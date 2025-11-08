import React from 'react';
import PropTypes from 'prop-types';
import ProgressCircle from './ProgressCircle';

/**
 * ChapterCard - Card pour afficher un chapitre
 * États : locked (verrouillé), active (en cours), completed (terminé)
 */
const ChapterCard = ({
  title,
  description,
  icon = '📚',
  difficulty = 1,
  isLocked = false,
  isCompleted = false,
  progress = 0,
  totalExercises = 5,
  completedExercises = 0,
  xpReward = 50,
  estimatedTime = 15,
  onClick
}) => {
  // Couleur du gradient selon difficulté
  const getBackgroundColor = () => {
    if (isLocked) {
      return 'linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%)';
    }
    if (isCompleted) {
      return 'linear-gradient(135deg, #1871BE 0%, #007AFF 100%)';
    }
    // En cours - Gradient vert
    if (difficulty === 1) {
      return 'linear-gradient(135deg, #088201 0%, #30D158 100%)';
    }
    if (difficulty === 2) {
      return 'linear-gradient(135deg, #FF6B00 0%, #FF9500 100%)';
    }
    return 'linear-gradient(135deg, #C41E3A 0%, #FF453A 100%)';
  };

  // Labels difficulté
  const getDifficultyLabel = () => {
    if (difficulty === 1) return 'EASY';
    if (difficulty === 2) return 'MIDD';
    return 'HARD';
  };

  return (
    <button
      className={`chapter-card ${isLocked ? 'chapter-card-locked' : ''} ${isCompleted ? 'chapter-card-completed' : ''}`}
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      style={{
        background: getBackgroundColor()
      }}
    >
      <div className="chapter-card-header">
        {/* Icon + Title */}
        <div className="chapter-card-title-section">
          <span className="chapter-card-icon">{icon}</span>
          <div className="chapter-card-title-wrapper">
            <h3 className="chapter-card-title">{title}</h3>
            <p className="chapter-card-description">{description}</p>
          </div>
        </div>

        {/* Progress Circle ou Lock */}
        {isLocked ? (
          <div className="chapter-card-lock">
            🔒
          </div>
        ) : (
          <ProgressCircle
            current={completedExercises}
            total={totalExercises}
            size={56}
            strokeWidth={5}
            color={isCompleted ? '#FFFFFF' : '#FFFFFF'}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
        )}
      </div>

      {/* Footer Stats */}
      <div className="chapter-card-footer">
        <div className="chapter-card-stats">
          <span className="chapter-card-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {estimatedTime} min
          </span>
          <span className="chapter-card-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            +{xpReward} XP
          </span>
          <span className="chapter-card-stat chapter-card-difficulty">
            {getDifficultyLabel()}
          </span>
        </div>
      </div>

      <style>{`
        /* Chapter Card Component */
        .chapter-card {
          width: 100%;
          min-height: 140px;
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
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chapter-card::before {
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

        .chapter-card:hover:not(.chapter-card-locked) {
          transform: translateY(-6px) scale(1.02);
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.3),
            0 6px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .chapter-card:hover:not(.chapter-card-locked)::before {
          opacity: 1;
        }

        .chapter-card:active:not(.chapter-card-locked) {
          transform: translateY(-3px) scale(0.98);
        }

        /* Locked State */
        .chapter-card-locked {
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Completed State */
        .chapter-card-completed {
          position: relative;
        }

        .chapter-card-completed::after {
          content: '✓';
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          z-index: 2;
        }

        /* Header */
        .chapter-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        /* Title Section */
        .chapter-card-title-section {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .chapter-card-icon {
          font-size: 32px;
          line-height: 1;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .chapter-card-title-wrapper {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chapter-card-title {
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 800;
          margin: 0;
          line-height: 1.3;
          text-align: left;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .chapter-card-description {
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /* Lock Icon */
        .chapter-card-lock {
          font-size: 32px;
          line-height: 1;
          opacity: 0.6;
          flex-shrink: 0;
        }

        /* Footer Stats */
        .chapter-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .chapter-card-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .chapter-card-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          font-weight: 600;
        }

        .chapter-card-stat svg {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .chapter-card-difficulty {
          background: rgba(0, 0, 0, 0.2);
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-weight: 700;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .chapter-card {
            min-height: 130px;
            padding: 16px;
            gap: 14px;
          }

          .chapter-card-icon {
            font-size: 28px;
          }

          .chapter-card-title {
            font-size: 16px;
          }

          .chapter-card-description {
            font-size: 12px;
          }

          .chapter-card-stat {
            font-size: 11px;
          }

          .chapter-card-stat svg {
            width: 13px;
            height: 13px;
          }
        }

        @media (max-width: 320px) {
          .chapter-card {
            min-height: 120px;
            padding: 14px;
            gap: 12px;
          }

          .chapter-card-icon {
            font-size: 26px;
          }

          .chapter-card-title {
            font-size: 15px;
          }

          .chapter-card-description {
            font-size: 11px;
          }

          .chapter-card-stats {
            gap: 12px;
          }

          .chapter-card-stat {
            font-size: 10px;
          }
        }
      `}</style>
    </button>
  );
};

ChapterCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  difficulty: PropTypes.number,
  isLocked: PropTypes.bool,
  isCompleted: PropTypes.bool,
  progress: PropTypes.number,
  totalExercises: PropTypes.number,
  completedExercises: PropTypes.number,
  xpReward: PropTypes.number,
  estimatedTime: PropTypes.number,
  onClick: PropTypes.func
};

export default React.memo(ChapterCard);
