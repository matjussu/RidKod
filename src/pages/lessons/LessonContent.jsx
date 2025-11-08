import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import LessonSection from '../../components/lessons/LessonSection';
import QuestionCard from '../../components/exercise/QuestionCard';
import CodeBlock from '../../components/exercise/CodeBlock';
import OptionButton from '../../components/exercise/OptionButton';
import ActionButton from '../../components/exercise/ActionButton';
import CustomKeyboard from '../../components/exercise/CustomKeyboard';
import useHaptic from '../../hooks/useHaptic';
import '../../styles/Lessons.css';

// Import des données chapitres
import chapter3Data from '../../data/lessons/python/chapter-3.json';

const LessonContent = () => {
  const navigate = useNavigate();
  const { language, chapterId } = useParams();
  const { triggerLight, triggerSuccess, triggerError } = useHaptic();
  const { progress, updateProgress } = useProgress();

  const [chapterData, setChapterData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);

  // État pour les exercices
  const [currentExercise, setCurrentExercise] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [freeInputValue, setFreeInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const contentRef = useRef(null);

  // Charger les données du chapitre
  useEffect(() => {
    if (chapterId === 'py_ch_003') {
      setChapterData(chapter3Data);
    } else {
      // Pour les chapitres non encore implémentés, afficher message
      setChapterData({
        title: "Chapitre en développement",
        subtitle: "Ce chapitre sera bientôt disponible !",
        sections: [
          {
            id: "section_placeholder",
            type: "text",
            title: "Contenu à venir",
            content: "Ce chapitre est actuellement en cours de rédaction. Pour le moment, seul le **Chapitre 3 : Boucles & Itérations** est disponible.\n\nRevenez bientôt pour découvrir ce nouveau contenu !"
          }
        ],
        exercises: []
      });
    }
  }, [chapterId]);

  // Charger la progression sauvegardée
  useEffect(() => {
    if (!progress || !language || !chapterId) return;

    const lessonProgress = progress.lessonProgress?.[language]?.[chapterId];
    if (lessonProgress) {
      setCompletedExercises(lessonProgress.exercisesCompleted || []);
    }
  }, [progress, language, chapterId]);

  // Auto-scroll vers la section en cours
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex]);

  const handleBack = () => {
    triggerLight();
    navigate(`/lessons/${language}/chapters`);
  };

  // Gestion du clavier personnalisé
  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setFreeInputValue(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setFreeInputValue('');
    } else {
      setFreeInputValue(prev => prev + key);
    }
  };

  // Gestion validation exercice
  const handleValidate = () => {
    console.log('🔍 handleValidate called');
    console.log('Current exercise:', currentExercise);
    console.log('Free input value:', freeInputValue);

    if (!currentExercise) {
      console.warn('❌ No current exercise');
      return;
    }

    let correct = false;

    // Vérifier selon le type d'input
    if (currentExercise.inputType === 'options') {
      correct = selectedOption === currentExercise.correctAnswer;
      console.log('Options check:', selectedOption, '===', currentExercise.correctAnswer, '→', correct);
    } else if (currentExercise.inputType === 'free_input') {
      const userAnswer = freeInputValue.trim().toLowerCase();
      const correctAnswer = currentExercise.correctAnswer.toLowerCase();
      correct = userAnswer === correctAnswer;
      console.log('Free input check:', userAnswer, '===', correctAnswer, '→', correct);
    } else if (currentExercise.inputType === 'clickable_lines') {
      correct = selectedLine === currentExercise.correctAnswer;
      console.log('Clickable lines check:', selectedLine, '===', currentExercise.correctAnswer, '→', correct);
    }

    console.log('✅ Setting submitted and correct:', correct);
    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      triggerSuccess();

      // Marquer l'exercice comme complété
      if (!completedExercises.includes(currentExercise.id)) {
        const newCompletedExercises = [...completedExercises, currentExercise.id];
        setCompletedExercises(newCompletedExercises);

        // Sauvegarder dans ProgressContext
        updateProgress({
          lessonProgress: {
            ...progress.lessonProgress,
            [language]: {
              ...progress.lessonProgress?.[language],
              [chapterId]: {
                completed: newCompletedExercises.length === chapterData.exercises.length,
                exercisesCompleted: newCompletedExercises,
                lastCompletedAt: Date.now()
              }
            }
          }
        });
      }
    } else {
      triggerError();
    }
  };

  // Passer à la section suivante
  const handleContinue = () => {
    // Reset état exercice
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setSelectedLine(null);
    setFreeInputValue('');
    setCurrentExercise(null);

    // Passer à la section suivante
    if (currentSectionIndex < chapterData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      // Fin du chapitre
      const allExercisesCompleted = completedExercises.length === chapterData.exercises.length;
      if (allExercisesCompleted) {
        // TODO: Afficher modal de completion
        alert(`🎉 Chapitre terminé ! +${chapterData.exercises.length * 10} XP`);
      }
      navigate(`/lessons/${language}/chapters`);
    }
  };

  // Render exercice intégré
  const renderExercise = (exerciseId) => {
    const exercise = chapterData.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return null;

    // Set current exercise si pas déjà fait
    if (currentExercise?.id !== exercise.id) {
      setCurrentExercise(exercise);
    }

    const isExerciseCompleted = completedExercises.includes(exercise.id);

    return (
      <div className="lesson-exercise-content">
        <QuestionCard
          question={exercise.question}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          explanation={exercise.explanation}
          highlightedLines={exercise.highlightedLines}
          xpGain={exercise.xpGain}
          code={exercise.code}
        />

        <CodeBlock
          code={exercise.code}
          language="python"
          highlightedLines={exercise.highlightedLines || []}
          isHighlightActive={isSubmitted}
          clickableLines={exercise.inputType === 'clickable_lines' ? [0, 1, 2] : []}
          selectedLine={selectedLine}
          onLineClick={(lineNum) => {
            if (exercise.inputType === 'clickable_lines' && !isSubmitted) {
              setSelectedLine(lineNum);
            }
          }}
          isSubmitted={isSubmitted}
          correctAnswer={exercise.correctAnswer}
        />

        {/* Options si type options */}
        {exercise.inputType === 'options' && (
          <div className="lesson-exercise-options">
            {exercise.options.map((option, index) => (
              <OptionButton
                key={index}
                option={option}
                index={index}
                isSelected={selectedOption === index}
                isSubmitted={isSubmitted}
                isCorrect={index === exercise.correctAnswer}
                onClick={() => {
                  if (!isSubmitted) {
                    setSelectedOption(index);
                    triggerLight();
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Free input si type free_input */}
        {exercise.inputType === 'free_input' && !isSubmitted && (
          <CustomKeyboard
            type={exercise.keyboardType || 'numeric'}
            value={freeInputValue}
            onKeyPress={handleKeyPress}
          />
        )}

        {/* User Answer Display après soumission */}
        {exercise.inputType === 'free_input' && isSubmitted && (
          <div style={{
            background: '#2C2C2E',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '12px'
          }}>
            <div style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '8px' }}>Ta réponse :</div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: isCorrect ? '#30D158' : '#FF453A'
            }}>
              {freeInputValue}
            </div>
          </div>
        )}

        {/* Action Button */}
        <ActionButton
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          isDisabled={
            !isSubmitted &&
            ((exercise.inputType === 'options' && selectedOption === null) ||
             (exercise.inputType === 'free_input' && freeInputValue.trim() === '') ||
             (exercise.inputType === 'clickable_lines' && selectedLine === null))
          }
          onValidate={handleValidate}
          onContinue={handleContinue}
        />
      </div>
    );
  };

  if (!chapterData) {
    return (
      <div className="lesson-content-container">
        <p style={{ color: '#FFFFFF', textAlign: 'center', padding: '40px' }}>
          Chargement...
        </p>
      </div>
    );
  }

  // Calculer la progression (nombre de sections vues)
  const progressPercentage = ((currentSectionIndex + 1) / chapterData.sections.length) * 100;

  // Section actuelle
  const currentSection = chapterData.sections[currentSectionIndex];

  return (
    <div className="lesson-content-container" ref={contentRef}>
      {/* Sticky Progress Bar */}
      <div className="lesson-progress-bar">
        <button className="lesson-progress-bar-back" onClick={handleBack} aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div className="lesson-progress-info">
          <p className="lesson-progress-text">
            Section {currentSectionIndex + 1}/{chapterData.sections.length}
          </p>
          <div className="lesson-progress-track">
            <div
              className="lesson-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="lesson-content-wrapper">
        {/* Chapter Title (seulement sur première section) */}
        {currentSectionIndex === 0 && (
          <>
            <h1 className="lesson-chapter-title">{chapterData.title}</h1>
            <p className="lesson-chapter-subtitle">{chapterData.subtitle}</p>
          </>
        )}

        {/* Current Section */}
        <LessonSection
          section={currentSection}
          exerciseComponent={
            currentSection.type === 'exercise' ? renderExercise(currentSection.exerciseId) : null
          }
          isExerciseCompleted={
            currentSection.type === 'exercise' &&
            completedExercises.includes(currentSection.exerciseId)
          }
        />

        {/* Navigation Buttons (sauf si c'est un exercice non complété) */}
        {currentSection.type !== 'exercise' && (
          <div className="lesson-navigation-buttons">
            {currentSectionIndex < chapterData.sections.length - 1 ? (
              <button className="lesson-next-button" onClick={handleContinue}>
                Continuer
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            ) : (
              <button className="lesson-finish-button" onClick={() => navigate(`/lessons/${language}/chapters`)}>
                Terminer le chapitre
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        /* Navigation Buttons */
        .lesson-navigation-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lesson-next-button,
        .lesson-finish-button {
          background: linear-gradient(135deg, #088201 0%, #30D158 100%);
          color: #FFFFFF;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(8, 130, 1, 0.3);
        }

        .lesson-next-button:hover,
        .lesson-finish-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(8, 130, 1, 0.4);
        }

        .lesson-next-button:active,
        .lesson-finish-button:active {
          transform: translateY(0);
        }

        /* Exercise Content */
        .lesson-exercise-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lesson-exercise-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .lesson-next-button,
          .lesson-finish-button {
            font-size: 14px;
            padding: 12px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonContent;
