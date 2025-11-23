import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import FeedbackGlow from '../../components/common/FeedbackGlow';
import { useProgress } from '../../context/ProgressContext';

const XPCollectLessons = () => {
  const { language, moduleId, nodeId } = useParams();
  const navigate = useNavigate();
  const { triggerLight, triggerSuccess } = useHaptic();
  const { progress, updateProgress } = useProgress();
  const [tapCount, setTapCount] = useState(0);
  const [currentLine, setCurrentLine] = useState('$ ');
  const [showGlow, setShowGlow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Calculer le numéro de leçon depuis nodeId et moduleId
  const MODULE_XP_OFFSETS = {
    'py_mod_001': 0,
    'py_mod_002': 6,
    'py_mod_003': 12,
    'py_mod_004': 16,
    'py_mod_005': 21,
    'py_mod_006': 26
  };

  const getLessonLabel = () => {
    const offset = MODULE_XP_OFFSETS[moduleId] || 0;
    const nodeNumber = parseInt(nodeId.split('_')[1]); // xp_1 → 1
    const lessonNumberInModule = nodeNumber - offset; // Position dans le module
    const moduleNumber = parseInt(moduleId.split('_')[2]); // py_mod_001 → 1
    return `${moduleNumber}.${lessonNumberInModule}`;
  };

  const lessonLabel = getLessonLabel();

  // Vérifier si le nœud est déjà collecté
  useEffect(() => {
    if (!progress) return;

    // Si déjà collecté, retourner immédiatement
    if (progress.xpNodesCollected?.[nodeId]) {
      console.warn(`Nœud XP ${nodeId} déjà collecté`);
      navigate(`/lessons/${language}/${moduleId}/lessons`, { replace: true });
    }
  }, [progress, nodeId, language, moduleId, navigate]);

  // Typewriter effect pour un mot
  const typeWord = useCallback((word, callback) => {
    setIsAnimating(true);
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < word.length) {
        const char = word[charIndex];
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

    // Séquence git add/commit/push avec numéro de leçon
    const words = [
      '>git',           // Tap 1
      ' add',           // Tap 2
      ` "${lessonLabel}"`, // Tap 3 
      '\n$ ',           // Tap 4 - Nouvelle ligne + prompt
      '>git',           // Tap 5
      ' commit',        // Tap 6
      ' -m',            // Tap 7
      ' "+30 XP"',      // Tap 8
      '\n$ ',           // Tap 9 - Nouvelle ligne + prompt
      '>git',           // Tap 10
      ' push'           // Tap 11
    ];

    console.log(`🖱️ Tap ${tapCount + 1}/11 - Word: "${words[tapCount]}" - lessonLabel: ${lessonLabel}`);

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
      setCurrentLine(prev => prev + '\n[remote: ✓ +30 XP collected]');
      setShowCursor(false);

      // Vibration forte
      triggerSuccess();

      // Glow vert
      setShowGlow(true);

      // Mettre à jour la progression
      try {
        console.log(`💎 Collecte de +30 XP pour le nœud ${nodeId}`);

        await updateProgress({
          totalXP: (progress?.totalXP || 0) + 30,
          xpNodesCollected: {
            ...progress?.xpNodesCollected,
            [nodeId]: true
          }
        });

        console.log(`✅ Nœud ${nodeId} collecté et sauvegardé !`);
      } catch (error) {
        console.error('Erreur lors de la collecte d\'XP:', error);
      }

      // Transition après 1.5s vers LessonList
      setTimeout(() => {
        navigate(`/lessons/${language}/${moduleId}/lessons`);
      }, 1500);
    }, 400);
  }, [triggerSuccess, updateProgress, progress, nodeId, navigate, language, moduleId]);

  // Ne rien afficher si pas de données (pendant la redirection)
  if (!progress) {
    return (
      <div style={{
        background: '#1A1919',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF'
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <div className="xp-collect-lessons-container" onClick={handleTap}>
      <style>{`
        /* Reset global */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        .xp-collect-lessons-container {
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
          padding: max(env(safe-area-inset-top), 40px) max(20px, env(safe-area-inset-left)) max(env(safe-area-inset-bottom), 40px);
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
          border: 2px solid #FFD700;
          border-radius: 12px;
          padding: 20px;
          min-height: 180px;
          max-height: 250px;
          overflow-y: auto;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 16px;
          line-height: 1.6;
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.3),
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
          color: #FFD700;
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
          background: rgba(255, 215, 0, 0.03);
          border: 2px dashed rgba(255, 215, 0, 0.3);
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
          background: rgba(255, 215, 0, 0.08);
          border-color: rgba(255, 215, 0, 0.5);
        }

        /* Star Icon */
        .star-icon {
          font-size: 80px;
          margin-bottom: 16px;
          animation: starPulse 2s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
        }

        @keyframes starPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
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

        .xp-label {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 2px;
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

          .star-icon {
            font-size: 60px;
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
        <div className="xp-display">+30 XP</div>
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

  // Lesson number entre guillemets (seulement si add est présent et pas commit)
  if (text.includes(' add') && !text.includes(' commit')) {
    const lessonMatch = text.match(/ add "([^"]+)"/);
    if (lessonMatch && text.indexOf(lessonMatch[0]) >= currentIndex - 4) {
      parts.push(<span key="lesson" className="terminal-file"> "{lessonMatch[1]}"</span>);
      currentIndex = text.indexOf(lessonMatch[0]) + lessonMatch[0].length;
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

export default XPCollectLessons;
