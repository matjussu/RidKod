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
          height: 56px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          box-sizing: border-box;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-height: 56px;
          padding: 0 16px;
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
          color: #000000;
        }

        .action-button.incorrect-state {
          background: #FF383C;
          color: #FFFFFF;
        }

        .action-button:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        /* Responsive pour iPhone */
        @media (max-width: 430px) and (min-width: 415px) {
          .action-button {
            height: 58px;
            min-height: 58px;
            font-size: 19px;
          }
        }

        @media (max-width: 414px) and (min-width: 376px) {
          .action-button {
            height: 56px;
            font-size: 18px;
          }
        }

        @media (max-width: 375px) {
          .action-button {
            height: 54px;
            min-height: 54px;
            font-size: 17px;
          }
        }

        @media (max-width: 320px) {
          .action-button {
            height: 52px;
            min-height: 52px;
            font-size: 16px;
            padding: 0 12px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .action-button {
            height: 48px;
            min-height: 48px;
            font-size: 16px;
          }
        }
      `}</style>
    </button>
  );
};

export default ActionButton;
