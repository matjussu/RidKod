import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useHaptic from '../hooks/useHaptic';

const LevelComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { triggerSuccess } = useHaptic();
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(100);
  const sliderRef = useRef(null);

  // Récupérer les données depuis location.state
  const { stats, level, totalXP, difficulty, currentExerciseLevel } = location.state || {};

  useEffect(() => {
    // Rediriger si pas de données
    if (!stats) {
      navigate('/home');
      return;
    }
    triggerSuccess();
  }, [stats, navigate, triggerSuccess]);

  // Extraire le numéro de niveau depuis le format "difficulty_levelNumber" (ex: "1_1" → 1)
  const levelNumber = typeof level === 'string' ? level.split('_')[1] : level;

  // Formatter le temps en minutes:secondes
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gérer le slide
  const handleTouchStart = () => {
    setIsSliding(true);
  };

  const handleTouchMove = (e) => {
    if (!isSliding || !sliderRef.current) return;

    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setSlideProgress(100 - percentage);

    if (percentage >= 95) {
      handleSlideComplete();
    }
  };

  const handleTouchEnd = () => {
    if (slideProgress > 10) {
      // Reset si pas complété
      setSlideProgress(100);
    }
    setIsSliding(false);
  };

  const handleSlideComplete = () => {
    setIsSliding(false);
    setSlideProgress(0);
    triggerSuccess();
    setTimeout(() => {
      // Naviguer vers XPCollect avec les données nécessaires
      navigate('/xp-collect', {
        state: {
          totalXP,
          difficulty,
          currentExerciseLevel
        }
      });
    }, 300);
  };

  // Ne rien afficher si pas de stats (pendant la redirection)
  if (!stats) return null;

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
          margin-top: 80px;
          margin-bottom: 48px;
          opacity: 0;
          animation: slideDown 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
        }

        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .level-complete-title {
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 48px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          margin: 0;
          line-height: 1;
          transform: skewX(-5deg);
          letter-spacing: 0px;
          text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
          position: relative;
        }

        .level-complete-title::before {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 4px;
          background: linear-gradient(90deg, #30D158 0%, #088201 100%);
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(48, 209, 88, 0.4);
        }

        .title-hash {
          color: #30D158;
          font-weight: 900;
          font-size: 48px;
          text-shadow: 2px 2px 8px rgba(48, 209, 88, 0.6);
          -webkit-text-fill-color: #30D158;
        }

        /* Stats Grid */
        .stats-grid {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 28px 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          text-align: center;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          background: rgba(255, 255, 255, 0.12);
        }

        .stats-row { animation-delay: 0.3s; }

        .stat-card.time {
          animation-delay: 0.4s;
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .stat-label {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
          color: #FFFFFF;
        }

        .stat-value.success {
          color: #30D158;
          text-shadow: 0 0 20px rgba(48, 209, 88, 0.8),
                       0 0 40px rgba(48, 209, 88, 0.5),
                       0 0 60px rgba(48, 209, 88, 0.3);
        }

        .stat-value.error {
          color: #FF453A;
          text-shadow: 0 0 20px rgba(255, 69, 58, 0.8),
                       0 0 40px rgba(255, 69, 58, 0.5),
                       0 0 60px rgba(255, 69, 58, 0.3);
        }

        .stat-value.time {
          color: #1871BE;
          font-size: 44px;
          text-shadow: 0 0 20px rgba(24, 113, 190, 0.8),
                       0 0 40px rgba(24, 113, 190, 0.5),
                       0 0 60px rgba(24, 113, 190, 0.3);
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
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #FF9500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-shadow: 0 0 20px rgba(255, 149, 0, 0.6);
        }

        .flame-icon {
          font-size: 32px;
          filter: drop-shadow(0 0 10px rgba(255, 149, 0, 0.8));
        }

        /* Slider Container */
        .slider-container {
          width: 100%;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s forwards;
        }

        .xp-slider {
          position: relative;
          width: 100%;
          height: 80px;
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(48, 209, 88, 0.4);
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
        }

        .xp-slider-text {
          position: absolute;
          top: 50%;
          right: -15px;
          transform: translateY(-50%) skewX(-12deg);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 95px;
          font-weight: 900;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0px;
          word-spacing: -40px;
          text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
          z-index: 2;
          pointer-events: none;
        }

        .xp-slider-arrow {
          position: absolute;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
          font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
          font-size: 20px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.7);
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 2;
          pointer-events: none;
          animation: slideHint 2s ease-in-out infinite;
        }

        @keyframes slideHint {
          0%, 100% {
            opacity: 0.7;
            transform: translateY(-50%) translateX(0px);
          }
          50% {
            opacity: 1;
            transform: translateY(-50%) translateX(10px);
          }
        }

        .xp-slider.completed {
          background: linear-gradient(135deg, #088201 0%, #065c01 100%);
          animation: success-flash 0.5s ease;
        }

        @keyframes success-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
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
        <h1 className="level-complete-title">
          <span className="title-hash">//</span>
          Level {levelNumber} Completed
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Row 1 : Correct / Incorrect */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Correct</div>
            <div className="stat-value success">{stats.correctAnswers}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Incorrect</div>
            <div className="stat-value error">{stats.incorrectAnswers}</div>
          </div>
        </div>

        {/* Row 2 : Temps (full width) */}
        <div className="stat-card time">
          <div className="stat-label">Time</div>
          <div className="stat-value time">{formatTime(stats.timeElapsed || 0)}</div>
        </div>
      </div>

      {/* Streak */}
      {stats.streak > 0 && (
        <div className="streak-section">
          <div className="streak-card">
            <div className="streak-value">
              <span className="flame-icon">🔥</span>
              {stats.streak} streak
            </div>
          </div>
        </div>
      )}

      {/* Slider XP */}
      <div className="slider-container">
        <div
          ref={sliderRef}
          className={`xp-slider ${isSliding ? 'sliding' : ''} ${slideProgress === 0 ? 'completed' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="xp-slider-arrow">&gt;&gt;&gt;</div>
          <div className="xp-slider-text">GET XP</div>
        </div>
      </div>
    </div>
  );
};

export default LevelComplete;
