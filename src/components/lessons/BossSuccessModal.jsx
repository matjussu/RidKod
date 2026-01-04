import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useHaptic from '../../hooks/useHaptic';
import { sounds } from '../../utils/audioService';

const BossSuccessModal = ({ errors, maxErrors, xpReward, onCollectXP }) => {
  const { triggerSuccess } = useHaptic();

  useEffect(() => {
    triggerSuccess();
    sounds.chime(); // Son victoire boss
  }, [triggerSuccess]);

  const styles = `
    @keyframes victoryFadeIn {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(30px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes trophyBounce {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      25% {
        transform: translateY(-15px) rotate(-5deg);
      }
      50% {
        transform: translateY(0) rotate(0deg);
      }
      75% {
        transform: translateY(-8px) rotate(5deg);
      }
    }

    @keyframes goldPulse {
      0%, 100% {
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        border-color: rgba(255, 215, 0, 0.4);
      }
      50% {
        box-shadow: 0 0 50px rgba(255, 215, 0, 0.9);
        border-color: rgba(255, 215, 0, 0.7);
      }
    }

    @keyframes confettiFloat {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: translateY(-25px) rotate(180deg);
        opacity: 0.7;
      }
    }

    .boss-success-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      animation: victoryFadeIn 0.6s ease-out;
    }

    .boss-success-content {
      background: linear-gradient(135deg, #2C2C2E 0%, #0F0F12 100%);
      border-radius: 24px;
      padding: 40px 32px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      border: 3px solid rgba(255, 215, 0, 0.4);
      position: relative;
      overflow: hidden;
      animation: goldPulse 3s ease-in-out infinite;
    }

    /* Confetti particles */
    .boss-success-confetti {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #FFD700;
      border-radius: 50%;
      opacity: 0.8;
      animation: confettiFloat 2.5s ease-in-out infinite;
    }

    .confetti:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; background: #FFD700; }
    .confetti:nth-child(2) { left: 25%; top: 40%; animation-delay: 0.3s; background: #FF9500; }
    .confetti:nth-child(3) { left: 45%; top: 10%; animation-delay: 0.6s; background: #30D158; }
    .confetti:nth-child(4) { left: 60%; top: 50%; animation-delay: 0.9s; background: #FFD700; }
    .confetti:nth-child(5) { left: 75%; top: 25%; animation-delay: 1.2s; background: #FF453A; }
    .confetti:nth-child(6) { left: 90%; top: 35%; animation-delay: 1.5s; background: #30D158; }
    .confetti:nth-child(7) { left: 15%; top: 70%; animation-delay: 1.8s; background: #FF9500; }
    .confetti:nth-child(8) { left: 80%; top: 65%; animation-delay: 2.1s; background: #FFD700; }

    .boss-success-header {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .boss-success-emoji {
      font-size: 80px;
      margin-bottom: 16px;
      display: block;
      animation: trophyBounce 1.5s ease-in-out infinite;
    }

    .boss-success-title {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 32px;
      font-weight: 900;
      color: #FFD700;
      margin: 0 0 12px 0;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    }

    .boss-success-subtitle {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 15px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0;
      opacity: 0.9;
      line-height: 1.5;
    }

    .boss-success-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .boss-stat-row {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .boss-stat-label {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 14px;
      font-weight: 600;
      color: #8E8E93;
    }

    .boss-stat-value {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 18px;
      font-weight: 900;
      color: #FFD700;
    }

    .boss-stat-value.green {
      color: #30D158;
    }

    .boss-success-button {
      width: 100%;
      height: 56px;
      background: linear-gradient(135deg, #30D158 0%, #00A83F 100%);
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
      box-shadow: 0 4px 16px rgba(48, 209, 88, 0.4);
      position: relative;
      z-index: 1;
    }

    .boss-success-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(48, 209, 88, 0.6);
    }

    .boss-success-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(48, 209, 88, 0.4);
    }

    @media (max-width: 480px) {
      .boss-success-content {
        padding: 32px 24px;
      }

      .boss-success-emoji {
        font-size: 64px;
      }

      .boss-success-title {
        font-size: 28px;
      }

      .boss-success-subtitle {
        font-size: 14px;
      }

      .boss-stat-row {
        padding: 14px;
      }

      .boss-stat-label {
        font-size: 13px;
      }

      .boss-stat-value {
        font-size: 16px;
      }

      .boss-success-button {
        height: 52px;
        font-size: 15px;
      }
    }
  `;

  // Injecter les styles
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('boss-success-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'boss-success-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);

  const getPerfectText = () => {
    if (errors === 0) return 'Sans Faute !';
    if (errors === 1) return 'Presque Parfait !';
    return 'Bien Joué !';
  };

  return (
    <div className="boss-success-overlay">
      <div className="boss-success-content">
        {/* Confetti particles */}
        <div className="boss-success-confetti">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
        </div>

        {/* Header */}
        <div className="boss-success-header">
          <span className="boss-success-emoji">🏆</span>
          <h2 className="boss-success-title">Victoire !</h2>
          <p className="boss-success-subtitle">
            {getPerfectText()}<br />
            Boss vaincu avec brio !
          </p>
        </div>

        {/* Stats */}
        <div className="boss-success-stats">
          <div className="boss-stat-row">
            <span className="boss-stat-label">Erreurs autorisées</span>
            <span className={`boss-stat-value ${errors === 0 ? 'green' : ''}`}>
              {errors} / {maxErrors}
            </span>
          </div>
          <div className="boss-stat-row">
            <span className="boss-stat-label">XP gagné</span>
            <span className="boss-stat-value">+{xpReward} XP</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="boss-success-button"
          onClick={onCollectXP}
          aria-label="Collecter les XP du boss"
        >
          ⭐ Collecter XP
        </button>
      </div>
    </div>
  );
};

BossSuccessModal.propTypes = {
  errors: PropTypes.number.isRequired,
  maxErrors: PropTypes.number.isRequired,
  xpReward: PropTypes.number.isRequired,
  onCollectXP: PropTypes.func.isRequired
};

export default BossSuccessModal;
