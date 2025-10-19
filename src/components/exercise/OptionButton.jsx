import React from "react";

const OptionButton = ({ value, isSelected, isCorrect, isSubmitted, onClick }) => {
  let className = "option-button ";
  
  if (!isSubmitted) {
    // État avant validation
    className += isSelected ? "selected" : "default";
  } else {
    // État après validation
    if (isCorrect) {
      className += "correct";
    } else if (isSelected) {
      className += "incorrect";
    } else {
      className += "faded disabled";
    }
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={isSubmitted}
    >
      {value}

      <style>{`
        /* Option Button */
        .option-button {
          height: 56px;
          border: none;
          border-radius: 12px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
        }

        .option-button:active {
          transform: scale(0.98);
        }

        /* Option States - Not Submitted */
        .option-button.default {
          background: #000000;
          color: #FFFFFF;
        }

        .option-button.selected {
          background: #484848;
          color: #FFFFFF;
          box-shadow: 0 0 0 2px #088201;
        }

        .option-button.default:hover,
        .option-button.selected:hover {
          filter: brightness(1.1);
        }

        /* Option States - Submitted */
        .option-button.correct {
          background: #088201;
          color: #000000;
        }

        .option-button.incorrect {
          background: #FF383C;
          color: #FFFFFF;
        }

        .option-button.faded {
          background: #2C2C2E;
          color: #FFFFFF;
          opacity: 0.5;
          cursor: not-allowed;
        }

        .option-button.disabled {
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .option-button {
            font-size: 18px;
          }
        }
      `}</style>
    </button>
  );
};

export default OptionButton;
