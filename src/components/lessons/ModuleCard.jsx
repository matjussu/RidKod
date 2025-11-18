import React from 'react';
import PropTypes from 'prop-types';

/**
 * ModuleCard - Card pour afficher un module
 * États : normal, completed (avec fond vert)
 */
const ModuleCard = ({
  module,
  progress,
  onClick
}) => {
  const { order, title, totalXP, totalLessons } = module;
  const { completed, completedLessons, completionPercentage } = progress;

  return (
    <button
      className={`module-card ${completed ? 'completed' : ''}`}
      onClick={onClick}
    >
      {/* Module Number */}
      <div className="module-number">
        {order}
      </div>

      {/* Content */}
      <div className="module-content">
        <h3 className="module-title">{title}</h3>

        {/* Progress Text */}
        <div className="module-progress-text">
          {completedLessons} / {totalLessons} leçons • {completionPercentage}%
        </div>

        {/* XP Badge */}
        <div className="module-xp-badge">
          {completed ? (
            <>
              <span className="xp-icon">✓</span>
              <span className="xp-value">TERMINÉ</span>
            </>
          ) : (
            <>
              <span className="xp-icon">⚡</span>
              <span className="xp-value">+{totalXP} XP</span>
            </>
          )}
        </div>
      </div>

      <style>{`
        /* Module Card - Style similaire à ChapterCard */
        .module-card {
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
          align-items: center;
          gap: 20px;
          position: relative;
          box-shadow: 0 8px 24px rgba(30, 90, 142, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        /* Effet de brillance subtil */
        .module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .module-card:hover::before {
          left: 100%;
        }

        .module-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 36px rgba(30, 90, 142, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .module-card:active {
          transform: translateY(-3px) scale(1.01);
        }

        /* Completed State - Fond vert */
        .module-card.completed {
          background: linear-gradient(135deg, #088201 0%, #30D158 100%);
          box-shadow: 0 8px 24px rgba(8, 130, 1, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .module-card.completed:hover {
          box-shadow: 0 12px 36px rgba(8, 130, 1, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Module Number - Style Racing */
        .module-number {
          font-size: 270px;
          font-weight: 900;
          font-style: italic;
          color: rgba(255, 255, 255, 0.36);
          line-height: 1;
          transform: skewX(-8deg);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          flex-shrink: 0;
        }

        .module-card.completed .module-number {
          color: rgba(255, 255, 255, 0.35);
        }

        /* Content */
        .module-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          z-index: 1;
        }

        /* Title */
        .module-title {
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
          text-align: left;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
          transform: skewX(-5deg);
          letter-spacing: 0.5px;
        }

        /* Progress Text */
        .module-progress-text {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-align: left;
        }

        /* XP Badge */
        .module-xp-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 215, 0, 0.2);
          border-radius: 8px;
          padding: 6px 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .module-card.completed .module-xp-badge {
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

        .module-card.completed .xp-value {
          color: #FFFFFF;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .module-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 24px;
          }

          .module-number {
            font-size: 250px;
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%) skewX(-8deg);
          }
        }

        @media (max-width: 480px) {
          .module-card {
            padding: 20px;
          }

          .module-number {
            font-size: 250px;
          }

          .module-title {
            font-size: 20px;
          }

          .module-description {
            font-size: 13px;
          }
        }
      `}</style>
    </button>
  );
};

ModuleCard.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    totalXP: PropTypes.number.isRequired,
    totalLessons: PropTypes.number.isRequired
  }).isRequired,
  progress: PropTypes.shape({
    completed: PropTypes.bool,
    completedLessons: PropTypes.number,
    totalLessons: PropTypes.number,
    completionPercentage: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func
};

export default React.memo(ModuleCard);
