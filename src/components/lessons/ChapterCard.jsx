import React from 'react';
import PropTypes from 'prop-types';

/**
 * ChapterCard - Design minimaliste épuré
 * États : locked (verrouillé), completed (terminé), active (en cours)
 */
const ChapterCard = ({
  title,
  chapterNumber,
  isLocked = false,
  isCompleted = false,
  onClick
}) => {

  return (
    <button
      className={`chapter-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
    >
      {/* Chapter Number */}
      <div className="chapter-number">
        {chapterNumber}
      </div>

      {/* Title */}
      <h3 className="chapter-title">{title}</h3>

      {/* XP Badge / Status - Racing style */}
      <div className="chapter-xp-badge">
        {isCompleted ? (
          <>
            <span className="xp-icon">✓</span>
            <span className="xp-value">Complété</span>
          </>
        ) : isLocked ? (
          <>
            <span className="xp-icon">🔒</span>
            <span className="xp-value">Verrouillé</span>
          </>
        ) : (
          <>
            <span className="xp-icon">⚡</span>
            <span className="xp-value">+100 XP</span>
          </>
        )}
      </div>

      <style>{`
        /* Chapter Card - Style "Cars" Racing */
        .chapter-card {
          width: 100%;
          background: linear-gradient(135deg, #1e5a8e 0%, #2b7dc1 100%);
          border: none;
          border-radius: 16px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          position: relative;
          box-shadow: 0 8px 24px rgba(30, 90, 142, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        /* Effet de brillance subtil */
        .chapter-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .chapter-card:hover:not(.locked)::before {
          left: 100%;
        }

        .chapter-card:hover:not(.locked) {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 36px rgba(30, 90, 142, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .chapter-card:active:not(.locked) {
          transform: translateY(-3px) scale(1.01);
        }

        /* Locked State */
        .chapter-card.locked {
          cursor: not-allowed;
          opacity: 0.5;
          background: linear-gradient(135deg, #4a4a4a 0%, #6a6a6a 100%);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* Completed State */
        .chapter-card.completed {
          background: linear-gradient(135deg, #088201 0%, #30D158 100%);
          box-shadow: 0 8px 24px rgba(8, 130, 1, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .chapter-card.completed:hover {
          box-shadow: 0 12px 36px rgba(8, 130, 1, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .chapter-card.completed .chapter-number,
        .chapter-card.completed .chapter-title,
        .chapter-card.completed .chapter-status {
          color: #FFFFFF;
        }

        /* Chapter Number - Style Racing */
        .chapter-number {
          font-size: 250px;
          font-weight: 900;
          font-style: italic;
          color: #ffffffff;
          line-height: 0.9;
          opacity: 0.25;
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%) skewX(-8deg);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .chapter-card.completed .chapter-number {
          opacity: 0.35;
          color: #FFFFFF;
        }

        .chapter-card.locked .chapter-number {
          color: #999999;
          opacity: 0.2;
        }

        /* Title - Style "Cars" */
        .chapter-title {
          font-size: 26px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
          text-align: left;
          z-index: 1;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
          transform: skewX(-5deg);
          letter-spacing: 0.5px;
        }

        .chapter-card.locked .chapter-title {
          color: #CCCCCC;
        }

        /* XP Badge - Racing style */
        .chapter-xp-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 215, 0, 0.2);
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          z-index: 1;
          margin-top: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .xp-icon {
          font-size: 16px;
          line-height: 1;
        }

        .xp-value {
          font-size: 14px;
          font-weight: 900;
          font-style: italic;
          color: #FFD700;
          letter-spacing: 0.5px;
          transform: skewX(-5deg);
        }

        /* Badge state: Completed */
        .chapter-card.completed .chapter-xp-badge {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .chapter-card.completed .xp-value {
          color: #FFFFFF;
        }

        /* Badge state: Locked */
        .chapter-card.locked .chapter-xp-badge {
          background: rgba(153, 153, 153, 0.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .chapter-card.locked .xp-value {
          color: #999999;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .chapter-card {
            padding: 20px;
            gap: 10px;
          }

          .chapter-number {
            font-size: 42px;
            right: 18px;
          }

          .chapter-title {
            font-size: 18px;
          }

          .chapter-xp-badge {
            padding: 5px 10px;
          }

          .xp-icon {
            font-size: 14px;
          }

          .xp-value {
            font-size: 13px;
          }

          .chapter-status span {
            font-size: 12px;
            padding: 5px 12px;
          }
        }

        @media (max-width: 320px) {
          .chapter-card {
            padding: 18px;
            gap: 8px;
          }

          .chapter-number {
            font-size: 38px;
            right: 16px;
          }

          .chapter-title {
            font-size: 17px;
          }

          .chapter-xp-badge {
            padding: 4px 8px;
          }

          .xp-icon {
            font-size: 13px;
          }

          .xp-value {
            font-size: 12px;
          }

          .chapter-status span {
            font-size: 11px;
            padding: 4px 10px;
          }
        }
      `}</style>
    </button>
  );
};

ChapterCard.propTypes = {
  title: PropTypes.string.isRequired,
  chapterNumber: PropTypes.number.isRequired,
  isLocked: PropTypes.bool,
  isCompleted: PropTypes.bool,
  onClick: PropTypes.func
};

export default React.memo(ChapterCard);
