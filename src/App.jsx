import React, { useState } from 'react';
import Header from "./components/layout/Header";
import QuestionCard from "./components/exercise/QuestionCard";
import CodeBlock from "./components/exercise/CodeBlock";
import OptionButton from "./components/exercise/OptionButton";
import ActionButton from "./components/exercise/ActionButton";

const ReadCodExercise = () => {
  // State management
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);

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
    }
  };

  const handleValidate = () => {
    setIsSubmitted(true);
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .app {
          min-height: 100vh;
          background: #1A1919;
          color: #FFFFFF;
          position: relative;
          padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        }



        /* Content */
        .content {
          padding: calc(max(env(safe-area-inset-top), 12px) + 75px) 20px 20px 20px;
          max-width: 428px;
          margin: 0 auto;
        }



        /* Options Grid */
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

          color: #FFFFFF;
        }

        .action-button:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        @media (min-width: 768px) {
          .content {
            padding-left: 24px;
            padding-right: 24px;
          }
        }
        /* Responsive */
        @media (max-width: 375px) {
          .content {
            padding: calc(max(env(safe-area-inset-top), 12px) + 70px) 20px 20px 20px;
          }
        }

        @media (max-width: 320px) {
          .content {
            padding: calc(max(env(safe-area-inset-top), 12px) + 65px) 16px 16px 16px;
          }
        }
      `}</style>

      {/* Header */}
      <Header
        onQuit={handleQuit}
        currentExercise={currentExercise + 1}
        totalExercises={totalExercises}
      />

      {/* Content */}
      <div className="content">

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
      </div>
    </div>
  );
};

export default ReadCodExercise;