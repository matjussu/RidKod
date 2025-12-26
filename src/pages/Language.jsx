import React from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageCard from '../components/language/LanguageCard';
import useHaptic from '../hooks/useHaptic';
import '../styles/Layout.css';
import '../styles/Language.css';

// Import des icônes
import pythonIcon from '../assets/python_5968350.png';
import htmlIcon from '../assets/html-5_5968267.png';
import cssIcon from '../assets/css-3_5968242.png';
import javaIcon from '../assets/java_5968282.png';
import cppIcon from '../assets/c_6132222.png';
import rIcon from '../assets/R_logo.svg.png';

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
          navigate('/difficulty', { state: { language: language } });
        } else {
          // Pour les autres langages pas encore implémentés
          alert(`${language} sera bientôt disponible !`);
          languageContainer.style.transform = 'scale(1)';
          languageContainer.style.opacity = '1';
        }
      }, 200);
    } else {
      if (language === 'PYTHON') {
        navigate('/difficulty', { state: { language: language } });
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
      name: 'WEB ',
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
    },
    {
      id: 'r',
      name: 'STATS',
      icon: rIcon,
      backgroundColor: 'linear-gradient(135deg, #276DC3 0%, #8A9BA8 100%)',
      isComingSoon: true
    }
  ];

  return (
    <div className="language-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header Section */}
      <div className="header-section">
        <h1 className="page-title">
          <span className="title-hash">//</span>
          Languages
        </h1>
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
