import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useHaptic from '../hooks/useHaptic';
import FeedbackGlow from '../components/common/FeedbackGlow';
import { playTypingSound, playSuccessSound } from '../utils/soundEffects';

const LevelComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { triggerSuccess, triggerLight } = useHaptic();

  // Phase: 'stats' ou 'xp-collect'
  const [phase, setPhase] = useState('stats');

  // Stats phase state
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  // XP Collection phase state
  const [tapCount, setTapCount] = useState(0);
  const [currentLine, setCurrentLine] = useState('$ ');
  const [showGlow, setShowGlow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

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

  // Extraire le numéro de niveau depuis le format "difficulty_levelNumber" (ex: "1_1" -> 1)
  const levelNumber = typeof level === 'string' ? level.split('_')[1] : level;

  // Formatter le temps en minutes:secondes
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ==================== STATS PHASE - SLIDER ====================

  const getSliderPosition = useCallback((clientX) => {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, []);

  const handleSlideComplete = useCallback(() => {
    setIsSliding(false);
    isDragging.current = false;
    setSlideProgress(100);
    triggerSuccess();

    // Transition vers phase XP après animation
    setTimeout(() => {
      setPhase('xp-collect');
    }, 300);
  }, [triggerSuccess]);

  // Touch handlers
  const handleTouchStart = () => {
    setIsSliding(true);
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;
    const percentage = getSliderPosition(e.touches[0].clientX);
    setSlideProgress(percentage);

    if (percentage >= 95) {
      handleSlideComplete();
    }
  };

  const handleTouchEnd = () => {
    if (slideProgress < 95) {
      setSlideProgress(0);
    }
    setIsSliding(false);
    isDragging.current = false;
  };

  // Mouse handlers (support desktop)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsSliding(true);
    isDragging.current = true;
    const percentage = getSliderPosition(e.clientX);
    setSlideProgress(percentage);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const percentage = getSliderPosition(e.clientX);
    setSlideProgress(percentage);

    if (percentage >= 95) {
      handleSlideComplete();
    }
  }, [getSliderPosition, handleSlideComplete]);

  const handleMouseUp = useCallback(() => {
    if (slideProgress < 95) {
      setSlideProgress(0);
    }
    setIsSliding(false);
    isDragging.current = false;
  }, [slideProgress]);

  // Global mouse events pour drag hors du slider
  useEffect(() => {
    if (phase !== 'stats') return;

    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isSliding) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSliding, phase, handleMouseMove, handleMouseUp]);

  // ==================== XP COLLECTION PHASE ====================

  // Typewriter effect pour un mot
  const typeWord = useCallback((word, callback) => {
    setIsAnimating(true);
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < word.length) {
        playTypingSound();
        setCurrentLine(prev => prev + word[charIndex]);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsAnimating(false);
        if (callback) callback();
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  // Calculer le prochain niveau (fix du bug string + 1)
  const getNextLevel = useCallback(() => {
    if (!currentExerciseLevel) return null;
    const parts = currentExerciseLevel.split('_');
    if (parts.length !== 2) return null;
    const [diff, lvl] = parts;
    return `${diff}_${parseInt(lvl, 10) + 1}`;
  }, [currentExerciseLevel]);

  // Animation finale après "push"
  const handleFinalTap = useCallback(() => {
    setTimeout(() => {
      setCurrentLine(prev => prev + '\n[remote: Success]');
      setShowCursor(false);
      setIsComplete(true);

      triggerSuccess();
      playSuccessSound();
      setShowGlow(true);

      // Navigation vers le prochain niveau après 1.5s
      // Note: PAS de completeLevel ici car déjà fait dans Exercise.jsx via completeLevelWithBatch
      setTimeout(() => {
        navigate('/exercise', {
          state: {
            difficulty,
            language: 'PYTHON'
          }
        });
      }, 1500);
    }, 400);
  }, [triggerSuccess, navigate, difficulty]);

  // Gérer le tap pour XP collection (3 taps: add, commit, push)
  const handleTap = useCallback(() => {
    if (isAnimating || tapCount >= 3 || isComplete) return;

    // Séquence réduite à 3 taps
    const words = [
      `>git add Score`,           // Tap 1
      `\n$ >git commit -m "+${totalXP}XP"`, // Tap 2
      `\n$ >git push`             // Tap 3
    ];

    const currentWord = words[tapCount];
    if (!currentWord) return;

    triggerLight();

    const currentTapIndex = tapCount;

    typeWord(currentWord, () => {
      setTapCount(prev => prev + 1);

      if (currentTapIndex === 2) {
        handleFinalTap();
      }
    });
  }, [isAnimating, tapCount, isComplete, totalXP, triggerLight, typeWord, handleFinalTap]);

  // Ne rien afficher si pas de stats
  if (!stats) return null;

  return (
    <div className="level-complete-container">
      <style>{`
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

        /* ==================== STATS PHASE ==================== */

        .stats-phase {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

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
          font-size: 48px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          margin: 0;
          line-height: 1;
          transform: skewX(-5deg);
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
        .stat-card.time { animation-delay: 0.4s; }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .stat-label {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
          color: #FFFFFF;
        }

        .stat-value.success {
          color: #30D158;
          text-shadow: 0 0 20px rgba(48, 209, 88, 0.8);
        }

        .stat-value.error {
          color: #FF453A;
          text-shadow: 0 0 20px rgba(255, 69, 58, 0.8);
        }

        .stat-value.time {
          color: #1871BE;
          font-size: 44px;
          text-shadow: 0 0 20px rgba(24, 113, 190, 0.8);
        }

        /* Streak */
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
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
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

        /* Slider */
        .slider-container {
          width: 100%;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s forwards;
        }

        .xp-slider {
          position: relative;
          width: 100%;
          height: 80px;
          background: linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          cursor: grab;
          user-select: none;
        }

        .xp-slider:active {
          cursor: grabbing;
        }

        .slider-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          border-radius: 20px;
          transition: width 0.05s ease-out;
        }

        .slider-thumb {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          background: #FFFFFF;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: left 0.05s ease-out;
          z-index: 2;
        }

        .slider-thumb-arrow {
          color: #30D158;
          font-size: 24px;
          font-weight: 900;
        }

        .xp-slider-text {
          position: absolute;
          top: 50%;
          right: 24px;
          transform: translateY(-50%);
          font-size: 24px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          z-index: 1;
          pointer-events: none;
        }

        /* ==================== XP COLLECT PHASE ==================== */

        .xp-phase {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          animation: fadeIn 0.6s ease forwards;
        }

        .xp-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .xp-title {
          font-size: 20px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .terminal-block {
          width: 100%;
          background: #000000;
          border: 2px solid #30D158;
          border-radius: 12px;
          padding: 20px;
          min-height: 180px;
          max-height: 250px;
          overflow-y: auto;
          font-size: 16px;
          line-height: 1.6;
          box-shadow: 0 0 40px rgba(48, 209, 88, 0.3);
          transition: box-shadow 0.3s ease;
        }

        .terminal-block.success {
          box-shadow: 0 0 60px rgba(48, 209, 88, 0.6);
        }

        .terminal-content {
          color: #30D158;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .terminal-prompt { color: #FFD700; }
        .terminal-chevron { color: #30D158; }
        .terminal-command { color: #FF9500; }
        .terminal-action { color: #30D158; }
        .terminal-flag { color: #1871BE; }
        .terminal-message { color: #FFFFFF; }
        .terminal-file { color: #FF9500; }
        .terminal-success { color: #30D158; font-weight: 700; }

        .cursor {
          display: inline-block;
          width: 10px;
          height: 18px;
          background: #30D158;
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .tap-instructions {
          text-align: center;
          margin: 20px 0;
        }

        .tap-instruction {
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .tap-counter {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          margin-top: 8px;
        }

        .tap-zone {
          width: 100%;
          flex: 1;
          min-height: 200px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed rgba(48, 209, 88, 0.3);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          margin-top: 20px;
        }

        .tap-zone:active {
          transform: scale(0.95);
          background: rgba(48, 209, 88, 0.08);
          border-color: rgba(48, 209, 88, 0.5);
        }

        .xp-display {
          font-size: 72px;
          font-weight: 900;
          color: #FF9500;
          text-shadow: 0 0 30px rgba(255, 149, 0, 0.8);
          line-height: 1;
          margin-bottom: 8px;
        }

        .xp-label {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .level-complete-title { font-size: 32px; }
          .title-hash { font-size: 32px; }
          .stat-value { font-size: 42px; }
          .terminal-block { font-size: 14px; padding: 16px; }
          .xp-display { font-size: 56px; }
        }
      `}</style>

      {phase === 'stats' ? (
        /* ==================== STATS PHASE ==================== */
        <div className="stats-phase">
          <div className="level-complete-header">
            <h1 className="level-complete-title">
              <span className="title-hash">//</span>
              Level {levelNumber} Completed
            </h1>
          </div>

          <div className="stats-grid">
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

            <div className="stat-card time">
              <div className="stat-label">Time</div>
              <div className="stat-value time">{formatTime(stats.timeElapsed || 0)}</div>
            </div>
          </div>

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

          <div className="slider-container">
            <div
              ref={sliderRef}
              className="xp-slider"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
            >
              <div
                className="slider-fill"
                style={{ width: `${slideProgress}%` }}
              />
              <div
                className="slider-thumb"
                style={{ left: `calc(${slideProgress}% - ${slideProgress * 0.6}px + 10px)` }}
              >
                <span className="slider-thumb-arrow">→</span>
              </div>
              <div className="xp-slider-text">GET XP</div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== XP COLLECT PHASE ==================== */
        <div className="xp-phase" onClick={handleTap}>
          <div className="xp-header">
            <h2 className="xp-title">// XP Earned</h2>
          </div>

          <div className={`terminal-block ${tapCount === 3 ? 'success' : ''}`}>
            <div className="terminal-content">
              {renderTerminalContent(currentLine)}
              {showCursor && <span className="cursor"></span>}
            </div>
          </div>

          <div className="tap-instructions">
            <p className="tap-instruction">
              {tapCount < 3 ? 'TAP TO COMMIT' : 'SUCCESS!'}
            </p>
            <p className="tap-counter">
              [{tapCount}/3]
            </p>
          </div>

          <div className="tap-zone">
            <div className="xp-display">+{totalXP}</div>
            <div className="xp-label">XP</div>
          </div>

          {showGlow && <FeedbackGlow type="success" />}
        </div>
      )}
    </div>
  );
};

// Fonction pour render le terminal avec syntax highlighting
const renderTerminalContent = (content) => {
  const lines = content.split('\n');
  return lines.map((line, lineIndex) => (
    <div key={lineIndex}>{highlightSyntax(line)}</div>
  ));
};

// Fonction syntax highlighting
const highlightSyntax = (line) => {
  if (line.startsWith('$ ')) {
    const rest = line.substring(2);
    return (
      <>
        <span className="terminal-prompt">$ </span>
        {highlightGitCommand(rest)}
      </>
    );
  }

  if (line.includes('[remote:')) {
    return <span className="terminal-success">{line}</span>;
  }

  return <span>{line}</span>;
};

// Highlight commandes Git
const highlightGitCommand = (text) => {
  const parts = [];

  // >git
  if (text.startsWith('>git')) {
    parts.push(<span key="chevron" className="terminal-chevron">&gt;</span>);
    parts.push(<span key="git" className="terminal-command">git</span>);
    text = text.substring(4);
  }

  // add Score
  if (text.includes(' add ')) {
    const idx = text.indexOf(' add ');
    parts.push(<span key="add" className="terminal-action"> add</span>);
    const afterAdd = text.substring(idx + 5);
    if (afterAdd) {
      parts.push(<span key="file" className="terminal-file"> {afterAdd.trim()}</span>);
    }
    return parts;
  }

  // commit -m "message"
  if (text.includes(' commit')) {
    parts.push(<span key="commit" className="terminal-action"> commit</span>);

    if (text.includes(' -m')) {
      parts.push(<span key="flag" className="terminal-flag"> -m</span>);

      const messageMatch = text.match(/"([^"]+)"/);
      if (messageMatch) {
        parts.push(<span key="message" className="terminal-message"> "{messageMatch[1]}"</span>);
      }
    }
    return parts;
  }

  // push
  if (text.includes(' push')) {
    parts.push(<span key="push" className="terminal-action"> push</span>);
    return parts;
  }

  return parts.length > 0 ? parts : text;
};

export default LevelComplete;
