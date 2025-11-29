import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/long_logo.png';
import WelcomeAnimation from '../components/welcome/WelcomeAnimation';

const Welcome = () => {
  const navigate = useNavigate();
  const { skipAuth } = useAuth();

  // Check if user has seen the animation
  const [showAnimation, setShowAnimation] = useState(() => {
    return !localStorage.getItem('hasSeenWelcomeAnimation');
  });

  // Transition state for smooth fade
  const [isTransitioning, setIsTransitioning] = useState(true);

  const handleAnimationComplete = () => {
    localStorage.setItem('hasSeenWelcomeAnimation', 'true');

    // Trigger smooth transition
    setIsTransitioning(true);

    // Delay hiding animation to allow fade out
    setTimeout(() => {
      setShowAnimation(false);
      // Keep isTransitioning true for Welcome fade in animations
    }, 100);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSkip = () => {
    skipAuth();
    navigate('/home');
  };

  return (
    <div className="welcome-wrapper">
      {/* Show animation on first visit */}
      {showAnimation && (
        <WelcomeAnimation onComplete={handleAnimationComplete} />
      )}

      {/* Welcome content - fades in after animation */}
      {!showAnimation && (
        <div className={`welcome-container ${isTransitioning ? 'transitioning' : ''}`}>
          <style>{`
        /* Reset global */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          touch-action: manipulation;
        }

        /* Wrapper with persistent background for smooth transition */
        .welcome-wrapper {
          position: fixed;
          inset: 0;
          background: #1A1919;
        }

        .welcome-container {
          height: 100vh;
          height: 100%;
          min-height: 100vh;
          min-height: -webkit-fill-available;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding-top: max(env(safe-area-inset-top), 60px);
          padding-left: max(20px, env(safe-area-inset-left));
          padding-right: max(20px, env(safe-area-inset-right));
          padding-bottom: max(env(safe-area-inset-bottom), 40px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
          opacity: 0;
          transform: translateY(20px);
        }

        /* Smooth fade in animation when transitioning from logo */
        .welcome-container.transitioning {
          animation: smoothFadeIn 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes smoothFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Top Section */
        .welcome-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        /* Logo container - Stagger delay: 0ms */
        .welcome-logo-container {
          width: 280px;
          height: auto;
          margin-bottom: 40px;
          opacity: 0;
          transform: scale(0.9);
          animation: scaleIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0ms forwards;
        }

        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        .welcome-logo-container img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .welcome-title {
          font-family: "JetBrains Mono", monospace;
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }

        .welcome-title-bracket {
          color: #FF9500;
          font-size: 30px;
        }

        .welcome-subtitle {
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 600;
          color: #8E8E93;
          line-height: 1.5;
          max-width: 320px;
          margin: 0 auto;
        }

        /* Buttons Section - Stagger delay: 300ms */
        .welcome-buttons {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 300ms forwards;
        }

        /* Primary Button (Signup) */
        .welcome-button-primary {
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          border-radius: 16px;
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: none;
          font-family: "JetBrains Mono", monospace;
          font-weight: 800;
          font-size: 16px;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 20px rgba(48, 209, 88, 0.3);
          position: relative;
          overflow: hidden;
        }

        .welcome-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(48, 209, 88, 0.4);
        }

        .welcome-button-primary:active {
          transform: scale(0.98);
        }

        /* Secondary Button (Login) */
        .welcome-button-secondary {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border-radius: 16px;
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: "JetBrains Mono", monospace;
          font-weight: 800;
          font-size: 16px;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .welcome-button-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .welcome-button-secondary:active {
          transform: scale(0.98);
        }

        /* Skip Button - Stagger delay: 450ms */
        .welcome-skip {
          background: none;
          border: none;
          cursor: pointer;
          padding: 16px;
          font-family: "JetBrains Mono", monospace;
          font-weight: 600;
          font-size: 14px;
          color: #8E8E93;
          text-align: center;
          transition: all 0.2s ease;
          opacity: 0;
          animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 450ms forwards;
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .welcome-skip:hover {
          color: #FFFFFF;
        }

        .welcome-skip:active {
          transform: scale(0.95);
        }

        /* Responsive */
        @media (max-width: 375px) {
          .welcome-container {
            padding-top: max(env(safe-area-inset-top), 50px);
            padding-bottom: max(env(safe-area-inset-bottom), 30px);
          }

          .welcome-logo-container {
            width: 240px;
            margin-bottom: 30px;
          }

          .welcome-text {
            margin-bottom: 50px;
          }

          .welcome-title {
            font-size: 24px;
          }

          .welcome-title-bracket {
            font-size: 26px;
          }

          .welcome-subtitle {
            font-size: 14px;
            max-width: 280px;
          }

          .welcome-button-primary,
          .welcome-button-secondary {
            height: 52px;
            font-size: 15px;
          }

          .welcome-skip {
            font-size: 13px;
          }
        }

        @media (max-width: 320px) {
          .welcome-logo-container {
            width: 220px;
            margin-bottom: 25px;
          }

          .welcome-title {
            font-size: 22px;
          }

          .welcome-title-bracket {
            font-size: 24px;
          }

          .welcome-subtitle {
            font-size: 13px;
          }

          .welcome-button-primary,
          .welcome-button-secondary {
            height: 50px;
            font-size: 14px;
          }
        }

        /* Fix Safari iOS */
        @supports (-webkit-touch-callout: none) {
          .welcome-container {
            height: -webkit-fill-available;
            min-height: -webkit-fill-available;
          }
        }

        /* Accessibility: Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .welcome-container,
          .welcome-logo-container,
          .welcome-text,
          .welcome-buttons,
          .welcome-skip {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>

      {/* Top Section */}
      <div className="welcome-top">
        {/* Logo */}
        <div className="welcome-logo-container">
          <img src={logoImage} alt="ReadCod Logo" />
        </div>

        {/* Welcome Text */}
        <div className="welcome-text">
          <p className="welcome-subtitle">
            Apprends à lire du code comme un pro. Sauvegarde ta progression et accède à ton profil partout.
          </p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="welcome-buttons">
        <button className="welcome-button-primary" onClick={handleSignup}>
          Créer un compte
        </button>

        <button className="welcome-button-secondary" onClick={handleLogin}>
          Se connecter
        </button>

        <button className="welcome-skip" onClick={handleSkip}>
          Continuer sans compte
        </button>
      </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
