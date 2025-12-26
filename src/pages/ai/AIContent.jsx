import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
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
  const { progress, updateProgress, recordDailyActivity } = useProgress();
  const { triggerLight, triggerSuccess, triggerError } = useHaptic();
  const contentRef = useRef(null);

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
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

  // Interactive code state
  const [selectedCodeLine, setSelectedCodeLine] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);

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
      setSelectedLine(null);
    } else {
      setCurrentExercise(null);
    }
  }, [currentSection, topicData]);

  // Auto-scroll vers le haut quand on change de section
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex]);

  const handleBackClick = () => {
    triggerLight();
    navigate('/ai-understanding');
  };

  // Fonction pour revenir à la section précédente
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      // Reset état exercice
      setIsSubmitted(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setFreeInputValue('');
      setCurrentExercise(null);
      setSelectedCodeLine(null);
      setSelectedLine(null);
      setIsExplanationExpanded(false);

      setCurrentSectionIndex(currentSectionIndex - 1);
      triggerLight();
    }
  };

  // Gestion des taps sur les bords (Instagram-style)
  const handleTapLeft = () => {
    if (currentSectionIndex > 0) {
      handlePrevious();
    }
  };

  const handleTapRight = () => {
    // Ne pas permettre le tap droit si c'est un exercice non soumis
    if (currentSection?.type === 'exercise' && !isSubmitted) {
      return;
    }
    if (currentSectionIndex < topicData.sections.length - 1) {
      handleNextSection();
    } else {
      // Dernière section - terminer
      setShowCompleteModal(true);
    }
  };

  const handleNextSection = () => {
    // Reset état exercice
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setFreeInputValue('');
    setCurrentExercise(null);
    setSelectedCodeLine(null);
    setSelectedLine(null);
    setIsExplanationExpanded(false);

    if (currentSectionIndex < topicData.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      // Topic completed
      setShowCompleteModal(true);
    }
  };

  const handleValidateExercise = () => {
    if (!currentExercise) return;

    let correct = false;

    if (currentExercise.inputType === 'options') {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.inputType === 'free_input') {
      const userAnswer = freeInputValue.trim().toLowerCase();
      const correctAnswer = currentExercise.correctAnswer.toString().toLowerCase();
      const acceptedAnswers = currentExercise.acceptedAnswers?.map(a => a.toLowerCase()) || [];
      correct = userAnswer === correctAnswer || acceptedAnswers.includes(userAnswer);
    } else if (currentExercise.inputType === 'clickable_lines') {
      correct = selectedLine === currentExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      triggerSuccess();
      updateProgress({
        xp: progress.xp + (currentExercise.xpGain || 15)
      });
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
    // Sauvegarder la completion du topic
    const currentAIProgress = progress.aiTopicProgress || {};
    updateProgress({
      aiTopicProgress: {
        ...currentAIProgress,
        [topicId]: {
          completed: true,
          completionPercentage: 100
        }
      }
    });

    // ✅ Enregistrer l'activité AI pour le calendrier
    recordDailyActivity('ai', 1);

    setShowCompleteModal(false);
    navigate('/ai-understanding');
  };

  const handleReturnToMenu = () => {
    triggerLight();
    // Sauvegarder la completion du topic
    const currentAIProgress = progress.aiTopicProgress || {};
    updateProgress({
      aiTopicProgress: {
        ...currentAIProgress,
        [topicId]: {
          completed: true,
          completionPercentage: 100
        }
      }
    });
    navigate('/ai-understanding');
  };

  // Format text with bold and inline code (sanitized against XSS)
  const formatText = (text) => {
    if (!text) return null;
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');
    return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatted) }} />;
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
      case 'text': {
        // Parse content to handle code blocks
        const parseContent = (content) => {
          const lines = content.split('\n');
          const elements = [];
          let i = 0;
          let currentCodeBlock = null;
          let codeLanguage = 'python';

          while (i < lines.length) {
            const line = lines[i];

            if (line.trim().startsWith('```')) {
              if (currentCodeBlock === null) {
                const lang = line.trim().substring(3).trim();
                codeLanguage = lang || 'python';
                currentCodeBlock = [];
              } else {
                elements.push(
                  <div key={`code-${i}`} className="ai-code-wrapper">
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

            if (currentCodeBlock !== null) {
              currentCodeBlock.push(line);
              i++;
              continue;
            }

            if (line.trim()) {
              elements.push(
                <p key={`p-${i}`} className="ai-text-paragraph">
                  {formatText(line)}
                </p>
              );
            }
            i++;
          }

          return elements;
        };

        // Check if this is the last section
        const isLastSection = currentSectionIndex === topicData.sections.length - 1;

        return (
          <div className="ai-section-text">
            <div className="ai-section-header">
              <span className="ai-mascot-icon">🤖</span>
              <h2 className="ai-section-title">{section.title}</h2>
            </div>
            <div className="ai-section-content">
              {parseContent(section.content)}
            </div>

            {/* Bouton Retour au menu sur la dernière section */}
            {isLastSection && (
              <button className="ai-return-menu-button" onClick={handleReturnToMenu}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Retour au menu
              </button>
            )}
          </div>
        );
      }

      case 'prompt_example':
        return (
          <AIPromptExample
            prompt={section.prompt}
            aiModel={section.aiModel}
            tip={section.tip}
          />
        );

      case 'chatgpt_simulation':
        return (
          <div className="chatgpt-simulation">
            {/* Badge modèle */}
            <div className="chatgpt-model-badge">
              <span className="chatgpt-model-icon">🤖</span>
              <span className="chatgpt-model-name">{section.aiModel || 'ChatGPT'}</span>
            </div>

            {/* Bulle utilisateur */}
            <div className="chatgpt-user-message">
              <div className="chatgpt-user-bubble">
                <p>{section.prompt}</p>
              </div>
              <div className="chatgpt-user-avatar">👤</div>
            </div>

            {/* Réponse IA avec code pleine largeur */}
            <div className="chatgpt-ai-message">
              <div className="chatgpt-ai-header-row">
                <div className="chatgpt-ai-avatar">✨</div>
                <span className="chatgpt-ai-label">ChatGPT</span>
              </div>
              <div className="chatgpt-ai-code">
                <CodeBlock
                  code={section.response.code}
                  language={section.response.language || 'python'}
                />
              </div>
            </div>
          </div>
        );

      case 'code_example': {
        const hasExplanations = section.lineExplanations && Object.keys(section.lineExplanations).length > 0;
        const startLine = section.startLine || 1;
        // Convert 0-based JSON keys to actual line numbers (startLine + index)
        const clickableLines = hasExplanations ? Object.keys(section.lineExplanations).map(n => Number(n) + startLine) : [];
        // Convert lineNumber back to 0-based for JSON lookup
        const explanationKey = selectedCodeLine !== null ? String(selectedCodeLine - startLine) : null;

        return (
          <div className="ai-section-code">
            {section.title && (
              <h2 className="ai-section-title" style={{ marginBottom: '16px' }}>{section.title}</h2>
            )}

            <div className="ai-code-container">
              <CodeBlock
                code={section.code}
                language={section.language || 'python'}
                clickableLines={clickableLines}
                selectedLine={selectedCodeLine}
                startLine={startLine}
                onLineClick={(lineNumber) => {
                  triggerLight();
                  setSelectedCodeLine(selectedCodeLine === lineNumber ? null : lineNumber);
                }}
              />
            </div>

            {hasExplanations && selectedCodeLine === null && (
              <p className="ai-code-hint">👆 Clique sur une ligne pour comprendre</p>
            )}

            {explanationKey !== null && section.lineExplanations?.[explanationKey] && (
              <div className="ai-decoder-container">
                <div className="ai-decoder-bubble">
                  <button
                    className="ai-decoder-close"
                    onClick={() => setSelectedCodeLine(null)}
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                  <div className="ai-decoder-icon">🤖</div>
                  <div className="ai-decoder-content">
                    {formatText(section.lineExplanations[explanationKey])}
                  </div>
                </div>
              </div>
            )}

            {section.highlight && (
              <div className={`ai-section-highlight ${section.highlight.style}`}>
                <span className="ai-highlight-icon">
                  {section.highlight.style === 'info' ? 'ℹ️' : '⚠️'}
                </span>
                <span>{section.highlight.content}</span>
              </div>
            )}
          </div>
        );
      }

      case 'exercise':
        if (!currentExercise) {
          return (
            <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              Exercice introuvable
            </div>
          );
        }

        return (
          <div className="ai-exercise-section">
            <QuestionCard
              question={currentExercise.question}
              explanation={currentExercise.explanation}
              isCorrect={isCorrect}
              isSubmitted={isSubmitted}
              xpGain={currentExercise.xpGain || 15}
              onExplanationToggle={() => setIsExplanationExpanded(!isExplanationExpanded)}
              isExplanationExpanded={isExplanationExpanded}
            />

            {/* Options */}
            {currentExercise.inputType === 'options' && (
              <div className="ai-exercise-options">
                {currentExercise.options.map((option, index) => (
                  <OptionButton
                    key={index}
                    value={option}
                    isSelected={selectedOption === index}
                    isCorrect={isSubmitted && index === currentExercise.correctAnswer}
                    isIncorrect={isSubmitted && selectedOption === index && !isCorrect}
                    isSubmitted={isSubmitted}
                    onClick={() => {
                      if (!isSubmitted) {
                        triggerLight();
                        setSelectedOption(index);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {/* Free Input */}
            {currentExercise.inputType === 'free_input' && (
              <div className="ai-exercise-free-input">
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
                  <div className="ai-exercise-hint">
                    💡 {currentExercise.hint}
                  </div>
                )}
              </div>
            )}

            {/* Clickable Lines */}
            {currentExercise.inputType === 'clickable_lines' && (
              <div className="ai-clickable-code">
                <CodeBlock
                  code={currentExercise.code}
                  language="python"
                  clickableLines={Array.from({ length: currentExercise.code.split('\n').length }, (_, i) => i)}
                  selectedLine={selectedLine}
                  onLineClick={(lineNum) => {
                    if (!isSubmitted) {
                      triggerLight();
                      setSelectedLine(lineNum);
                    }
                  }}
                  isSubmitted={isSubmitted}
                  correctAnswer={currentExercise.correctAnswer}
                />
                {!isSubmitted && selectedLine === null && (
                  <p className="ai-code-hint">👆 Clique sur la ligne concernée</p>
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
                  ((currentExercise.inputType === 'options' && selectedOption === null) ||
                   (currentExercise.inputType === 'free_input' && !freeInputValue.trim()) ||
                   (currentExercise.inputType === 'clickable_lines' && selectedLine === null))
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
    <div className="ai-content-container" ref={contentRef}>
      {/* Sticky Progress Bar avec Story Bars Instagram */}
      <div className="lesson-progress-bar">
        <button className="lesson-progress-bar-back" onClick={handleBackClick} aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div className="lesson-progress-info">
          <p className="lesson-progress-text">
            Section {currentSectionIndex + 1}/{topicData.sections.length}
          </p>

          {/* Instagram-style Story Bars */}
          <div className="story-bars-container">
            {topicData.sections.map((_, index) => (
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
        {currentSection && renderSection(currentSection)}
      </div>

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
        /* AI Content Container - NEON WHITE Theme */
        .ai-content-container {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          background: #0F0F12;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
          opacity: 0;
          transform: scale(0.95) translateY(20px);
          filter: blur(10px);
          animation: dojoEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Tatami Grid Pattern - White */
        .ai-content-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(255, 255, 255, 0.02) 39px,
              rgba(255, 255, 255, 0.02) 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(255, 255, 255, 0.02) 39px,
              rgba(255, 255, 255, 0.02) 40px
            );
          pointer-events: none;
          z-index: 0;
        }

        @keyframes dojoEnter {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        /* Progress Bar - NEON WHITE */
        .lesson-progress-bar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(15, 15, 18, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 16px 20px;
          padding-top: max(env(safe-area-inset-top), 16px);
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lesson-progress-bar-back {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lesson-progress-bar-back:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .lesson-progress-bar-back svg {
          color: #FFFFFF;
          display: block;
        }

        .lesson-progress-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lesson-progress-text {
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* Story Bars */
        .story-bars-container {
          display: flex;
          gap: 4px;
          width: 100%;
        }

        .story-bar {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          overflow: hidden;
        }

        .story-bar-fill {
          height: 100%;
          width: 0;
          background: #FFFFFF;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .story-bar.completed .story-bar-fill {
          width: 100%;
        }

        .story-bar.active .story-bar-fill {
          width: 50%;
          animation: storyProgress 0.5s ease forwards;
        }

        @keyframes storyProgress {
          to { width: 100%; }
        }

        /* Content Wrapper */
        .lesson-content-wrapper {
          padding: 20px;
          padding-bottom: max(env(safe-area-inset-bottom), 40px);
          position: relative;
          z-index: 1;
        }

        /* Tap Zones - Instagram Style */
        .tap-zone {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 15%;
          z-index: 50;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }

        .tap-zone-left { left: 0; }
        .tap-zone-right { right: 0; }

        /* AI Section Text - NEON WHITE Theme */
        .ai-section-text {
          background: linear-gradient(135deg, rgba(30, 30, 36, 0.9) 0%, rgba(15, 15, 18, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .ai-section-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .ai-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .ai-mascot-icon {
          font-size: 24px;
          opacity: 0.9;
        }

        .ai-section-title {
          font-family: "JetBrains Mono", monospace;
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }

        .ai-section-content {
          font-family: "JetBrains Mono", monospace;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
        }

        .ai-text-paragraph {
          margin-bottom: 16px;
        }

        .ai-text-paragraph:last-child {
          margin-bottom: 0;
        }

        /* Important words highlighted with white neon */
        .ai-section-text strong {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-weight: 600;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .ai-inline-code {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 4px;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
        }

        .ai-code-wrapper {
          margin: 16px 0;
        }

        /* ChatGPT Simulation */
        .chatgpt-simulation {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .chatgpt-model-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 163, 127, 0.15);
          border: 1px solid rgba(16, 163, 127, 0.3);
          border-radius: 20px;
          padding: 8px 16px;
          align-self: center;
        }

        .chatgpt-model-icon {
          font-size: 18px;
        }

        .chatgpt-model-name {
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          font-weight: 600;
          color: #10A37F;
        }

        .chatgpt-user-message {
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          gap: 12px;
        }

        .chatgpt-user-bubble {
          background: #2C2C2E;
          border-radius: 18px 18px 4px 18px;
          padding: 14px 18px;
          max-width: 85%;
        }

        .chatgpt-user-bubble p {
          font-family: "JetBrains Mono", monospace;
          font-size: 15px;
          color: #FFFFFF;
          line-height: 1.5;
          margin: 0;
        }

        .chatgpt-user-avatar {
          width: 36px;
          height: 36px;
          background: #3A3A3C;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .chatgpt-ai-message {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chatgpt-ai-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chatgpt-ai-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #10A37F 0%, #1A7F5A 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .chatgpt-ai-label {
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          font-weight: 600;
          color: #10A37F;
        }

        .chatgpt-ai-code {
          border-radius: 12px;
          overflow: hidden;
          animation: fadeInCode 0.8s ease-out;
          width: 100%;
        }

        @keyframes fadeInCode {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* AI Section Code */
        .ai-section-code {
          margin-top: 8px;
        }

        .ai-code-container {
          border-radius: 12px;
          overflow: hidden;
        }

        .ai-code-hint {
          text-align: center;
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          color: #8E8E93;
          font-style: italic;
          margin-top: 12px;
          padding: 8px;
        }

        /* AI Decoder Bubble - NEON WHITE */
        .ai-decoder-container {
          margin-top: 16px;
          animation: aiSlideUp 0.3s ease;
        }

        .ai-decoder-bubble {
          background: linear-gradient(135deg, #0F0F12 0%, #1A1A1E 100%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          padding: 20px;
          padding-top: 28px;
          position: relative;
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.08);
        }

        .ai-decoder-icon {
          position: absolute;
          top: -14px;
          left: 20px;
          font-size: 28px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        .ai-decoder-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #8E8E93;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .ai-decoder-close:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        .ai-decoder-content {
          font-family: "JetBrains Mono", monospace;
          font-size: 15px;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 1.6;
        }

        .ai-decoder-content strong {
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .ai-decoder-content .ai-inline-code {
          background: rgba(255, 255, 255, 0.12);
        }

        /* AI Section Highlight */
        .ai-section-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 16px;
          padding: 16px;
          border-radius: 10px;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          line-height: 1.5;
        }

        .ai-section-highlight.info {
          background: rgba(24, 113, 190, 0.1);
          border: 1px solid rgba(24, 113, 190, 0.3);
          color: rgba(255, 255, 255, 0.9);
        }

        .ai-section-highlight.warning {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
        }

        .ai-highlight-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        /* AI Exercise Section */
        .ai-exercise-section {
          margin-top: 8px;
        }

        .ai-exercise-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .ai-exercise-free-input {
          margin-top: 20px;
        }

        .ai-exercise-hint {
          margin-top: 12px;
          padding: 12px 16px;
          background: rgba(255, 215, 0, 0.1);
          border-left: 3px solid #FFD700;
          border-radius: 0 8px 8px 0;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }

        .ai-clickable-code {
          margin-top: 20px;
        }

        @keyframes aiSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Return to Menu Button - NEON WHITE */
        .ai-return-menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          margin-top: 32px;
          padding: 16px 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .ai-return-menu-button:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.15) 100%);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 6px 24px rgba(255, 255, 255, 0.2);
        }

        .ai-return-menu-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
        }

        .ai-return-menu-button svg {
          stroke: #FFFFFF;
        }

        /* Modal Styles - NEON WHITE */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .modal-content {
          background: linear-gradient(135deg, #0F0F12 0%, #1A1A1E 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 32px;
          max-width: 360px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-icon {
          font-size: 56px;
          margin-bottom: 20px;
        }

        .modal-title {
          font-family: "JetBrains Mono", monospace;
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 12px 0;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .modal-description {
          font-family: "JetBrains Mono", monospace;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .modal-xp {
          font-family: "JetBrains Mono", monospace;
          font-size: 18px;
          font-weight: 700;
          color: #10A37F;
          margin: 0 0 24px 0;
          text-shadow: 0 0 15px rgba(16, 163, 127, 0.4);
        }

        .modal-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .modal-button:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.15) 100%);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
        }

        /* ========================================
           AI CONTENT THEME OVERRIDES
           White selection + ChatGPT Green validation
           ======================================== */

        /* Override Option Button - Default state */
        .ai-exercise-options .option-button.default {
          background: #1E1E24 !important;
          color: #FFFFFF !important;
          border: 2px solid rgba(255, 255, 255, 0.1) !important;
        }

        .ai-exercise-options .option-button.default:hover {
          border-color: rgba(255, 255, 255, 0.3) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }

        /* Override Option Button - Selected state - WHITE */
        .ai-exercise-options .option-button.selected {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #FFFFFF !important;
          border: 2px solid #FFFFFF !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3) !important;
        }

        .ai-exercise-options .option-button.selected:hover {
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.4) !important;
        }

        /* Override Option Button - Correct state - ChatGPT GREEN */
        .ai-exercise-options .option-button.correct {
          background: #01aa09ff !important;
          color: #FFFFFF !important;
          border: 2px solid #01aa09ff !important;
        }

        /* Override Action Button - Disabled state - WHITE dimmed */
        .ai-exercise-section .action-button.disabled {
          background: rgba(255, 255, 255, 0.1) !important;
          color: rgba(255, 255, 255, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }

        /* Override Action Button - Enabled state - ChatGPT GREEN */
        .ai-exercise-section .action-button.enabled {
          background: linear-gradient(135deg, #01aa09ff 0%, #01aa09ff 100%) !important;
          color: #FFFFFF !important;
          border: none !important;
          box-shadow: 0 0 20px rgba(16, 163, 127, 0.4) !important;
        }

        .ai-exercise-section .action-button.enabled:hover:not(:disabled) {
          box-shadow: 0 0 30px rgba(16, 163, 127, 0.5) !important;
          filter: brightness(1.1);
        }

        /* Override Action Button - Incorrect state - RED */
        .ai-exercise-section .action-button.incorrect-state {
          background: linear-gradient(135deg, #FF453A 0%, #DC2626 100%) !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 20px rgba(255, 69, 58, 0.4) !important;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .ai-section-text {
            padding: 20px;
          }

          .ai-section-title {
            font-size: 16px;
          }

          .ai-section-content {
            font-size: 14px;
          }

          .ai-decoder-bubble {
            padding: 16px;
            padding-top: 24px;
          }

          .ai-decoder-content {
            font-size: 14px;
          }

          .ai-return-menu-button {
            font-size: 14px;
            padding: 14px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AIContent;
