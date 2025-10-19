import React from "react";
import { X } from "lucide-react";
import ProgressBar from "./ProgressBar";

const Header = ({ onQuit, currentExercise, totalExercises }) => {
  return (
    <div className="header">
      <button className="close-button" onClick={onQuit} aria-label="Quitter">
        <X />
      </button>
      <ProgressBar current={currentExercise} total={totalExercises} />

      <style>{`
        /* Header */
        .header {
          position: fixed;
          top: 20px;
          left: 10.5%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 428px;
          z-index: 100;
          padding: max(env(safe-area-inset-top), 12px) 0 0 0;
          background: #1A1919;
        }

        .close-button {
          position: absolute;
          top: max(env(safe-area-inset-top), 12px);
          left: 15px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 101;
        }

        @media (max-width: 375px) {
          .close-button {
            left: 16px;
            padding: 6px;
          }

          .close-button svg {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 320px) {
          .close-button {
            left: 12px;
            padding: 4px;
          }

          .close-button svg {
            width: 20px;
            height: 20px;
          }
        }

        .close-button svg {
          color: #FF453A;
          width: 24px;
          height: 24px;
        }
      `}</style>
    </div>
  );
};

export default Header;
