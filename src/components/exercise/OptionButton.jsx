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
          height: 52px;
          border: none;
          border-radius: 10px;
          font-size: 19px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 600;
          width: 100%;
          box-sizing: border-box;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-height: 52px;
          padding: 6px 10px;
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
          color: #FFFFFF;
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

        /* Responsive pour iPhone */
        @media (max-width: 430px) and (min-width: 415px) {
          .option-button {
            font-size: 18px;
            height: 50px;
            min-height: 50px;
          }
        }

        @media (max-width: 414px) and (min-width: 376px) {
          .option-button {
            font-size: 18px;
            height: 50px;
          }
        }

        @media (max-width: 375px) {
          .option-button {
            font-size: 17px;
            height: 48px;
            min-height: 48px;
          }
        }

        @media (max-width: 320px) {
          .option-button {
            font-size: 15px;
            height: 46px;
            min-height: 46px;
            padding: 4px 6px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .option-button {
            height: 44px;
            min-height: 44px;
            font-size: 15px;
          }
        }
      `}</style>
    </button>
  );
};

export default OptionButton;
