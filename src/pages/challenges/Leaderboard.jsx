import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useHaptic from '../../hooks/useHaptic';
import LeaderboardCard from '../../components/challenges/LeaderboardCard';
import { getGlobalLeaderboard, getUserRank } from '../../services/leaderboardService';
import '../../styles/Challenges.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerLight } = useHaptic();

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRankData, setUserRankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        // Récupérer le leaderboard global
        const { success, leaderboard: data, error: lbError } = await getGlobalLeaderboard(50);

        if (!success) {
          setError(lbError || 'Erreur lors du chargement');
          return;
        }

        setLeaderboard(data);

        // Si l'utilisateur est connecté, récupérer son rang
        if (user?.uid) {
          const { success: rankSuccess, rank, userData } = await getUserRank(user.uid);
          if (rankSuccess) {
            setUserRankData({ rank, ...userData });
          }
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Impossible de charger le classement');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const handleBackClick = () => {
    triggerLight();
    navigate('/challenges');
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
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      top: 'max(env(safe-area-inset-top), 8px)',
      left: 'max(16px, env(safe-area-inset-left))',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      padding: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      borderRadius: '12px',
      transition: 'all 0.2s ease',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    headerGlow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '250px',
      height: '120px',
      background: 'radial-gradient(ellipse, rgba(250, 204, 21, 0.12) 0%, transparent 70%)',
      filter: 'blur(40px)',
      pointerEvents: 'none',
      zIndex: -1,
    },
    title: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '28px',
      fontWeight: 900,
      color: '#FFFFFF',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    titleIcon: {
      fontSize: '28px',
    },
    subtitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '13px',
      fontWeight: 500,
      color: 'rgba(255, 255, 255, 0.5)',
      margin: 0,
    },
    userRankCard: {
      marginBottom: '20px',
      padding: '16px',
      background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(250, 204, 21, 0.02) 100%)',
      border: '1px solid rgba(250, 204, 21, 0.2)',
      borderRadius: '16px',
    },
    userRankTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.5)',
      margin: '0 0 12px 0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    leaderboardList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      flex: 1,
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
      borderTopColor: '#FACC15',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    errorContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      textAlign: 'center',
    },
    errorIcon: {
      fontSize: '48px',
    },
    errorText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    emptyContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      textAlign: 'center',
    },
    emptyIcon: {
      fontSize: '48px',
      opacity: 0.5,
    },
    emptyText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
  };

  return (
    <div style={styles.container}>
      {/* Keyframes pour spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Back Button */}
      <button
        style={styles.backButton}
        onClick={handleBackClick}
        aria-label="Retour"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerGlow}></div>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>{"🏆"}</span>
          Classement
        </h1>
        <p style={styles.subtitle}>Top 50 des meilleurs joueurs</p>
      </div>

      {/* User Rank Card (si connecté et non dans le top) */}
      {userRankData && userRankData.rank > 50 && (
        <div style={styles.userRankCard}>
          <p style={styles.userRankTitle}>Ton classement</p>
          <LeaderboardCard
            rank={userRankData.rank}
            username={userRankData.username}
            avatarColor={userRankData.avatarColor}
            userLevel={userRankData.userLevel}
            totalXP={userRankData.totalXP}
            isCurrentUser={true}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Chargement du classement...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>{"😵"}</span>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leaderboard.length === 0 && (
        <div style={styles.emptyContainer}>
          <span style={styles.emptyIcon}>{"🏜️"}</span>
          <p style={styles.emptyText}>Aucun joueur pour le moment</p>
        </div>
      )}

      {/* Leaderboard List */}
      {!loading && !error && leaderboard.length > 0 && (
        <div style={styles.leaderboardList}>
          {leaderboard.map((player) => (
            <LeaderboardCard
              key={player.userId}
              rank={player.rank}
              username={player.username}
              avatarColor={player.avatarColor}
              userLevel={player.userLevel}
              totalXP={player.totalXP}
              isCurrentUser={user?.uid === player.userId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
