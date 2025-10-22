import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from "../components/exercise/QuestionCard";
import CodeBlock from "../components/exercise/CodeBlock";
import OptionButton from "../components/exercise/OptionButton";
import ActionButton from "../components/exercise/ActionButton";
import FeedbackGlow from "../components/common/FeedbackGlow";
import ExitConfirmModal from "../components/common/ExitConfirmModal";
import useHaptic from "../hooks/useHaptic";
import exercisesData from "../data/exercises.json";

const Exercise = () => {
  const navigate = useNavigate();

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

  const handleValidate = () => {
    setIsSubmitted(true);

    const correct = selectedOption === exercise.correctAnswer;

    if (correct) {
      setGlowType('success');
      triggerSuccess();
    } else {
      setGlowType('error');
      triggerError();
    }

    setShowGlow(true);

    setTimeout(() => {
      setShowGlow(false);
    }, correct ? 600 : 800);
  };

  const handleContinue = () => {
    setIsExplanationExpanded(false);
    setHighlightedLines([]);

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      alert('🎉 Bravo ! Tous les exercices terminés !\\n\\nTu as complété tous les exercices ReadCod !');
      setCurrentExerciseIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
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

  return (
    <div className="exercise-app">
      <style>{`
        /* Reset global */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          touch-action: manipulation;
        }

        #root {
          height: 100%;
        }

        .exercise-app {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          position: relative;
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          overflow-x: hidden;
          opacity: 0;
          transform: scale(1.05);
          animation: fadeInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Header sticky */
        .header-fixed {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #1A1919;
          padding-top: max(env(safe-area-inset-top), 8px);
          padding-bottom: 8px;
          margin-bottom: 0;
        }

        .close-button {
          position: absolute;
          top: max(env(safe-area-inset-top), 4px);
          left: 0px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 101;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .close-button svg {
          color: #FF453A;
          width: 20px;
          height: 20px;
        }

        /* Progress Bar dans header */
        .progress-container {
          padding: 4px max(48px, calc(env(safe-area-inset-left) + 48px)) 0 max(48px, calc(env(safe-area-inset-right) + 48px));
          margin: 0;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-bar {
          height: 10px;
          background: #3A3A3C;
          border-radius: 10px;
          overflow: hidden;
          width: 100%;
        }

        .progress-fill {
          height: 100%;
          background: #088201;
          transition: width 0.3s ease;
        }

        /* Content scrollable */
        .content-scrollable {
          padding-top: 16px;
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
          padding-bottom: max(env(safe-area-inset-bottom), 16px);
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* Hide scrollbar */
        .content-scrollable::-webkit-scrollbar {
          display: none;
        }

        .content-scrollable {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Question Card */
        .question-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 12px;
          margin-bottom: 12px;
        }

        /* Code Block */
        .code-container {
          background: #030303ff;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 12px;
          overflow-x: auto;
          overflow-y: auto;
          height: 370px !important;
          max-height: none !important;
          min-height: none !important;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
          transition: height 0.3s ease;
        }

        .code-container.compact {
          height: auto !important;
          max-height: 600px !important;
          min-height: auto !important;
        }

        /* Options Container with Animation */
        .options-container {
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .options-container.visible {
          opacity: 1;
          max-height: 200px;
          margin-bottom: 12px;
        }

        .options-container.hidden {
          opacity: 0;
          max-height: 0;
          margin-bottom: 0;
          transform: translateY(-10px);
        }

        /* Options Grid */
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        /* Action Button */
        .action-button {
          width: 100%;
          height: 52px;
          border-radius: 10px;
          margin-bottom: max(12px, env(safe-area-inset-bottom));
          box-sizing: border-box;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Scrollbar custom pour le code */
        .code-container::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .code-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .code-container::-webkit-scrollbar-thumb {
          background: #3A3A3C;
          border-radius: 2px;
        }

        /* Code pre optimisations */
        .code-container pre {
          margin: 0 !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        /* Responsive styles - iPhone 14/15 Pro Max */
        @media (max-width: 430px) {
          .content-scrollable {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }

          .progress-container {
            padding: 4px max(50px, calc(env(safe-area-inset-left) + 50px)) 0 max(50px, calc(env(safe-area-inset-right) + 50px));
          }
        }

        /* iPhone 14/15 Pro */
        @media (max-width: 393px) {
          .content-scrollable {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }
        }

        @media (max-width: 375px) {
          .close-button {
            left: max(14px, env(safe-area-inset-left));
            padding: 4px;
          }

          .close-button svg {
            width: 18px;
            height: 18px;
          }

          .progress-container {
            padding: 4px max(44px, calc(env(safe-area-inset-left) + 44px)) 0 max(44px, calc(env(safe-area-inset-right) + 44px));
          }

          .content-scrollable {
            padding-left: max(14px, env(safe-area-inset-left));
            padding-right: max(14px, env(safe-area-inset-right));
          }
        }

        @media (max-width: 320px) {
          .close-button {
            left: max(12px, env(safe-area-inset-left));
            padding: 3px;
          }

          .close-button svg {
            width: 16px;
            height: 16px;
          }

          .progress-container {
            padding: 3px max(40px, calc(env(safe-area-inset-left) + 40px)) 0 max(40px, calc(env(safe-area-inset-right) + 40px));
          }

          .content-scrollable {
            padding-left: max(12px, env(safe-area-inset-left));
            padding-right: max(12px, env(safe-area-inset-right));
          }

          .code-container pre {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }

          .options-grid {
            gap: 8px;
          }
        }

        @media (max-height: 667px) {
          .code-container pre {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .header-fixed {
            padding-top: max(env(safe-area-inset-top), 6px);
            padding-bottom: 6px;
          }

          .close-button {
            top: max(env(safe-area-inset-top), 6px);
            padding: 3px;
          }

          .close-button svg {
            width: 16px;
            height: 16px;
          }

          .progress-container {
            padding: 3px max(40px, calc(env(safe-area-inset-left) + 40px)) 0 max(40px, calc(env(safe-area-inset-right) + 40px));
          }

          .content-scrollable {
            padding-left: max(12px, env(safe-area-inset-left));
            padding-right: max(12px, env(safe-area-inset-right));
          }

          .question-card {
            padding: 8px;
            margin-bottom: 8px;
          }

          .options-grid {
            gap: 8px;
            margin-bottom: 8px;
          }
        }

        /* Fix Safari iOS et WebKit */
        @supports (-webkit-touch-callout: none) {
          .exercise-app {
            height: -webkit-fill-available;
            min-height: -webkit-fill-available;
          }

          body {
            height: -webkit-fill-available;
          }
        }

        /* Optimisations touch iOS */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        button, input, textarea {
          -webkit-user-select: text;
        }

        /* Fix zoom iOS */
        input, textarea, select {
          font-size: 16px;
        }

        /* Prevent overscroll bounce */
        body {
          overscroll-behavior-y: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

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