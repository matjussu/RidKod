import React from 'react';

const DifficultyCard = ({
  difficulty,
  xpInfo,
  backgroundColor,
  onClick
}) => {
  return (
    <button
      className="difficulty-card"
      onClick={onClick}
      style={{
        background: backgroundColor
      }}
    >
      <div className="difficulty-card-content">
        <span className="difficulty-title">{difficulty}</span>
        <span className="xp-badge">{xpInfo}</span>
      </div>

      <style>{`
        /* Difficulty Card Component */
        .difficulty-card {
          width: 100%;
          min-height: 110px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            0 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .difficulty-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .difficulty-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.3),
            0 6px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .difficulty-card:hover::before {
          opacity: 1;
        }

        .difficulty-card:active {
          transform: translateY(-3px) scale(0.98);
          box-shadow:
            0 10px 32px rgba(0, 0, 0, 0.25),
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .difficulty-card-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          width: 110%;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .difficulty-title {
          color: #FFFFFF;
          font-size: 100px;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -3px;
          line-height: 1;
          text-shadow:
            0 4px 8px rgba(0, 0, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.3);
          transform: skewX(-5deg);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .difficulty-card:hover .difficulty-title {
          transform: skewX(-5deg) scale(1.05);
        }

        .xp-badge {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          font-style: normal;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          transform: skewX(0deg);
        }

        /* Responsive adjustments */
        @media (max-width: 375px) {
          .difficulty-card {
            min-height: 100px;
            border-radius: 18px;
          }

          .difficulty-card-content {
            padding: 0 20px;
          }

          .difficulty-title {
            font-size: 90px;
            letter-spacing: 1.5px;
          }

          .xp-badge {
            font-size: 11px;
            padding: 6px 12px;
            border-radius: 10px;
          }
        }

        @media (max-width: 320px) {
          .difficulty-card {
            min-height: 95px;
            border-radius: 16px;
          }

          .difficulty-card-content {
            padding: 0 16px;
          }

          .difficulty-title {
            font-size: 75px;
            letter-spacing: 1px;
          }

          .xp-badge {
            font-size: 10px;
            padding: 5px 10px;
            border-radius: 8px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .difficulty-card {
            min-height: 90px;
            border-radius: 16px;
          }

          .difficulty-card-content {
            padding: 0 18px;
          }

          .difficulty-title {
            font-size: 100px;
            letter-spacing: 1px;
          }

          .xp-badge {
            font-size: 10px;
            padding: 5px 10px;
            border-radius: 8px;
          }
        }
      `}</style>
    </button>
  );
};

export default DifficultyCard;
