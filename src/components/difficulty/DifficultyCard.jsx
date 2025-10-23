import React from 'react';

const DifficultyCard = ({
  difficulty,
  icon,
  description,
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
        <div className="difficulty-header">
          <div className="difficulty-icon">{icon}</div>
          <div className="difficulty-info">
            <span className="difficulty-title">{difficulty}</span>
            <span className="difficulty-description">{description}</span>
          </div>
        </div>
        <div className="difficulty-footer">
          <span className="xp-badge">{xpInfo}</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="arrow-icon"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>

      <style>{`
        /* Difficulty Card Component */
        .difficulty-card {
          width: 100%;
          min-height: 140px;
          border-radius: 24px;
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
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 24px;
          position: relative;
          z-index: 1;
          gap: 16px;
        }

        .difficulty-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .difficulty-icon {
          font-size: 48px;
          line-height: 1;
          flex-shrink: 0;
          transform: scale(1);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .difficulty-card:hover .difficulty-icon {
          transform: scale(1.15) rotate(-5deg);
        }

        .difficulty-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          text-align: left;
        }

        .difficulty-title {
          color: #FFFFFF;
          font-size: 28px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .difficulty-description {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .difficulty-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .xp-badge {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .arrow-icon {
          color: rgba(255, 255, 255, 0.8);
          transform: translateX(0);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
        }

        .difficulty-card:hover .arrow-icon {
          transform: translateX(6px);
        }

        /* Responsive adjustments */
        @media (max-width: 375px) {
          .difficulty-card {
            min-height: 130px;
            border-radius: 20px;
          }

          .difficulty-card-content {
            padding: 20px;
            gap: 14px;
          }

          .difficulty-icon {
            font-size: 42px;
          }

          .difficulty-title {
            font-size: 24px;
          }

          .difficulty-description {
            font-size: 13px;
          }

          .xp-badge {
            font-size: 12px;
            padding: 7px 12px;
          }

          .arrow-icon {
            width: 20px;
            height: 20px;
          }
        }

        @media (max-width: 320px) {
          .difficulty-card {
            min-height: 120px;
            border-radius: 18px;
          }

          .difficulty-card-content {
            padding: 18px;
            gap: 12px;
          }

          .difficulty-header {
            gap: 12px;
          }

          .difficulty-icon {
            font-size: 38px;
          }

          .difficulty-title {
            font-size: 22px;
          }

          .difficulty-description {
            font-size: 12px;
          }

          .xp-badge {
            font-size: 11px;
            padding: 6px 10px;
            border-radius: 10px;
          }

          .arrow-icon {
            width: 18px;
            height: 18px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .difficulty-card {
            min-height: 110px;
            border-radius: 18px;
          }

          .difficulty-card-content {
            padding: 18px;
            gap: 12px;
          }

          .difficulty-icon {
            font-size: 36px;
          }

          .difficulty-title {
            font-size: 22px;
          }

          .difficulty-description {
            font-size: 12px;
          }

          .xp-badge {
            font-size: 11px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </button>
  );
};

export default DifficultyCard;
