import React from 'react';

// Belt colors configuration
const BELT_CONFIG = {
  easy: {
    color: '#E5E7EB',
    glow: 'rgba(229, 231, 235, 0.4)',
    gradient: 'linear-gradient(135deg, rgba(30, 30, 36, 0.95) 0%, rgba(40, 40, 48, 0.9) 100%)',
    icon: '◯'
  },
  medium: {
    color: '#FCD34D',
    glow: 'rgba(252, 211, 77, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(45, 40, 30, 0.95) 0%, rgba(55, 48, 35, 0.9) 100%)',
    icon: '◐'
  },
  hard: {
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(45, 25, 30, 0.95) 0%, rgba(55, 30, 35, 0.9) 100%)',
    icon: '●'
  }
};

const DifficultyCard = ({
  difficulty,
  xpInfo,
  backgroundColor,
  onClick,
  userLevel
}) => {
  // Determine belt type from difficulty name
  const diffLower = difficulty.toLowerCase();
  const beltType = diffLower === 'easy' ? 'easy'
    : (diffLower === 'medium' || diffLower === 'midd') ? 'medium'
    : 'hard';
  const belt = BELT_CONFIG[beltType];

  return (
    <button
      className={`difficulty-card belt-${beltType}`}
      onClick={onClick}
      style={{
        background: belt.gradient,
        '--belt-color': belt.color,
        '--belt-glow': belt.glow
      }}
    >
      {/* Belt icon indicator */}
      <div className="belt-icon" style={{ color: belt.color }}>
        {belt.icon}
      </div>

      <div className="difficulty-card-content">
        {/* Titre difficulté */}
        <span className="difficulty-title">{difficulty}</span>

        {/* Container badges centrés sous le titre */}
        <div className="badges-container">
          <div className="user-level-badge">
            Niveau {userLevel}
          </div>
          <span className="xp-badge">{xpInfo}</span>
        </div>
      </div>

      <style>{`
        /* Difficulty Card Component - DOJO BELT SYSTEM */
        .difficulty-card {
          width: 100%;
          min-height: 110px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.25),
            0 2px 8px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid var(--belt-color, rgba(255, 255, 255, 0.2));
          border-left-width: 4px;
        }

        /* Belt icon positioned top-right */
        .belt-icon {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 20px;
          opacity: 0.8;
          transition: all 0.3s ease;
          text-shadow: 0 0 10px var(--belt-glow);
        }

        .difficulty-card:hover .belt-icon {
          opacity: 1;
          transform: scale(1.2);
          text-shadow: 0 0 20px var(--belt-glow);
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
            rgba(255, 255, 255, 0.05) 0%,
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
            0 16px 48px rgba(0, 0, 0, 0.35),
            0 0 30px var(--belt-glow),
            0 6px 16px rgba(0, 0, 0, 0.2);
          border-color: var(--belt-color);
        }

        .difficulty-card:hover::before {
          opacity: 1;
        }

        .difficulty-card:active {
          transform: translateY(-3px) scale(0.98);
          box-shadow:
            0 10px 32px rgba(0, 0, 0, 0.3),
            0 0 15px var(--belt-glow),
            0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .difficulty-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          padding: 16px 24px;
          position: relative;
          z-index: 1;
          gap: 16px;
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
            0 0 30px var(--belt-glow),
            0 4px 8px rgba(0, 0, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.3);
          transform: skewX(-5deg);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .difficulty-card:hover .difficulty-title {
          transform: skewX(-5deg) scale(1.05);
          text-shadow:
            0 0 40px var(--belt-glow),
            0 4px 8px rgba(0, 0, 0, 0.4);
        }

        /* Container badges sous le titre */
        .badges-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
        }

        .xp-badge {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          font-style: normal;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1px solid var(--belt-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          transform: skewX(0deg);
          transition: all 0.3s ease;
        }

        .difficulty-card:hover .xp-badge {
          box-shadow: 0 0 15px var(--belt-glow);
        }

        /* User level badge (centré sous titre) */
        .user-level-badge {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.85);
          font-size: 11px;
          font-weight: 600;
          font-style: italic;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .difficulty-card:hover .user-level-badge {
          background: rgba(0, 0, 0, 0.6);
          border-color: rgba(255, 255, 255, 0.25);
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

          .user-level-badge {
            font-size: 10px;
            padding: 5px 9px;
            border-radius: 7px;
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

          .user-level-badge {
            font-size: 9px;
            padding: 4px 8px;
            border-radius: 6px;
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

          .user-level-badge {
            font-size: 9px;
            padding: 4px 8px;
            border-radius: 6px;
          }
        }
      `}</style>
    </button>
  );
};

export default DifficultyCard;
