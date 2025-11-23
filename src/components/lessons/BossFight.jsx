import React from 'react';
import PropTypes from 'prop-types';

/**
 * BossFight - Composant boss fight en fin de module
 * Boss unlock après completion de toutes les leçons du module
 * Position : absolute (x, y) synchronisée avec PathSVG
 */
const BossFight = ({
  module,
  x,
  y,
  unlocked = false,
  defeated = false,
  completedLessons = 0,
  totalLessons = 0,
  onClick
}) => {
  const { order, totalXP } = module;

  // Mapping icônes boss par numéro de module
  const bossIcons = {
    1: '🐉', // Dragon
    2: '🤖', // Robot
    3: '👾', // Alien
    4: '🦾', // Cyborg
    5: '🔮', // Crystal
    6: '🏆'  // Trophy
  };

  const bossIcon = bossIcons[order] || '🎯';

  const handleClick = () => {
    if (defeated) {
      // Boss déjà battu, ne rien faire
      return;
    }
    if (!unlocked) {
      // Shake animation si locked
      const elem = document.querySelector('.boss-fight');
      elem?.classList.add('boss-shake');
      setTimeout(() => elem?.classList.remove('boss-shake'), 500);
      return;
    }
    onClick?.();
  };

  // Déterminer la classe selon l'état
  const getStateClass = () => {
    if (defeated) return 'boss-defeated';
    if (unlocked) return 'boss-unlocked';
    return 'boss-locked';
  };

  return (
    <button
      className={`boss-fight ${getStateClass()}`}
      onClick={handleClick}
      disabled={!unlocked || defeated}
      style={{
        '--boss-x': `${x}px`,
        '--boss-y': `${y}px`
      }}
    >
      {/* Cercle boss géant */}
      <div className="boss-circle">
        {/* Afficher checkmark si defeated, sinon icône boss */}
        {defeated ? (
          <span className="boss-defeated-icon">✓</span>
        ) : (
          <span className="boss-icon">{bossIcon}</span>
        )}

        {/* Lock overlay si pas unlocked */}
        {!unlocked && !defeated && (
          <div className="boss-lock-overlay">
            <span className="boss-lock-icon">🔒</span>
            <span className="boss-lock-text">
              {completedLessons}/{totalLessons}
            </span>
          </div>
        )}

        {/* Glow effect pour boss unlocked ou defeated */}
        {(unlocked || defeated) && (
          <div className="boss-glow" />
        )}
      </div>

      {/* Badge UNIT BOSS */}
      <div className="boss-badge">
        <span className="boss-badge-text">UNIT {order} BOSS</span>
      </div>

      {/* Reward XP */}
      <div className="boss-reward">
        <span className="boss-reward-icon">⚡</span>
        <span className="boss-reward-text">+{totalXP} XP</span>
      </div>

      <style>{`
        /* Boss Fight - Gaming style */
        .boss-fight {
          position: absolute;
          left: var(--boss-x);
          top: var(--boss-y);
          transform: translate(-50%, -50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 40px 20px;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .boss-fight.boss-unlocked:hover {
          transform: translate(-50%, calc(-50% - 8px)) scale(1.05);
        }

        .boss-fight.boss-unlocked:active {
          transform: translate(-50%, calc(-50% - 4px)) scale(1.02);
        }

        .boss-fight.boss-locked {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .boss-fight.boss-defeated {
          cursor: default;
          opacity: 1;
        }

        .boss-fight.boss-defeated:hover {
          transform: translate(-50%, -50%);
        }

        /* Shake animation pour boss locked */
        .boss-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        /* Cercle boss géant */
        .boss-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #FF453A 0%, #FF9500 100%);
          border: 6px solid #FFD700;
          box-shadow: 0 12px 40px rgba(255, 69, 58, 0.6),
                      inset 0 2px 0 rgba(255, 255, 255, 0.2);
          animation: float 3s ease-in-out infinite;
        }

        .boss-fight.boss-locked .boss-circle {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border: 6px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          animation: none;
        }

        .boss-fight.boss-defeated .boss-circle {
          background: linear-gradient(135deg, #30D158 0%, #34C759 100%);
          border: 6px solid #34C759;
          box-shadow: 0 12px 40px rgba(48, 209, 88, 0.8),
                      inset 0 2px 0 rgba(255, 255, 255, 0.3);
          animation: float 3s ease-in-out infinite, victoryPulse 2s ease-in-out infinite;
        }

        /* Animation float */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        /* Icône boss */
        .boss-icon {
          font-size: 64px;
          line-height: 1;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
          animation: breathe 2s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        /* Icône defeated (checkmark) */
        .boss-defeated-icon {
          font-size: 72px;
          font-weight: 900;
          line-height: 1;
          color: #FFFFFF;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
          animation: victoryScale 2s ease-in-out infinite;
        }

        @keyframes victoryScale {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.15) rotate(5deg);
          }
        }

        @keyframes victoryPulse {
          0%, 100% {
            box-shadow: 0 12px 40px rgba(48, 209, 88, 0.8),
                        inset 0 2px 0 rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 12px 60px rgba(48, 209, 88, 1),
                        inset 0 2px 0 rgba(255, 255, 255, 0.4);
          }
        }

        /* Lock overlay */
        .boss-lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .boss-lock-icon {
          font-size: 36px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
        }

        .boss-lock-text {
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }

        /* Glow effect */
        .boss-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
          animation: pulse-glow 2s ease-in-out infinite;
          pointer-events: none;
        }

        .boss-fight.boss-defeated .boss-glow {
          background: radial-gradient(circle, rgba(48, 209, 88, 0.6) 0%, transparent 70%);
          animation: pulse-glow-victory 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-glow-victory {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* Badge UNIT BOSS */
        .boss-badge {
          background: linear-gradient(135deg, #FF9500 0%, #FFB340 100%);
          border: 3px solid #FFD700;
          border-radius: 12px;
          padding: 10px 24px;
          box-shadow: 0 4px 16px rgba(255, 149, 0, 0.5),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .boss-fight.boss-locked .boss-badge {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .boss-fight.boss-defeated .boss-badge {
          background: linear-gradient(135deg, #30D158 0%, #34C759 100%);
          border: 3px solid #FFD700;
          box-shadow: 0 4px 16px rgba(48, 209, 88, 0.6),
                      inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .boss-badge-text {
          font-size: 16px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
          transform: skewX(-5deg);
          display: inline-block;
        }

        /* Reward */
        .boss-reward {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 215, 0, 0.2);
          border-radius: 10px;
          padding: 8px 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }

        .boss-fight.boss-locked .boss-reward {
          background: rgba(60, 60, 60, 0.3);
        }

        .boss-fight.boss-defeated .boss-reward {
          background: rgba(48, 209, 88, 0.3);
        }

        .boss-reward-icon {
          font-size: 20px;
          line-height: 1;
        }

        .boss-reward-text {
          font-size: 16px;
          font-weight: 900;
          font-style: italic;
          color: #FFD700;
          letter-spacing: 0.5px;
          transform: skewX(-5deg);
        }

        .boss-fight.boss-locked .boss-reward-text {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .boss-fight {
            padding: 32px 16px;
            margin: 48px auto 32px auto;
          }

          .boss-circle {
            width: 120px;
            height: 120px;
            border: 5px solid #FFD700;
          }

          .boss-icon {
            font-size: 56px;
          }

          .boss-lock-icon {
            font-size: 32px;
          }

          .boss-badge-text {
            font-size: 14px;
          }

          .boss-reward-text {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .boss-fight {
            padding: 24px 12px;
            margin: 40px auto 24px auto;
          }

          .boss-circle {
            width: 100px;
            height: 100px;
            border: 4px solid #FFD700;
          }

          .boss-icon {
            font-size: 48px;
          }

          .boss-lock-icon {
            font-size: 28px;
          }

          .boss-lock-text {
            font-size: 12px;
          }

          .boss-badge {
            padding: 8px 16px;
          }

          .boss-badge-text {
            font-size: 13px;
          }

          .boss-reward {
            padding: 6px 12px;
          }

          .boss-reward-icon {
            font-size: 16px;
          }

          .boss-reward-text {
            font-size: 13px;
          }
        }
      `}</style>
    </button>
  );
};

BossFight.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    totalXP: PropTypes.number.isRequired
  }).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  unlocked: PropTypes.bool,
  defeated: PropTypes.bool,
  completedLessons: PropTypes.number,
  totalLessons: PropTypes.number,
  onClick: PropTypes.func
};

export default React.memo(BossFight);
