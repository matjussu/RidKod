import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useHaptic from '../../hooks/useHaptic';

const BossGameOverModal = ({ errors, maxErrors, onRetry }) => {
  const { triggerError } = useHaptic();

  useEffect(() => {
    triggerError();
  }, [triggerError]);

  const styles = `
    @keyframes gameOverFadeIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes skullShake {
      0%, 100% { transform: rotate(0deg); }
      10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
      20%, 40%, 60%, 80% { transform: rotate(5deg); }
    }

    @keyframes redPulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(255, 69, 58, 0.4);
      }
      50% {
        box-shadow: 0 0 40px rgba(255, 69, 58, 0.7);
      }
    }

    .boss-gameover-overlay {
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
      animation: gameOverFadeIn 0.5s ease-out;
    }

    .boss-gameover-content {
      background: linear-gradient(135deg, #2C2C2E 0%, #0F0F12 100%);
      border-radius: 24px;
      padding: 40px 32px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      border: 2px solid rgba(255, 69, 58, 0.3);
      position: relative;
      overflow: hidden;
      animation: redPulse 2s ease-in-out infinite;
    }

    .boss-gameover-header {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .boss-gameover-emoji {
      font-size: 80px;
      margin-bottom: 16px;
      display: block;
      animation: skullShake 0.5s ease-in-out 0.5s;
    }

    .boss-gameover-title {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 32px;
      font-weight: 900;
      color: #FF453A;
      margin: 0 0 12px 0;
      text-shadow: 0 0 20px rgba(255, 69, 58, 0.6);
    }

    .boss-gameover-subtitle {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 15px;
      font-weight: 600;
      color: #8E8E93;
      margin: 0;
      line-height: 1.5;
    }

    .boss-gameover-stats {
      background: rgba(255, 69, 58, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
      border: 1px solid rgba(255, 69, 58, 0.2);
      text-align: center;
    }

    .boss-gameover-stats-label {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 14px;
      font-weight: 600;
      color: #8E8E93;
      margin-bottom: 8px;
    }

    .boss-gameover-stats-value {
      font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
      font-size: 28px;
      font-weight: 900;
      color: #FF453A;
    }

    .boss-gameover-button {
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

    .boss-gameover-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 149, 0, 0.6);
    }

    .boss-gameover-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(255, 149, 0, 0.4);
    }

    @media (max-width: 480px) {
      .boss-gameover-content {
        padding: 32px 24px;
      }

      .boss-gameover-emoji {
        font-size: 64px;
      }

      .boss-gameover-title {
        font-size: 28px;
      }

      .boss-gameover-subtitle {
        font-size: 14px;
      }

      .boss-gameover-stats {
        padding: 16px;
      }

      .boss-gameover-stats-value {
        font-size: 24px;
      }

      .boss-gameover-button {
        height: 52px;
        font-size: 15px;
      }
    }
  `;

  // Injecter les styles
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('boss-gameover-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'boss-gameover-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div className="boss-gameover-overlay">
      <div className="boss-gameover-content">
        {/* Header */}
        <div className="boss-gameover-header">
          <span className="boss-gameover-emoji">💀</span>
          <h2 className="boss-gameover-title">Game Over</h2>
          <p className="boss-gameover-subtitle">
            Le boss était trop fort...<br />
            Mais tu peux réessayer !
          </p>
        </div>

        {/* Stats */}
        <div className="boss-gameover-stats">
          <div className="boss-gameover-stats-label">Trop d'rreurs commises</div>
          <div className="boss-gameover-stats-value">
            {errors} / {maxErrors}
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="boss-gameover-button"
          onClick={onRetry}
          aria-label="Réessayer le boss fight"
        >
          🔄 Réessayer
        </button>
      </div>
    </div>
  );
};

BossGameOverModal.propTypes = {
  errors: PropTypes.number.isRequired,
  maxErrors: PropTypes.number.isRequired,
  onRetry: PropTypes.func.isRequired
};

export default BossGameOverModal;
