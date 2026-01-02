import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useExerciseState } from '../hooks/useExerciseState';
import QuestionCard from "../components/exercise/QuestionCard";
import CodeBlock from "../components/exercise/CodeBlock";
import OptionButton from "../components/exercise/OptionButton";
import ActionButton from "../components/exercise/ActionButton";
import FeedbackGlow from "../components/common/FeedbackGlow";
import ExitConfirmModal from "../components/common/ExitConfirmModal";
import CustomKeyboard from "../components/exercise/CustomKeyboard";
import useHaptic from "../hooks/useHaptic";
import { isBlockComplete, EXERCISES_PER_LEVEL, getMaxLevelsForDifficulty } from '../constants/exerciseLayout';
import { loadExercisesByDifficulty } from '../data/loaders/trainingLoader';
import '../styles/Exercise.css';

const Exercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeLevelWithBatch, getStats, isLevelCompleted, loading: progressLoading } = useProgress();

  // Récupérer le langage et la difficulté depuis la navigation
  const language = location.state?.language || 'PYTHON';
  const difficulty = location.state?.difficulty || 1;

  // Charger la progression pour déterminer le niveau de départ
  const stats = getStats();

  // Timer pour mesurer le temps passé sur le niveau
  const [levelStartTime] = useState(Date.now());

  // Haptic feedback hook
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  // Load exercises dynamically based on difficulty (lazy loading)
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        // Charger les exercices via le loader centralisé
        const exercisesData = await loadExercisesByDifficulty(difficulty);
        setExercises(exercisesData);

        // ⏳ Attendre que la progression soit chargée avant de vérifier les niveaux
        if (progressLoading) {
          console.log('⏳ Attente chargement progression...');
          setIsLoading(false);
          return;
        }

        // ✅ Vérifier si le premier niveau de cette difficulté est déjà complété
        // Si oui, trouver le dernier niveau NON complété et démarrer là
        const firstLevelNumber = 1;
        const firstLevelId = `${difficulty}_${firstLevelNumber}`;

        if (isLevelCompleted(firstLevelId)) {
          // Trouver le prochain niveau non complété
          let nextLevelNumber = 1;
          let nextLevelId = `${difficulty}_${nextLevelNumber}`;

          // Chercher le premier niveau non complété
          const maxLevels = getMaxLevelsForDifficulty(difficulty);
          while (isLevelCompleted(nextLevelId) && nextLevelNumber <= maxLevels) {
            nextLevelNumber++;
            nextLevelId = `${difficulty}_${nextLevelNumber}`;
          }

          // Si tous les niveaux sont complétés, rediriger vers home
          if (nextLevelNumber > maxLevels) {
            console.log(`Tous les niveaux de difficulté ${difficulty} sont complétés !`);
            navigate('/home');
            return;
          }

          // Démarrer au niveau non complété
          const startIndex = (nextLevelNumber - 1) * EXERCISES_PER_LEVEL;
          setCurrentExerciseIndex(startIndex);
          console.log(`Niveau ${nextLevelId} déjà complété, démarrage au niveau ${nextLevelId} (index ${startIndex})`);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
        // Fallback to empty array
        setExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [difficulty, isLevelCompleted, navigate, progressLoading]);

  // ⚠️ IMPORTANT: Tous les hooks doivent être AVANT tout early return
  // Calcul de l'exercice actuel (défaut si loading)
  const exercise = exercises[currentExerciseIndex] || {};
  const levelNumber = Math.floor(currentExerciseIndex / EXERCISES_PER_LEVEL) + 1;
  const currentExerciseLevel = `${difficulty}_${levelNumber}`;

  // Exercise state management avec reducer (remplace 15 useState)
  const exerciseState = useExerciseState(
    exercise,
    stats.userLevel,
    stats.streak?.current || 0
  );

  // Destructure pour faciliter l'utilisation
  const {
    state,
    isCorrect,
    isAnswerSelected,
    selectOption,
    selectLine,
    updateInput,
    clearInput,
    checkAnswer,
    validateAnswer,
    updateBlockStats,
    resetForNextExercise,
    showGlow,
    hideGlow,
    toggleExplanation,
    showExitModal: showModal,
    hideExitModal: hideModal
  } = exerciseState;

  // Event handlers (simplified avec le hook)
  const handleOptionClick = useCallback((index) => {
    if (!state.isSubmitted) {
      selectOption(index);
      triggerLight();
    }
  }, [state.isSubmitted, selectOption, triggerLight]);

  const handleLineClick = useCallback((lineNumber) => {
    if (!state.isSubmitted) {
      selectLine(lineNumber);
      triggerLight();
    }
  }, [state.isSubmitted, selectLine, triggerLight]);

  const handleKeyPress = useCallback((key) => {
    if (key === '⌫') {
      updateInput(state.userInput.slice(0, -1));
    } else if (key === 'CLEAR') {
      clearInput();
    } else {
      updateInput(state.userInput + key);
    }
  }, [state.userInput, updateInput, clearInput]);

  const handleValidate = useCallback(async () => {
    const correct = isCorrect;
    const baseXP = exercise.xpGain || 10;
    const xpGain = correct ? baseXP : 0;

    // Update state avec le reducer (atomique)
    validateAnswer(correct);

    // Haptic feedback
    if (correct) {
      triggerSuccess();
    } else {
      triggerError();
    }

    // ✅ NOUVELLE LOGIQUE : Ne sauvegarder QUE localement (pas de Firestore)
    // Les stats sont accumulées dans le reducer (state.blockStats)
    // Sauvegarde uniquement à la fin du niveau (10/10 exercices)
    updateBlockStats(correct, xpGain);

    // Cache glow après délai
    setTimeout(() => {
      hideGlow();
    }, correct ? 1200 : 1500);
  }, [isCorrect, exercise.xpGain, validateAnswer, triggerSuccess, triggerError, updateBlockStats, hideGlow]);

  const handleContinue = useCallback(async () => {
    // Reset state via reducer (atomique)
    resetForNextExercise();

    const nextExerciseIndex = currentExerciseIndex + 1;
    const blockComplete = isBlockComplete(currentExerciseIndex) ||
                          (currentExerciseIndex >= exercises.length - 1);

    if (blockComplete) {
      // ✅ SAUVEGARDE UNIQUEMENT ICI (fin du niveau - 10/10 exercices)
      // 🔥 1 SEULE ÉCRITURE FIRESTORE pour tout le niveau
      try {
        const { correctAnswers, incorrectAnswers, xpGained } = state.blockStats;

        // Appeler la fonction batch optimisée (1 write au lieu de 10)
        await completeLevelWithBatch(currentExerciseLevel, {
          correctAnswers,
          incorrectAnswers,
          xpGained
        });

        console.log(`✅ Niveau ${currentExerciseLevel} complété en batch : ${correctAnswers}/${correctAnswers + incorrectAnswers} corrects, +${xpGained} XP`);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du niveau:', error);
      }

      // Naviguer vers LevelComplete avec les stats
      const freshStats = getStats();
      const timeElapsed = Math.floor((Date.now() - levelStartTime) / 1000);

      navigate('/level-complete', {
        state: {
          stats: {
            correctAnswers: state.blockStats.correctAnswers,
            incorrectAnswers: state.blockStats.incorrectAnswers,
            timeElapsed,
            streak: freshStats.streak?.current || 0
          },
          level: currentExerciseLevel,
          totalXP: state.blockStats.xpGained,
          difficulty,
          currentExerciseLevel
        }
      });
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Continuer au prochain exercice (pas de sauvegarde)
      setCurrentExerciseIndex(nextExerciseIndex);
    }
  }, [currentExerciseIndex, exercises.length, getStats, levelStartTime, navigate, state.blockStats, currentExerciseLevel, difficulty, resetForNextExercise, completeLevelWithBatch]);

  const handleQuit = useCallback(() => {
    showModal();
  }, [showModal]);

  const handleModalContinue = useCallback(() => {
    hideModal();
    triggerLight();
  }, [hideModal, triggerLight]);

  const handleModalExit = useCallback(() => {
    hideModal();

    console.log(`Sortie pendant le niveau ${currentExerciseLevel} - progression du niveau perdue`);

    // Animation de sortie
    const exerciseApp = document.querySelector('.exercise-app');
    if (exerciseApp) {
      exerciseApp.style.transform = 'scale(0.95)';
      exerciseApp.style.opacity = '0';

      setTimeout(() => {
        navigate('/home');
      }, 200);
    } else {
      navigate('/home');
    }
  }, [hideModal, currentExerciseLevel, navigate]);

  const handleExplanationToggle = useCallback(() => {
    // Toggle via reducer (gère automatiquement les lignes à highlight)
    toggleExplanation();

    // Scroll vers le code si expansion
    if (!state.isExplanationExpanded) {
      setTimeout(() => {
        const codeContainer = document.querySelector('.code-container');
        if (codeContainer) {
          codeContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 150);
    }
  }, [toggleExplanation, state.isExplanationExpanded]);

  // Show loading state (après tous les hooks)
  // Attendre que la progression ET les exercices soient chargés
  if (progressLoading || isLoading || exercises.length === 0) {
    return (
      <div className="exercise-app" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#FFFFFF',
        fontSize: '18px'
      }}>
        {progressLoading ? 'Chargement de la progression...' : 'Chargement des exercices...'}
      </div>
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
            <div className="progress-fill" style={{
              width: `${((currentExerciseIndex % EXERCISES_PER_LEVEL) + 1) / EXERCISES_PER_LEVEL * 100}%`
            }} />
          </div>
        </div>
      </header>

      {/* Screen Reader Live Region for Feedback */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {state.isSubmitted && isCorrect && `Bonne réponse ! Vous gagnez ${exercise.xpGain} points d'expérience.`}
        {state.isSubmitted && !isCorrect && `Réponse incorrecte. Réessayez sur le prochain exercice !`}
      </div>

      {/* Content Scrollable */}
      <main className="content-scrollable" aria-label="Contenu de l'exercice">
        {/* Question */}
        <QuestionCard
          question={exercise.question}
          isSubmitted={state.isSubmitted}
          isCorrect={isCorrect}
          xpGain={exercise.xpGain}
          explanation={exercise.explanation}
          onExplanationToggle={handleExplanationToggle}
          isExplanationExpanded={state.isExplanationExpanded}
        />

        {/* Code Block */}
        <CodeBlock
          code={exercise.code}
          language={exercise.language}
          highlightedLines={state.highlightedLines}
          isHighlightActive={state.isExplanationExpanded}
          isCompact={state.isExplanationExpanded}
          clickableLines={exercise.clickableLines || []}
          selectedLine={state.selectedLine}
          onLineClick={handleLineClick}
          isSubmitted={state.isSubmitted}
          correctAnswer={exercise.correctAnswer}
        />

        {/* Options Grid - Only for inputType 'options' */}
        {exercise.inputType === 'options' && (
          <div className={`options-container ${state.isExplanationExpanded ? 'hidden' : 'visible'}`}>
            <div className="options-grid" role="group" aria-label="Options de réponse">
              {exercise.options.map((option, index) => (
                <OptionButton
                  key={index}
                  value={option}
                  isSelected={state.selectedOption === index}
                  isCorrect={index === exercise.correctAnswer}
                  isSubmitted={state.isSubmitted}
                  onClick={() => handleOptionClick(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Custom Keyboard - Only for inputType 'free_input' AND not submitted */}
        {exercise.inputType === 'free_input' && !state.isExplanationExpanded && !state.isSubmitted && (
          <CustomKeyboard
            type={exercise.keyboardType || 'numeric'}
            value={state.userInput}
            onKeyPress={handleKeyPress}
          />
        )}

        {/* User Answer Display - Only for free_input after submission */}
        {exercise.inputType === 'free_input' && state.isSubmitted && !state.isExplanationExpanded && (
          <div className="user-answer-display">
            <div className="answer-label">Ta réponse :</div>
            <div className={`answer-value ${isCorrect ? 'correct' : 'incorrect'}`}>
              {state.userInput}
            </div>
          </div>
        )}

        {/* Validate/Continue Button */}
        <ActionButton
          isSubmitted={state.isSubmitted}
          isCorrect={isCorrect}
          isDisabled={!state.isSubmitted && !isAnswerSelected}
          onClick={state.isSubmitted ? handleContinue : handleValidate}
        />
      </main>

      {/* Feedback Glow Effects */}
      <FeedbackGlow isVisible={state.showGlow} type={state.glowType} />

      {/* Exit Confirmation Modal */}
      <ExitConfirmModal
        isVisible={state.showExitModal}
        onContinue={handleModalContinue}
        onExit={handleModalExit}
      />
    </div>
  );
};

export default Exercise;