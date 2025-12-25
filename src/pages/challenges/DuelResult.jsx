import { useNavigate, useLocation } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import '../../styles/Challenges.css';

const DuelResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerLight } = useHaptic();

  const {
    mode = 'bot',
    player = { username: 'Toi', score: 0, correctAnswers: 0, timeSeconds: 0 },
    opponent = { username: 'Adversaire', score: 0, correctAnswers: 0, timeSeconds: 0, isBot: false },
    exerciseCount = 5
  } = location.state || {};

  // Determiner le gagnant
  const playerWins = player.score > opponent.score ||
    (player.score === opponent.score && player.timeSeconds < opponent.timeSeconds);
  const isDraw = player.score === opponent.score && player.timeSeconds === opponent.timeSeconds;

  const handlePlayAgain = () => {
    triggerLight();
    if (mode === 'bot') {
      navigate('/challenges/duel/bot');
    } else {
      navigate('/challenges/duel');
    }
  };

  const handleBackToMenu = () => {
    triggerLight();
    navigate('/challenges');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultMessage = () => {
    if (isDraw) {
      return { emoji: '🤝', title: 'Egalite !', subtitle: 'Match nul parfait' };
    }
    if (playerWins) {
      return { emoji: '🏆', title: 'Victoire !', subtitle: 'Tu as gagne le duel' };
    }
    return { emoji: '😤', title: 'Defaite...', subtitle: 'Retente ta chance !' };
  };

  const result = getResultMessage();

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
    resultEmoji: {
      fontSize: '80px',
      display: 'block',
      marginBottom: '16px',
      animation: 'bounce 0.6s ease-out',
    },
    resultTitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '32px',
      fontWeight: 900,
      margin: '0 0 8px 0',
    },
    resultTitleWin: {
      color: '#30D158',
    },
    resultTitleLose: {
      color: '#FF453A',
    },
    resultTitleDraw: {
      color: '#FACC15',
    },
    resultSubtitle: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
    },
    comparisonCard: {
      background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.9) 0%, rgba(20, 20, 25, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
    },
    versusRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    playerCard: {
      flex: 1,
      textAlign: 'center',
    },
    playerAvatar: {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 8px',
      fontSize: '24px',
    },
    playerAvatarWinner: {
      background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.2) 0%, rgba(52, 199, 89, 0.1) 100%)',
      border: '2px solid #30D158',
    },
    playerAvatarLoser: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
    },
    playerAvatarDraw: {
      background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2) 0%, rgba(251, 146, 60, 0.1) 100%)',
      border: '2px solid #FACC15',
    },
    playerName: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      color: '#FFFFFF',
      margin: '0 0 4px 0',
    },
    playerScore: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '28px',
      fontWeight: 900,
      margin: 0,
    },
    playerScoreWinner: {
      color: '#30D158',
    },
    playerScoreLoser: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    playerScoreDraw: {
      color: '#FACC15',
    },
    vsIcon: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '16px',
      fontWeight: 700,
      color: 'rgba(255, 255, 255, 0.3)',
      padding: '0 16px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: '8px',
    },
    statRow: {
      display: 'contents',
    },
    statValue: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      textAlign: 'center',
      padding: '8px 0',
    },
    statValuePlayer: {
      color: '#FFFFFF',
    },
    statValueOpponent: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    statLabel: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: 'rgba(255, 255, 255, 0.4)',
      textAlign: 'center',
      padding: '8px 12px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
    },
    winnerBadge: {
      background: 'linear-gradient(135deg, #30D158 0%, #34C759 100%)',
      color: '#000000',
      fontSize: '11px',
      fontWeight: 700,
      padding: '4px 10px',
      borderRadius: '20px',
      display: 'inline-block',
      marginTop: '8px',
    },
    actionButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: 'auto',
    },
    playAgainButton: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      border: 'none',
      borderRadius: '14px',
      padding: '16px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '16px',
      fontWeight: 700,
      color: '#FFFFFF',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    backButton: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '14px',
      padding: '14px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '14px',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.6)',
      cursor: 'pointer',
    },
  };

  const getPlayerAvatarStyle = (isWinner) => {
    if (isDraw) return styles.playerAvatarDraw;
    return isWinner ? styles.playerAvatarWinner : styles.playerAvatarLoser;
  };

  const getScoreStyle = (isWinner) => {
    if (isDraw) return styles.playerScoreDraw;
    return isWinner ? styles.playerScoreWinner : styles.playerScoreLoser;
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.resultEmoji}>{result.emoji}</span>
        <h1 style={{
          ...styles.resultTitle,
          ...(isDraw ? styles.resultTitleDraw : playerWins ? styles.resultTitleWin : styles.resultTitleLose)
        }}>
          {result.title}
        </h1>
        <p style={styles.resultSubtitle}>{result.subtitle}</p>
      </div>

      {/* Comparison Card */}
      <div style={styles.comparisonCard}>
        {/* Versus Row */}
        <div style={styles.versusRow}>
          {/* Player */}
          <div style={styles.playerCard}>
            <div style={{ ...styles.playerAvatar, ...getPlayerAvatarStyle(playerWins) }}>
              {"👤"}
            </div>
            <p style={styles.playerName}>Toi</p>
            <p style={{ ...styles.playerScore, ...getScoreStyle(playerWins) }}>
              {player.score}
            </p>
            {playerWins && !isDraw && (
              <span style={styles.winnerBadge}>GAGNANT</span>
            )}
          </div>

          {/* VS */}
          <span style={styles.vsIcon}>VS</span>

          {/* Opponent */}
          <div style={styles.playerCard}>
            <div style={{ ...styles.playerAvatar, ...getPlayerAvatarStyle(!playerWins && !isDraw) }}>
              {opponent.isBot ? '🤖' : '👤'}
            </div>
            <p style={styles.playerName}>{opponent.username}</p>
            <p style={{ ...styles.playerScore, ...getScoreStyle(!playerWins && !isDraw) }}>
              {opponent.score}
            </p>
            {!playerWins && !isDraw && (
              <span style={styles.winnerBadge}>GAGNANT</span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {/* Bonnes reponses */}
          <div style={{ ...styles.statValue, ...styles.statValuePlayer }}>
            {player.correctAnswers}/{exerciseCount}
          </div>
          <div style={styles.statLabel}>Bonnes reponses</div>
          <div style={{ ...styles.statValue, ...styles.statValueOpponent }}>
            {opponent.correctAnswers}/{exerciseCount}
          </div>

          {/* Temps */}
          <div style={{ ...styles.statValue, ...styles.statValuePlayer }}>
            {formatTime(player.timeSeconds)}
          </div>
          <div style={styles.statLabel}>Temps</div>
          <div style={{ ...styles.statValue, ...styles.statValueOpponent }}>
            {formatTime(opponent.timeSeconds)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button style={styles.playAgainButton} onClick={handlePlayAgain}>
          {"⚔️"} Rejouer
        </button>
        <button style={styles.backButton} onClick={handleBackToMenu}>
          Retour aux challenges
        </button>
      </div>
    </div>
  );
};

export default DuelResult;
