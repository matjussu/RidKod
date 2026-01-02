import { useNavigate, useLocation } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import '../../styles/Challenges.css';

const DuelResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerLight } = useHaptic();

  const {
    mode = 'bot',
    player = { username: 'Toi', correctAnswers: 0, errors: 0, timeSeconds: 0, totalTime: 0 },
    opponent = { username: 'Adversaire', correctAnswers: 0, errors: 0, timeSeconds: 0, totalTime: 0, isBot: false },
    exerciseCount = 5,
    penaltySeconds = 10
  } = location.state || {};

  // Calculer les temps totaux si non fournis
  const playerTotalTime = player.totalTime || (player.timeSeconds + (player.errors || 0) * penaltySeconds);
  const opponentTotalTime = opponent.totalTime || (opponent.timeSeconds + (opponent.errors || 0) * penaltySeconds);

  // Determiner le gagnant (le plus petit temps gagne)
  const playerWins = playerTotalTime < opponentTotalTime;
  const isDraw = playerTotalTime === opponentTotalTime;

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
      return { title: 'Egalite !', subtitle: 'Match nul parfait' };
    }
    if (playerWins) {
      return { title: 'Victoire !', subtitle: 'Tu as gagne le duel' };
    }
    return { title: 'Defaite...', subtitle: 'Retente ta chance !' };
  };

  const result = getResultMessage();

  // SVG Icons pour remplacer les emojis
  const TrophyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '80px', height: '80px' }}>
      <path d="M6 9H3C3 9 3 5 6 5V9Z" stroke="#FACC15" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M18 9H21C21 9 21 5 18 5V9Z" stroke="#FACC15" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M6 5H18V9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9V5Z" stroke="#FACC15" strokeWidth="2"/>
      <path d="M12 15V18" stroke="#FACC15" strokeWidth="2"/>
      <path d="M8 21H16" stroke="#FACC15" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 18H15V21H9V18Z" fill="#FACC15" fillOpacity="0.2" stroke="#FACC15" strokeWidth="2"/>
    </svg>
  );

  const DefeatIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '80px', height: '80px' }}>
      <circle cx="12" cy="12" r="10" stroke="#FF453A" strokeWidth="2"/>
      <path d="M8 9L10 11M10 9L8 11" stroke="#FF453A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 9L16 11M16 9L14 11" stroke="#FF453A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 16C8 16 9.5 14 12 14C14.5 14 16 16 16 16" stroke="#FF453A" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const DrawIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '80px', height: '80px' }}>
      <circle cx="12" cy="12" r="10" stroke="#FACC15" strokeWidth="2"/>
      <path d="M8 10V10.01" stroke="#FACC15" strokeWidth="3" strokeLinecap="round"/>
      <path d="M16 10V10.01" stroke="#FACC15" strokeWidth="3" strokeLinecap="round"/>
      <path d="M8 15H16" stroke="#FACC15" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const ResultIcon = () => {
    if (isDraw) return <DrawIcon />;
    if (playerWins) return <TrophyIcon />;
    return <DefeatIcon />;
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
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    resultIcon: {
      display: 'flex',
      justifyContent: 'center',
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
    playerTime: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '24px',
      fontWeight: 900,
      margin: 0,
    },
    playerTimeWinner: {
      color: '#30D158',
    },
    playerTimeLoser: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    playerTimeDraw: {
      color: '#FACC15',
    },
    penaltyText: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: '#FF453A',
      margin: '4px 0 0 0',
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

  const getTimeStyle = (isWinner) => {
    if (isDraw) return styles.playerTimeDraw;
    return isWinner ? styles.playerTimeWinner : styles.playerTimeLoser;
  };

  // SVG icons pour avatars
  const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '28px', height: '28px' }}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '28px', height: '28px' }}>
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
      <path d="M9 4H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const SwordsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '20px', height: '20px' }}>
      <path d="M14.5 17.5L3 6V3H6L17.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 19L19 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9.5 6.5L3 13V16L6 19H9L15.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

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
        <div style={styles.resultIcon}>
          <ResultIcon />
        </div>
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
            <div style={{ ...styles.playerAvatar, ...getPlayerAvatarStyle(playerWins), color: playerWins ? '#30D158' : 'rgba(255,255,255,0.5)' }}>
              <UserIcon />
            </div>
            <p style={styles.playerName}>Toi</p>
            <p style={{ ...styles.playerTime, ...getTimeStyle(playerWins) }}>
              {formatTime(playerTotalTime)}
            </p>
            {(player.errors || 0) > 0 && (
              <p style={styles.penaltyText}>
                {formatTime(player.timeSeconds)} +{(player.errors || 0) * penaltySeconds}s
              </p>
            )}
            {playerWins && !isDraw && (
              <span style={styles.winnerBadge}>GAGNANT</span>
            )}
          </div>

          {/* VS */}
          <span style={styles.vsIcon}>VS</span>

          {/* Opponent */}
          <div style={styles.playerCard}>
            <div style={{ ...styles.playerAvatar, ...getPlayerAvatarStyle(!playerWins && !isDraw), color: !playerWins && !isDraw ? '#30D158' : 'rgba(255,255,255,0.5)' }}>
              {opponent.isBot ? <BotIcon /> : <UserIcon />}
            </div>
            <p style={styles.playerName}>{opponent.username}</p>
            <p style={{ ...styles.playerTime, ...getTimeStyle(!playerWins && !isDraw) }}>
              {formatTime(opponentTotalTime)}
            </p>
            {(opponent.errors || 0) > 0 && (
              <p style={styles.penaltyText}>
                {formatTime(opponent.timeSeconds)} +{(opponent.errors || 0) * penaltySeconds}s
              </p>
            )}
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

          {/* Erreurs */}
          <div style={{ ...styles.statValue, ...styles.statValuePlayer }}>
            {player.errors || 0}
          </div>
          <div style={styles.statLabel}>Erreurs</div>
          <div style={{ ...styles.statValue, ...styles.statValueOpponent }}>
            {opponent.errors || 0}
          </div>

          {/* Penalites */}
          <div style={{ ...styles.statValue, color: (player.errors || 0) > 0 ? '#FF453A' : 'rgba(255,255,255,0.5)' }}>
            +{(player.errors || 0) * penaltySeconds}s
          </div>
          <div style={styles.statLabel}>Penalites</div>
          <div style={{ ...styles.statValue, color: (opponent.errors || 0) > 0 ? '#FF453A' : 'rgba(255,255,255,0.5)' }}>
            +{(opponent.errors || 0) * penaltySeconds}s
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button style={styles.playAgainButton} onClick={handlePlayAgain}>
          <SwordsIcon /> Rejouer
        </button>
        <button style={styles.backButton} onClick={handleBackToMenu}>
          Retour aux challenges
        </button>
      </div>
    </div>
  );
};

export default DuelResult;
