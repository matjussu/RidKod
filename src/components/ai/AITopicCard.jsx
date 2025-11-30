import React from 'react';
import PropTypes from 'prop-types';

/**
 * AITopicCard - Card High-Tech pour topics AI Understanding
 * Design: Cyberpunk élégant avec icônes SVG
 */
const AITopicCard = ({
  topic,
  progress,
  onClick
}) => {
  const { icon, title, description, difficulty, xpReward } = topic;
  const { completed, completionPercentage } = progress;

  // Texte de difficulté
  const getDifficultyText = () => {
    switch(difficulty) {
      case 1: return 'EASY';
      case 2: return 'MEDIUM';
      case 3: return 'HARD';
      default: return 'EASY';
    }
  };

  // Icônes SVG High-Tech
  const getIconSVG = () => {
    switch(icon) {
      case '🤖': // Automation
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2"/>
            <circle cx="12" cy="5" r="2"/>
            <path d="M12 7v4"/>
            <line x1="8" y1="16" x2="8" y2="16"/>
            <line x1="16" y1="16" x2="16" y2="16"/>
          </svg>
        );
      case '🛒': // E-commerce
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        );
      case '🔍': // AI Auditor
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
            <path d="M11 8v6"/>
            <path d="M8 11h6"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      className={`ai-topic-card-hightech ${completed ? 'completed' : ''}`}
      onClick={onClick}
    >
      {/* Corner Accents */}
      <div className="corner-accent top-left"></div>
      <div className="corner-accent top-right"></div>
      <div className="corner-accent bottom-left"></div>
      <div className="corner-accent bottom-right"></div>

      {/* Icon SVG */}
      <div className="topic-icon-svg">
        {getIconSVG()}
      </div>

      {/* Content */}
      <div className="topic-content-hightech">
        <h3 className="topic-title-hightech">{title}</h3>
        <p className="topic-description-hightech">{description}</p>

        {/* Bottom Info */}
        <div className="topic-info-hightech">
          {/* Difficulty Text */}
          <div className="topic-difficulty-hightech">
            {getDifficultyText()}
          </div>

          {/* Progress or XP Badge */}
          <div className="topic-xp-badge-hightech">
            {completed ? (
              <>
                <span className="xp-icon">✓</span>
                <span className="xp-value">COMPLETE</span>
              </>
            ) : completionPercentage > 0 ? (
              <>
                <span className="progress-value">{completionPercentage}%</span>
              </>
            ) : (
              <>
                <span className="xp-value">+{xpReward} XP</span>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* AI Topic Card High-Tech */
        .ai-topic-card-hightech {
          width: 100%;
          background: linear-gradient(135deg, #0A0A0A 0%, #0D0D0D 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 32px 28px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          position: relative;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.03);
          overflow: hidden;
        }

        /* Corner Accents */
        .corner-accent {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .corner-accent.top-left {
          top: 12px;
          left: 12px;
          border-right: none;
          border-bottom: none;
        }

        .corner-accent.top-right {
          top: 12px;
          right: 12px;
          border-left: none;
          border-bottom: none;
        }

        .corner-accent.bottom-left {
          bottom: 12px;
          left: 12px;
          border-right: none;
          border-top: none;
        }

        .corner-accent.bottom-right {
          bottom: 12px;
          right: 12px;
          border-left: none;
          border-top: none;
        }

        /* Glow Effect on Hover */
        .ai-topic-card-hightech::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .ai-topic-card-hightech:hover::before {
          opacity: 1;
        }

        .ai-topic-card-hightech:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow:
            0 8px 32px rgba(255, 255, 255, 0.08),
            0 0 20px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .ai-topic-card-hightech:hover .corner-accent {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .ai-topic-card-hightech:active {
          transform: translateY(-3px);
        }

        /* Completed State */
        .ai-topic-card-hightech.completed {
          background: linear-gradient(135deg, #001a1a 0%, #002020 100%);
          border-color: rgba(0, 255, 128, 0.3);
        }

        .ai-topic-card-hightech.completed:hover {
          border-color: rgba(0, 255, 128, 0.5);
          box-shadow:
            0 8px 32px rgba(0, 255, 128, 0.2),
            0 0 20px rgba(0, 255, 128, 0.1);
        }

        .ai-topic-card-hightech.completed .corner-accent {
          border-color: rgba(0, 255, 128, 0.4);
        }

        /* Icon SVG */
        .topic-icon-svg {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .ai-topic-card-hightech:hover .topic-icon-svg {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .topic-icon-svg svg {
          stroke: #FFFFFF;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
        }

        .ai-topic-card-hightech.completed .topic-icon-svg {
          background: rgba(0, 255, 128, 0.08);
          border-color: rgba(0, 255, 128, 0.3);
        }

        .ai-topic-card-hightech.completed .topic-icon-svg svg {
          stroke: #00FF80;
          filter: drop-shadow(0 0 8px rgba(0, 255, 128, 0.4));
        }

        /* Content */
        .topic-content-hightech {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
          z-index: 1;
        }

        /* Title */
        .topic-title-hightech {
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.3;
          text-align: center;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        /* Description */
        .topic-description-hightech {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          line-height: 1.5;
          text-align: center;
        }

        /* Bottom Info */
        .topic-info-hightech {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Difficulty Text */
        .topic-difficulty-hightech {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #FF9500;
          line-height: 1;
        }

        /* XP Badge */
        .topic-xp-badge-hightech {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .ai-topic-card-hightech.completed .topic-xp-badge-hightech {
          background: rgba(0, 255, 128, 0.1);
          border-color: rgba(0, 255, 128, 0.3);
          color: #00FF80;
        }

        .xp-icon {
          font-size: 14px;
          line-height: 1;
        }

        .xp-value, .progress-value {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .ai-topic-card-hightech {
            padding: 28px 20px;
          }

          .topic-icon-svg {
            width: 72px;
            height: 72px;
          }

          .topic-icon-svg svg {
            width: 42px;
            height: 42px;
          }

          .topic-title-hightech {
            font-size: 17px;
            word-break: break-word;
            hyphens: auto;
          }

          .topic-description-hightech {
            font-size: 12px;
          }

          .topic-difficulty-hightech {
            font-size: 10px;
          }
        }

        /* iPhone SE et petits écrans */
        @media (max-width: 375px) {
          .ai-topic-card-hightech {
            padding: 24px 16px;
          }

          .topic-icon-svg {
            width: 64px;
            height: 64px;
          }

          .topic-icon-svg svg {
            width: 36px;
            height: 36px;
          }

          .topic-title-hightech {
            font-size: 15px;
            word-break: break-word;
            hyphens: auto;
          }

          .topic-description-hightech {
            font-size: 11px;
          }

          .topic-difficulty-hightech {
            font-size: 9px;
          }

          .topic-xp-badge-hightech {
            font-size: 10px;
            padding: 5px 10px;
          }
        }
      `}</style>
    </button>
  );
};

AITopicCard.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    difficulty: PropTypes.number.isRequired,
    xpReward: PropTypes.number.isRequired,
    category: PropTypes.string
  }).isRequired,
  progress: PropTypes.shape({
    completed: PropTypes.bool,
    completionPercentage: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func
};

export default React.memo(AITopicCard);
