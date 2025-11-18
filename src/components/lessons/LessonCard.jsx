import React from 'react';
import PropTypes from 'prop-types';

/**
 * LessonCard - Card pour afficher une leçon
 * États : active (en cours), completed (terminé)
 */
const LessonCard = ({
  lesson,
  progress,
  onClick
}) => {
  const { title, lessonNumber, xpReward } = lesson;
  const { completed } = progress;

  return (
    <button
      className={`lesson-card ${completed ? 'completed' : ''}`}
      onClick={onClick}
    >
      {/* Lesson Number */}
      <div className="lesson-number">
        {lessonNumber}
      </div>

      {/* Title */}
      <h3 className="lesson-title">{title}</h3>

      {/* XP Badge / Status */}
      <div className="lesson-xp-badge">
        {completed ? (
          <>
            <span className="xp-icon">✓</span>
            <span className="xp-value">Complété</span>
          </>
        ) : (
          <>
            <span className="xp-icon">⚡</span>
            <span className="xp-value">+{xpReward} XP</span>
          </>
        )}
      </div>

      <style>{`
        /* Lesson Card - Style similaire à Chapter Card */
        .lesson-card {
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

        /* Effet de brillance */
        .lesson-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .lesson-card:hover::before {
          left: 100%;
        }

        .lesson-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 36px rgba(30, 90, 142, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .lesson-card:active {
          transform: translateY(-3px) scale(1.01);
        }

        /* Completed State */
        .lesson-card.completed {
          background: linear-gradient(135deg, #088201 0%, #30D158 100%);
          box-shadow: 0 8px 24px rgba(8, 130, 1, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .lesson-card.completed:hover {
          box-shadow: 0 12px 36px rgba(8, 130, 1, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Lesson Number - Affiché en grand derrière */
        .lesson-number {
          font-size: 120px;
          font-weight: 900;
          font-style: italic;
          color: rgba(255, 255, 255, 0.25);
          line-height: 0.9;
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%) skewX(-8deg);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .lesson-card.completed .lesson-number {
          opacity: 0.35;
          color: #FFFFFF;
        }

        /* Title */
        .lesson-title {
          font-size: 22px;
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

        /* XP Badge */
        .lesson-xp-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 215, 0, 0.2);
          border-radius: 8px;
          padding: 6px 12px;
          z-index: 1;
          margin-top: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .lesson-card.completed .lesson-xp-badge {
          background: rgba(255, 255, 255, 0.25);
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

        .lesson-card.completed .xp-value {
          color: #FFFFFF;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .lesson-card {
            padding: 20px;
          }

          .lesson-number {
            font-size: 80px;
          }

          .lesson-title {
            font-size: 18px;
          }
        }

        @media (max-width: 320px) {
          .lesson-card {
            padding: 18px;
          }

          .lesson-number {
            font-size: 60px;
          }

          .lesson-title {
            font-size: 17px;
          }
        }
      `}</style>
    </button>
  );
};

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    lessonNumber: PropTypes.string.isRequired,
    xpReward: PropTypes.number.isRequired
  }).isRequired,
  progress: PropTypes.shape({
    completed: PropTypes.bool
  }).isRequired,
  onClick: PropTypes.func
};

export default React.memo(LessonCard);
