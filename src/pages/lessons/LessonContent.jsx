import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { useSwipeable } from 'react-swipeable';
import LessonSection from '../../components/lessons/LessonSection';
import QuestionCard from '../../components/exercise/QuestionCard';
import CodeBlock from '../../components/exercise/CodeBlock';
import OptionButton from '../../components/exercise/OptionButton';
import ActionButton from '../../components/exercise/ActionButton';
import CustomKeyboard from '../../components/exercise/CustomKeyboard';
import useHaptic from '../../hooks/useHaptic';
import '../../styles/Lessons.css';

// Import des données chapitres
import chapter0Data from '../../data/lessons/python/chapter-0.json';
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
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

  const contentRef = useRef(null);

  // Charger les données du chapitre
  useEffect(() => {
    if (chapterId === 'py_ch_000') {
      setChapterData(chapter0Data);
    } else if (chapterId === 'py_ch_003') {
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
            content: "Ce chapitre est actuellement en cours de rédaction. Pour le moment, les **Chapitre 0 : Introduction** et **Chapitre 3 : Boucles & Itérations** sont disponibles.\n\nRevenez bientôt pour découvrir ce nouveau contenu !"
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

  // Fonction pour revenir à la section précédente
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      // Reset état exercice
      setIsSubmitted(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setSelectedLine(null);
      setFreeInputValue('');
      setCurrentExercise(null);
      setIsExplanationExpanded(false);

      setCurrentSectionIndex(currentSectionIndex - 1);
      triggerLight();
    }
  };

  // Configuration swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // Swipe gauche = section suivante (toujours autorisé, même exercice non complété)
      if (currentSectionIndex < chapterData.sections.length - 1) {
        handleContinue();
      }
    },
    onSwipedRight: () => {
      // Swipe droite = section précédente
      handlePrevious();
    },
    preventScrollOnSwipe: false, // Permettre scroll vertical
    trackMouse: true, // Debug desktop
    delta: 80, // Distance minimale 80px pour détecter swipe
    swipeDuration: 500, // Temps max pour détecter swipe (ms)
    touchEventOptions: { passive: true } // Performance scroll
  });

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
    setIsExplanationExpanded(false);

    // Passer à la section suivante
    if (currentSectionIndex < chapterData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  // Terminer le chapitre et retourner à la liste
  const handleFinishChapter = () => {
    const allExercisesCompleted = completedExercises.length === chapterData.exercises.length;

    if (allExercisesCompleted) {
      // Ajouter +100 XP pour avoir complété le chapitre
      updateProgress({
        xp: progress.xp + 100
      });
      triggerSuccess();

      // Afficher feedback de succès
      alert(`🎉 Chapitre terminé ! +100 XP`);
    } else {
      triggerLight();
    }

    navigate(`/lessons/${language}/chapters`);
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
          isExplanationExpanded={isExplanationExpanded}
          onExplanationToggle={() => setIsExplanationExpanded(!isExplanationExpanded)}
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
                value={option}
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
          onClick={isSubmitted ? handleContinue : handleValidate}
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

      {/* Content Wrapper avec swipe handlers */}
      <div {...swipeHandlers} className="lesson-content-wrapper swipeable-wrapper">
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

        {/* Swipe hints ou bouton terminer */}
        {currentSection.type !== 'exercise' && (
          <>
            {/* Si dernière section, afficher bouton Terminer */}
            {currentSectionIndex === chapterData.sections.length - 1 ? (
              <button className="finish-chapter-button" onClick={handleFinishChapter}>
                <span className="finish-text">Terminer le chapitre</span>
              </button>
            ) : (
              /* Sinon, afficher swipe hints */
              <div className="swipe-hints">
                {currentSectionIndex > 0 && (
                  <div className="swipe-hint left">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Swipe
                  </div>
                )}
                {currentSectionIndex < chapterData.sections.length - 1 && (
                  <div className="swipe-hint right">
                    Swipe
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        /* Swipe Wrapper - Transitions fluides */
        .swipeable-wrapper {
          position: relative;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          -webkit-user-select: none;
        }

        /* Swipe Hints */
        .swipe-hints {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 32px;
          margin-bottom: 24px;
          padding: 0 4px;
        }

        .swipe-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 12px;
          font-weight: 600;
          color: #8E8E93;
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }

        .swipe-hint svg {
          opacity: 0.5;
        }

        /* Animation pulse subtile */
        @keyframes swipePulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }

        .swipe-hint {
          animation: swipePulse 2s ease-in-out infinite;
        }

        /* Finish Chapter Button - Racing style */
        .finish-chapter-button {
          width: 100%;
          background: linear-gradient(135deg, #FF9500 0%, #FFB340 100%);
          border: 3px solid #FFD700;
          border-radius: 16px;
          padding: 20px;
          margin-top: 32px;
          margin-bottom: 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(255, 149, 0, 0.4);
        }

        .finish-chapter-button:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(255, 149, 0, 0.6);
        }

        .finish-chapter-button:active {
          transform: translateY(-2px) scale(1.01);
        }

        .finish-text {
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          letter-spacing: 0.5px;
          transform: skewX(-5deg);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Exercise Content */
        .lesson-exercise-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lesson-exercise-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .finish-chapter-button {
            padding: 16px;
          }

          .finish-text {
            font-size: 16px;
          }

          .swipe-hint {
            font-size: 11px;
          }

          .swipe-hint svg {
            width: 12px;
            height: 12px;
          }
        }

        @media (max-width: 320px) {
          .finish-chapter-button {
            padding: 14px;
          }

          .finish-text {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonContent;
