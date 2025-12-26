import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import CodeBlock from '../../components/exercise/CodeBlock';
import OptionButton from '../../components/exercise/OptionButton';
import ActionButton from '../../components/exercise/ActionButton';
import QuestionCard from '../../components/exercise/QuestionCard';
import CustomKeyboard from '../../components/exercise/CustomKeyboard';
import FeedbackGlow from '../../components/common/FeedbackGlow';
import { subscribeToDuel, updatePlayerScore } from '../../services/duelService';
import {
  incrementDuelStats,
  saveLocalChallengeStats,
  getLocalChallengeStats
} from '../../services/challengeStatsService';
import '../../styles/Challenges.css';

const DuelGame = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { recordDailyActivity } = useProgress();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  const isHost = location.state?.isHost ?? true;

  // Etats du jeu
  const [loading, setLoading] = useState(true);
  const [duelData, setDuelData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Etats du joueur
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Stats
  const [playerScore, setPlayerScore] = useState(0);
  const [playerCorrect, setPlayerCorrect] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentQuestion, setOpponentQuestion] = useState(0);

  // Feedback
  const [showGlow, setShowGlow] = useState(false);
  const [glowType, setGlowType] = useState('success');

  // Pour eviter d'incrementer les stats plusieurs fois
  const statsUpdatedRef = useRef(false);

  // Timer
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Ecouter le duel
  useEffect(() => {
    if (!code) {
      navigate('/challenges/duel');
      return;
    }

    const unsubscribe = subscribeToDuel(code, ({ success, duelData: data, error }) => {
      if (!success) {
        console.error('Duel subscription error:', error);
        navigate('/challenges/duel');
        return;
      }

      setDuelData(data);

      if (data.exercises) {
        setExercises(data.exercises);
      }

      // Mettre a jour les scores de l'adversaire
      const opponent = isHost ? data.guest : data.host;
      if (opponent) {
        setOpponentScore(opponent.score || 0);
        setOpponentQuestion(opponent.currentQuestion || 0);
      }

      // Verifier si le duel est termine
      if (data.status === 'finished') {
        const player = isHost ? data.host : data.guest;
        const opponentData = isHost ? data.guest : data.host;

        const playerTimeSeconds = player.finishedAt ? Math.floor((new Date(player.finishedAt).getTime() - new Date(data.startedAt?.toDate?.() || Date.now()).getTime()) / 1000) : 0;
        const opponentTimeSeconds = opponentData.finishedAt ? Math.floor((new Date(opponentData.finishedAt).getTime() - new Date(data.startedAt?.toDate?.() || Date.now()).getTime()) / 1000) : 0;

        // Determiner si le joueur a gagne
        const playerWins = player.score > opponentData.score ||
          (player.score === opponentData.score && playerTimeSeconds < opponentTimeSeconds);

        // Incrementer les stats de duel (une seule fois)
        if (!statsUpdatedRef.current) {
          statsUpdatedRef.current = true;
          if (user?.uid) {
            incrementDuelStats(user.uid, playerWins);
          } else {
            const localStats = getLocalChallengeStats();
            saveLocalChallengeStats({
              duelsWon: (localStats.duelsWon || 0) + (playerWins ? 1 : 0)
            });
          }
          // ✅ Enregistrer l'activité challenge pour le calendrier
          recordDailyActivity('challenges', 1);
        }

        navigate('/challenges/duel/result', {
          state: {
            mode: 'friend',
            player: {
              username: player.username,
              score: player.score,
              correctAnswers: player.correctAnswers,
              timeSeconds: playerTimeSeconds
            },
            opponent: {
              username: opponentData.username,
              score: opponentData.score,
              correctAnswers: opponentData.correctAnswers,
              timeSeconds: opponentTimeSeconds
            },
            exerciseCount: data.exerciseCount || 5
          }
        });
      }

      if (loading) {
        setLoading(false);
        setStartTime(Date.now());
      }
    });

    return () => unsubscribe();
  }, [code, isHost, loading, navigate]);

  // Timer
  useEffect(() => {
    if (startTime) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

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
  const handleValidate = useCallback(async () => {
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

    const xpGain = correct ? (currentExercise.xpGain || 10) : 0;
    const newScore = playerScore + xpGain;
    const newCorrect = playerCorrect + (correct ? 1 : 0);

    setPlayerScore(newScore);
    setPlayerCorrect(newCorrect);

    // Mettre a jour Firestore
    if (user?.uid && code) {
      await updatePlayerScore(code, user.uid, {
        score: newScore,
        correctAnswers: newCorrect,
        currentQuestion: currentIndex + 1
      });
    }
  }, [isSubmitted, checkAnswer, currentExercise, currentIndex, playerScore, playerCorrect, user, code, triggerSuccess, triggerError]);

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
      // Terminer le duel
      if (timerRef.current) clearInterval(timerRef.current);

      const finalTime = new Date().toISOString();

      if (user?.uid && code) {
        await updatePlayerScore(code, user.uid, {
          finishedAt: finalTime
        });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, exercises.length, user, code, triggerLight]);

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

  const opponentName = isHost ? duelData?.guest?.username : duelData?.host?.username;

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
    headerTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 700,
      color: '#22D3EE',
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
    playerScoreCard: {
      flex: 1,
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      borderRadius: '12px',
      padding: '10px 12px',
      textAlign: 'center',
    },
    opponentScoreCard: {
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
      color: '#22D3EE',
    },
    vsText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      fontWeight: 700,
      color: 'rgba(255, 255, 255, 0.3)',
    },
    opponentProgress: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.4)',
      marginTop: '4px',
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
      background: 'linear-gradient(90deg, #06B6D4 0%, #22D3EE 100%)',
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
      borderTopColor: '#22D3EE',
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
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(255, 255, 255, 0.5)' }}>
            Chargement du duel...
          </p>
        </div>
      </div>
    );
  }

  if (!currentExercise) return null;

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <FeedbackGlow type={glowType} visible={showGlow} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <span style={styles.headerTitle}>
            {"⚔️"} Duel
          </span>
          <span style={styles.timer}>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Score Comparison */}
        <div style={styles.scoreComparison}>
          <div style={styles.playerScoreCard}>
            <span style={styles.scoreName}>Toi</span>
            <span style={{ ...styles.scoreValue, ...styles.scoreValuePlayer }}>
              {playerScore}
            </span>
          </div>
          <span style={styles.vsText}>VS</span>
          <div style={styles.opponentScoreCard}>
            <span style={styles.scoreName}>{opponentName || 'Adversaire'}</span>
            <span style={styles.scoreValue}>{opponentScore}</span>
            <div style={styles.opponentProgress}>
              Q{opponentQuestion}/{exercises.length}
            </div>
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
          showExplanation={showExplanation}
          explanation={currentExercise.explanation}
          onToggleExplanation={() => setShowExplanation(!showExplanation)}
          xpGain={currentExercise.xpGain || 10}
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

export default DuelGame;
