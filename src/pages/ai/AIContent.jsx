import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import AIPromptExample from '../../components/ai/AIPromptExample';
import CodeBlock from '../../components/exercise/CodeBlock';
import QuestionCard from '../../components/exercise/QuestionCard';
import OptionButton from '../../components/exercise/OptionButton';
import ActionButton from '../../components/exercise/ActionButton';
import CustomKeyboard from '../../components/exercise/CustomKeyboard';
import topicAutomation from '../../data/ai/ai_topic_001.json';
import '../../styles/Lessons.css';

// Map topic IDs to their data
const TOPIC_DATA = {
  'ai_topic_001': topicAutomation,
  // Add more topics here as they are created
  // 'ai_topic_002': topicEcommerce,
  // 'ai_topic_003': topicAuditor,
};

const AIContent = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const { progress, updateProgress } = useProgress();
  const { triggerSuccess, triggerError } = useHaptic();

  const [topicData, setTopicData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);

  // Exercise state
  const [selectedOption, setSelectedOption] = useState(null);
  const [freeInputValue, setFreeInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Load topic data from static imports
  useEffect(() => {
    if (topicId && TOPIC_DATA[topicId]) {
      setTopicData(TOPIC_DATA[topicId]);
    } else {
      console.error(`Topic ${topicId} not found`);
    }
  }, [topicId]);

  // Get current section
  const currentSection = topicData?.sections?.[currentSectionIndex];

  // Handle exercise from section
  useEffect(() => {
    if (currentSection?.type === 'exercise' && currentSection.exerciseId) {
      const exercise = topicData.exercises.find(ex => ex.id === currentSection.exerciseId);
      setCurrentExercise(exercise);
      setIsSubmitted(false);
      setSelectedOption(null);
      setFreeInputValue('');
    } else {
      setCurrentExercise(null);
    }
  }, [currentSection, topicData]);

  const handleBackClick = () => {
    navigate('/ai-understanding');
  };

  const handleNextSection = () => {
    if (currentSectionIndex < topicData.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Topic completed
      setShowCompleteModal(true);
    }
  };

  const handleValidateExercise = () => {
    console.log('🔍 handleValidateExercise called');
    console.log('selectedOption:', selectedOption);
    console.log('correctAnswer:', currentExercise?.correctAnswer);

    if (!currentExercise) return;

    let correct = false;

    if (currentExercise.inputType === 'options') {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.inputType === 'free_input') {
      const userAnswer = freeInputValue.trim().toLowerCase();
      const correctAnswer = currentExercise.correctAnswer.toString().toLowerCase();
      const acceptedAnswers = currentExercise.acceptedAnswers?.map(a => a.toLowerCase()) || [];

      correct = userAnswer === correctAnswer || acceptedAnswers.includes(userAnswer);
    }

    console.log('✅ Is correct?', correct);

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      triggerSuccess();

      // Add XP
      updateProgress({
        xp: progress.xp + (currentExercise.xpGain || 15)
      });

      // Mark exercise as completed
      if (!completedExercises.includes(currentExercise.id)) {
        setCompletedExercises(prev => [...prev, currentExercise.id]);
      }
    } else {
      triggerError();
    }
  };

  const handleContinueExercise = () => {
    handleNextSection();
  };

  const handleCompleteModal = () => {
    setShowCompleteModal(false);
    navigate('/ai-understanding');
  };

  if (!topicData) {
    return (
      <div className="lesson-content-wrapper">
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
          Chargement...
        </div>
      </div>
    );
  }

  const renderSection = (section) => {
    switch (section.type) {
      case 'text':
        // Parse content to handle code blocks
        const parseContent = (content) => {
          const lines = content.split('\n');
          const elements = [];
          let i = 0;
          let currentCodeBlock = null;
          let codeLanguage = 'python';

          while (i < lines.length) {
            const line = lines[i];

            // Detect start of code block
            if (line.trim().startsWith('```')) {
              if (currentCodeBlock === null) {
                // Start code block
                const lang = line.trim().substring(3).trim();
                codeLanguage = lang || 'python';
                currentCodeBlock = [];
              } else {
                // End code block - render it
                elements.push(
                  <div key={`code-${i}`} className="lesson-code-wrapper" style={{ margin: '16px 0' }}>
                    <CodeBlock
                      code={currentCodeBlock.join('\n')}
                      language={codeLanguage}
                    />
                  </div>
                );
                currentCodeBlock = null;
              }
              i++;
              continue;
            }

            // Inside code block
            if (currentCodeBlock !== null) {
              currentCodeBlock.push(line);
              i++;
              continue;
            }

            // Regular paragraph
            if (line.trim()) {
              // Bold markdown
              let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              elements.push(
                <p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: formatted }}></p>
              );
            } else {
              // Empty line
              elements.push(<br key={`br-${i}`} />);
            }
            i++;
          }

          return elements;
        };

        return (
          <div className="lesson-section-text" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h2 className="section-title" style={{ color: '#FFFFFF', marginBottom: '16px' }}>{section.title}</h2>
            <div className="section-content" style={{
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.7'
            }}>
              {parseContent(section.content)}
            </div>
          </div>
        );

      case 'prompt_example':
        return (
          <AIPromptExample
            prompt={section.prompt}
            aiModel={section.aiModel}
            tip={section.tip}
          />
        );

      case 'code_example':
        return (
          <div className="lesson-section-code">
            <h2 className="section-title">{section.title}</h2>
            <div className="lesson-code-wrapper">
              <CodeBlock
                code={section.code}
                language={section.language || 'python'}
              />
            </div>
            {section.highlight && (
              <div className={`lesson-section-highlight ${section.highlight.style}`}>
                <span className="highlight-icon">
                  {section.highlight.style === 'info' ? 'ℹ️' : '⚠️'}
                </span>
                <span>{section.highlight.content}</span>
              </div>
            )}
          </div>
        );

      case 'exercise':
        if (!currentExercise) {
          return (
            <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              Exercice introuvable
            </div>
          );
        }

        return (
          <div className="lesson-exercise-section" style={{ marginTop: '24px' }}>
            <QuestionCard
              question={currentExercise.question}
              explanation={isSubmitted ? currentExercise.explanation : null}
              isCorrect={isCorrect}
              isSubmitted={isSubmitted}
            />

            {/* Options */}
            {currentExercise.inputType === 'options' && (
              <div className="exercise-options-container" style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {currentExercise.options.map((option, index) => (
                  <OptionButton
                    key={index}
                    value={option}
                    isSelected={selectedOption === index}
                    isCorrect={isSubmitted && index === currentExercise.correctAnswer}
                    isIncorrect={isSubmitted && selectedOption === index && !isCorrect}
                    isSubmitted={isSubmitted}
                    onClick={() => !isSubmitted && setSelectedOption(index)}
                  />
                ))}
              </div>
            )}

            {/* Free Input */}
            {currentExercise.inputType === 'free_input' && (
              <div className="exercise-free-input-container">
                <CustomKeyboard
                  type="numeric"
                  value={freeInputValue}
                  onKeyPress={(key) => {
                    if (!isSubmitted) {
                      if (key === 'DEL' || key === 'Backspace') {
                        setFreeInputValue(prev => prev.slice(0, -1));
                      } else {
                        setFreeInputValue(prev => prev + key);
                      }
                    }
                  }}
                  onSubmit={!isSubmitted ? handleValidateExercise : undefined}
                />
                {currentExercise.hint && !isSubmitted && (
                  <div className="exercise-hint">
                    💡 {currentExercise.hint}
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div style={{ marginTop: '24px' }}>
              <ActionButton
                isSubmitted={isSubmitted}
                isCorrect={isCorrect}
                onClick={isSubmitted ? handleContinueExercise : handleValidateExercise}
                isDisabled={
                  !isSubmitted &&
                  (currentExercise.inputType === 'options' ? selectedOption === null : !freeInputValue.trim())
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lesson-content-wrapper">
      {/* Back Button */}
      <button className="lesson-back-button" onClick={handleBackClick} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div className="lesson-header">
        <h1 className="lesson-title">{topicData.title}</h1>
        <p className="lesson-subtitle">{topicData.subtitle}</p>

        {/* Progress */}
        <div className="lesson-progress-bar">
          <div
            className="lesson-progress-fill"
            style={{ width: `${((currentSectionIndex + 1) / topicData.sections.length) * 100}%` }}
          ></div>
        </div>
        <div className="lesson-progress-text">
          Section {currentSectionIndex + 1} / {topicData.sections.length}
        </div>
      </div>

      {/* Current Section */}
      <div className="lesson-content">
        {currentSection && renderSection(currentSection)}
      </div>

      {/* Navigation Buttons */}
      {currentSection?.type !== 'exercise' && (
        <div className="lesson-navigation">
          <button
            className="lesson-nav-button next"
            onClick={handleNextSection}
          >
            {currentSectionIndex < topicData.sections.length - 1 ? 'Continuer' : 'Terminer'}
          </button>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay" onClick={handleCompleteModal}>
          <div className="modal-content chapter-complete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon success">🎉</div>
            <h2 className="modal-title">Topic Terminé !</h2>
            <p className="modal-description">
              Félicitations ! Tu as complété "{topicData.title}".
            </p>
            <p className="modal-xp">
              +{completedExercises.length * 15} XP gagnés
            </p>
            <button className="modal-button" onClick={handleCompleteModal}>
              Retour aux Topics
            </button>
          </div>
        </div>
      )}

      <style>{`
        .section-content p {
          margin-bottom: 16px;
          line-height: 1.7;
        }

        .section-content code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "JetBrains Mono", monospace;
        }

        .exercise-hint {
          margin-top: 12px;
          padding: 12px 16px;
          background: rgba(255, 215, 0, 0.1);
          border-left: 3px solid #FFD700;
          border-radius: 6px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }

        .lesson-navigation {
          margin-top: 40px;
          display: flex;
          justify-content: center;
        }

        .lesson-nav-button {
          padding: 16px 48px;
          background: linear-gradient(135deg, #1e5a8e 0%, #2b7dc1 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .lesson-nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 90, 142, 0.4);
        }
      `}</style>
    </div>
  );
};

export default AIContent;
