import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DifficultyCard from '../components/difficulty/DifficultyCard';
import useHaptic from '../hooks/useHaptic';

const Difficulty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerLight, triggerSuccess } = useHaptic();
  const [selectedLanguage, setSelectedLanguage] = useState('PYTHON');

  // Récupérer le langage sélectionné depuis la navigation
  useEffect(() => {
    if (location.state?.language) {
      setSelectedLanguage(location.state.language);
    }
  }, [location.state]);

  const handleDifficultySelect = (difficulty) => {
    triggerSuccess();

    // Animation de sortie élégante
    const difficultyContainer = document.querySelector('.difficulty-container');
    if (difficultyContainer) {
      difficultyContainer.style.transform = 'scale(0.95)';
      difficultyContainer.style.opacity = '0';

      setTimeout(() => {
        navigate('/exercise', {
          state: {
            language: selectedLanguage,
            difficulty: difficulty
          }
        });
      }, 300);
    } else {
      navigate('/exercise', {
        state: {
          language: selectedLanguage,
          difficulty: difficulty
        }
      });
    }
  };

  const handleBack = () => {
    triggerLight();

    // Animation de sortie élégante
    const difficultyContainer = document.querySelector('.difficulty-container');
    if (difficultyContainer) {
      difficultyContainer.style.transform = 'scale(0.95)';
      difficultyContainer.style.opacity = '0';

      setTimeout(() => {
        navigate('/language');
      }, 200);
    } else {
      navigate('/language');
    }
  };

  // Configuration des niveaux de difficulté
  const difficulties = [
    {
      id: 'easy',
      difficulty: 'FACILE',
      icon: '🌱',
      description: 'Parfait pour débuter et comprendre les bases',
      xpInfo: '+10 XP par exercice',
      backgroundColor: 'linear-gradient(135deg, #088201 0%, #0AB305 50%, #30D158 100%)'
    },
    {
      id: 'medium',
      difficulty: 'MOYEN',
      icon: '🔥',
      description: 'Challenge équilibré pour progresser rapidement',
      xpInfo: '+20 XP par exercice',
      backgroundColor: 'linear-gradient(135deg, #FF6B00 0%, #FF8500 50%, #FF9500 100%)'
    },
    {
      id: 'hard',
      difficulty: 'DIFFICILE',
      icon: '💎',
      description: 'Pour experts cherchant un défi intense',
      xpInfo: '+30 XP par exercice',
      backgroundColor: 'linear-gradient(135deg, #C41E3A 0%, #FF383C 50%, #FF453A 100%)'
    }
  ];

  return (
    <div className="difficulty-container">
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

        .difficulty-container {
          height: 100vh;
          height: -webkit-fill-available;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: max(env(safe-area-inset-top), 20px);
          padding-left: max(20px, env(safe-area-inset-left));
          padding-right: max(20px, env(safe-area-inset-right));
          padding-bottom: max(env(safe-area-inset-bottom), 40px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          opacity: 0;
          transform: scale(1.05);
          animation: fadeInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Back Button */
        .back-button {
          position: absolute;
          top: max(env(safe-area-inset-top), 8px);
          left: max(20px, env(safe-area-inset-left));
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .back-button:active {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(0.95);
        }

        .back-button svg {
          color: #FFFFFF;
          width: 24px;
          height: 24px;
        }

        /* Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 40px;
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
        }

        .page-title {
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
        }

        .title-bracket {
          color: #FF9500;
          font-weight: 800;
          font-size: 26px;
        }

        .page-subtitle {
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 8px 0 0 0;
          line-height: 1.2;
        }

        .subtitle-bracket {
          color: #088201;
          font-weight: 800;
          font-size: 20px;
        }


        /* Difficulties Grid */
        .difficulties-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        /* Staggered animation for cards */
        .difficulties-grid > *:nth-child(1) {
          animation-delay: 0.5s;
        }

        .difficulties-grid > *:nth-child(2) {
          animation-delay: 0.6s;
        }

        .difficulties-grid > *:nth-child(3) {
          animation-delay: 0.7s;
        }


        /* Footer */
        .footer {
          position: absolute;
          bottom: max(env(safe-area-inset-bottom), 20px);
          color: #8E8E93;
          font-size: 22px;
          font-weight: 400;
          text-align: center;
          font-family: "Jersey 25", cursive;
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s forwards;
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* iPhone 14/15 Pro Max */
        @media (max-width: 430px) {
          .difficulty-container {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }

          .back-button {
            left: max(18px, env(safe-area-inset-left));
          }
        }

        /* iPhone 14/15 Pro */
        @media (max-width: 393px) {
          .difficulty-container {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }

          .back-button {
            left: max(16px, env(safe-area-inset-left));
          }
        }

        /* iPhone SE, iPhone 12/13 mini - 375px */
        @media (max-width: 375px) {
          .difficulty-container {
            padding-left: max(14px, env(safe-area-inset-left));
            padding-right: max(14px, env(safe-area-inset-right));
            padding-top: max(env(safe-area-inset-top), 16px);
          }

          .back-button {
            left: max(14px, env(safe-area-inset-left));
            top: max(env(safe-area-inset-top), 6px);
            padding: 10px;
          }

          .back-button svg {
            width: 22px;
            height: 22px;
          }

          .page-title {
            font-size: 22px;
          }

          .title-bracket {
            font-size: 24px;
          }

          .page-subtitle {
            font-size: 16px;
          }

          .subtitle-bracket {
            font-size: 18px;
          }

          .difficulties-grid {
            gap: 18px;
          }
        }

        /* Très petits écrans - iPhone SE 1ère gen */
        @media (max-width: 320px) {
          .difficulty-container {
            padding-left: max(12px, env(safe-area-inset-left));
            padding-right: max(12px, env(safe-area-inset-right));
            padding-top: max(env(safe-area-inset-top), 14px);
          }

          .back-button {
            left: max(12px, env(safe-area-inset-left));
            top: max(env(safe-area-inset-top), 4px);
            padding: 8px;
          }

          .back-button svg {
            width: 20px;
            height: 20px;
          }

          .page-title {
            font-size: 20px;
          }

          .title-bracket {
            font-size: 22px;
          }

          .page-subtitle {
            font-size: 15px;
          }

          .subtitle-bracket {
            font-size: 17px;
          }

          .difficulties-grid {
            gap: 16px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .back-button {
            top: max(env(safe-area-inset-top), 6px);
            padding: 8px;
          }

          .back-button svg {
            width: 20px;
            height: 20px;
          }

          .page-title {
            font-size: 20px;
          }

          .title-bracket {
            font-size: 22px;
          }

          .page-subtitle {
            font-size: 15px;
          }

          .subtitle-bracket {
            font-size: 17px;
          }

          .difficulties-grid {
            gap: 16px;
          }
        }

        /* Fix Safari iOS et WebKit */
        @supports (-webkit-touch-callout: none) {
          .difficulty-container {
            height: -webkit-fill-available;
            min-height: -webkit-fill-available;
          }

          body {
            height: -webkit-fill-available;
          }
        }

        /* Optimisations touch iOS */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        button, input, textarea {
          -webkit-user-select: text;
        }

        /* Fix zoom iOS */
        input, textarea, select {
          font-size: 16px;
        }

        /* Prevent overscroll bounce */
        body {
          overscroll-behavior-y: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* Back Button */}
      <button className="back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header Section */}
      <div className="header-section">
        <h1 className="page-title">
          <span className="title-bracket">{"<"}</span>
          Choisis
          <span className="title-bracket">{"/"}</span>
        </h1>
        <h2 className="page-subtitle">
          <span className="subtitle-bracket">{"/"}</span>
          Ta difficulté
          <span className="subtitle-bracket">{">"}</span>
        </h2>
      </div>

      {/* Difficulties Grid */}
      <div className="difficulties-grid">
        {difficulties.map((diff) => (
          <DifficultyCard
            key={diff.id}
            difficulty={diff.difficulty}
            icon={diff.icon}
            description={diff.description}
            xpInfo={diff.xpInfo}
            backgroundColor={diff.backgroundColor}
            onClick={() => handleDifficultySelect(diff.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="footer">
        By M/E
      </div>
    </div>
  );
};

export default Difficulty;
