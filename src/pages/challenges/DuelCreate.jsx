import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useHaptic from '../../hooks/useHaptic';
import { createDuel, subscribeToDuel, deleteDuel, setPlayerReady } from '../../services/duelService';
import { getUserProfile } from '../../services/userService';
import '../../styles/Challenges.css';

const DuelCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerLight, triggerSuccess } = useHaptic();

  const [loading, setLoading] = useState(true);
  const [duelCode, setDuelCode] = useState('');
  const [duelData, setDuelData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Creer le duel au chargement
  useEffect(() => {
    const initDuel = async () => {
      if (!user?.uid) {
        navigate('/login');
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        const username = profile?.profile?.username || 'Joueur';

        const { success, duelCode: code, error: createError } = await createDuel(user.uid, username);

        if (!success) {
          setError(createError || 'Erreur lors de la creation du duel');
          setLoading(false);
          return;
        }

        setDuelCode(code);
        setLoading(false);
      } catch (err) {
        console.error('Error creating duel:', err);
        setError('Erreur lors de la creation du duel');
        setLoading(false);
      }
    };

    initDuel();
  }, [user, navigate]);

  // Ecouter les mises a jour du duel
  useEffect(() => {
    if (!duelCode) return;

    const unsubscribe = subscribeToDuel(duelCode, ({ success, duelData: data, error: subError }) => {
      if (success) {
        setDuelData(data);

        // Si les deux joueurs sont prets, demarrer le jeu
        if (data.status === 'playing') {
          triggerSuccess();
          navigate(`/challenges/duel/game/${duelCode}`, { state: { isHost: true } });
        }
      } else {
        console.error('Subscription error:', subError);
      }
    });

    return () => unsubscribe();
  }, [duelCode, navigate, triggerSuccess]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(duelCode);
      triggerLight();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [duelCode, triggerLight]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Duel ReadCod',
          text: `Rejoins mon duel sur ReadCod ! Code: ${duelCode}`,
          url: window.location.origin + `/challenges/duel/join/${duelCode}`
        });
        triggerLight();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      handleCopyCode();
    }
  }, [duelCode, triggerLight, handleCopyCode]);

  const handleReady = useCallback(async () => {
    if (!user?.uid || !duelCode) return;

    triggerLight();
    await setPlayerReady(duelCode, user.uid);
  }, [user, duelCode, triggerLight]);

  const handleCancel = useCallback(async () => {
    if (duelCode && user?.uid) {
      await deleteDuel(duelCode, user.uid);
    }
    triggerLight();
    navigate('/challenges/duel');
  }, [duelCode, user, navigate, triggerLight]);

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
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    headerIcon: {
      fontSize: '48px',
      display: 'block',
      marginBottom: '16px',
    },
    headerTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '24px',
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
    codeCard: {
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
      border: '2px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      textAlign: 'center',
      marginBottom: '24px',
    },
    codeLabel: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    codeValue: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '36px',
      fontWeight: 900,
      color: '#22D3EE',
      letterSpacing: '8px',
      marginBottom: '16px',
    },
    codeActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    actionButton: {
      background: 'rgba(6, 182, 212, 0.2)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '12px',
      padding: '12px 20px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '13px',
      fontWeight: 600,
      color: '#22D3EE',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    waitingCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
    },
    waitingTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.8)',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    playerSlot: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      marginBottom: '8px',
    },
    playerSlotEmpty: {
      border: '2px dashed rgba(255, 255, 255, 0.1)',
      background: 'transparent',
    },
    playerAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '16px',
      fontWeight: 700,
      color: '#FFFFFF',
    },
    playerInfo: {
      flex: 1,
    },
    playerName: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      color: '#FFFFFF',
      margin: 0,
    },
    playerStatus: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: 'rgba(255, 255, 255, 0.5)',
      margin: 0,
    },
    playerReady: {
      color: '#30D158',
    },
    readyBadge: {
      background: '#30D158',
      color: '#000000',
      fontSize: '11px',
      fontWeight: 700,
      padding: '4px 8px',
      borderRadius: '6px',
    },
    waitingDots: {
      display: 'flex',
      gap: '4px',
    },
    waitingDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.3)',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
    readyButton: {
      background: 'linear-gradient(135deg, #30D158 0%, #34C759 100%)',
      border: 'none',
      borderRadius: '14px',
      padding: '16px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '16px',
      fontWeight: 700,
      color: '#FFFFFF',
      cursor: 'pointer',
      width: '100%',
      marginBottom: '12px',
    },
    readyButtonDisabled: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.3)',
      cursor: 'not-allowed',
    },
    cancelButton: {
      background: 'transparent',
      border: '1px solid rgba(255, 69, 58, 0.3)',
      borderRadius: '14px',
      padding: '14px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      color: '#FF453A',
      cursor: 'pointer',
      width: '100%',
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255, 255, 255, 0.1)',
      borderTopColor: '#22D3EE',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px',
      textAlign: 'center',
    },
    errorText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      color: '#FF453A',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(255, 255, 255, 0.5)' }}>
            Creation du duel...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <span style={{ fontSize: '48px' }}>{"😕"}</span>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.cancelButton} onClick={() => navigate('/challenges/duel')}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  const hasGuest = duelData?.guest !== null;
  const hostReady = duelData?.host?.ready;
  const guestReady = duelData?.guest?.ready;
  const canStart = hasGuest && !hostReady;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>{"🎯"}</span>
        <h1 style={styles.headerTitle}>Duel cree !</h1>
        <p style={styles.headerSubtitle}>Partage ce code avec ton ami</p>
      </div>

      {/* Code Card */}
      <div style={styles.codeCard}>
        <p style={styles.codeLabel}>Code du duel</p>
        <p style={styles.codeValue}>{duelCode}</p>
        <div style={styles.codeActions}>
          <button style={styles.actionButton} onClick={handleCopyCode}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {copied ? 'Copie !' : 'Copier'}
          </button>
          <button style={styles.actionButton} onClick={handleShare}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16,6 12,2 8,6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Partager
          </button>
        </div>
      </div>

      {/* Waiting Card */}
      <div style={styles.waitingCard}>
        <h2 style={styles.waitingTitle}>
          {"👥"} Joueurs
        </h2>

        {/* Host */}
        <div style={styles.playerSlot}>
          <div style={styles.playerAvatar}>
            {duelData?.host?.username?.[0]?.toUpperCase() || 'H'}
          </div>
          <div style={styles.playerInfo}>
            <p style={styles.playerName}>{duelData?.host?.username || 'Hote'} (toi)</p>
            <p style={{ ...styles.playerStatus, ...(hostReady ? styles.playerReady : {}) }}>
              {hostReady ? 'Pret !' : 'En attente...'}
            </p>
          </div>
          {hostReady && <span style={styles.readyBadge}>PRET</span>}
        </div>

        {/* Guest */}
        <div style={{ ...styles.playerSlot, ...(hasGuest ? {} : styles.playerSlotEmpty) }}>
          {hasGuest ? (
            <>
              <div style={styles.playerAvatar}>
                {duelData?.guest?.username?.[0]?.toUpperCase() || 'G'}
              </div>
              <div style={styles.playerInfo}>
                <p style={styles.playerName}>{duelData?.guest?.username || 'Invite'}</p>
                <p style={{ ...styles.playerStatus, ...(guestReady ? styles.playerReady : {}) }}>
                  {guestReady ? 'Pret !' : 'En attente...'}
                </p>
              </div>
              {guestReady && <span style={styles.readyBadge}>PRET</span>}
            </>
          ) : (
            <>
              <div style={{ ...styles.playerAvatar, background: 'rgba(255, 255, 255, 0.1)' }}>
                {"?"}
              </div>
              <div style={styles.playerInfo}>
                <p style={{ ...styles.playerName, color: 'rgba(255, 255, 255, 0.3)' }}>En attente...</p>
                <p style={styles.playerStatus}>Partage le code pour inviter</p>
              </div>
              <div style={styles.waitingDots}>
                <span style={{ ...styles.waitingDot, animationDelay: '0s' }}></span>
                <span style={{ ...styles.waitingDot, animationDelay: '0.2s' }}></span>
                <span style={{ ...styles.waitingDot, animationDelay: '0.4s' }}></span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ready Button */}
      <button
        style={{
          ...styles.readyButton,
          ...(canStart ? {} : styles.readyButtonDisabled)
        }}
        onClick={handleReady}
        disabled={!canStart}
      >
        {hostReady ? 'En attente de l\'adversaire...' : canStart ? 'Je suis pret !' : 'En attente d\'un joueur...'}
      </button>

      {/* Cancel Button */}
      <button style={styles.cancelButton} onClick={handleCancel}>
        Annuler le duel
      </button>
    </div>
  );
};

export default DuelCreate;
