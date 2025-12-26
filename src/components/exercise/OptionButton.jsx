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
          flex-direction: row;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 600;
          width: 100%;
          box-sizing: border-box;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          margin: 0;
          padding: 0px 6px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .option-button:active {
          transform: scale(0.98);
        }

        /* Option States - Not Submitted - DOJO THEME */
        .option-button.default {
          background: #1E1E24;
          color: #FFFFFF;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .option-button.selected {
          background: rgba(0, 221, 179, 0.1);
          color: #FFFFFF;
          border: 2px solid #00DDB3;
          box-shadow: 0 0 20px rgba(0, 221, 179, 0.3);
        }

        .option-button.default:hover {
          border-color: rgba(0, 221, 179, 0.3);
          background: rgba(0, 221, 179, 0.05);
        }

        .option-button.selected:hover {
          box-shadow: 0 0 25px rgba(0, 221, 179, 0.4);
        }

        /* Option States - Submitted */
        .option-button.correct {
          background: #00DDB3;
          color: #000000;
          border: 2px solid #00DDB3;
          font-weight: 700;
        }

        .option-button.incorrect {
          background: #FF383C;
          color: #FFFFFF;
          border: 2px solid #FF383C;
        }

        .option-button.faded {
          background: #1E1E24;
          color: #FFFFFF;
          opacity: 0.4;
          cursor: not-allowed;
          border: 2px solid rgba(255, 255, 255, 0.05);
        }

        .option-button.disabled {
          cursor: not-allowed;
        }

        /* iPhone 14/15 Pro Max */
        @media (max-width: 430px) {
          .option-button {
            font-size: 15px;
            min-height: 50px;
            padding: 0px 6px;
          }
        }

        /* iPhone 14/15 Pro */
        @media (max-width: 393px) {
          .option-button {
            font-size: 15px;
            min-height: 50px;
            padding: 0px 6px;
          }
        }

        @media (max-width: 375px) {
          .option-button {
            font-size: 14px;
            min-height: 48px;
            padding: 0px 6px;
          }
        }

        @media (max-width: 320px) {
          .option-button {
            font-size: 13px;
            min-height: 46px;
            padding: 0px 6px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .option-button {
            min-height: 44px;
            font-size: 14px;
            padding: 0px 6px;
          }
        }
      `}</style>
    </button>
  );
};

export default React.memo(OptionButton);
