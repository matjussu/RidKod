import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useHaptic from '../../hooks/useHaptic';
import LeaderboardCard from '../../components/challenges/LeaderboardCard';
import { getDailyLeaderboard, getUserDailyRank } from '../../services/dailyChallengeService';
import '../../styles/Challenges.css';

const DailyResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { triggerLight } = useHaptic();

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les stats depuis la navigation
  const stats = location.state?.stats || {
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalXP: 0,
    timeSeconds: 0
  };
  const exerciseCount = location.state?.exerciseCount || 5;

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);

      try {
        // Charger le classement du jour
        const { success, leaderboard: dailyLeaderboard } = await getDailyLeaderboard(null, 10);

        if (success) {
          setLeaderboard(dailyLeaderboard);
        }

        // Récupérer le rang de l'utilisateur
        if (user?.uid) {
          const { success: rankSuccess, rank, totalParticipants } = await getUserDailyRank(user.uid);
          if (rankSuccess) {
            setUserRank({ rank, totalParticipants });
          }
        }
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [user]);

  const handleBackClick = () => {
    triggerLight();
    navigate('/challenges');
  };

  // Formater le temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer le pourcentage de réussite
  const successRate = Math.round((stats.correctAnswers / exerciseCount) * 100);

  // Déterminer le message de félicitation
  const getResultMessage = () => {
    if (successRate === 100) return { emoji: '🏆', text: 'Parfait !' };
    if (successRate >= 80) return { emoji: '🌟', text: 'Excellent !' };
    if (successRate >= 60) return { emoji: '👍', text: 'Bien joué !' };
    if (successRate >= 40) return { emoji: '💪', text: 'Pas mal !' };
    return { emoji: '📚', text: 'Continue !' };
  };

  const resultMessage = getResultMessage();

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
    headerEmoji: {
      fontSize: '64px',
      display: 'block',
      marginBottom: '16px',
      animation: 'bounce 0.6s ease-out',
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '24px',
    },
    statCard: {
      background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.8) 0%, rgba(20, 20, 25, 0.9) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '16px 12px',
      textAlign: 'center',
    },
    statValue: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '24px',
      fontWeight: 800,
      color: '#FFFFFF',
      display: 'block',
    },
    statValueXP: {
      color: '#FACC15',
    },
    statValueSuccess: {
      color: '#30D158',
    },
    statLabel: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: '4px',
      display: 'block',
    },
    rankCard: {
      background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(250, 204, 21, 0.05) 100%)',
      border: '1px solid rgba(251, 146, 60, 0.2)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      textAlign: 'center',
    },
    rankTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.5)',
      margin: '0 0 8px 0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    rankValue: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '36px',
      fontWeight: 900,
      color: '#FB923C',
      margin: '0 0 4px 0',
    },
    rankSubtext: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.4)',
      margin: 0,
    },
    leaderboardSection: {
      marginBottom: '24px',
    },
    leaderboardTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 700,
      color: 'rgba(255, 255, 255, 0.8)',
      margin: '0 0 12px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    leaderboardList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    loadingSpinner: {
      width: '24px',
      height: '24px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderTopColor: '#FB923C',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '20px auto',
    },
    emptyText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.4)',
      textAlign: 'center',
      padding: '20px',
    },
    backButton: {
      background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 700,
      color: '#FFFFFF',
      cursor: 'pointer',
      width: '100%',
      marginTop: 'auto',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerEmoji}>{resultMessage.emoji}</span>
        <h1 style={styles.headerTitle}>{resultMessage.text}</h1>
        <p style={styles.headerSubtitle}>Défi du jour terminé</p>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={{ ...styles.statValue, ...styles.statValueXP }}>
            {stats.totalXP}
          </span>
          <span style={styles.statLabel}>XP gagnés</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statValue, ...styles.statValueSuccess }}>
            {stats.correctAnswers}/{exerciseCount}
          </span>
          <span style={styles.statLabel}>Bonnes réponses</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {formatTime(stats.timeSeconds)}
          </span>
          <span style={styles.statLabel}>Temps</span>
        </div>
      </div>

      {/* Rank Card */}
      {userRank && (
        <div style={styles.rankCard}>
          <p style={styles.rankTitle}>Ton classement du jour</p>
          <p style={styles.rankValue}>#{userRank.rank}</p>
          <p style={styles.rankSubtext}>
            sur {userRank.totalParticipants} participant{userRank.totalParticipants > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Leaderboard */}
      <div style={styles.leaderboardSection}>
        <h2 style={styles.leaderboardTitle}>
          {"🏅"} Top 10 du jour
        </h2>

        {loading ? (
          <div style={styles.loadingSpinner}></div>
        ) : leaderboard.length > 0 ? (
          <div style={styles.leaderboardList}>
            {leaderboard.map((player) => (
              <LeaderboardCard
                key={player.oderId}
                rank={player.rank}
                username={player.username}
                avatarColor={null}
                userLevel={null}
                totalXP={player.score}
                isCurrentUser={user?.uid === player.oderId}
              />
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>
            Tu es le premier à relever le défi aujourd'hui !
          </p>
        )}
      </div>

      {/* Back Button */}
      <button style={styles.backButton} onClick={handleBackClick}>
        Retour aux challenges
      </button>
    </div>
  );
};

export default DailyResult;
