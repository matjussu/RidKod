import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import QuestionCard from "../components/exercise/QuestionCard";
import CodeBlock from "../components/exercise/CodeBlock";
import OptionButton from "../components/exercise/OptionButton";
import ActionButton from "../components/exercise/ActionButton";
import FeedbackGlow from "../components/common/FeedbackGlow";
import ExitConfirmModal from "../components/common/ExitConfirmModal";
import CustomKeyboard from "../components/exercise/CustomKeyboard";
import useHaptic from "../hooks/useHaptic";
import exercisesData from "../data/exercises.json";
import { isBlockComplete, EXERCISES_PER_LEVEL } from '../constants/exerciseLayout';
import '../styles/Exercise.css';

const Exercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeExercise, getStats, isLevelCompleted } = useProgress();

  // Récupérer le langage et la difficulté depuis la navigation
  const language = location.state?.language || 'PYTHON';
  const difficulty = location.state?.difficulty || 1;

  // Charger la progression pour déterminer le niveau de départ
  const stats = getStats();

  // Pour une difficulté donnée, toujours commencer à l'exercice 0
  // (on filtre les exercices par difficulté, donc chaque difficulté a ses propres exercices)
  const startingExerciseIndex = 0;

  // State management
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(startingExerciseIndex);

  const [showGlow, setShowGlow] = useState(false);
  const [glowType, setGlowType] = useState(null);

  // New states for different input types
  const [userInput, setUserInput] = useState(''); // For free_input type
  const [selectedLine, setSelectedLine] = useState(null); // For clickable_lines type

  // Explanation system state
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState([]);

  // Exit modal state
  const [showExitModal, setShowExitModal] = useState(false);

  // Level stats tracking
  const [blockStats, setBlockStats] = useState(() => {
    return {
      correctAnswers: 0,
      incorrectAnswers: 0,
      xpGained: 0,
      currentUserLevel: stats.userLevel,
      streak: stats.streak?.current || 0,
      totalAnswered: 0,
      timeElapsed: 0 // Temps en secondes
    };
  });

  // Timer pour mesurer le temps passé sur le niveau
  const [levelStartTime] = useState(Date.now());

  // Haptic feedback hook
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  // Load exercises from JSON and filter by difficulty
  const allExercises = exercisesData;
  const exercises = allExercises.filter(ex => ex.difficulty === difficulty);
  const exercise = exercises[currentExerciseIndex];

  // Calculate current exercise level (1-based, increments every 10 exercises)
  // Format: {difficulty}_{level} ex: "1_1", "2_1", "3_1" pour distinguer les difficultés
  const levelNumber = Math.floor(currentExerciseIndex / EXERCISES_PER_LEVEL) + 1;
  const currentExerciseLevel = `${difficulty}_${levelNumber}`;

  // Event handlers
  const handleOptionClick = (index) => {
    if (!isSubmitted) {
      setSelectedOption(index);
      triggerLight();
    }
  };

  const handleLineClick = (lineNumber) => {
    if (!isSubmitted) {
      setSelectedLine(lineNumber);
      triggerLight();
    }
  };

  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setUserInput('');
    } else {
      setUserInput(prev => prev + key);
    }
  };

  // Validation function for flexible answer checking
  const checkAnswer = () => {
    const inputType = exercise.inputType || 'options';

    if (inputType === 'options') {
      return selectedOption === exercise.correctAnswer;
    } else if (inputType === 'free_input') {
      const acceptedAnswers = exercise.acceptedAnswers || [];
      return acceptedAnswers.some(answer =>
        answer.toLowerCase().trim() === userInput.toLowerCase().trim()
      );
    } else if (inputType === 'clickable_lines') {
      return selectedLine === exercise.correctAnswer;
    }
    return false;
  };

  const handleValidate = async () => {
    setIsSubmitted(true);

    const correct = checkAnswer();
    const baseXP = exercise.xpGain || 10;
    // XP gagné UNIQUEMENT si réponse correcte
    const xpGain = correct ? baseXP : 0;

    if (correct) {
      setGlowType('success');
      triggerSuccess();
    } else {
      setGlowType('error');
      triggerError();
    }

    setShowGlow(true);

    // Sauvegarder la progression avec le niveau d'exercice actuel
    let actualXpGained = 0;
    try {
      const result = await completeExercise({
        exerciseLevel: currentExerciseLevel,
        isCorrect: correct,
        xpGained: xpGain  // 0 si incorrect, baseXP si correct
      });
      actualXpGained = result?.xpGained || 0;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error);
    }

    // Mettre à jour les stats du bloc
    setBlockStats(prev => ({
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (correct ? 0 : 1),
      xpGained: prev.xpGained + actualXpGained,
      totalAnswered: prev.totalAnswered + 1,
      currentUserLevel: prev.currentUserLevel,
      streak: prev.streak
    }));

    setTimeout(() => {
      setShowGlow(false);
    }, correct ? 1200 : 1500);
  };

  const handleContinue = () => {
    setIsExplanationExpanded(false);
    setHighlightedLines([]);

    // Vérifier si on vient de terminer le dernier exercice d'un bloc
    // Index commence à 0, donc exercice 9 (10ème) = fin du niveau 1
    const nextExerciseIndex = currentExerciseIndex + 1;
    const blockComplete = isBlockComplete(currentExerciseIndex);

    if (blockComplete) {
      // Naviguer vers LevelComplete avec les stats
      const stats = getStats();
      const timeElapsed = Math.floor((Date.now() - levelStartTime) / 1000); // En secondes

      navigate('/level-complete', {
        state: {
          stats: {
            correctAnswers: blockStats.correctAnswers,
            incorrectAnswers: blockStats.incorrectAnswers,
            timeElapsed,
            streak: stats.streak?.current || 0
          },
          level: currentExerciseLevel,
          totalXP: blockStats.xpGained,
          difficulty,
          currentExerciseLevel
        }
      });
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Continuer normalement au prochain exercice
      setCurrentExerciseIndex(nextExerciseIndex);
      setSelectedOption(null);
      setUserInput('');
      setSelectedLine(null);
      setIsSubmitted(false);
    } else {
      // Fin de tous les exercices disponibles
      const stats = getStats();
      const timeElapsed = Math.floor((Date.now() - levelStartTime) / 1000); // En secondes

      navigate('/level-complete', {
        state: {
          stats: {
            correctAnswers: blockStats.correctAnswers,
            incorrectAnswers: blockStats.incorrectAnswers,
            timeElapsed,
            streak: stats.streak?.current || 0
          },
          level: currentExerciseLevel,
          totalXP: blockStats.xpGained,
          difficulty,
          currentExerciseLevel
        }
      });
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

    // Si on quitte pendant un niveau, on perd la progression du niveau actuel
    // mais on garde les niveaux complétés précédents
    console.log(`Sortie pendant le niveau ${currentExerciseLevel} - progression du niveau perdue`);

    // Animation de sortie élégante
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

  const isCorrect = checkAnswer();

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
          clickableLines={exercise.clickableLines || []}
          selectedLine={selectedLine}
          onLineClick={handleLineClick}
          isSubmitted={isSubmitted}
          correctAnswer={exercise.correctAnswer}
        />

        {/* Options Grid - Only for inputType 'options' */}
        {exercise.inputType === 'options' && (
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
        )}

        {/* Custom Keyboard - Only for inputType 'free_input' AND not submitted */}
        {exercise.inputType === 'free_input' && !isExplanationExpanded && !isSubmitted && (
          <CustomKeyboard
            type={exercise.keyboardType || 'numeric'}
            value={userInput}
            onKeyPress={handleKeyPress}
          />
        )}

        {/* User Answer Display - Only for free_input after submission */}
        {exercise.inputType === 'free_input' && isSubmitted && !isExplanationExpanded && (
          <div className="user-answer-display">
            <div className="answer-label">Ta réponse :</div>
            <div className={`answer-value ${isCorrect ? 'correct' : 'incorrect'}`}>
              {userInput}
            </div>
          </div>
        )}

        {/* Validate/Continue Button */}
        <ActionButton
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          isDisabled={
            !isSubmitted &&
            (exercise.inputType === 'options' ? selectedOption === null :
             exercise.inputType === 'free_input' ? userInput.trim() === '' :
             exercise.inputType === 'clickable_lines' ? selectedLine === null :
             true)
          }
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