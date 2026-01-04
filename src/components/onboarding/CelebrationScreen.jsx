import React, { useEffect, useState } from 'react';
import useHaptic from '../../hooks/useHaptic';
import MascotHappy from '../common/MascotHappy';
import longLogo from '../../assets/long_logo.png';

/**
 * CelebrationScreen - Écran final avec récap complet et mascotte
 * Props:
 * - username: string
 * - experienceLevel: string
 * - primaryGoal: string
 * - preferredLanguages: string[]
 * - dailyGoalMinutes: number
 * - onStart: function
 */
const CelebrationScreen = ({
  username,
  experienceLevel,
  primaryGoal,
  preferredLanguages,
  dailyGoalMinutes,
  onStart
}) => {
  const { triggerSuccess } = useHaptic();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
      triggerSuccess();
    }, 300);

    return () => clearTimeout(timer);
  }, [triggerSuccess]);

  // Labels pour le récap
  const experienceLabels = {
    beginner: 'Débutant',
    junior: 'Junior',
    intermediate: 'Confirmé',
    expert: 'Expert'
  };

  const goalLabels = {
    learn_language: 'Apprendre un langage',
    read_code: 'Mieux lire le code',
    code_reviews: 'Code reviews',
    audit_ai: "Comprendre l'IA",
    curiosity: 'Curiosité'
  };

  const languageLabels = {
    python: 'Python',
    web: 'Web',
    java: 'Java',
    cpp: 'C++',
    stats: 'Stats'
  };

  const timeLabels = {
    0: 'Je découvre',
    5: '5 min/jour',
    10: '10 min/jour',
    15: '15+ min/jour'
  };

  return (
    <div className="celebration-screen">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="celebration-confetti" aria-hidden="true">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                '--delay': `${Math.random() * 2}s`,
                '--x': `${Math.random() * 100}%`,
                '--rotate': `${Math.random() * 720}deg`,
                '--color': ['#30D158', '#FF9500', '#0A84FF', '#FF453A', '#FFD60A'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="celebration-content">
        {/* Logo */}
        <div className="celebration-logo">
          <img src={longLogo} alt="ReadKode Logo" />
        </div>

        {/* Mascotte */}
        <div className="celebration-mascot">
          <MascotHappy size={100} />
        </div>

        <h1 className="celebration-title">
          Bienvenue {username} !
        </h1>

        {/* Récap stylisé */}
        <div className="celebration-recap">
          <div className="celebration-recap-item">
            <span className="celebration-recap-icon">🎯</span>
            <div className="celebration-recap-text">
              <span className="celebration-recap-label">Niveau</span>
              <span className="celebration-recap-value">{experienceLabels[experienceLevel] || experienceLevel}</span>
            </div>
          </div>

          <div className="celebration-recap-item">
            <span className="celebration-recap-icon">🚀</span>
            <div className="celebration-recap-text">
              <span className="celebration-recap-label">Objectif</span>
              <span className="celebration-recap-value">{goalLabels[primaryGoal] || primaryGoal}</span>
            </div>
          </div>

          <div className="celebration-recap-item">
            <span className="celebration-recap-icon">💻</span>
            <div className="celebration-recap-text">
              <span className="celebration-recap-label">Langages</span>
              <span className="celebration-recap-value">
                {preferredLanguages?.map(lang => languageLabels[lang] || lang).join(', ') || 'Aucun'}
              </span>
            </div>
          </div>

          <div className="celebration-recap-item">
            <span className="celebration-recap-icon">⏰</span>
            <div className="celebration-recap-text">
              <span className="celebration-recap-label">Rythme</span>
              <span className="celebration-recap-value">{timeLabels[dailyGoalMinutes] || `${dailyGoalMinutes} min/jour`}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="celebration-start-button"
          onClick={onStart}
        >
          COMMENCER
        </button>
      </div>
    </div>
  );
};

export default React.memo(CelebrationScreen);
