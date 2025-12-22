import React from 'react';

const LeaderboardCard = React.memo(({
  rank,
  username,
  avatarColor,
  userLevel,
  totalXP,
  isCurrentUser = false
}) => {
  // Déterminer le style du podium (top 3)
  const getPodiumStyle = () => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return null;
  };

  const podiumStyle = getPodiumStyle();

  // Extraire l'initiale du username
  const initial = username?.charAt(0)?.toUpperCase() || '?';

  const styles = {
    card: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      background: isCurrentUser
        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(30, 30, 35, 0.8) 0%, rgba(20, 20, 25, 0.9) 100%)',
      border: isCurrentUser
        ? '1px solid rgba(139, 92, 246, 0.3)'
        : '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '16px',
      transition: 'all 0.2s ease',
    },
    rankContainer: {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 800,
      fontSize: podiumStyle ? '18px' : '14px',
      background: podiumStyle === 'gold'
        ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
        : podiumStyle === 'silver'
        ? 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)'
        : podiumStyle === 'bronze'
        ? 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)'
        : 'rgba(255, 255, 255, 0.05)',
      color: podiumStyle ? '#000000' : 'rgba(255, 255, 255, 0.5)',
      boxShadow: podiumStyle === 'gold'
        ? '0 0 15px rgba(255, 215, 0, 0.4)'
        : podiumStyle === 'silver'
        ? '0 0 15px rgba(192, 192, 192, 0.3)'
        : podiumStyle === 'bronze'
        ? '0 0 15px rgba(205, 127, 50, 0.3)'
        : 'none',
    },
    avatar: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: avatarColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 700,
      fontSize: '18px',
      color: '#FFFFFF',
      textTransform: 'uppercase',
      flexShrink: 0,
    },
    info: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minWidth: 0,
    },
    usernameRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    username: {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 700,
      fontSize: '15px',
      color: isCurrentUser ? '#8B5CF6' : '#FFFFFF',
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    levelBadge: {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 600,
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.6)',
      background: 'rgba(255, 255, 255, 0.08)',
      padding: '2px 6px',
      borderRadius: '4px',
      flexShrink: 0,
    },
    xp: {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 500,
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.4)',
      margin: 0,
    },
    xpValue: {
      color: '#FACC15',
      fontWeight: 600,
    },
    youBadge: {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 600,
      fontSize: '9px',
      color: '#8B5CF6',
      background: 'rgba(139, 92, 246, 0.15)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      padding: '2px 6px',
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  return (
    <div style={styles.card}>
      {/* Rank */}
      <div style={styles.rankContainer}>
        {podiumStyle ? (
          rank === 1 ? '1' : rank === 2 ? '2' : '3'
        ) : (
          `#${rank}`
        )}
      </div>

      {/* Avatar */}
      <div style={styles.avatar}>
        {initial}
      </div>

      {/* Info */}
      <div style={styles.info}>
        <div style={styles.usernameRow}>
          <p style={styles.username}>{username}</p>
          <span style={styles.levelBadge}>Niv. {userLevel}</span>
          {isCurrentUser && <span style={styles.youBadge}>Toi</span>}
        </div>
        <p style={styles.xp}>
          <span style={styles.xpValue}>{totalXP?.toLocaleString() || 0}</span> XP
        </p>
      </div>
    </div>
  );
});

LeaderboardCard.displayName = 'LeaderboardCard';

export default LeaderboardCard;
