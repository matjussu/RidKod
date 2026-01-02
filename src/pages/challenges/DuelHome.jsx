import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useHaptic from '../../hooks/useHaptic';
import '../../styles/Challenges.css';

const DuelHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerLight } = useHaptic();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleBackClick = () => {
    triggerLight();
    navigate('/challenges');
  };

  const handleBotDuel = () => {
    triggerLight();
    navigate('/challenges/duel/bot');
  };

  const handleCreateDuel = () => {
    triggerLight();
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/challenges/duel/create');
  };

  const handleJoinDuel = () => {
    triggerLight();
    if (!user) {
      navigate('/login');
      return;
    }
    setShowJoinModal(true);
  };

  const handleJoinSubmit = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      setJoinError('Le code doit contenir 6 caractères');
      return;
    }
    triggerLight();
    navigate(`/challenges/duel/join/${code}`);
  };

  // SVG Icons
  const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="mode-icon">
      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="14" r="2" fill="currentColor"/>
      <circle cx="16" cy="14" r="2" fill="currentColor"/>
      <path d="M9 4H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12H1M23 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const FriendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="mode-icon">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 19C3 15.6863 5.68629 13 9 13C10.0736 13 11.0907 13.2417 12 13.6736" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 19C15 16.2386 16.7909 14 19 14C21.2091 14 23 16.2386 23 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const TargetIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="duel-action-icon">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );

  const LinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="duel-action-icon">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="challenges-container">
      {/* Back Button */}
      <button className="challenges-back-button" onClick={handleBackClick} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div className="duel-header">
        <div className="duel-header-glow"></div>
        <h1 className="duel-title">
          <span className="duel-title-accent">{"//"}</span>DUEL
        </h1>
        <p className="duel-subtitle">Affronte un adversaire en temps réel</p>
      </div>

      {/* Modes */}
      <div className="duel-modes-container">
        {/* Bot Duel */}
        <button className="challenge-mode-card bot" onClick={handleBotDuel} style={{ animationDelay: '0.1s' }}>
          <div className="mode-card-glow"></div>
          <div className="mode-icon-container">
            <BotIcon />
          </div>
          <div className="mode-content">
            <div className="mode-title-row">
              <h2 className="mode-title">CONTRE LE BOT</h2>
            </div>
            <p className="mode-description">
              Entraîne-toi contre notre IA. Parfait pour progresser avant d'affronter tes amis !
            </p>
          </div>
          <div className="mode-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </button>

        {/* Divider */}
        <div className="duel-divider">
          <div className="duel-divider-line"></div>
          <span className="duel-divider-text">ou</span>
          <div className="duel-divider-line"></div>
        </div>

        {/* Friend Duel */}
        <div className="challenge-mode-card friend" style={{ animationDelay: '0.2s' }}>
          <div className="mode-card-glow"></div>
          <div className="mode-icon-container">
            <FriendIcon />
          </div>
          <div className="mode-content">
            <div className="mode-title-row">
              <h2 className="mode-title">CONTRE UN AMI</h2>
            </div>
            <p className="mode-description">
              Défie un ami avec un code d'invitation. Qui sera le plus rapide ?
            </p>

            <div className="duel-actions-grid">
              <button className="duel-action-button" onClick={handleCreateDuel}>
                <TargetIcon />
                <span className="duel-action-text">Créer un duel</span>
              </button>
              <button className="duel-action-button" onClick={handleJoinDuel}>
                <LinkIcon />
                <span className="duel-action-text">Rejoindre</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="duel-info-card">
        <p className="duel-info-title">
          <InfoIcon />
          Comment ça marche ?
        </p>
        <p className="duel-info-text">
          Chaque joueur répond aux mêmes 5 questions. Le score est basé sur le temps total : le plus rapide gagne, mais chaque erreur ajoute 10 secondes de pénalité !
        </p>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="duel-modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="duel-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="duel-modal-title">Rejoindre un duel</h2>
            <p className="duel-modal-subtitle">Entre le code à 6 caractères</p>

            <input
              type="text"
              className="duel-code-input"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.slice(0, 6));
                setJoinError('');
              }}
              placeholder="XXXXXX"
              maxLength={6}
              autoFocus
            />

            {joinError && <p className="duel-modal-error">{joinError}</p>}

            <div className="duel-modal-actions">
              <button
                className="duel-modal-button cancel"
                onClick={() => setShowJoinModal(false)}
              >
                Annuler
              </button>
              <button
                className="duel-modal-button join"
                onClick={handleJoinSubmit}
              >
                Rejoindre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuelHome;
