import React from "react";

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <style>{`
        .progress-container {
          padding: 15px 20px 16px 56px;
        }

        .progress-bar {
          height: 15px;
          background: #D9D9D9;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #088201;
          transition: width 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .progress-container {
            padding: 12px 20px 16px 48px;
          }
        }

        @media (max-width: 320px) {
          .progress-container {
            padding: 10px 16px 14px 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
