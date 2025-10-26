import React, { useEffect } from 'react'; 

const FeedbackGlow = ({ isVisible, type }) => {
  if (!isVisible) return null;

  return (
    <div className={`feedback-glow feedback-glow-${type}`}>
      <div className="glow-top" />
      <div className="glow-right" />
      <div className="glow-bottom" />
      <div className="glow-left" />

      <style>{`
        .feedback-glow {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 9999;
        }

        /* Bords individuels */
        .glow-top,
        .glow-right,
        .glow-bottom,
        .glow-left {
          position: absolute;
          opacity: 0;
        }

        .glow-top {
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .glow-right {
          top: 0;
          right: 0;
          bottom: 0;
          width: 4px;
        }

        .glow-bottom {
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .glow-left {
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
        }

        /* Animation SUCCESS (vert) */
        .feedback-glow-success .glow-top,
        .feedback-glow-success .glow-right,
        .feedback-glow-success .glow-bottom,
        .feedback-glow-success .glow-left {
          background: #088201;
          box-shadow:
            0 0 20px 4px rgba(48, 209, 88, 0.6),
            0 0 40px 8px rgba(48, 209, 88, 0.3);
          animation: glowSuccess 0.6s ease-out forwards;
        }

        @keyframes glowSuccess {
          0% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* Animation ERROR (rouge) */
        .feedback-glow-error .glow-top,
        .feedback-glow-error .glow-right,
        .feedback-glow-error .glow-bottom,
        .feedback-glow-error .glow-left {
          background: #FF383C;
          box-shadow:
            0 0 20px 4px rgba(255, 69, 58, 0.6),
            0 0 40px 8px rgba(255, 69, 58, 0.3);
          animation: glowError 0.8s ease-out forwards;
        }

        @keyframes glowError {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          40% {
            opacity: 0.3;
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* Responsive - ajustement pour iPhone */
        @media (max-width: 375px) {
          .glow-top,
          .glow-bottom {
            height: 3px;
          }
          .glow-left,
          .glow-right {
            width: 3px;
          }
        }

        @media (max-width: 320px) {
          .glow-top,
          .glow-bottom {
            height: 2px;
          }
          .glow-left,
          .glow-right {
            width: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackGlow;