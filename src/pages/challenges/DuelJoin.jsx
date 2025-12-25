import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useHaptic from '../../hooks/useHaptic';
import { joinDuel, subscribeToDuel, setPlayerReady } from '../../services/duelService';
import { getUserProfile } from '../../services/userService';
import '../../styles/Challenges.css';

const DuelJoin = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const { user } = useAuth();
  const { triggerLight, triggerSuccess } = useHaptic();

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [duelData, setDuelData] = useState(null);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  const hasAttemptedJoin = useRef(false);

  // Rejoindre le duel
  useEffect(() => {
    if (hasAttemptedJoin.current) return;

    const initJoin = async () => {
      if (!user?.uid) {
        navigate('/login');
        return;
      }

      if (!code) {
        setError('Code de duel invalide');
        setLoading(false);
        return;
      }

      hasAttemptedJoin.current = true;
      setJoining(true);

      try {
        const profile = await getUserProfile(user.uid);
        const username = profile?.profile?.username || 'Joueur';

        const { success, duelData: data, error: joinError } = await joinDuel(code, user.uid, username);

        if (!success) {
          setError(joinError || 'Impossible de rejoindre le duel');
          setLoading(false);
          setJoining(false);
          return;
        }

        setDuelData(data);
        setJoined(true);
        setLoading(false);
        setJoining(false);
      } catch (err) {
        console.error('Error joining duel:', err);
        setError('Erreur lors de la connexion au duel');
        setLoading(false);
        setJoining(false);
      }
    };

    initJoin();
  }, [user, code, navigate]);

  // Ecouter les mises a jour du duel
  useEffect(() => {
    if (!code || !joined) return;

    const unsubscribe = subscribeToDuel(code, ({ success, duelData: data, error: subError }) => {
      if (success) {
        setDuelData(data);

        // Si le duel commence, naviguer vers le jeu
        if (data.status === 'playing') {
          navigate(`/challenges/duel/game/${code}`, { state: { isHost: false } });
        }
      } else {
        console.error('Subscription error:', subError);
      }
    });

    return () => unsubscribe();
  }, [code, joined, navigate]);

  const handleReady = useCallback(async () => {
    if (!user?.uid || !code) return;

    triggerLight();
    await setPlayerReady(code, user.uid);
  }, [user, code, triggerLight]);

  const handleCancel = useCallback(() => {
    triggerLight();
    navigate('/challenges/duel');
  }, [navigate, triggerLight]);

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
    codeDisplay: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '20px',
      fontWeight: 700,
      color: '#22D3EE',
      background: 'rgba(6, 182, 212, 0.1)',
      padding: '12px 24px',
      borderRadius: '12px',
      display: 'inline-block',
      letterSpacing: '4px',
      marginTop: '8px',
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
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '14px',
      padding: '14px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.6)',
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

  if (loading || joining) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(255, 255, 255, 0.5)' }}>
            {joining ? 'Connexion au duel...' : 'Chargement...'}
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
          <button style={styles.cancelButton} onClick={handleCancel}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  const hostReady = duelData?.host?.ready;
  const guestReady = duelData?.guest?.ready;
  const canStart = !guestReady;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>{"🔗"}</span>
        <h1 style={styles.headerTitle}>Duel rejoint !</h1>
        <p style={styles.headerSubtitle}>
          Prepare-toi a affronter {duelData?.host?.username || 'ton adversaire'}
        </p>
        <span style={styles.codeDisplay}>{code?.toUpperCase()}</span>
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
            <p style={styles.playerName}>{duelData?.host?.username || 'Hote'}</p>
            <p style={{ ...styles.playerStatus, ...(hostReady ? styles.playerReady : {}) }}>
              {hostReady ? 'Pret !' : 'En attente...'}
            </p>
          </div>
          {hostReady && <span style={styles.readyBadge}>PRET</span>}
        </div>

        {/* Guest (You) */}
        <div style={styles.playerSlot}>
          <div style={styles.playerAvatar}>
            {duelData?.guest?.username?.[0]?.toUpperCase() || 'G'}
          </div>
          <div style={styles.playerInfo}>
            <p style={styles.playerName}>{duelData?.guest?.username || 'Invite'} (toi)</p>
            <p style={{ ...styles.playerStatus, ...(guestReady ? styles.playerReady : {}) }}>
              {guestReady ? 'Pret !' : 'En attente...'}
            </p>
          </div>
          {guestReady && <span style={styles.readyBadge}>PRET</span>}
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
        {guestReady ? 'En attente de l\'hote...' : 'Je suis pret !'}
      </button>

      {/* Cancel Button */}
      <button style={styles.cancelButton} onClick={handleCancel}>
        Quitter le duel
      </button>
    </div>
  );
};

export default DuelJoin;
