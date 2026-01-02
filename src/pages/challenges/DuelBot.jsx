import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import CodeBlock from '../../components/exercise/CodeBlock';
import OptionButton from '../../components/exercise/OptionButton';
import ActionButton from '../../components/exercise/ActionButton';
import QuestionCard from '../../components/exercise/QuestionCard';
import CustomKeyboard from '../../components/exercise/CustomKeyboard';
import FeedbackGlow from '../../components/common/FeedbackGlow';
import {
  incrementDuelStats,
  saveLocalChallengeStats,
  getLocalChallengeStats
} from '../../services/challengeStatsService';
import { getRandomExercises } from '../../data/loaders/trainingLoader';
import '../../styles/Challenges.css';

const DuelBot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recordDailyActivity } = useProgress();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  // Etats du jeu
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Etats du joueur
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Constante de pénalité (10 secondes par erreur)
  const PENALTY_SECONDS = 10;

  // Stats joueur
  const [playerStats, setPlayerStats] = useState({
    correctAnswers: 0,
    errors: 0,
    currentQuestion: 0
  });

  // Stats bot
  const [botStats, setBotStats] = useState({
    correctAnswers: 0,
    errors: 0,
    currentQuestion: 0,
    isAnswering: false,
    timeSeconds: 0
  });

  // Feedback
  const [showGlow, setShowGlow] = useState(false);
  const [glowType, setGlowType] = useState('success');

  // Timer
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const botTimeoutRef = useRef(null);

  // Difficulte du bot (0 = facile, 1 = moyen, 2 = difficile)
  const [botDifficulty] = useState(1);

  // Charger les exercices
  useEffect(() => {
    const loadExercises = async () => {
      try {
        // Charger 5 exercices aléatoires via le loader centralisé
        const randomExercises = await getRandomExercises(5, 'python');
        setExercises(randomExercises);
        setLoading(false);
      } catch (error) {
        console.error('Error loading exercises:', error);
        navigate('/challenges/duel');
      }
    };

    loadExercises();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, [navigate]);

  // Countdown avant le debut
  useEffect(() => {
    if (!loading && !gameStarted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(c => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
  }, [loading, gameStarted, countdown]);

  // Timer du jeu
  useEffect(() => {
    if (gameStarted && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, startTime]);

  // Simuler le bot qui repond
  useEffect(() => {
    if (!gameStarted || isSubmitted || botStats.currentQuestion > currentIndex) return;

    // Delai base sur la difficulte
    const baseDelay = botDifficulty === 0 ? 8000 : botDifficulty === 1 ? 5000 : 3000;
    const randomDelay = baseDelay + Math.random() * 4000;

    // Probabilite de bonne reponse basee sur la difficulte
    const correctProbability = botDifficulty === 0 ? 0.5 : botDifficulty === 1 ? 0.7 : 0.85;

    setBotStats(prev => ({ ...prev, isAnswering: true }));

    botTimeoutRef.current = setTimeout(() => {
      const botCorrect = Math.random() < correctProbability;
      const botTime = Math.floor(randomDelay / 1000); // Temps de réponse du bot

      setBotStats(prev => ({
        ...prev,
        isAnswering: false,
        correctAnswers: prev.correctAnswers + (botCorrect ? 1 : 0),
        errors: prev.errors + (botCorrect ? 0 : 1),
        timeSeconds: prev.timeSeconds + botTime,
        currentQuestion: currentIndex + 1
      }));
    }, randomDelay);

    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, [gameStarted, currentIndex, isSubmitted, botDifficulty, exercises, botStats.currentQuestion]);

  const currentExercise = exercises[currentIndex];
  const inputType = currentExercise?.inputType || 'options';

  // Verifier la reponse
  const checkAnswer = useCallback(() => {
    if (!currentExercise) return false;

    if (inputType === 'options') {
      return selectedOption === currentExercise.correctAnswer;
    } else if (inputType === 'free_input') {
      const acceptedAnswers = currentExercise.acceptedAnswers || [];
      return acceptedAnswers.some(answer =>
        answer.toLowerCase().trim() === userInput.toLowerCase().trim()
      );
    } else if (inputType === 'clickable_lines') {
      return selectedLine === currentExercise.correctAnswer;
    }
    return false;
  }, [currentExercise, inputType, selectedOption, userInput, selectedLine]);

  // Valider la reponse
  const handleValidate = useCallback(() => {
    if (isSubmitted) return;

    const correct = checkAnswer();
    setIsCorrect(correct);
    setIsSubmitted(true);

    setGlowType(correct ? 'success' : 'error');
    setShowGlow(true);
    setTimeout(() => setShowGlow(false), 600);

    if (correct) {
      triggerSuccess();
    } else {
      triggerError();
    }

    setPlayerStats(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      errors: prev.errors + (correct ? 0 : 1),
      currentQuestion: currentIndex + 1
    }));
  }, [isSubmitted, checkAnswer, currentIndex, triggerSuccess, triggerError]);

  // Continuer
  const handleContinue = useCallback(async () => {
    triggerLight();

    setSelectedOption(null);
    setUserInput('');
    setSelectedLine(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowExplanation(false);

    if (currentIndex >= exercises.length - 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

      const playerTimeReal = Math.floor((Date.now() - startTime) / 1000);
      const playerTotalTime = playerTimeReal + (playerStats.errors * PENALTY_SECONDS);
      const botTotalTime = botStats.timeSeconds + (botStats.errors * PENALTY_SECONDS);

      // Determiner si le joueur a gagne (le plus petit temps gagne)
      const playerWins = playerTotalTime < botTotalTime;

      // Incrementer les stats de duel
      if (user?.uid) {
        await incrementDuelStats(user.uid, playerWins);
      } else {
        const localStats = getLocalChallengeStats();
        saveLocalChallengeStats({
          duelsWon: (localStats.duelsWon || 0) + (playerWins ? 1 : 0)
        });
      }

      // Enregistrer l'activité challenge pour le calendrier
      recordDailyActivity('challenges', 1);

      navigate('/challenges/duel/result', {
        state: {
          mode: 'bot',
          player: {
            username: user?.displayName || 'Toi',
            ...playerStats,
            timeSeconds: playerTimeReal,
            totalTime: playerTotalTime
          },
          opponent: {
            username: 'Bot',
            ...botStats,
            totalTime: botTotalTime,
            isBot: true
          },
          exerciseCount: exercises.length,
          penaltySeconds: PENALTY_SECONDS
        }
      });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, exercises.length, startTime, playerStats, botStats, user, navigate, triggerLight]);

  // Handlers
  const handleOptionSelect = (index) => {
    if (isSubmitted) return;
    triggerLight();
    setSelectedOption(index);
  };

  const handleLineSelect = (lineNumber) => {
    if (isSubmitted) return;
    triggerLight();
    setSelectedLine(lineNumber);
  };

  const handleKeyPress = (key) => {
    if (isSubmitted) return;
    triggerLight();
    if (key === 'delete') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setUserInput('');
    } else {
      setUserInput(prev => prev + key);
    }
  };

  const handleBackClick = () => {
    triggerLight();
    navigate('/challenges/duel');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canValidate = inputType === 'options'
    ? selectedOption !== null
    : inputType === 'free_input'
    ? userInput.trim().length > 0
    : selectedLine !== null;

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0D0D0F',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    header: {
      position: 'sticky',
      top: 0,
      background: 'rgba(13, 13, 15, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '12px 20px',
      paddingTop: 'max(calc(env(safe-area-inset-top) + 12px), 28px)',
      zIndex: 100,
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 700,
      color: '#A78BFA',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    timer: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '16px',
      fontWeight: 700,
      color: '#FFFFFF',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '6px 12px',
      borderRadius: '8px',
    },
    scoreComparison: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
    playerScore: {
      flex: 1,
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '12px',
      padding: '10px 12px',
      textAlign: 'center',
    },
    botScore: {
      flex: 1,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '10px 12px',
      textAlign: 'center',
    },
    scoreName: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: 'rgba(255, 255, 255, 0.5)',
      display: 'block',
      marginBottom: '4px',
    },
    scoreValue: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '20px',
      fontWeight: 800,
      color: '#FFFFFF',
    },
    scoreValuePlayer: {
      color: '#A78BFA',
    },
    vsText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      fontWeight: 700,
      color: 'rgba(255, 255, 255, 0.3)',
    },
    progressBar: {
      height: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '12px',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
      transition: 'width 0.3s ease',
    },
    content: {
      flex: 1,
      padding: '20px',
      maxWidth: 'min(428px, 100vw)',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    },
    countdownOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(13, 13, 15, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    countdownNumber: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '120px',
      fontWeight: 900,
      color: '#A78BFA',
      textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
      animation: 'pulse 1s ease-in-out infinite',
    },
    countdownText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '18px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginTop: '16px',
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255, 255, 255, 0.1)',
      borderTopColor: '#A78BFA',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginTop: '20px',
    },
    actionButtonContainer: {
      marginTop: '20px',
    },
    botIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    botDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#30D158',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(255, 255, 255, 0.5)' }}>
            Preparation du duel...
          </p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        `}</style>
        <div style={styles.countdownOverlay}>
          <div style={styles.countdownNumber}>{countdown}</div>
          <p style={styles.countdownText}>Le duel commence...</p>
        </div>
      </div>
    );
  }

  if (!currentExercise) return null;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <FeedbackGlow type={glowType} visible={showGlow} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button style={styles.backButton} onClick={handleBackClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <span style={styles.headerTitle}>
            {"🤖"} vs Bot
          </span>
          <span style={styles.timer}>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Time Comparison */}
        <div style={styles.scoreComparison}>
          <div style={styles.playerScore}>
            <span style={styles.scoreName}>Toi</span>
            <span style={{ ...styles.scoreValue, ...styles.scoreValuePlayer }}>
              {formatTime(elapsedSeconds)}
              {playerStats.errors > 0 && (
                <span style={{ fontSize: '12px', color: '#FF453A', marginLeft: '4px' }}>
                  +{playerStats.errors * PENALTY_SECONDS}s
                </span>
              )}
            </span>
          </div>
          <span style={styles.vsText}>VS</span>
          <div style={styles.botScore}>
            <span style={styles.scoreName}>
              <span style={styles.botIndicator}>
                Bot {botStats.isAnswering && <span style={styles.botDot}></span>}
              </span>
            </span>
            <span style={styles.scoreValue}>
              {formatTime(botStats.timeSeconds)}
              {botStats.errors > 0 && (
                <span style={{ fontSize: '12px', color: '#FF453A', marginLeft: '4px' }}>
                  +{botStats.errors * PENALTY_SECONDS}s
                </span>
              )}
            </span>
          </div>
        </div>

        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${((currentIndex + (isSubmitted ? 1 : 0)) / exercises.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <QuestionCard
          question={currentExercise.question}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          isExplanationExpanded={showExplanation}
          explanation={currentExercise.explanation}
          onExplanationToggle={() => setShowExplanation(!showExplanation)}
          hideXp={true}
        />

        <CodeBlock
          code={currentExercise.code}
          language={currentExercise.language}
          clickableLines={inputType === 'clickable_lines' ? currentExercise.clickableLines : []}
          selectedLine={selectedLine}
          correctLine={isSubmitted ? currentExercise.correctAnswer : null}
          onLineClick={handleLineSelect}
          isSubmitted={isSubmitted}
          highlightedLines={showExplanation ? (currentExercise.highlightedLines || []) : []}
        />

        {inputType === 'options' && currentExercise.options && (
          <div style={styles.optionsGrid}>
            {currentExercise.options.map((option, index) => (
              <OptionButton
                key={index}
                value={option}
                isSelected={selectedOption === index}
                isCorrect={index === currentExercise.correctAnswer}
                isSubmitted={isSubmitted}
                onClick={() => handleOptionSelect(index)}
              />
            ))}
          </div>
        )}

        {inputType === 'free_input' && (
          <CustomKeyboard
            value={userInput}
            onKeyPress={handleKeyPress}
            keyboardType={currentExercise.keyboardType || 'numeric'}
            isSubmitted={isSubmitted}
            isCorrect={isCorrect}
            correctAnswer={currentExercise.acceptedAnswers?.[0]}
          />
        )}

        <div style={styles.actionButtonContainer}>
          <ActionButton
            isSubmitted={isSubmitted}
            isCorrect={isCorrect}
            isDisabled={!isSubmitted && !canValidate}
            onClick={isSubmitted ? handleContinue : handleValidate}
          />
        </div>
      </div>
    </div>
  );
};

export default DuelBot;
