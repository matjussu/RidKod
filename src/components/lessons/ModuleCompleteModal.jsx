import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useHaptic from '../../hooks/useHaptic';

const ModuleCompleteModal = ({
  moduleTitle,
  lessonsCompleted,
  totalLessons,
  xpEarned,
  onBossFight
}) => {
  const { triggerSuccess } = useHaptic();

  useEffect(() => {
    triggerSuccess();
  }, [triggerSuccess]);

  const styles = `
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes particleFloat {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: translateY(-30px) rotate(180deg);
        opacity: 0.5;
      }
    }

    @keyframes pulseScale {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .module-complete-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      animation: modalFadeIn 0.4s ease-out;
    }

    .module-complete-content {
      background: linear-gradient(135deg, #2C2C2E 0%, #0F0F12 100%);
      border-radius: 24px;
      padding: 40px 32px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 215, 0, 0.2);
      position: relative;
      overflow: hidden;
      animation: pulseScale 3s ease-in-out infinite;
    }

    /* Particules dorées */
    .module-complete-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #FFD700;
      border-radius: 50%;
      opacity: 0.6;
      animation: particleFloat 3s ease-in-out infinite;
    }

    .particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; }
    .particle:nth-child(2) { left: 30%; top: 40%; animation-delay: 0.5s; }
    .particle:nth-child(3) { left: 50%; top: 10%; animation-delay: 1s; }
    .particle:nth-child(4) { left: 70%; top: 50%; animation-delay: 1.5s; }
    .particle:nth-child(5) { left: 90%; top: 30%; animation-delay: 2s; }
    .particle:nth-child(6) { left: 20%; top: 70%; animation-delay: 2.5s; }
    .particle:nth-child(7) { left: 60%; top: 80%; animation-delay: 3s; }
    .particle:nth-child(8) { left: 80%; top: 60%; animation-delay: 3.5s; }

    .module-complete-header {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .module-complete-emoji {
      font-size: 72px;
      margin-bottom: 16px;
      display: block;
      animation: pulseScale 2s ease-in-out infinite;
    }

    .module-complete-title {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 28px;
      font-weight: 900;
      color: #FFD700;
      margin: 0 0 8px 0;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
    }

    .module-complete-subtitle {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 15px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0;
      opacity: 0.9;
    }

    .module-complete-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .stat-row {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-label {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 14px;
      font-weight: 600;
      color: #8E8E93;
    }

    .stat-value {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 18px;
      font-weight: 900;
      color: #FFD700;
    }

    .module-complete-button {
      width: 100%;
      height: 56px;
      background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
      border: none;
      border-radius: 12px;
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 16px;
      font-weight: 900;
      color: #FFFFFF;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(255, 149, 0, 0.4);
      position: relative;
      z-index: 1;
    }

    .module-complete-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 149, 0, 0.6);
    }

    .module-complete-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(255, 149, 0, 0.4);
    }

    @media (max-width: 480px) {
      .module-complete-content {
        padding: 32px 24px;
      }

      .module-complete-emoji {
        font-size: 64px;
      }

      .module-complete-title {
        font-size: 24px;
      }

      .module-complete-subtitle {
        font-size: 14px;
      }

      .stat-row {
        padding: 14px;
      }

      .stat-label {
        font-size: 13px;
      }

      .stat-value {
        font-size: 16px;
      }

      .module-complete-button {
        height: 52px;
        font-size: 15px;
      }
    }
  `;

  // Injecter les styles
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('module-complete-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'module-complete-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div className="module-complete-overlay">
      <div className="module-complete-content">
        {/* Particules dorées animées */}
        <div className="module-complete-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        {/* Header */}
        <div className="module-complete-header">
          <span className="module-complete-emoji">🎉</span>
          <h2 className="module-complete-title">{moduleTitle} Terminé !</h2>
          <p className="module-complete-subtitle">Les bases de Python maîtrisées</p>
        </div>

        {/* Stats */}
        <div className="module-complete-stats">
          <div className="stat-row">
            <span className="stat-label">Leçons complétées</span>
            <span className="stat-value">{lessonsCompleted}/{totalLessons}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">XP collecté</span>
            <span className="stat-value">+{xpEarned} XP</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="module-complete-button"
          onClick={onBossFight}
          aria-label="Affronter le boss final"
        >
          🏆 Affronter le Boss Final
        </button>
      </div>
    </div>
  );
};

ModuleCompleteModal.propTypes = {
  moduleTitle: PropTypes.string.isRequired,
  lessonsCompleted: PropTypes.number.isRequired,
  totalLessons: PropTypes.number.isRequired,
  xpEarned: PropTypes.number.isRequired,
  onBossFight: PropTypes.func.isRequired
};

export default ModuleCompleteModal;
