import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import QuestionCard from '../../components/exercise/QuestionCard';
import CodeBlock from '../../components/exercise/CodeBlock';
import OptionButton from '../../components/exercise/OptionButton';
import ActionButton from '../../components/exercise/ActionButton';
import CustomKeyboard from '../../components/exercise/CustomKeyboard';
import BossGameOverModal from '../../components/lessons/BossGameOverModal';
import BossSuccessModal from '../../components/lessons/BossSuccessModal';
import useHaptic from '../../hooks/useHaptic';

// Import boss data
import bossMod001Data from '../../data/lessons/python/boss-mod-001.json';

const BossFightContent = () => {
  const navigate = useNavigate();
  const { language, moduleId } = useParams();
  const { triggerLight, triggerSuccess, triggerError } = useHaptic();
  const { progress, updateProgress } = useProgress();

  // Boss data
  const [bossData, setBossData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // Current question state
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [freeInputValue, setFreeInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

  // Modals
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load boss data
  useEffect(() => {
    const bossMap = {
      'py_mod_001': bossMod001Data
    };

    if (bossMap[moduleId]) {
      setBossData(bossMap[moduleId]);
    } else {
      // Module pas encore implémenté
      navigate(`/lessons/${language}/${moduleId}/lessons`);
    }
  }, [moduleId, language, navigate]);

  // Handle back
  const handleBack = () => {
    triggerLight();
    navigate(`/lessons/${language}/${moduleId}/lessons`);
  };

  // Handle keyboard
  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setFreeInputValue(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setFreeInputValue('');
    } else {
      setFreeInputValue(prev => prev + key);
    }
  };

  // Handle validation
  const handleValidate = () => {
    if (!bossData) return;

    const currentQuestion = bossData.questions[currentQuestionIndex];
    let correct = false;

    // Check answer based on input type
    if (currentQuestion.inputType === 'options') {
      correct = selectedOption === currentQuestion.correctAnswer;
    } else if (currentQuestion.inputType === 'free_input') {
      const userAnswer = freeInputValue.trim().toLowerCase();
      const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
      correct = userAnswer === correctAnswer;
    } else if (currentQuestion.inputType === 'predefined') {
      const userAnswer = freeInputValue.trim();
      const correctAnswer = currentQuestion.correctAnswer;
      correct = userAnswer === correctAnswer;
    } else if (currentQuestion.inputType === 'clickable_lines') {
      correct = selectedLine === currentQuestion.correctAnswer;
    }

    setIsSubmitted(true);
    setIsCorrect(correct);

    // Track answered questions
    setAnsweredQuestions(prev => [...prev, {
      questionId: currentQuestion.id,
      correct
    }]);

    if (correct) {
      triggerSuccess();
    } else {
      triggerError();
      const newErrorCount = errors + 1;
      setErrors(newErrorCount);

      // Check if game over (3+ errors)
      if (newErrorCount > bossData.maxErrors) {
        setTimeout(() => {
          setShowGameOverModal(true);
        }, 1500);
      }
    }
  };

  // Handle continue
  const handleContinue = () => {
    // Reset state
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setSelectedLine(null);
    setFreeInputValue('');
    setIsExplanationExpanded(false);

    // Check if last question
    if (currentQuestionIndex >= bossData.questions.length - 1) {
      // Boss fight complete
      if (errors <= bossData.maxErrors) {
        // Victory
        setShowSuccessModal(true);
      }
    } else {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle retry (from game over modal)
  const handleRetry = () => {
    setShowGameOverModal(false);
    setCurrentQuestionIndex(0);
    setErrors(0);
    setAnsweredQuestions([]);
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setSelectedLine(null);
    setFreeInputValue('');
    setIsExplanationExpanded(false);
  };

  // Handle success (collect XP)
  const handleSuccess = async () => {
    setShowSuccessModal(false);

    // Mark boss as completed and defeated
    await updateProgress({
      totalXP: (progress?.totalXP || 0) + bossData.xpReward,
      bossCompleted: {
        ...progress?.bossCompleted,
        [moduleId]: {
          completed: true,
          errors: errors,
          completedAt: Date.now()
        }
      },
      bossesDefeated: {
        ...progress?.bossesDefeated,
        [moduleId]: true
      }
    });

    // Navigate to XP collection page
    navigate(`/lessons/${language}/${moduleId}/boss-xp`);
  };

  if (!bossData) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1A1919 0%, #2C2C2E 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF'
      }}>
        Chargement...
      </div>
    );
  }

  const currentQuestion = bossData.questions[currentQuestionIndex];
  const totalQuestions = bossData.questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const maxHearts = bossData.maxErrors + 1; // 3 hearts for max 2 errors

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A1919 0%, #2C2C2E 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#FFFFFF',
      fontFamily: '"JetBrains Mono", monospace'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(26, 25, 25, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 20px',
        zIndex: 100
      }}>
        {/* Back button + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FF9500',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '900',
            color: '#FFD700',
            margin: 0,
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
          }}>
            🏆 Boss Final
          </h1>
        </div>

        {/* Progress bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          height: '6px',
          overflow: 'hidden',
          marginBottom: '12px'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #FFD700 0%, #FF9500 100%)',
            height: '100%',
            width: `${progressPercentage}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#8E8E93', fontWeight: '700' }}>
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </span>

          {/* Hearts (lives) */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: maxHearts }).map((_, index) => (
              <span
                key={index}
                style={{
                  fontSize: '20px',
                  opacity: index < errors ? 0.3 : 1,
                  filter: index < errors ? 'grayscale(100%)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {index < errors ? '🖤' : '❤️'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <QuestionCard
          question={currentQuestion.question}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          explanation={currentQuestion.explanation}
          highlightedLines={currentQuestion.highlightedLines || []}
          xpGain={currentQuestion.xpGain}
          code={currentQuestion.code}
          isExplanationExpanded={isExplanationExpanded}
          onExplanationToggle={() => setIsExplanationExpanded(!isExplanationExpanded)}
        />

        <CodeBlock
          code={currentQuestion.code}
          language="python"
          highlightedLines={currentQuestion.highlightedLines || []}
          isHighlightActive={isSubmitted}
          clickableLines={
            currentQuestion.inputType === 'clickable_lines'
              ? Array.from({ length: currentQuestion.code.split('\n').length }, (_, i) => i)
              : []
          }
          selectedLine={selectedLine}
          onLineClick={(lineNum) => {
            if (currentQuestion.inputType === 'clickable_lines' && !isSubmitted) {
              setSelectedLine(lineNum);
            }
          }}
          isSubmitted={isSubmitted}
          correctAnswer={currentQuestion.correctAnswer}
        />

        {/* Options */}
        {currentQuestion.inputType === 'options' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginTop: '16px'
          }}>
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={index}
                value={option}
                index={index}
                isSelected={selectedOption === index}
                isSubmitted={isSubmitted}
                isCorrect={index === currentQuestion.correctAnswer}
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

        {/* Free input keyboard */}
        {(currentQuestion.inputType === 'free_input' || currentQuestion.inputType === 'predefined') && !isSubmitted && (
          <CustomKeyboard
            type={currentQuestion.predefinedAnswers ? 'predefined' : (currentQuestion.keyboardType || 'numeric')}
            predefinedKeys={currentQuestion.predefinedAnswers}
            value={freeInputValue}
            onKeyPress={handleKeyPress}
          />
        )}

        {/* User answer display */}
        {(currentQuestion.inputType === 'free_input' || currentQuestion.inputType === 'predefined') && isSubmitted && (
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

        {/* Action button */}
        <ActionButton
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          isDisabled={
            !isSubmitted &&
            ((currentQuestion.inputType === 'options' && selectedOption === null) ||
             ((currentQuestion.inputType === 'free_input' || currentQuestion.inputType === 'predefined') && freeInputValue.trim() === '') ||
             (currentQuestion.inputType === 'clickable_lines' && selectedLine === null))
          }
          onClick={isSubmitted ? handleContinue : handleValidate}
        />
      </div>

      {/* Game Over Modal */}
      {showGameOverModal && (
        <BossGameOverModal
          errors={errors}
          maxErrors={bossData.maxErrors}
          onRetry={handleRetry}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <BossSuccessModal
          errors={errors}
          maxErrors={bossData.maxErrors}
          xpReward={bossData.xpReward}
          onCollectXP={handleSuccess}
        />
      )}
    </div>
  );
};

export default BossFightContent;
