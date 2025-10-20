import React from "react";

const QuestionCard = ({ question, isSubmitted, isCorrect, xpGain }) => {
  const renderContent = () => {
    if (!isSubmitted) {
      // Affiche la question normale avec accolades orange
      return (
        <p className="question-text">
          <span className="question-brace">{"{"}</span>
          {question}
          <span className="question-brace">{"}"}</span>
        </p>
      );
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
          background: #ffffffff;
          border-radius: 14px;
          padding: 12px;
          margin-bottom: 12px;
        }

        .question-text {
          color: #000000;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 700 ;
          line-height: 1.3;
          margin: 0;
        }

        .feedback-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: contentChange 0.3s ease;
          padding: 0;
          min-height: 0;
        }

        .feedback-text {
          color: #FF9500;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 600;
        }

        .feedback-xp {
          color: #FF9500;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 600;
        }

        .question-brace {
          color: #FF9500;
          font-weight: 800;
          font-size: 16px;
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
