import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DifficultyCard from '../components/difficulty/DifficultyCard';
import useHaptic from '../hooks/useHaptic';
import '../styles/Layout.css';
import '../styles/Difficulty.css';

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

  const handleDifficultySelect = (difficultyValue) => {
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
            difficulty: difficultyValue // Passer la valeur numérique (1, 2, 3)
          }
        });
      }, 300);
    } else {
      navigate('/exercise', {
        state: {
          language: selectedLanguage,
          difficulty: difficultyValue // Passer la valeur numérique (1, 2, 3)
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
      difficulty: 'EASY',
      difficultyValue: 1, // Valeur numérique pour filtrage
      xpInfo: '+10 XP',
      backgroundColor: 'linear-gradient(135deg, #088201 0%, #0AB305 50%, #30D158 100%)'
    },
    {
      id: 'medium',
      difficulty: 'MIDD',
      difficultyValue: 2, // Valeur numérique pour filtrage
      xpInfo: '+20 XP',
      backgroundColor: 'linear-gradient(135deg, #FF6B00 0%, #FF8500 50%, #FF9500 100%)'
    },
    {
      id: 'hard',
      difficulty: 'HARD',
      difficultyValue: 3, // Valeur numérique pour filtrage
      xpInfo: '+30 XP',
      backgroundColor: 'linear-gradient(135deg, #C41E3A 0%, #FF383C 50%, #FF453A 100%)'
    }
  ];

  return (
    <div className="difficulty-container">
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
            xpInfo={diff.xpInfo}
            backgroundColor={diff.backgroundColor}
            onClick={() => handleDifficultySelect(diff.difficultyValue)}
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
