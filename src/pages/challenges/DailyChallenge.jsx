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
  getDailyChallengeExercises,
  hasCompletedDailyChallenge,
  saveDailyChallengeScore,
  getTodayDateString
} from '../../services/dailyChallengeService';
import { getUserProfile } from '../../services/userService';
import {
  incrementDailyChallengeCompleted,
  saveLocalChallengeStats,
  getLocalChallengeStats
} from '../../services/challengeStatsService';
import '../../styles/Challenges.css';

const DailyChallenge = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeExercise, recordDailyActivity } = useProgress();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  // États principaux
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [previousScore, setPreviousScore] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dateString, setDateString] = useState('');

  // États de l'exercice en cours
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // États du feedback
  const [showGlow, setShowGlow] = useState(false);
  const [glowType, setGlowType] = useState('success');

  // Stats de la session
  const [stats, setStats] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalXP: 0
  });

  // Timer
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Charger le défi du jour
  useEffect(() => {
    const loadDailyChallenge = async () => {
      setLoading(true);

      try {
        // Vérifier si déjà complété
        if (user?.uid) {
          const completion = await hasCompletedDailyChallenge(user.uid);
          if (completion.completed) {
            setAlreadyCompleted(true);
            setPreviousScore(completion);
            setLoading(false);
            return;
          }
        }

        // Charger les exercices du jour
        const { success, exercises: dailyExercises, date } = await getDailyChallengeExercises();

        if (!success || !dailyExercises.length) {
          navigate('/challenges');
          return;
        }

        setExercises(dailyExercises);
        setDateString(date);
        setStartTime(Date.now());
      } catch (error) {
        console.error('Error loading daily challenge:', error);
        navigate('/challenges');
      } finally {
        setLoading(false);
      }
    };

    loadDailyChallenge();
  }, [user, navigate]);

  // Timer
  useEffect(() => {
    if (startTime && !alreadyCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, alreadyCompleted]);

  const currentExercise = exercises[currentIndex];
  const inputType = currentExercise?.inputType || 'options';

  // Vérifier la réponse
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

  // Valider la réponse
  const handleValidate = useCallback(() => {
    if (isSubmitted) return;

    const correct = checkAnswer();
    setIsCorrect(correct);
    setIsSubmitted(true);

    // Feedback visuel
    setGlowType(correct ? 'success' : 'error');
    setShowGlow(true);
    setTimeout(() => setShowGlow(false), 600);

    // Haptic
    if (correct) {
      triggerSuccess();
    } else {
      triggerError();
    }

    // Mettre à jour les stats
    const xpGain = correct ? (currentExercise.xpGain || 10) : 0;
    setStats(prev => ({
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (correct ? 0 : 1),
      totalXP: prev.totalXP + xpGain
    }));
  }, [isSubmitted, checkAnswer, currentExercise, triggerSuccess, triggerError]);

  // Continuer à l'exercice suivant
  const handleContinue = useCallback(async () => {
    triggerLight();

    // Reset état
    setSelectedOption(null);
    setUserInput('');
    setSelectedLine(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowExplanation(false);

    // Vérifier si c'est le dernier exercice
    if (currentIndex >= exercises.length - 1) {
      // Arrêter le timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const finalTime = Math.floor((Date.now() - startTime) / 1000);

      // Sauvegarder le score et incrémenter les stats
      if (user?.uid) {
        const profile = await getUserProfile(user.uid);
        await saveDailyChallengeScore(
          user.uid,
          profile?.profile?.username || 'Joueur',
          {
            score: stats.totalXP,
            correctAnswers: stats.correctAnswers,
            incorrectAnswers: stats.incorrectAnswers,
            timeSeconds: finalTime
          }
        );
        // Incrémenter le compteur de défis complétés
        await incrementDailyChallengeCompleted(user.uid, dateString);
      } else {
        // Utilisateur non connecté - sauvegarder en local
        const localStats = getLocalChallengeStats();
        saveLocalChallengeStats({
          dailyChallengesCompleted: (localStats.dailyChallengesCompleted || 0) + 1
        });
      }

      // ✅ Enregistrer l'activité challenge pour le calendrier
      recordDailyActivity('challenges', 1);

      // Naviguer vers les résultats
      navigate('/challenges/daily/result', {
        state: {
          stats: {
            ...stats,
            timeSeconds: finalTime
          },
          date: dateString,
          exerciseCount: exercises.length
        }
      });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, exercises.length, startTime, stats, user, dateString, navigate, triggerLight]);

  // Handlers de sélection
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
    navigate('/challenges');
  };

  // Formater le temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Déterminer si on peut valider
  const canValidate = inputType === 'options'
    ? selectedOption !== null
    : inputType === 'free_input'
    ? userInput.trim().length > 0
    : selectedLine !== null;

  // Styles
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
      padding: '16px 20px',
      paddingTop: 'max(calc(env(safe-area-inset-top) + 16px), 32px)',
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
      borderRadius: '8px',
    },
    headerTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 700,
      color: '#FB923C',
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
    progressBar: {
      height: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #FB923C 0%, #FACC15 100%)',
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
      padding: '40px',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255, 255, 255, 0.1)',
      borderTopColor: '#FB923C',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    completedContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '40px 20px',
      textAlign: 'center',
    },
    completedIcon: {
      fontSize: '64px',
    },
    completedTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '24px',
      fontWeight: 800,
      color: '#FFFFFF',
      margin: 0,
    },
    completedText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
    },
    completedScore: {
      background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(250, 204, 21, 0.05) 100%)',
      border: '1px solid rgba(251, 146, 60, 0.2)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    scoreValue: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '32px',
      fontWeight: 800,
      color: '#FACC15',
    },
    scoreLabel: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    backButtonLarge: {
      background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 700,
      color: '#FFFFFF',
      cursor: 'pointer',
      marginTop: '16px',
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

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(255, 255, 255, 0.5)' }}>
            Chargement du défi du jour...
          </p>
        </div>
      </div>
    );
  }

  // Already completed state
  if (alreadyCompleted && previousScore) {
    return (
      <div style={styles.container}>
        <div style={styles.completedContainer}>
          <span style={styles.completedIcon}>{"🎯"}</span>
          <h1 style={styles.completedTitle}>Défi déjà complété !</h1>
          <p style={styles.completedText}>
            Tu as déjà terminé le défi du jour. Reviens demain pour un nouveau challenge !
          </p>
          <div style={styles.completedScore}>
            <span style={styles.scoreValue}>{previousScore.score} XP</span>
            <span style={styles.scoreLabel}>
              {previousScore.correctAnswers}/5 bonnes réponses
            </span>
          </div>
          <button style={styles.backButtonLarge} onClick={handleBackClick}>
            Retour aux challenges
          </button>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return null;
  }

  return (
    <div style={styles.container}>
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
            {"📅"} Défi du jour
          </span>
          <span style={styles.timer}>{formatTime(elapsedSeconds)}</span>
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
        {/* Question Card */}
        <QuestionCard
          question={currentExercise.question}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          showExplanation={showExplanation}
          explanation={currentExercise.explanation}
          onToggleExplanation={() => setShowExplanation(!showExplanation)}
          xpGain={currentExercise.xpGain || 10}
        />

        {/* Code Block */}
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

        {/* Options (Multiple Choice) */}
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

        {/* Free Input */}
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

        {/* Action Button */}
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

export default DailyChallenge;
