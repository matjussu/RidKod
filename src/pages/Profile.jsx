import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import useHaptic from '../hooks/useHaptic';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getStats, getProgressToNextLevel, loading } = useProgress();
  const { triggerLight, triggerSuccess } = useHaptic();

  const stats = getStats();
  const progressToNext = getProgressToNextLevel();

  const handleBack = () => {
    triggerLight();
    navigate('/home');
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      triggerSuccess();
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1A1919',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '16px'
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <style>{`
        /* Reset global */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
        }

        .profile-container {
          min-height: 100vh;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          padding: max(env(safe-area-inset-top), 20px) max(20px, env(safe-area-inset-left)) max(env(safe-area-inset-bottom), 30px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          position: relative;
          opacity: 0;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Back Button */
        .profile-back-button {
          position: absolute;
          top: max(env(safe-area-inset-top), 8px);
          left: max(16px, env(safe-area-inset-left));
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .profile-back-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .profile-back-button:active {
          transform: scale(0.95);
        }

        .profile-back-button svg {
          color: #FFFFFF;
          width: 24px;
          height: 24px;
        }

        /* Header */
        .profile-header {
          text-align: center;
          margin-top: 60px;
          margin-bottom: 32px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(48, 209, 88, 0.3);
        }

        .profile-email {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 8px;
        }

        .profile-status {
          font-size: 13px;
          font-weight: 600;
          color: #30D158;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-guest {
          color: #8E8E93;
        }

        /* Level Card */
        .level-card {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        .level-title {
          font-size: 14px;
          font-weight: 700;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .level-number {
          font-size: 48px;
          font-weight: 800;
          color: #30D158;
          line-height: 1;
          margin-bottom: 16px;
        }

        .level-xp {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 12px;
        }

        .level-progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .level-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #30D158 0%, #088201 100%);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .level-progress-text {
          font-size: 12px;
          font-weight: 600;
          color: #8E8E93;
          text-align: right;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
        }

        .stat-card {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-success {
          color: #30D158;
        }

        .stat-error {
          color: #FF453A;
        }

        .stat-streak {
          color: #FF9500;
        }

        /* Logout Button */
        .logout-button {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          height: 56px;
          width: 100%;
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 800;
          color: #FF453A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          margin-top: auto;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
        }

        .logout-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 69, 58, 0.3);
        }

        .logout-button:active {
          transform: scale(0.98);
        }

        /* Guest Mode */
        .guest-message {
          background: rgba(255, 149, 0, 0.15);
          border: 1px solid #FF9500;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #FF9500;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        .guest-login-button {
          background: linear-gradient(135deg, #FF9500 0%, #FF8800 100%);
          border: none;
          border-radius: 16px;
          height: 56px;
          width: 100%;
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 800;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(255, 149, 0, 0.3);
          margin-top: auto;
        }

        .guest-login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255, 149, 0, 0.4);
        }

        .guest-login-button:active {
          transform: scale(0.98);
        }

        /* Responsive */
        @media (max-width: 375px) {
          .profile-header {
            margin-top: 50px;
            margin-bottom: 28px;
          }

          .profile-avatar {
            width: 70px;
            height: 70px;
            font-size: 32px;
          }

          .level-number {
            font-size: 42px;
          }

          .stat-value {
            font-size: 28px;
          }
        }
      `}</style>

      {/* Back Button */}
      <button className="profile-back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {isAuthenticated ? (user?.email ? user.email[0].toUpperCase() : '?') : '👤'}
        </div>
        <div className="profile-email">
          {isAuthenticated ? (user?.email || 'Utilisateur') : 'Mode invité'}
        </div>
        <div className={`profile-status ${!isAuthenticated ? 'profile-guest' : ''}`}>
          {isAuthenticated ? 'Connecté' : 'Non connecté'}
        </div>
      </div>

      {/* Guest Message */}
      {!isAuthenticated && (
        <div className="guest-message">
          ⚠️ Tes données sont stockées localement. Connecte-toi pour sauvegarder ta progression sur tous tes appareils !
        </div>
      )}

      {/* Level Card */}
      <div className="level-card">
        <div className="level-title">Niveau actuel</div>
        <div className="level-number">Niveau {stats.userLevel}</div>
        <div className="level-xp">{stats.totalXP} XP total</div>
        <div className="level-progress-bar">
          <div
            className="level-progress-fill"
            style={{width: `${progressToNext.percentage}%`}}
          ></div>
        </div>
        <div className="level-progress-text">
          {progressToNext.current} / {progressToNext.required} XP vers niveau {stats.userLevel + 1}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalExercises}</div>
          <div className="stat-label">Exercices</div>
        </div>

        <div className="stat-card">
          <div className="stat-value stat-success">{stats.correctAnswers}</div>
          <div className="stat-label">Correct</div>
        </div>

        <div className="stat-card">
          <div className="stat-value stat-error">{stats.incorrectAnswers}</div>
          <div className="stat-label">Incorrect</div>
        </div>

        <div className="stat-card">
          <div className="stat-value stat-streak">
            {stats.streak?.current || 0} 🔥
          </div>
          <div className="stat-label">Streak</div>
        </div>
      </div>

      {/* Logout/Login Button */}
      {isAuthenticated ? (
        <button className="logout-button" onClick={handleLogout}>
          Se déconnecter
        </button>
      ) : (
        <button className="guest-login-button" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      )}
    </div>
  );
};

export default Profile;
