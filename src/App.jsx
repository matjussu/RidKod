import React, { useState } from 'react';
import QuestionCard from "./components/exercise/QuestionCard";
import CodeBlock from "./components/exercise/CodeBlock";
import OptionButton from "./components/exercise/OptionButton";
import ActionButton from "./components/exercise/ActionButton";
import FeedbackGlow from "./components/common/FeedbackGlow";
import useHaptic from "./hooks/useHaptic";

const ReadCodExercise = () => {
  // State management
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showGlow, setShowGlow] = useState(false);
  const [glowType, setGlowType] = useState(null);

  // Haptic feedback hook
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  // Exercise data (will be moved to external JSON later)
  const exercise = {
    question: "{Que renvoie ce programme ?}",
    code: `nb_notes = int(input("Combien?"))
somme = 0

for i in range(nb_notes):
    note = float(input("Entrez la note n°{i+1} : "))
    somme += note

moyenne = somme / nb_notes

print(f"La moyenne des {nb_notes} notes est : {moyenne: .2}")`,
    options: ["12", "14", "16", "20"],
    correctAnswer: 1,
    xpGain: 10
  };

  const totalExercises = 10;

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
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentExercise(prev => prev + 1);
  };

  const handleQuit = () => {
    if (window.confirm("Voulez-vous vraiment quitter ?")) {
      window.location.href = '/';
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
          overflow: hidden;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          -webkit-font-smoothing: antialiased;
        }

        #root {
          height: 100%;
        }

        .app {
          height: 100vh;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* Header fixe */
        .header-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: #1A1919;
          padding-top: max(env(safe-area-inset-top), 12px);
          padding-bottom: 12px;
        }

        .close-button {
          position: absolute;
          top: max(env(safe-area-inset-top), 12px);
          left: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 101;
        }

        .close-button svg {
          color: #FF453A;
          width: 24px;
          height: 24px;
        }

        /* Progress Bar dans header */
        .progress-container {
          padding: 8px 56px 0 56px;
          margin: 0;
        }

        .progress-bar {
          height: 4px;
          background: #3A3A3C;
          border-radius: 2px;
          overflow: hidden;
          width: 100%;
        }

        .progress-fill {
          height: 100%;
          background: #30D158;
          transition: width 0.3s ease;
        }

        /* Content scrollable */
        .content-scrollable {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding-top: calc(max(env(safe-area-inset-top), 12px) + 60px);
          padding-left: 20px;
          padding-right: 20px;
          padding-bottom: max(env(safe-area-inset-bottom), 20px);
          max-width: 428px;
          margin: 0 auto;
          width: 100%;
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
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
        }

        /* Code Block optimisé */
        .code-container {
          background: #030303ff;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          overflow-x: auto;
          max-height: 40vh;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Options Grid */
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        /* Action Button */
        .action-button {
          width: 100%;
          height: 56px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .close-button {
            left: 16px;
            padding: 6px;
          }

          .close-button svg {
            width: 22px;
            height: 22px;
          }

          .progress-container {
            padding: 8px 48px 0 48px;
          }

          .content-scrollable {
            padding-top: calc(max(env(safe-area-inset-top), 12px) + 55px);
            padding-left: 16px;
            padding-right: 16px;
          }

          .code-container {
            max-height: 35vh;
            padding: 14px;
          }
        }

        @media (max-width: 320px) {
          .close-button {
            left: 12px;
            padding: 4px;
          }

          .close-button svg {
            width: 20px;
            height: 20px;
          }

          .progress-container {
            padding: 8px 44px 0 44px;
          }

          .content-scrollable {
            padding-top: calc(max(env(safe-area-inset-top), 12px) + 50px);
            padding-left: 16px;
            padding-right: 16px;
          }

          .code-container {
            max-height: 30vh;
            padding: 12px;
          }
        }

        @media (min-height: 700px) {
          .code-container {
            max-height: 45vh;
          }
        }

        /* Fix Safari iOS */
        @supports (-webkit-touch-callout: none) {
          .app {
            height: -webkit-fill-available;
          }
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
            <div className="progress-fill" style={{ width: `${((currentExercise + 1) / totalExercises) * 100}%` }} />
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
        />

        {/* Code Block */}
        <CodeBlock
          code={exercise.code}
          language="python"
        />

        {/* Options Grid */}
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