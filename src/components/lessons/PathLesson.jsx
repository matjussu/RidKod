import React from 'react';
import PropTypes from 'prop-types';

/**
 * PathLesson - Composant leçon sur le path gaming style Duolingo
 * États : pending (non commencé), active (en cours), completed (terminé)
 * Position : absolute (x, y) synchronisée avec PathSVG
 */
const PathLesson = ({
  lesson,
  x,
  y,
  position = 'left',
  completed = false,
  isActive = false,
  onClick
}) => {
  const { lessonNumber, title, xpReward } = lesson;

  // Mapping icônes thématiques par numéro de leçon (cycle de 7)
  const lessonIcons = ['📖', '💻', '🎯', '🔥', '⚡', '🚀', '🏆'];
  const iconIndex = (parseInt(lessonNumber) - 1) % lessonIcons.length;
  const icon = lessonIcons[iconIndex];

  // Déterminer l'état visuel
  const state = completed ? 'completed' : (isActive ? 'active' : 'pending');

  return (
    <button
      className={`path-lesson path-lesson-${state} path-lesson-label-${position}`}
      onClick={onClick}
      style={{
        '--lesson-x': `${x}px`,
        '--lesson-y': `${y}px`
      }}
    >
      {/* Cercle principal avec icône */}
      <div className="path-lesson-circle">
        <span className="path-lesson-icon">{completed ? '✓' : icon}</span>

        {/* Particules dorées pour leçons complétées */}
        {completed && (
          <div className="path-particles">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="particle" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Label avec numéro et XP */}
      <div className="path-lesson-label">
        <span className="path-lesson-number">{lessonNumber}</span>
        <span className="path-lesson-title">{title}</span>
        <span className="path-lesson-xp">
          {completed ? 'Complété' : `+${xpReward} XP`}
        </span>
      </div>

      <style>{`
        /* Path Lesson - Gaming style */
        .path-lesson {
          position: absolute;
          left: var(--lesson-x);
          top: var(--lesson-y);
          width: 0;
          height: 0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          overflow: visible;
          z-index: 10;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .path-lesson:hover .path-lesson-circle {
          transform: translate(-50%, -50%) scale(1.05);
        }

        .path-lesson:active .path-lesson-circle {
          transform: translate(-50%, -50%) scale(0.98);
        }

        /* Cercle principal - Toujours centré sur (0,0) du bouton */
        .path-lesson-circle {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        /* Label - Positionné en absolu par rapport au centre */
        .path-lesson-label {
          position: absolute;
          top: 0;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 160px;
          width: max-content;
          z-index: 1;
          pointer-events: none; /* Clics passent au travers vers le bouton si besoin, ou non */
        }

        /* Direction du label selon position */
        /* position='left' => Node à gauche => Label à droite */
        .path-lesson-label-left .path-lesson-label {
          left: 56px; /* 40px radius + 16px gap */
          text-align: left;
          align-items: flex-start;
        }

        /* position='right' => Node à droite => Label à gauche */
        .path-lesson-label-right .path-lesson-label {
          right: 56px; /* 40px radius + 16px gap */
          text-align: right;
          align-items: flex-end;
        }

        /* États du cercle */
        .path-lesson-pending .path-lesson-circle {
          background: linear-gradient(135deg, #1e5a8e 0%, #2b7dc1 100%);
          border: 4px solid rgba(255, 255, 255, 0.2);
        }

        .path-lesson-active .path-lesson-circle {
          background: linear-gradient(135deg, #FF9500 0%, #FFB340 100%);
          border: 4px solid #FFD700;
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          box-shadow: 0 0 32px rgba(255, 149, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .path-lesson-completed .path-lesson-circle {
          background: linear-gradient(135deg, #088201 0%, #30D158 100%);
          border: 4px solid rgba(255, 255, 255, 0.3);
        }

        /* Icône */
        .path-lesson-icon {
          font-size: 36px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        /* Animation pulse pour leçon active */
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 32px rgba(255, 149, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 48px rgba(255, 149, 0, 0.8), 0 12px 32px rgba(0, 0, 0, 0.4);
          }
        }

        /* Particules dorées */
        .path-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-radius: 50%;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #FFD700;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          animation: particleFloat 2s ease-out infinite;
          box-shadow: 0 0 8px #FFD700;
        }

        .particle:nth-child(1) { transform: rotate(0deg); }
        .particle:nth-child(2) { transform: rotate(72deg); }
        .particle:nth-child(3) { transform: rotate(144deg); }
        .particle:nth-child(4) { transform: rotate(216deg); }
        .particle:nth-child(5) { transform: rotate(288deg); }

        @keyframes particleFloat {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(40px, -40px);
            opacity: 0;
          }
        }

        .path-lesson-number {
          font-size: 12px;
          font-weight: 700;
          color: #FF9500;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .path-lesson-title {
          font-size: 16px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          line-height: 1.2;
          transform: skewX(-5deg);
          letter-spacing: 0.5px;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
        }

        .path-lesson-xp {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .path-lesson-completed .path-lesson-xp {
          color: #30D158;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .path-lesson-circle {
            width: 64px;
            height: 64px;
          }

          .path-lesson-label-left .path-lesson-label {
            left: 44px; /* 32px radius + 12px gap */
          }

          .path-lesson-label-right .path-lesson-label {
            right: 44px; /* 32px radius + 12px gap */
          }

          .path-lesson-icon {
            font-size: 28px;
          }

          .path-lesson-label {
            max-width: 120px;
          }

          .path-lesson-title {
            font-size: 14px;
          }

          .path-lesson-xp {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .path-lesson-circle {
            width: 56px;
            height: 56px;
          }

          .path-lesson-label-left .path-lesson-label {
            left: 38px; /* 28px radius + 10px gap */
          }

          .path-lesson-label-right .path-lesson-label {
            right: 38px; /* 28px radius + 10px gap */
          }

          .path-lesson-icon {
            font-size: 24px;
          }

          .path-lesson-title {
            font-size: 13px;
          }
        }
      `}</style>
    </button>
  );
};

PathLesson.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lessonNumber: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    xpReward: PropTypes.number.isRequired
  }).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  position: PropTypes.oneOf(['left', 'right']),
  completed: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func
};

export default React.memo(PathLesson);
