import React from "react";

const QuestionCard = ({ question, isSubmitted, isCorrect, xpGain }) => {
  const renderContent = () => {
    if (!isSubmitted) {
      // Affiche la question normale
      return <p className="question-text">{question}</p>;
    }

    if (isCorrect) {
      // Affiche "Bravo ! +10 EXP"
      return (
        <div className="feedback-content">
          <span className="feedback-text">Bravo !</span>
          <span className="feedback-xp">+{xpGain} EXP</span>
        </div>
      );
    }

    // Affiche "Bien essayé !"
    return (
      <div className="feedback-content">
        <span className="feedback-text">Bien essayé !</span>
      </div>
    );
  };

  return (
    <div className="question-card">
      {renderContent()}

      <style>{`
        /* Question Card */
        .question-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .question-text {
          color: #000000;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 14px;
          font-weight: bold;
          line-height: 1.4;
          margin: 0;
        }

        .feedback-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: contentChange 0.3s ease;
        }

        .feedback-text {
          color: #FF9500;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 16px;
          font-weight: 800;

        }

        .feedback-xp {
          color: #FF9500;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 16px;
          font-weight: 800;
        }

        @keyframes contentChange {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;
