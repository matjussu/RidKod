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
      `}</style>
    </button>
  );
};

export default ActionButton;
