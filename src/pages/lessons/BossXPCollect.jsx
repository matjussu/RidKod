import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import FeedbackGlow from '../../components/common/FeedbackGlow';
import { playTypingSound } from '../../utils/soundEffects';
import { useProgress } from '../../context/ProgressContext';

const BossXPCollect = () => {
  const { language, moduleId } = useParams();
  const navigate = useNavigate();
  const { triggerLight, triggerSuccess } = useHaptic();
  const { progress } = useProgress();
  const [tapCount, setTapCount] = useState(0);
  const [currentLine, setCurrentLine] = useState('$ ');
  const [showGlow, setShowGlow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Calculer le label du boss
  const moduleNumber = parseInt(moduleId.split('_')[2]); // py_mod_001 → 1
  const bossLabel = `BOSS ${moduleNumber}`;

  // Typewriter effect pour un mot
  const typeWord = useCallback((word, callback) => {
    setIsAnimating(true);
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < word.length) {
        const char = word[charIndex];
        playTypingSound();
        setCurrentLine(prev => prev + char);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsAnimating(false);
        if (callback) callback();
      }
    }, 40); // 40ms par lettre (plus rapide que training)

    return () => clearInterval(typeInterval);
  }, []);

  // Gérer le tap
  const handleTap = () => {
    if (isAnimating || tapCount >= 11) return;

    // Séquence git add/commit/push avec label boss
    const words = [
      '>git',           // Tap 1
      ' add',           // Tap 2
      ` "${bossLabel}"`, // Tap 3
      '\n$ ',           // Tap 4 - Nouvelle ligne + prompt
      '>git',           // Tap 5
      ' commit',        // Tap 6
      ' -m',            // Tap 7
      ' "+100 XP"',     // Tap 8
      '\n$ ',           // Tap 9 - Nouvelle ligne + prompt
      '>git',           // Tap 10
      ' push'           // Tap 11
    ];

    console.log(`🖱️ Tap ${tapCount + 1}/11 - Word: "${words[tapCount]}" - bossLabel: ${bossLabel}`);

    const currentWord = words[tapCount];

    if (!currentWord) {
      console.error('❌ Word not found for tap', tapCount);
      return;
    }

    // Vibration légère
    triggerLight();

    // Sauvegarder l'index actuel avant l'incrément
    const currentTapIndex = tapCount;

    // Typewriter effect
    typeWord(currentWord, () => {
      setTapCount(prev => prev + 1);

      // Si c'était le dernier tap (index 10 = 11ème tap)
      if (currentTapIndex === 10) {
        handleFinalTap();
      }
    });
  };

  // Animation finale après push
  const handleFinalTap = useCallback(async () => {
    setTimeout(async () => {
      // Ajouter ligne de succès
      setCurrentLine(prev => prev + '\n[remote: ✓ +100 XP collected]');
      setShowCursor(false);

      // Vibration forte
      triggerSuccess();

      // Glow vert
      setShowGlow(true);

      // Attendre 1.5s puis naviguer
      setTimeout(() => {
        navigate(`/lessons/${language}/${moduleId}/lessons`);
      }, 1500);
    }, 400);
  }, [triggerSuccess, navigate, language, moduleId]);

  return (
    <div className="xp-collect-container" onClick={handleTap}>
      <style>{`
        /* Reset global */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        .xp-collect-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          min-height: 100vh;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: max(env(safe-area-inset-top), 40px) max(20px, env(safe-area-inset-left)) max(env(safe-area-inset-bottom), 8px) max(20px, env(safe-area-inset-right));
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          opacity: 0;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          z-index: 1000;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Header */
        .xp-header {
          text-align: center;
          margin-bottom: 24px;
          opacity: 0;
          animation: slideDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
        }

        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .xp-title {
          font-size: 20px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        /* Terminal Block */
        .terminal-block {
          width: 100%;
          background: #000000;
          border: 2px solid #30D158;
          border-radius: 12px;
          padding: 20px;
          min-height: 180px;
          max-height: 250px;
          overflow-y: auto;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 16px;
          line-height: 1.6;
          box-shadow: 0 0 40px rgba(48, 209, 88, 0.3),
                      0 4px 16px rgba(0, 0, 0, 0.4);
          position: relative;
          opacity: 0;
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
          transition: box-shadow 0.3s ease;
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .terminal-block.success {
          box-shadow: 0 0 60px rgba(48, 209, 88, 0.6),
                      0 4px 16px rgba(0, 0, 0, 0.4);
          border-color: #30D158;
        }

        .terminal-content {
          color: #30D158;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* Syntax highlighting */
        .terminal-prompt { color: #FFD700; }
        .terminal-chevron { color: #FF9500; }
        .terminal-command { color: #FF9500; }
        .terminal-action { color: #FFD700; }
        .terminal-flag { color: #1871BE; }
        .terminal-message { color: #FFFFFF; }
        .terminal-file { color: #FF9500; }
        .terminal-success { color: #30D158; font-weight: 700; }

        /* Cursor */
        .cursor {
          display: inline-block;
          width: 10px;
          height: 18px;
          background: #FFD700;
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Instructions */
        .tap-instructions {
          text-align: center;
          margin: 20px 0;
          opacity: 0;
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        .tap-instruction {
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 8px 0;
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
        }

        /* Tap Zone */
        .tap-zone {
          width: 100%;
          flex: 1;
          min-height: 250px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed rgba(48, 209, 88, 0.3);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0;
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
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
          color: #FFD700;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                       0 0 60px rgba(255, 215, 0, 0.4);
          line-height: 1;
          margin-bottom: 8px;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .terminal-block {
            font-size: 14px;
            padding: 16px;
            min-height: 160px;
          }

          .xp-display {
            font-size: 56px;
          }

          .tap-instruction {
            font-size: 14px;
          }
        }

        /* Animation scale bounce sur tap */
        @keyframes tapBounce {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          75% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .tap-zone.tapped {
          animation: tapBounce 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>

      {/* Header */}
      <div className="xp-header">
        <h2 className="xp-title">//GET YOUR XP</h2>
      </div>

      {/* Terminal Block */}
      <div className={`terminal-block ${tapCount === 11 ? 'success' : ''}`}>
        <div className="terminal-content">
          {renderTerminalContent(currentLine, showCursor)}
        </div>
      </div>

      {/* Instructions */}
      <div className="tap-instructions">
        <p className="tap-instruction">
          {tapCount < 11 ? 'TAP TO COMMIT' : 'SUCCESS!'}
        </p>
        <p className="tap-counter">
          {tapCount < 11 ? `[${tapCount}/11]` : '[11/11]'}
        </p>
      </div>

      {/* Tap Zone */}
      <div className="tap-zone">
        <div className="xp-display">+100 XP</div>
      </div>

      {/* Feedback Glow */}
      {showGlow && <FeedbackGlow type="success" />}
    </div>
  );
};

// Fonction pour render le terminal avec syntax highlighting
const renderTerminalContent = (content, showCursor) => {
  // Séparer par lignes
  const lines = content.split('\n');

  return lines.map((line, lineIndex) => (
    <div key={lineIndex}>
      {highlightSyntax(line)}
      {/* Ajouter le curseur à la fin de la dernière ligne */}
      {showCursor && lineIndex === lines.length - 1 && (
        <span className="cursor"></span>
      )}
    </div>
  ));
};

// Fonction syntax highlighting
const highlightSyntax = (line) => {
  // Prompt $
  if (line.startsWith('$ ')) {
    const rest = line.substring(2);
    return (
      <>
        <span className="terminal-prompt">$ </span>
        {highlightGitCommand(rest)}
      </>
    );
  }

  // Message de succès
  if (line.includes('[remote:')) {
    return <span className="terminal-success">{line}</span>;
  }

  return <span>{line}</span>;
};

// Highlight commandes Git
const highlightGitCommand = (text) => {
  const parts = [];
  let currentIndex = 0;

  // >git
  if (text.startsWith('>git')) {
    parts.push(<span key="chevron" className="terminal-chevron">&gt;</span>);
    parts.push(<span key="git" className="terminal-command">git</span>);
    currentIndex = 4;
  }

  // add (séparé pour apparition progressive)
  if (text.includes(' add')) {
    const addIndex = text.indexOf(' add');
    if (addIndex >= currentIndex) {
      parts.push(<span key="add" className="terminal-action"> add</span>);
      currentIndex = addIndex + 4;
    }
  }

  // Boss label entre guillemets (seulement si add est présent et pas commit)
  if (text.includes(' add') && !text.includes(' commit')) {
    const bossMatch = text.match(/ add "([^"]+)"/);
    if (bossMatch && text.indexOf(bossMatch[0]) >= currentIndex - 4) {
      parts.push(<span key="boss" className="terminal-file"> "{bossMatch[1]}"</span>);
      currentIndex = text.indexOf(bossMatch[0]) + bossMatch[0].length;
    }
  }

  // commit (séparé pour apparition progressive)
  if (text.includes(' commit')) {
    const commitIndex = text.indexOf(' commit');
    if (commitIndex >= currentIndex) {
      parts.push(<span key="commit" className="terminal-action"> commit</span>);
      currentIndex = commitIndex + 7;
    }
  }

  // -m (séparé pour apparition progressive)
  if (text.includes(' -m')) {
    const flagIndex = text.indexOf(' -m');
    if (flagIndex >= currentIndex) {
      parts.push(<span key="flag" className="terminal-flag"> -m</span>);
      currentIndex = flagIndex + 3;
    }
  }

  // Message XP entre guillemets (seulement si -m est présent)
  if (text.includes(' -m')) {
    const messageMatch = text.match(/ -m "([^"]+)"/);
    if (messageMatch && text.indexOf(messageMatch[0]) >= currentIndex - 3) {
      parts.push(<span key="message" className="terminal-message"> "{messageMatch[1]}"</span>);
      currentIndex = text.indexOf(messageMatch[0]) + messageMatch[0].length;
    }
  }

  // push
  if (text.includes(' push')) {
    const pushIndex = text.indexOf(' push');
    if (pushIndex >= currentIndex) {
      parts.push(<span key="push" className="terminal-action"> push</span>);
    }
  }

  return parts.length > 0 ? parts : text;
};

export default BossXPCollect;
