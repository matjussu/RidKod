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

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0D0D0F',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'max(calc(env(safe-area-inset-top) + 20px), 40px)',
      paddingLeft: 'max(20px, env(safe-area-inset-left))',
      paddingRight: 'max(20px, env(safe-area-inset-right))',
      paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
      maxWidth: 'min(428px, 100vw)',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    },
    backButton: {
      position: 'absolute',
      top: 'max(calc(env(safe-area-inset-top) + 16px), 32px)',
      left: '20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      zIndex: 10,
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      marginTop: '20px',
    },
    headerIcon: {
      fontSize: '56px',
      display: 'block',
      marginBottom: '16px',
    },
    headerTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '28px',
      fontWeight: 900,
      color: '#FFFFFF',
      margin: '0 0 8px 0',
    },
    headerSubtitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
    },
    modesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '32px',
    },
    modeCard: {
      background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.9) 0%, rgba(20, 20, 25, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    modeCardBot: {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    modeCardFriend: {
      borderColor: 'rgba(6, 182, 212, 0.3)',
    },
    modeCardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      opacity: 0.1,
      pointerEvents: 'none',
    },
    modeCardGlowBot: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    },
    modeCardGlowFriend: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)',
    },
    modeHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '12px',
      position: 'relative',
      zIndex: 1,
    },
    modeIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
    },
    modeIconBot: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
    },
    modeIconFriend: {
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
    },
    modeTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '18px',
      fontWeight: 800,
      color: '#FFFFFF',
      margin: 0,
    },
    modeTitleBot: {
      color: '#A78BFA',
    },
    modeTitleFriend: {
      color: '#22D3EE',
    },
    modeDescription: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
      lineHeight: 1.5,
      position: 'relative',
      zIndex: 1,
    },
    modeArrow: {
      position: 'absolute',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      opacity: 0.5,
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      margin: '8px 0',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    friendActions: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    friendButton: {
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '14px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    friendButtonIcon: {
      fontSize: '24px',
    },
    friendButtonText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '13px',
      fontWeight: 600,
      color: '#22D3EE',
    },
    infoCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '14px',
      padding: '16px',
      marginTop: 'auto',
    },
    infoTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.5)',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    infoText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.4)',
      margin: 0,
      lineHeight: 1.5,
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modal: {
      background: 'linear-gradient(135deg, #1A1A1F 0%, #0D0D0F 100%)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '24px',
      padding: '32px 24px',
      maxWidth: '340px',
      width: '100%',
      textAlign: 'center',
    },
    modalTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '20px',
      fontWeight: 800,
      color: '#FFFFFF',
      margin: '0 0 8px 0',
    },
    modalSubtitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.5)',
      margin: '0 0 24px 0',
    },
    codeInput: {
      width: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '2px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '24px',
      fontWeight: 700,
      color: '#22D3EE',
      textAlign: 'center',
      letterSpacing: '8px',
      textTransform: 'uppercase',
      outline: 'none',
      boxSizing: 'border-box',
    },
    errorText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: '#FF453A',
      margin: '8px 0 0 0',
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    modalButton: {
      flex: 1,
      padding: '14px',
      borderRadius: '12px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
    },
    modalButtonCancel: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    modalButtonJoin: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)',
      color: '#FFFFFF',
    },
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button style={styles.backButton} onClick={handleBackClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>{"⚔️"}</span>
        <h1 style={styles.headerTitle}>Mode Duel</h1>
        <p style={styles.headerSubtitle}>Affronte un adversaire en temps réel</p>
      </div>

      {/* Modes */}
      <div style={styles.modesContainer}>
        {/* Bot Duel */}
        <button
          style={{ ...styles.modeCard, ...styles.modeCardBot }}
          onClick={handleBotDuel}
        >
          <div style={{ ...styles.modeCardGlow, ...styles.modeCardGlowBot }}></div>
          <div style={styles.modeHeader}>
            <div style={{ ...styles.modeIcon, ...styles.modeIconBot }}>
              {"🤖"}
            </div>
            <h2 style={{ ...styles.modeTitle, ...styles.modeTitleBot }}>
              Contre le Bot
            </h2>
          </div>
          <p style={styles.modeDescription}>
            Entraîne-toi contre notre IA. Parfait pour t'améliorer avant d'affronter tes amis !
          </p>
          <div style={styles.modeArrow}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>ou</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Friend Duel */}
        <div style={{ ...styles.modeCard, ...styles.modeCardFriend }}>
          <div style={{ ...styles.modeCardGlow, ...styles.modeCardGlowFriend }}></div>
          <div style={styles.modeHeader}>
            <div style={{ ...styles.modeIcon, ...styles.modeIconFriend }}>
              {"👥"}
            </div>
            <h2 style={{ ...styles.modeTitle, ...styles.modeTitleFriend }}>
              Contre un ami
            </h2>
          </div>
          <p style={styles.modeDescription}>
            Défie un ami avec un code d'invitation. Qui sera le plus rapide ?
          </p>

          <div style={{ ...styles.friendActions, marginTop: '16px' }}>
            <button style={styles.friendButton} onClick={handleCreateDuel}>
              <span style={styles.friendButtonIcon}>{"🎯"}</span>
              <span style={styles.friendButtonText}>Créer un duel</span>
            </button>
            <button style={styles.friendButton} onClick={handleJoinDuel}>
              <span style={styles.friendButtonIcon}>{"🔗"}</span>
              <span style={styles.friendButtonText}>Rejoindre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div style={styles.infoCard}>
        <p style={styles.infoTitle}>
          <span>{"💡"}</span> Comment ça marche ?
        </p>
        <p style={styles.infoText}>
          Chaque joueur répond aux mêmes 5 questions. Le score est basé sur la rapidité et la précision. Le plus rapide avec le meilleur score gagne !
        </p>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div style={styles.modalOverlay} onClick={() => setShowJoinModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Rejoindre un duel</h2>
            <p style={styles.modalSubtitle}>Entre le code à 6 caractères</p>

            <input
              type="text"
              style={styles.codeInput}
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.slice(0, 6));
                setJoinError('');
              }}
              placeholder="XXXXXX"
              maxLength={6}
              autoFocus
            />

            {joinError && <p style={styles.errorText}>{joinError}</p>}

            <div style={styles.modalActions}>
              <button
                style={{ ...styles.modalButton, ...styles.modalButtonCancel }}
                onClick={() => setShowJoinModal(false)}
              >
                Annuler
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.modalButtonJoin }}
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
