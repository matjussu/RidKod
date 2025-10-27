import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';

const LevelComplete = ({ stats, level = 1, onContinue }) => {
  const navigate = useNavigate();
  const { triggerSuccess } = useHaptic();

  useEffect(() => {
    triggerSuccess();
  }, []);

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100)
    : 0;

  const getPerformanceMessage = () => {
    if (accuracy === 100) return "Performance parfaite";
    if (accuracy >= 80) return "Excellent travail";
    if (accuracy >= 60) return "Bon effort";
    if (accuracy >= 40) return "Continue comme ça";
    return "Persévère, tu progresses";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 80) return '#30D158';
    if (accuracy >= 60) return '#FF9500';
    return '#FF453A';
  };

  return (
    <div className="level-complete-container">
      <style>{`
        /* Reset global */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        .level-complete-container {
          min-height: 100vh;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: max(env(safe-area-inset-top), 20px) max(20px, env(safe-area-inset-left)) max(env(safe-area-inset-bottom), 30px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          opacity: 0;
          animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Header Section */
        .level-complete-header {
          text-align: center;
          margin-bottom: 40px;
          opacity: 0;
          animation: slideDown 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
        }

        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .level-complete-title {
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .level-complete-subtitle {
          font-size: 15px;
          font-weight: 600;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Stats Grid */
        .stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          text-align: center;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .stat-card:nth-child(1) { animation-delay: 0.3s; }
        .stat-card:nth-child(2) { animation-delay: 0.4s; }
        .stat-card:nth-child(3) { animation-delay: 0.5s; }
        .stat-card:nth-child(4) { animation-delay: 0.6s; }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .stat-label {
          font-size: 12px;
          font-weight: 700;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 48px;
          font-weight: 800;
          line-height: 1;
          color: #FFFFFF;
        }

        .stat-value.success {
          color: #30D158;
        }

        .stat-value.error {
          color: #FF453A;
        }

        .stat-value.xp {
          color: #FF9500;
        }

        .stat-value.level {
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Accuracy Circle */
        .accuracy-section {
          width: 100%;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s forwards;
        }

        .accuracy-card {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .accuracy-circle-container {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto 20px;
        }

        .accuracy-circle-bg {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
        }

        .accuracy-circle {
          position: absolute;
          top: 0;
          left: 0;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 8px solid transparent;
          transform: rotate(-90deg);
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .accuracy-percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
        }

        .accuracy-label {
          font-size: 13px;
          font-weight: 700;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .performance-message {
          font-size: 18px;
          font-weight: 700;
          margin-top: 8px;
        }

        /* Streak Section */
        .streak-section {
          width: 100%;
          margin-bottom: 32px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
        }

        .streak-card {
          background: linear-gradient(135deg, rgba(255, 149, 0, 0.15) 0%, rgba(255, 136, 0, 0.1) 100%);
          border: 1px solid #FF9500;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }

        .streak-value {
          font-size: 32px;
          font-weight: 800;
          color: #FF9500;
          margin-bottom: 4px;
        }

        .streak-label {
          font-size: 13px;
          font-weight: 600;
          color: #FF9500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Buttons Container */
        .buttons-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s forwards;
        }

        .continue-button,
        .home-button {
          width: 100%;
          height: 56px;
          border: none;
          border-radius: 16px;
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 800;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-button {
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          box-shadow: 0 6px 24px rgba(48, 209, 88, 0.3);
        }

        .continue-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(48, 209, 88, 0.4);
        }

        .continue-button:active {
          transform: scale(0.98);
        }

        .home-button {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .home-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .home-button:active {
          transform: scale(0.98);
        }

        /* Responsive */
        @media (max-width: 375px) {
          .level-complete-title {
            font-size: 24px;
          }

          .stat-value {
            font-size: 42px;
          }

          .accuracy-circle-container,
          .accuracy-circle-bg,
          .accuracy-circle {
            width: 120px;
            height: 120px;
          }

          .accuracy-percentage {
            font-size: 32px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="level-complete-header">
        <div className="level-complete-title">Niveau {level} complété</div>
        <div className="level-complete-subtitle">{getPerformanceMessage()}</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Correct</div>
          <div className="stat-value success">{stats.correctAnswers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Incorrect</div>
          <div className="stat-value error">{stats.incorrectAnswers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">XP gagnés</div>
          <div className="stat-value xp">+{stats.xpGained}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Niveau</div>
          <div className="stat-value level">{stats.currentUserLevel}</div>
        </div>
      </div>

      {/* Accuracy Circle */}
      <div className="accuracy-section">
        <div className="accuracy-card">
          <div className="accuracy-label">Précision</div>
          <div className="accuracy-circle-container">
            <div className="accuracy-circle-bg"></div>
            <div
              className="accuracy-circle"
              style={{
                borderColor: getPerformanceColor(),
                borderTopColor: 'transparent',
                borderRightColor: accuracy >= 25 ? getPerformanceColor() : 'transparent',
                borderBottomColor: accuracy >= 50 ? getPerformanceColor() : 'transparent',
                borderLeftColor: accuracy >= 75 ? getPerformanceColor() : 'transparent'
              }}
            ></div>
            <div className="accuracy-percentage" style={{ color: getPerformanceColor() }}>
              {accuracy}%
            </div>
          </div>
          <div className="performance-message" style={{ color: getPerformanceColor() }}>
            {getPerformanceMessage()}
          </div>
        </div>
      </div>

      {/* Streak */}
      {stats.streak > 0 && (
        <div className="streak-section">
          <div className="streak-card">
            <div className="streak-value">{stats.streak} jours</div>
            <div className="streak-label">Série en cours</div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="buttons-container">
        <button className="continue-button" onClick={onContinue}>
          Continuer
        </button>
        <button className="home-button" onClick={() => navigate('/home')}>
          Retour au menu
        </button>
      </div>
    </div>
  );
};

export default LevelComplete;
