import React from "react";

const QuestionCard = ({ question, isSubmitted, isCorrect, xpGain, explanation, onExplanationToggle, isExplanationExpanded }) => {
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

    // Après validation, affiche feedback + bouton explication
    return (
      <div className="feedback-section">
        {/* Feedback principal */}
        <div className="feedback-content">
          <span className="feedback-text">
            {isCorrect ? 'Bravo !' : 'Bien essayé !'}
          </span>
          {isCorrect && (
            <span className="feedback-xp">+{xpGain} EXP</span>
          )}
        </div>

        {/* Bouton toggle explication */}
        <button
          className="explanation-toggle"
          onClick={onExplanationToggle}
        >
          <span className="explanation-icon">💡</span>
          <span className="explanation-text">
            {isExplanationExpanded ? 'Masquer l\'explication' : 'Voir l\'explication'}
          </span>
          <span className={`chevron ${isExplanationExpanded ? 'expanded' : ''}`}>
            {isExplanationExpanded ? '▲' : '▼'}
          </span>
        </button>

        {/* Contenu de l'explication (expandable) */}
        {isExplanationExpanded && (
          <div className="explanation-content">
            <h4>📖 Comment ça marche :</h4>
            <div className="explanation-text-content">
              {explanation}
            </div>
          </div>
        )}
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
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .question-text {
          color: #000000;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
        }

        .question-brace {
          color: #FF9500;
          font-weight: 800;
          font-size: 16px;
        }

        /* Feedback Section */
        .feedback-section {
          animation: contentChange 0.3s ease;
        }

        .feedback-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0;
          min-height: 0;
          margin-bottom: 12px;
        }

        .feedback-text {
          color: #FF9500;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 800;
        }

        .feedback-xp {
          color: #FF9500;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 600;
        }

        /* Explanation Toggle Button */
        .explanation-toggle {
          width: 100%;
          padding: 12px 0;
          background: #1871BE;
          border: none;
          border-top: 1px solid #E5E5EA;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
          color: #FFFFFF;
          transition: background 0.2s ease;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          margin: 0;
          border-radius: 8px;
          margin-top: 8px;
        }

        .explanation-toggle:active {
          background: #0056CC;
        }

        .explanation-toggle:hover {
          background: #0066E6;
        }

        .explanation-icon {
          font-size: 18px;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .explanation-text {
          flex: 1;
          text-align: left;
        }

        .chevron {
          font-size: 11px;
          color: #FFFFFF;
          transition: transform 0.3s ease;
          margin-left: 8px;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .chevron.expanded {
          transform: rotate(180deg);
        }

        /* Explanation Content */
        .explanation-content {
          padding: 12px 0 0 0;
          animation: slideDown 0.3s ease-out;
          border-top: 1px solid #E5E5EA;
          margin-top: 8px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }

        .explanation-content h4 {
          color: #000000ff;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 8px 0;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
        }

        .explanation-text-content {
          color: #000000ff;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-line;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 540;
          margin: 0;
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

        /* Responsive */
        @media (max-width: 375px) {
          .explanation-toggle {
            padding: 10px 0;
            font-size: 13px;
          }

          .explanation-icon {
            font-size: 16px;
            margin-right: 6px;
          }

          .explanation-text-content {
            font-size: 12px;
          }

          .explanation-content h4 {
            font-size: 14px;
            margin-bottom: 6px;
          }

          .feedback-text,
          .feedback-xp {
            font-size: 14px;
          }
        }

        @media (max-width: 320px) {
          .explanation-toggle {
            padding: 8px 0;
            font-size: 12px;
          }

          .explanation-icon {
            font-size: 14px;
            margin-right: 4px;
          }

          .explanation-text-content {
            font-size: 11px;
          }

          .explanation-content {
            padding: 8px 0 0 0;
          }

          .feedback-text,
          .feedback-xp {
            font-size: 13px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .explanation-toggle {
            padding: 8px 0;
            font-size: 12px;
          }

          .explanation-content {
            padding: 8px 0 0 0;
          }

          .explanation-text-content {
            font-size: 12px;
          }

          .feedback-text,
          .feedback-xp {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;
