import React from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageCard from '../components/language/LanguageCard';
import useHaptic from '../hooks/useHaptic';

// Import des icônes
import pythonIcon from '../assets/python_5968350.png';
import htmlIcon from '../assets/html-5_5968267.png';
import cssIcon from '../assets/css-3_5968242.png';
import javaIcon from '../assets/java_5968282.png';
import cppIcon from '../assets/c_6132222.png';

const Language = () => {
  const navigate = useNavigate();
  const { triggerLight, triggerSuccess } = useHaptic();

  const handleLanguageSelect = (language) => {
    triggerSuccess();

    // Animation de sortie élégante
    const languageContainer = document.querySelector('.language-container');
    if (languageContainer) {
      languageContainer.style.transform = 'scale(0.95)';
      languageContainer.style.opacity = '0';

      setTimeout(() => {
        if (language === 'PYTHON') {
          navigate('/exercise');
        } else {
          // Pour les autres langages pas encore implémentés
          alert(`${language} sera bientôt disponible !`);
          languageContainer.style.transform = 'scale(1)';
          languageContainer.style.opacity = '1';
        }
      }, 200);
    } else {
      if (language === 'PYTHON') {
        navigate('/exercise');
      }
    }
  };

  const handleBack = () => {
    triggerLight();

    // Animation de sortie élégante
    const languageContainer = document.querySelector('.language-container');
    if (languageContainer) {
      languageContainer.style.transform = 'scale(0.95)';
      languageContainer.style.opacity = '0';

      setTimeout(() => {
        navigate('/');
      }, 200);
    } else {
      navigate('/');
    }
  };

  // Configuration des langages
  const languages = [
    {
      id: 'python',
      name: 'PYTHON',
      icon: pythonIcon,
      backgroundColor: 'linear-gradient(135deg, #0A3860 30%, #FFD43B 100%)',
      isComingSoon: false
    },
    {
      id: 'web',
      name: 'WEB',
      icon: htmlIcon,
      backgroundColor: 'linear-gradient(135deg, #E34F26 0%, #F16529 50%, #FF9500 100%)',
      isComingSoon: true
    },
    {
      id: 'java',
      name: 'JAVA',
      icon: javaIcon,
      backgroundColor: 'linear-gradient(135deg, #4B2200 70%, #5382A1 100%)',
      isComingSoon: true
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: cppIcon,
      backgroundColor: 'linear-gradient(135deg, #00599C 0%, #004482 100%)',
      isComingSoon: true
    }
  ];

  return (
    <div className="language-container">
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

        .language-container {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: max(env(safe-area-inset-top), 20px);
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
          padding-bottom: max(env(safe-area-inset-bottom), 125px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
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
          left: max(16px, env(safe-area-inset-left));
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
          margin-top: 60px;
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

        /* Languages Grid */
        .languages-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 150%;
          max-width: 105%;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        /* Footer */
        .footer {
          margin-top: auto;
          padding-top: 20px;
          color: #8E8E93;
          font-size: 22px;
          font-weight: 400;
          text-align: center;
          font-family: "Jersey 25", cursive;
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
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
          .language-container {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }

          .back-button {
            left: max(18px, env(safe-area-inset-left));
          }
        }

        /* iPhone 14/15 Pro */
        @media (max-width: 393px) {
          .language-container {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }

          .back-button {
            left: max(16px, env(safe-area-inset-left));
          }
        }

        /* iPhone SE, iPhone 12/13 mini - 375px */
        @media (max-width: 375px) {
          .language-container {
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

          .header-section {
            margin-top: 55px;
            margin-bottom: 35px;
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

          .languages-grid {
            gap: 14px;
          }
        }

        /* Très petits écrans - iPhone SE 1ère gen */
        @media (max-width: 320px) {
          .language-container {
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

          .header-section {
            margin-top: 50px;
            margin-bottom: 30px;
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

          .languages-grid {
            gap: 12px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .header-section {
            margin-top: 40px;
            margin-bottom: 25px;
          }

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

          .languages-grid {
            gap: 12px;
            margin-bottom: 15px;
          }
        }

        /* Fix Safari iOS et WebKit */
        @supports (-webkit-touch-callout: none) {
          .language-container {
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
          Choisi
          <span className="title-bracket">{"/"}</span>
        </h1>
        <h2 className="page-subtitle">
          <span className="subtitle-bracket">{"/"}</span>
          Un langage
          <span className="subtitle-bracket">{">"}</span>
        </h2>
      </div>

      {/* Languages Grid */}
      <div className="languages-grid">
        {languages.map((lang) => (
          <LanguageCard
            key={lang.id}
            language={lang.name}
            icon={lang.icon}
            backgroundColor={lang.backgroundColor}
            isComingSoon={lang.isComingSoon}
            onClick={() => handleLanguageSelect(lang.name)}
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

export default Language;