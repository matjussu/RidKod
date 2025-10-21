import React, { useState } from 'react';
import QuestionCard from "./components/exercise/QuestionCard";
import CodeBlock from "./components/exercise/CodeBlock";
import OptionButton from "./components/exercise/OptionButton";
import ActionButton from "./components/exercise/ActionButton";
import FeedbackGlow from "./components/common/FeedbackGlow";
import useHaptic from "./hooks/useHaptic";
import exercisesData from "./data/exercises.json";

const ReadCodExercise = () => {
  // State management
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showGlow, setShowGlow] = useState(false);
  const [glowType, setGlowType] = useState(null);

  // Explanation system state
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState([]);

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
      // Feedback haptic léger pour la sélection
      triggerLight();
    }
  };

  const handleValidate = () => {
    setIsSubmitted(true);

    const correct = selectedOption === exercise.correctAnswer;

    // Déclenche les effets visuels et tactiles
    if (correct) {
      setGlowType('success');
      triggerSuccess();
    } else {
      setGlowType('error');
      triggerError();
    }

    setShowGlow(true);

    // Cache le glow après l'animation
    setTimeout(() => {
      setShowGlow(false);
    }, correct ? 600 : 800); // Durée selon le type d'animation
  };

  const handleContinue = () => {
    // Reset explanation state
    setIsExplanationExpanded(false);
    setHighlightedLines([]);

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Fin des exercices
      alert('🎉 Bravo ! Tous les exercices terminés !\n\nTu as complété tous les exercices ReadCod !');
      // Optionnel : reset au premier exercice
      setCurrentExerciseIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const handleQuit = () => {
    if (window.confirm("Voulez-vous vraiment quitter ?")) {
      window.location.href = '/';
    }
  };

  // Handle explanation toggle with smooth scrolling
  const handleExplanationToggle = () => {
    const newState = !isExplanationExpanded;
    setIsExplanationExpanded(newState);

    if (newState) {
      // Active le highlight quand on expand
      setHighlightedLines(exercise.highlightedLines || []);

      // Scroll smooth vers le code après un court délai
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
      // Désactive le highlight quand on collapse
      setHighlightedLines([]);
    }
  };

  // Computed values
  const isCorrect = selectedOption === exercise.correctAnswer;

  return (
    <div className="app">
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

        .app {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100vw;
          margin: 0 auto;
          overflow-x: hidden;
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
          max-width: min(428px, 100vw);
          margin-left: auto;
          margin-right: auto;
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
          max-width: min(428px, 100vw);
          margin: 0 auto;
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

        /* Code Block - RÈGLE UNIQUE SANS OVERRIDE */
        .code-container {
          background: #030303ff;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 12px;
          overflow-x: auto;
          overflow-y: auto;
          /* TAILLE CONTRÔLABLE ICI */
          height: 370px !important;
          max-height: none !important;
          min-height: none !important;
          /* LARGEUR FIXE POUR ÉVITER RÉTRÉCISSEMENT */
          width: 100%;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
          transition: height 0.3s ease;
        }

        /* Code Block en mode compact (ajusté au contenu) */
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

        /* iPhone 14/15 Pro Max - 430px */
        @media (max-width: 430px) and (min-width: 415px) {
          .content-scrollable {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }

          .progress-container {
            padding: 4px max(50px, calc(env(safe-area-inset-left) + 50px)) 0 max(50px, calc(env(safe-area-inset-right) + 50px));
          }
        }

        /* iPhone 14/15 Pro - 393px */
        @media (max-width: 414px) and (min-width: 376px) {
          .content-scrollable {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }

          /* .code-container SUPPRIMÉ - règle unique ligne 231 */
        }

        /* iPhone SE, iPhone 12/13 mini - 375px */
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

          /* .code-container SUPPRIMÉ - règle unique ligne 231 */
        }

        /* Très petits écrans - iPhone SE 1ère gen */
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

          /* .code-container SUPPRIMÉ - règle unique ligne 231 */

          .code-container pre {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }

          .options-grid {
            gap: 8px;
          }
        }

        /* Écrans hauts - iPhone 14/15 Pro Max */
        @media (min-height: 850px) {
          /* .code-container SUPPRIMÉ - règle unique ligne 231 */
        }

        /* Écrans moyens - iPhone 14/15 Pro */
        @media (min-height: 700px) and (max-height: 849px) {
          /* .code-container SUPPRIMÉ - règle unique ligne 231 */
        }

        /* Écrans compacts - iPhone SE */
        @media (max-height: 667px) {
          /* .code-container SUPPRIMÉ - règle unique ligne 231 */

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

          /* .code-container SUPPRIMÉ - règle unique ligne 231 */

          .options-grid {
            gap: 8px;
            margin-bottom: 8px;
          }
        }

        /* Fix Safari iOS et WebKit */
        @supports (-webkit-touch-callout: none) {
          .app {
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

        {/* Options Grid (masqué quand explication expanded) */}
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
    </div>
  );
};

export default ReadCodExercise;