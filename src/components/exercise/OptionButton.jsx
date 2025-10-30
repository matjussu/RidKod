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
          min-height: 52px;
          height: auto;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          line-height: 1.4;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 600;
          width: 100%;
          box-sizing: border-box;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          padding: 12px 8px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
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

        /* iPhone 14/15 Pro Max */
        @media (max-width: 430px) {
          .option-button {
            font-size: 15px;
            min-height: 50px;
            padding: 10px 8px;
          }
        }

        /* iPhone 14/15 Pro */
        @media (max-width: 393px) {
          .option-button {
            font-size: 15px;
            min-height: 50px;
            padding: 10px 8px;
          }
        }

        @media (max-width: 375px) {
          .option-button {
            font-size: 14px;
            min-height: 48px;
            padding: 10px 6px;
          }
        }

        @media (max-width: 320px) {
          .option-button {
            font-size: 13px;
            min-height: 46px;
            padding: 8px 6px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .option-button {
            min-height: 44px;
            font-size: 14px;
            padding: 8px 6px;
          }
        }
      `}</style>
    </button>
  );
};

export default React.memo(OptionButton);
