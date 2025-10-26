import React from "react";

const ActionButton = ({ isSubmitted, isCorrect, isDisabled, onClick }) => {
  let className = "action-button ";
  
  if (!isSubmitted) {
    className += isDisabled ? "disabled" : "enabled";
  } else {
    className += isCorrect ? "enabled" : "incorrect-state";
  }

  const buttonText = isSubmitted ? "Continuer" : "Valider";

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={isDisabled}
    >
      {buttonText}

      <style>{`
        /* Validate/Continue Button */
        .action-button {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 10px;
          font-size: 17px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 600;
          box-sizing: border-box;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-height: 52px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .action-button.disabled {
          background: #484848;
          color: #FFFFFF;
          cursor: not-allowed;
        }

        .action-button.enabled {
          background: #088201;
          color: #FFFFFF;
        }

        .action-button.incorrect-state {
          background: #FF383C;
          color: #FFFFFF;
        }

        .action-button:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        /* iPhone 14/15 Pro Max */
        @media (max-width: 430px) {
          .action-button {
            height: 50px;
            min-height: 50px;
            font-size: 16px;
          }
        }

        /* iPhone 14/15 Pro */
        @media (max-width: 393px) {
          .action-button {
            height: 50px;
            font-size: 16px;
          }
        }

        @media (max-width: 375px) {
          .action-button {
            height: 48px;
            min-height: 48px;
            font-size: 15px;
          }
        }

        @media (max-width: 320px) {
          .action-button {
            height: 46px;
            min-height: 46px;
            font-size: 14px;
            padding: 0 10px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .action-button {
            height: 44px;
            min-height: 44px;
            font-size: 14px;
          }
        }
      `}</style>
    </button>
  );
};

export default React.memo(ActionButton);
