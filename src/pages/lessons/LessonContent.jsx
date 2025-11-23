import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import LessonSection from '../../components/lessons/LessonSection';
import QuestionCard from '../../components/exercise/QuestionCard';
import CodeBlock from '../../components/exercise/CodeBlock';
import OptionButton from '../../components/exercise/OptionButton';
import ActionButton from '../../components/exercise/ActionButton';
import CustomKeyboard from '../../components/exercise/CustomKeyboard';
import ChapterCompleteModal from '../../components/lessons/ChapterCompleteModal';
import ModuleCompleteModal from '../../components/lessons/ModuleCompleteModal';
import useHaptic from '../../hooks/useHaptic';
import '../../styles/Lessons.css';

// Import des données leçons - Module 1
import lesson_1_1_Data from '../../data/lessons/python/lesson-1-1.json';
import lesson_1_2_Data from '../../data/lessons/python/lesson-1-2.json';
import lesson_1_3_Data from '../../data/lessons/python/lesson-1-3.json';
import lesson_1_4_Data from '../../data/lessons/python/lesson-1-4.json';
import lesson_1_5_Data from '../../data/lessons/python/lesson-1-5.json';
import lesson_1_6_Data from '../../data/lessons/python/lesson-1-6.json';
import lesson_1_7_Data from '../../data/lessons/python/lesson-1-7.json';
// Module 2
import lesson_2_1_Data from '../../data/lessons/python/lesson-2-1.json';
import lesson_2_2_Data from '../../data/lessons/python/lesson-2-2.json';
import lesson_2_3_Data from '../../data/lessons/python/lesson-2-3.json';
import lesson_2_4_Data from '../../data/lessons/python/lesson-2-4.json';
import lesson_2_5_Data from '../../data/lessons/python/lesson-2-5.json';
import lesson_2_6_Data from '../../data/lessons/python/lesson-2-6.json';
import lesson_2_7_Data from '../../data/lessons/python/lesson-2-7.json';
// Module 3
import lesson_3_1_Data from '../../data/lessons/python/lesson-3-1.json';
import lesson_3_2_Data from '../../data/lessons/python/lesson-3-2.json';
import lesson_3_3_Data from '../../data/lessons/python/lesson-3-3.json';
import lesson_3_4_Data from '../../data/lessons/python/lesson-3-4.json';
import lesson_3_5_Data from '../../data/lessons/python/lesson-3-5.json';
// Module 4
import lesson_4_1_Data from '../../data/lessons/python/lesson-4-1.json';
import lesson_4_2_Data from '../../data/lessons/python/lesson-4-2.json';
import lesson_4_3_Data from '../../data/lessons/python/lesson-4-3.json';
import lesson_4_4_Data from '../../data/lessons/python/lesson-4-4.json';
import lesson_4_5_Data from '../../data/lessons/python/lesson-4-5.json';
import lesson_4_6_Data from '../../data/lessons/python/lesson-4-6.json';
// Module 5
import lesson_5_1_Data from '../../data/lessons/python/lesson-5-1.json';
import lesson_5_2_Data from '../../data/lessons/python/lesson-5-2.json';
import lesson_5_3_Data from '../../data/lessons/python/lesson-5-3.json';
import lesson_5_4_Data from '../../data/lessons/python/lesson-5-4.json';
import lesson_5_5_Data from '../../data/lessons/python/lesson-5-5.json';
import lesson_5_6_Data from '../../data/lessons/python/lesson-5-6.json';
// Module 6
import lesson_6_1_Data from '../../data/lessons/python/lesson-6-1.json';
import lesson_6_2_Data from '../../data/lessons/python/lesson-6-2.json';
import lesson_6_3_Data from '../../data/lessons/python/lesson-6-3.json';
import lesson_6_4_Data from '../../data/lessons/python/lesson-6-4.json';
import lesson_6_5_Data from '../../data/lessons/python/lesson-6-5.json';
import lesson_6_6_Data from '../../data/lessons/python/lesson-6-6.json';

const LessonContent = () => {
  const navigate = useNavigate();
  const { language, moduleId, lessonId } = useParams();
  const { triggerLight, triggerSuccess, triggerError } = useHaptic();
  const { progress, updateProgress } = useProgress();

  const [lessonData, setLessonData] = useState(null);
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
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showModuleCompleteModal, setShowModuleCompleteModal] = useState(false);

  const contentRef = useRef(null);

  // Charger les données de la leçon
  useEffect(() => {
    const lessonMap = {
      // Module 1
      'py_les_1_1': lesson_1_1_Data,
      'py_les_1_2': lesson_1_2_Data,
      'py_les_1_3': lesson_1_3_Data,
      'py_les_1_4': lesson_1_4_Data,
      'py_les_1_5': lesson_1_5_Data,
      'py_les_1_6': lesson_1_6_Data,
      'py_les_1_7': lesson_1_7_Data,
      // Module 2
      'py_les_2_1': lesson_2_1_Data,
      'py_les_2_2': lesson_2_2_Data,
      'py_les_2_3': lesson_2_3_Data,
      'py_les_2_4': lesson_2_4_Data,
      'py_les_2_5': lesson_2_5_Data,
      'py_les_2_6': lesson_2_6_Data,
      'py_les_2_7': lesson_2_7_Data,
      // Module 3
      'py_les_3_1': lesson_3_1_Data,
      'py_les_3_2': lesson_3_2_Data,
      'py_les_3_3': lesson_3_3_Data,
      'py_les_3_4': lesson_3_4_Data,
      'py_les_3_5': lesson_3_5_Data,
      // Module 4
      'py_les_4_1': lesson_4_1_Data,
      'py_les_4_2': lesson_4_2_Data,
      'py_les_4_3': lesson_4_3_Data,
      'py_les_4_4': lesson_4_4_Data,
      'py_les_4_5': lesson_4_5_Data,
      'py_les_4_6': lesson_4_6_Data,
      // Module 5
      'py_les_5_1': lesson_5_1_Data,
      'py_les_5_2': lesson_5_2_Data,
      'py_les_5_3': lesson_5_3_Data,
      'py_les_5_4': lesson_5_4_Data,
      'py_les_5_5': lesson_5_5_Data,
      'py_les_5_6': lesson_5_6_Data,
      // Module 6
      'py_les_6_1': lesson_6_1_Data,
      'py_les_6_2': lesson_6_2_Data,
      'py_les_6_3': lesson_6_3_Data,
      'py_les_6_4': lesson_6_4_Data,
      'py_les_6_5': lesson_6_5_Data,
      'py_les_6_6': lesson_6_6_Data,
    };

    if (lessonMap[lessonId]) {
      setLessonData(lessonMap[lessonId]);
    } else {
      // Pour les leçons non encore implémentées, afficher message
      setLessonData({
        title: "Leçon en développement",
        subtitle: "Cette leçon sera bientôt disponible !",
        sections: [
          {
            id: "section_placeholder",
            type: "text",
            title: "Contenu à venir",
            content: "Cette leçon est actuellement en cours de rédaction. Pour le moment, seule la **Leçon 1.1 : La lecture de haut en bas** est disponible.\n\nRevenez bientôt pour découvrir ce nouveau contenu !"
          }
        ],
        exercises: []
      });
    }
  }, [lessonId]);

  // Charger la progression sauvegardée
  useEffect(() => {
    if (!progress || !language || !lessonId) return;

    const lessonProgress = progress.lessonProgress?.[language]?.[lessonId];
    if (lessonProgress) {
      setCompletedExercises(lessonProgress.exercisesCompleted || []);
    }
  }, [progress, language, lessonId]);

  // Auto-scroll vers la section en cours
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex]);

  // Vérifier si le module entier est terminé
  const isModuleComplete = () => {
    console.log('🔍 isModuleComplete() - Start check');
    if (!progress || !moduleId) {
      console.log('❌ No progress or moduleId');
      return false;
    }

    // Définir les leçons de chaque module
    const moduleLessons = {
      'py_mod_001': ['py_les_1_1', 'py_les_1_2', 'py_les_1_3', 'py_les_1_4', 'py_les_1_5', 'py_les_1_6', 'py_les_1_7'],
      'py_mod_002': ['py_les_2_1', 'py_les_2_2', 'py_les_2_3', 'py_les_2_4', 'py_les_2_5', 'py_les_2_6', 'py_les_2_7'],
      'py_mod_003': ['py_les_3_1', 'py_les_3_2', 'py_les_3_3', 'py_les_3_4', 'py_les_3_5'],
      'py_mod_004': ['py_les_4_1', 'py_les_4_2', 'py_les_4_3', 'py_les_4_4', 'py_les_4_5', 'py_les_4_6'],
      'py_mod_005': ['py_les_5_1', 'py_les_5_2', 'py_les_5_3', 'py_les_5_4', 'py_les_5_5', 'py_les_5_6'],
      'py_mod_006': ['py_les_6_1', 'py_les_6_2', 'py_les_6_3', 'py_les_6_4', 'py_les_6_5', 'py_les_6_6']
    };

    // Définir les nœuds XP de chaque module
    const moduleXPNodes = {
      'py_mod_001': ['xp_1', 'xp_2', 'xp_3', 'xp_4', 'xp_5', 'xp_6'],
      'py_mod_002': ['xp_7', 'xp_8', 'xp_9', 'xp_10', 'xp_11', 'xp_12'],
      'py_mod_003': ['xp_13', 'xp_14', 'xp_15', 'xp_16'],
      'py_mod_004': ['xp_17', 'xp_18', 'xp_19', 'xp_20', 'xp_21'],
      'py_mod_005': ['xp_22', 'xp_23', 'xp_24', 'xp_25', 'xp_26'],
      'py_mod_006': ['xp_27', 'xp_28', 'xp_29', 'xp_30', 'xp_31']
    };

    const lessons = moduleLessons[moduleId] || [];
    const xpNodes = moduleXPNodes[moduleId] || [];

    console.log('📋 Module:', moduleId);
    console.log('📋 Lessons requises:', lessons);
    console.log('📋 XP nodes requis:', xpNodes);

    // Vérifier que toutes les leçons sont complétées
    const allLessonsComplete = lessons.every(lessonId => {
      const isComplete = progress.lessonProgress?.[language]?.[lessonId]?.completed === true;
      console.log(`  Leçon ${lessonId}: ${isComplete ? '✅' : '❌'}`);
      return isComplete;
    });

    // Vérifier que tous les nœuds XP sont collectés
    const allXPNodesCollected = xpNodes.every(nodeId => {
      const isCollected = progress.xpNodesCollected?.[nodeId] === true;
      console.log(`  XP ${nodeId}: ${isCollected ? '✅' : '❌'}`);
      return isCollected;
    });

    console.log('📊 All lessons complete:', allLessonsComplete);
    console.log('📊 All XP nodes collected:', allXPNodesCollected);
    console.log('🎯 Module complete:', allLessonsComplete && allXPNodesCollected);

    return allLessonsComplete && allXPNodesCollected;
  };

  const handleBack = () => {
    triggerLight();
    navigate(`/lessons/${language}/${moduleId}/lessons`);
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

  // Gestion des touches sur les bords (Instagram-style)
  const handleTapLeft = () => {
    // Tap sur bord gauche = section précédente
    if (currentSectionIndex > 0) {
      handlePrevious();
    }
  };

  const handleTapRight = () => {
    // Tap sur bord droit = section suivante
    if (currentSectionIndex < lessonData.sections.length - 1) {
      handleContinue();
    }
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
              [lessonId]: {
                completed: newCompletedExercises.length === lessonData.exercises.length,
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
    if (currentSectionIndex < lessonData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  // Terminer la leçon et retourner à la liste
  const handleFinishLesson = () => {
    console.log('🔍 handleFinishLesson appelée');
    console.log('📊 completedExercises:', completedExercises);
    console.log('📊 lessonData.exercises:', lessonData.exercises);
    console.log('📊 completedExercises.length:', completedExercises.length);
    console.log('📊 lessonData.exercises.length:', lessonData.exercises.length);

    const allExercisesCompleted = completedExercises.length === lessonData.exercises.length;
    console.log('✅ allExercisesCompleted:', allExercisesCompleted);

    if (allExercisesCompleted) {
      // XP sera collecté via les nœuds XP entre les leçons (30 XP par nœud)
      triggerSuccess();

      // Vérifier si le module entier est terminé
      const moduleComplete = isModuleComplete();
      console.log('🎯 isModuleComplete():', moduleComplete);

      if (moduleComplete) {
        console.log('🎉 Module complet ! Affichage du ModuleCompleteModal');
        setShowModuleCompleteModal(true);
      } else {
        console.log('✅ Leçon complète ! Affichage du ChapterCompleteModal');
        setShowCompleteModal(true);
      }
    } else {
      console.log('⚠️ Tous les exercices ne sont pas complétés, retour à la liste');
      triggerLight();
      navigate(`/lessons/${language}/${moduleId}/lessons`);
    }
  };

  // Fermer le modal et retourner aux leçons
  const handleCloseModal = () => {
    setShowCompleteModal(false);
    navigate(`/lessons/${language}/${moduleId}/lessons`);
  };

  // Gérer le clic sur Boss Fight depuis ModuleCompleteModal
  const handleBossFight = () => {
    setShowModuleCompleteModal(false);
    triggerSuccess();
    navigate(`/lessons/${language}/${moduleId}/boss`);
  };

  // Render exercice intégré
  const renderExercise = (exerciseId) => {
    const exercise = lessonData.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return null;

    // Set current exercise si pas déjà fait
    if (currentExercise?.id !== exercise.id) {
      setCurrentExercise(exercise);
    }

    const isExerciseCompleted = completedExercises.includes(exercise.id);

    // Détecter si c'est le dernier exercice (dernière section ET type exercice)
    const isLastExercise = currentSectionIndex === lessonData.sections.length - 1 &&
                           currentSection.type === 'exercise';

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
          clickableLines={
            exercise.inputType === 'clickable_lines'
              ? Array.from({ length: exercise.code.split('\n').length }, (_, i) => i)
              : []
          }
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
            type={exercise.predefinedAnswers ? 'predefined' : (exercise.keyboardType || 'numeric')}
            predefinedKeys={exercise.predefinedAnswers}
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
          onClick={isSubmitted ? (isLastExercise ? handleFinishLesson : handleContinue) : handleValidate}
          continueText={isLastExercise ? "Terminer la leçon" : "Continuer"}
        />
      </div>
    );
  };

  if (!lessonData) {
    return (
      <div className="lesson-content-container">
        <p style={{ color: '#FFFFFF', textAlign: 'center', padding: '40px' }}>
          Chargement...
        </p>
      </div>
    );
  }

  // Calculer la progression (nombre de sections vues)
  const progressPercentage = ((currentSectionIndex + 1) / lessonData.sections.length) * 100;

  // Section actuelle
  const currentSection = lessonData.sections[currentSectionIndex];

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
            Section {currentSectionIndex + 1}/{lessonData.sections.length}
          </p>

          {/* Instagram-style Story Bars */}
          <div className="story-bars-container">
            {lessonData.sections.map((_, index) => (
              <div
                key={index}
                className={`story-bar ${index < currentSectionIndex ? 'completed' : ''} ${index === currentSectionIndex ? 'active' : ''}`}
              >
                <div className="story-bar-fill" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tap Zones - Instagram Style */}
      <div className="tap-zone tap-zone-left" onClick={handleTapLeft} />
      <div className="tap-zone tap-zone-right" onClick={handleTapRight} />

      {/* Content Wrapper */}
      <div className="lesson-content-wrapper">
        {/* Lesson Title (seulement sur première section) */}
        {currentSectionIndex === 0 && (
          <>
            <h1 className="lesson-chapter-title">{lessonData.title}</h1>
            <p className="lesson-chapter-subtitle">{lessonData.subtitle}</p>
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

        {/* Bouton terminer si dernière section ET que ce n'est PAS un exercice */}
        {currentSectionIndex === lessonData.sections.length - 1 &&
         currentSection.type !== 'exercise' && (
          <button className="finish-lesson-button" onClick={handleFinishLesson}>
            <span className="finish-text">Terminer la leçon</span>
          </button>
        )}
      </div>

      <style>{`
        /* Tap Zones - Instagram Style */
        .tap-zone {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 10%;
          z-index: 50;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }

        .tap-zone-left {
          left: 0;
        }

        .tap-zone-right {
          right: 0;
        }

        /* Debug mode - décommenter pour voir les zones */
        /*
        .tap-zone-left {
          background: rgba(255, 0, 0, 0.1);
        }

        .tap-zone-right {
          background: rgba(0, 255, 0, 0.1);
        }
        */

        /* Finish Lesson Button - Racing style */
        .finish-lesson-button {
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

        .finish-lesson-button:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(255, 149, 0, 0.6);
        }

        .finish-lesson-button:active {
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
          .finish-lesson-button {
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
          .finish-lesson-button {
            padding: 14px;
          }

          .finish-text {
            font-size: 15px;
          }
        }
      `}</style>

      {/* Modal de fin de leçon */}
      {showCompleteModal && (
        <ChapterCompleteModal
          chapterTitle={lessonData.title}
          xpEarned={30}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal de fin de module */}
      {showModuleCompleteModal && (
        <ModuleCompleteModal
          moduleTitle={
            moduleId === 'py_mod_001' ? 'Module 1' :
            moduleId === 'py_mod_002' ? 'Module 2' :
            moduleId === 'py_mod_003' ? 'Module 3' :
            moduleId === 'py_mod_004' ? 'Module 4' :
            moduleId === 'py_mod_005' ? 'Module 5' :
            moduleId === 'py_mod_006' ? 'Module 6' : 'Module'
          }
          lessonsCompleted={
            moduleId === 'py_mod_001' || moduleId === 'py_mod_002' ? 7 :
            moduleId === 'py_mod_003' ? 5 :
            moduleId === 'py_mod_004' || moduleId === 'py_mod_005' || moduleId === 'py_mod_006' ? 6 : 0
          }
          totalLessons={
            moduleId === 'py_mod_001' || moduleId === 'py_mod_002' ? 7 :
            moduleId === 'py_mod_003' ? 5 :
            moduleId === 'py_mod_004' || moduleId === 'py_mod_005' || moduleId === 'py_mod_006' ? 6 : 0
          }
          xpEarned={
            moduleId === 'py_mod_001' || moduleId === 'py_mod_002' ? 180 :
            moduleId === 'py_mod_003' ? 120 :
            moduleId === 'py_mod_004' || moduleId === 'py_mod_005' || moduleId === 'py_mod_006' ? 150 : 0
          }
          onBossFight={handleBossFight}
        />
      )}
    </div>
  );
};

export default LessonContent;
