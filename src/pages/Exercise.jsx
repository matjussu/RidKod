import React, { useState, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import QuestionCard from "../components/exercise/QuestionCard";
import CodeBlock from "../components/exercise/CodeBlock";
import OptionButton from "../components/exercise/OptionButton";
import ActionButton from "../components/exercise/ActionButton";
import FeedbackGlow from "../components/common/FeedbackGlow";
import ExitConfirmModal from "../components/common/ExitConfirmModal";
import useHaptic from "../hooks/useHaptic";
import exercisesData from "../data/exercises.json";
import { isBlockComplete } from '../constants/exerciseLayout';
import '../styles/Exercise.css';

// Lazy load LevelComplete component (only loaded when needed)
const LevelComplete = lazy(() => import("../components/exercise/LevelComplete"));

const Exercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeExercise, getStats } = useProgress();

  // Récupérer le langage et la difficulté depuis la navigation
  const language = location.state?.language || 'PYTHON';
  const difficulty = location.state?.difficulty || 1;

  // State management
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showGlow, setShowGlow] = useState(false);
  const [glowType, setGlowType] = useState(null);

  // Explanation system state
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState([]);

  // Exit modal state
  const [showExitModal, setShowExitModal] = useState(false);

  // Level complete state
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [blockStats, setBlockStats] = useState(() => {
    const stats = getStats();
    return {
      correctAnswers: 0,
      incorrectAnswers: 0,
      xpGained: 0,
      currentLevel: stats.level,
      streak: stats.streak?.current || 0,
      totalAnswered: 0
    };
  });

  // Haptic feedback hook
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  // Load exercises from JSON
  const exercises = exercisesData;
  const exercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;

  // Event handlers
  const handleOptionClick = (index) => {
    if (!isSubmitted) {
      setSelectedOption(index);
      triggerLight();
    }
  };

  const handleValidate = async () => {
    setIsSubmitted(true);

    const correct = selectedOption === exercise.correctAnswer;
    const xpGain = exercise.xpGain || 10;

    if (correct) {
      setGlowType('success');
      triggerSuccess();
    } else {
      setGlowType('error');
      triggerError();
    }

    setShowGlow(true);

    // Mettre à jour les stats du bloc
    setBlockStats(prev => ({
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (correct ? 0 : 1),
      xpGained: prev.xpGained + xpGain,
      totalAnswered: prev.totalAnswered + 1,
      currentLevel: prev.currentLevel,
      streak: prev.streak
    }));

    // Sauvegarder la progression
    try {
      await completeExercise({
        exerciseId: exercise.id,
        language: language,
        difficulty: difficulty,
        xpGained: xpGain,
        isCorrect: correct,
        attempts: 1
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error);
    }

    setTimeout(() => {
      setShowGlow(false);
    }, correct ? 600 : 800);
  };

  const handleContinue = () => {
    setIsExplanationExpanded(false);
    setHighlightedLines([]);

    // Vérifier si on a complété un bloc (utilise la constante EXERCISES_PER_LEVEL = 10)
    const blockComplete = isBlockComplete(currentExerciseIndex);

    if (blockComplete) {
      // Afficher l'écran de feedback
      const stats = getStats();
      setBlockStats(prev => ({
        ...prev,
        currentLevel: stats.level,
        streak: stats.streak?.current || 0
      }));
      setShowLevelComplete(true);
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Continuer normalement
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Fin de tous les exercices
      const stats = getStats();
      setBlockStats(prev => ({
        ...prev,
        currentLevel: stats.level,
        streak: stats.streak?.current || 0
      }));
      setShowLevelComplete(true);
    }
  };

  const handleLevelContinue = () => {
    setShowLevelComplete(false);

    // Réinitialiser les stats du bloc
    const stats = getStats();
    setBlockStats({
      correctAnswers: 0,
      incorrectAnswers: 0,
      xpGained: 0,
      totalAnswered: 0,
      currentLevel: stats.level,
      streak: stats.streak?.current || 0
    });

    // Continuer au prochain exercice ou retourner à l'accueil
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Tous les exercices terminés - retour à l'accueil
      navigate('/home');
    }
  };

  const handleQuit = () => {
    setShowExitModal(true);
  };

  const handleModalContinue = () => {
    setShowExitModal(false);
    triggerLight();
  };

  const handleModalExit = () => {
    setShowExitModal(false);

    // Animation de sortie élégante
    const exerciseApp = document.querySelector('.exercise-app');
    if (exerciseApp) {
      exerciseApp.style.transform = 'scale(0.95)';
      exerciseApp.style.opacity = '0';

      setTimeout(() => {
        navigate('/');
      }, 200);
    } else {
      navigate('/');
    }
  };

  const handleExplanationToggle = () => {
    const newState = !isExplanationExpanded;
    setIsExplanationExpanded(newState);

    if (newState) {
      setHighlightedLines(exercise.highlightedLines || []);

      setTimeout(() => {
        const codeContainer = document.querySelector('.code-container');
        if (codeContainer) {
          codeContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 150);
    } else {
      setHighlightedLines([]);
    }
  };

  const isCorrect = selectedOption === exercise.correctAnswer;

  // Afficher l'écran de feedback si le bloc est complété
  if (showLevelComplete) {
    return (
      <Suspense fallback={<div style={{
        minHeight: '100vh',
        background: '#1A1919',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'JetBrains Mono, monospace'
      }}>Chargement...</div>}>
        <LevelComplete
          stats={blockStats}
          onContinue={handleLevelContinue}
        />
      </Suspense>
    );
  }

  return (
    <div className="exercise-app">

      {/* Header Fixed */}
      <header className="header-fixed">
        <button className="close-button" onClick={handleQuit} aria-label="Quitter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%` }} />
          </div>
        </div>
      </header>

      {/* Content Scrollable */}
      <main className="content-scrollable">
        {/* Question */}
        <QuestionCard
          question={exercise.question}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          xpGain={exercise.xpGain}
          explanation={exercise.explanation}
          onExplanationToggle={handleExplanationToggle}
          isExplanationExpanded={isExplanationExpanded}
        />

        {/* Code Block */}
        <CodeBlock
          code={exercise.code}
          language={exercise.language}
          highlightedLines={highlightedLines}
          isHighlightActive={isExplanationExpanded}
          isCompact={isExplanationExpanded}
        />

        {/* Options Grid */}
        <div className={`options-container ${isExplanationExpanded ? 'hidden' : 'visible'}`}>
          <div className="options-grid">
            {exercise.options.map((option, index) => (
              <OptionButton
                key={index}
                value={option}
                isSelected={selectedOption === index}
                isCorrect={index === exercise.correctAnswer}
                isSubmitted={isSubmitted}
                onClick={() => handleOptionClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Validate/Continue Button */}
        <ActionButton
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          isDisabled={!isSubmitted && selectedOption === null}
          onClick={isSubmitted ? handleContinue : handleValidate}
        />
      </main>

      {/* Feedback Glow Effects */}
      <FeedbackGlow isVisible={showGlow} type={glowType} />

      {/* Exit Confirmation Modal */}
      <ExitConfirmModal
        isVisible={showExitModal}
        onContinue={handleModalContinue}
        onExit={handleModalExit}
      />
    </div>
  );
};

export default Exercise;