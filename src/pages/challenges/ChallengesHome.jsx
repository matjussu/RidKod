import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useHaptic from '../../hooks/useHaptic';
import { getChallengeStats, getLocalChallengeStats } from '../../services/challengeStatsService';
import '../../styles/Challenges.css';

const ChallengesHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerLight } = useHaptic();

  const [stats, setStats] = useState({
    duelsWon: 0,
    dailyChallengesCompleted: 0,
    rank: null
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        if (user?.uid) {
          const result = await getChallengeStats(user.uid);
          if (result.success) {
            setStats(result.stats);
          }
        } else {
          // Utilisateur non connecté - stats locales
          const localStats = getLocalChallengeStats();
          setStats(localStats);
        }
      } catch (error) {
        console.error('Error loading challenge stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [user]);

  const handleBackClick = () => {
    triggerLight();
    navigate('/home');
  };

  const handleModeClick = (mode) => {
    triggerLight();
    if (mode === 'leaderboard') {
      navigate('/challenges/leaderboard');
    } else if (mode === 'daily') {
      navigate('/challenges/daily');
    } else if (mode === 'duel') {
      navigate('/challenges/duel');
    }
  };

  const modes = [
    {
      id: 'duel',
      title: 'DUEL',
      subtitle: '1 vs 1',
      description: 'Affronte un adversaire en temps réel. Le plus rapide gagne !',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="mode-icon">
          <path d="M12 24L24 12L36 24L24 36L12 24Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M6 24H12M36 24H42M24 6V12M24 36V42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      status: 'available',
      accentClass: 'duel'
    },
    {
      id: 'daily',
      title: 'DÉFI DU JOUR',
      subtitle: null,
      description: 'Un nouveau challenge chaque jour. Compare tes scores !',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="mode-icon">
          <rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M16 8V14M32 8V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M8 22H40" stroke="currentColor" strokeWidth="2.5"/>
          <circle cx="24" cy="31" r="5" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M24 29V32L26 33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      status: 'available',
      accentClass: 'daily'
    },
    {
      id: 'leaderboard',
      title: 'CLASSEMENT',
      subtitle: 'Global',
      description: 'Grimpe dans le classement et deviens le meilleur !',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="mode-icon">
          <rect x="6" y="28" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
          <rect x="19" y="18" width="10" height="24" rx="2" stroke="currentColor" strokeWidth="2.5"/>
          <rect x="32" y="24" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M24 8L26 12H22L24 8Z" fill="currentColor"/>
          <circle cx="24" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      status: 'available',
      accentClass: 'leaderboard'
    }
  ];

  return (
    <div className="challenges-container">
      {/* Back Button */}
      <button className="challenges-back-button" onClick={handleBackClick} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header Section avec style Arena */}
      <div className="challenges-header">
        <div className="challenges-header-glow"></div>
        <div className="challenges-title-wrapper">
          <h1 className="challenges-title">
            <span className="challenges-title-accent">{"//"}</span>
            CHALLENGES
          </h1>
        </div>
        <div className="challenges-title-divider"></div>
        <p className="challenges-subtitle">
          Prouve ta maîtrise du code face aux autres
        </p>
      </div>

      {/* Modes Grid */}
      <div className="challenges-modes-grid">
        {modes.map((mode, index) => (
          <button
            key={mode.id}
            className={`challenge-mode-card ${mode.accentClass}`}
            onClick={() => handleModeClick(mode.id)}
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            {/* Glow Effect */}
            <div className="mode-card-glow"></div>

            {/* Icon Container */}
            <div className="mode-icon-container">
              {mode.icon}
            </div>

            {/* Content */}
            <div className="mode-content">
              <div className="mode-title-row">
                <h2 className="mode-title">{mode.title}</h2>
                {mode.subtitle && <span className="mode-subtitle">{mode.subtitle}</span>}
              </div>
              <p className="mode-description">{mode.description}</p>
            </div>

            {/* Status Badge */}
            {mode.status === 'coming_soon' && (
              <div className="mode-status-badge">
                <span className="status-dot"></span>
                Bientôt
              </div>
            )}

            {/* Arrow */}
            <div className="mode-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Stats Preview */}
      <div className="challenges-stats-preview">
        <div className="stats-preview-title">
          Tes statistiques
        </div>
        <div className="stats-preview-grid">
          <div className="stat-item">
            <span className="stat-value">
              {loadingStats ? '-' : stats.duelsWon}
            </span>
            <span className="stat-label">Duels gagnés</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {loadingStats ? '-' : stats.dailyChallengesCompleted}
            </span>
            <span className="stat-label">Défis complétés</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {loadingStats ? '-' : (stats.rank ? `#${stats.rank}` : '--')}
            </span>
            <span className="stat-label">Classement</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChallengesHome;
