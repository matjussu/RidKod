import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useHaptic from '../hooks/useHaptic';
import FeedbackGlow from '../components/common/FeedbackGlow';
import { playTypingSound, playSuccessSound } from '../utils/soundEffects';
import MascotteHappy from '../assets/Mascotte Happy.svg';

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

  // XP Collection phase state - simplifié
  const [tapCount, setTapCount] = useState(0);
  const [completedLines, setCompletedLines] = useState([]); // Lignes terminées
  const [currentTyping, setCurrentTyping] = useState('$ '); // Ligne en cours de frappe
  const [isTyping, setIsTyping] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showChoiceButtons, setShowChoiceButtons] = useState(false); // Afficher les boutons de choix

  // Récupérer les données depuis location.state
  const { stats, level, totalXP, difficulty, currentExerciseLevel } = location.state || {};

  // Score ring state pour l'animation
  const [scoreAnimated, setScoreAnimated] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const animationHasRun = useRef(false);

  // Calculs pour le score ring (accuracy)
  const total = stats ? stats.correctAnswers + stats.incorrectAnswers : 0;
  const percentage = total > 0 ? Math.round((stats?.correctAnswers / total) * 100) : 0;
  const circumference = 2 * Math.PI * 52; // radius = 52
  const accuracyOffset = scoreAnimated ? circumference - (percentage / 100) * circumference : circumference;

  // Calculs pour le time ring (horloge style - 0-60s)
  const seconds = stats?.timeElapsed || 0;
  const timeProgress = (seconds % 60) / 60; // 0 à 1 (recommence après 60s)
  const timeOffset = scoreAnimated ? circumference - (timeProgress * circumference) : circumference;

  useEffect(() => {
    // Rediriger si pas de données
    if (!stats) {
      navigate('/home');
      return;
    }

    // Empêcher l'animation de se relancer
    if (animationHasRun.current) return;
    animationHasRun.current = true;

    triggerSuccess();

    // Référence pour cleanup de l'intervalle
    let countInterval = null;

    // Calculer le pourcentage une seule fois
    const totalExercises = stats.correctAnswers + stats.incorrectAnswers;
    const targetPercentage = totalExercises > 0
      ? Math.round((stats.correctAnswers / totalExercises) * 100)
      : 0;

    // Animation du score ring après un délai
    const scoreTimer = setTimeout(() => {
      setScoreAnimated(true);

      // Animation count-up du pourcentage
      let current = 0;
      const increment = Math.max(targetPercentage / 30, 1); // Minimum 1 pour éviter les micro-incréments

      countInterval = setInterval(() => {
        current += increment;
        if (current >= targetPercentage) {
          setAnimatedPercentage(targetPercentage);
          clearInterval(countInterval);
        } else {
          setAnimatedPercentage(Math.floor(current));
        }
      }, 50);
    }, 800);

    return () => {
      clearTimeout(scoreTimer);
      if (countInterval) clearInterval(countInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, navigate]);

  // Extraire le numéro de niveau depuis le format "difficulty_levelNumber" (ex: "1_1" -> 1)
  const levelNumber = (typeof level === 'string' && level.includes('_'))
    ? level.split('_')[1]
    : (level || '1');

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

  // XP avec valeur par défaut
  const xpValue = totalXP || 0;

  // Les 3 commandes à afficher (sans le prompt $, on l'ajoute séparément)
  const commands = [
    `git add Score_${levelNumber}`,
    `git commit -m "+${xpValue}XP"`,
    'git push origin'
  ];

  // Effet typewriter pour une commande
  const typeCommand = useCallback((command, onComplete) => {
    setIsTyping(true);
    let index = 0;
    const fullCommand = '$ ' + command;

    // Commencer avec juste le prompt
    setCurrentTyping('$ ');

    const interval = setInterval(() => {
      if (index < command.length) {
        playTypingSound();
        setCurrentTyping('$ ' + command.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete(fullCommand);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Gérer le tap
  const handleTap = useCallback(() => {
    if (tapCount >= 3 || isComplete || isTyping) return;

    triggerLight();
    const currentTapIndex = tapCount;

    // Lancer le typewriter pour la commande actuelle
    typeCommand(commands[currentTapIndex], (fullLine) => {
      // Commande terminée - l'ajouter aux lignes complétées
      setCompletedLines(prev => [...prev, fullLine]);
      setCurrentTyping('$ '); // Reset pour prochaine ligne

      const newTapCount = currentTapIndex + 1;
      setTapCount(newTapCount);

      // Si c'était le dernier tap (3ème)
      if (newTapCount === 3) {
        setTimeout(() => {
          setCompletedLines(prev => [...prev, '[remote: Success]']);
          setCurrentTyping('');
          setIsComplete(true);
          triggerSuccess();
          playSuccessSound();
          setShowGlow(true);

          // Afficher les boutons de choix après un court délai
          setTimeout(() => {
            setShowChoiceButtons(true);
          }, 500);
        }, 300);
      }
    });
  }, [tapCount, isComplete, isTyping, commands, typeCommand, triggerLight, triggerSuccess]);

  // Navigation vers le niveau suivant
  const handleNextLevel = useCallback(() => {
    triggerLight();
    navigate('/exercise', {
      state: {
        difficulty,
        language: 'PYTHON'
      }
    });
  }, [navigate, difficulty, triggerLight]);

  // Retour au menu
  const handleBackToMenu = useCallback(() => {
    triggerLight();
    navigate('/home');
  }, [navigate, triggerLight]);

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
          min-height: -webkit-fill-available;
          background: var(--training-bg);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          padding-top: max(env(safe-area-inset-top), 20px);
          padding-left: max(20px, env(safe-area-inset-left));
          padding-right: max(20px, env(safe-area-inset-right));
          padding-bottom: max(env(safe-area-inset-bottom), 8px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
          opacity: 0;
          transform: scale(0.95) translateY(20px);
          filter: blur(10px);
          animation: dojoEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
}

        .level-complete-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(1, 182, 10, 0.03) 39px,
              rgba(1, 182, 10, 0.03) 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(1, 182, 10, 0.03) 39px,
              rgba(1, 182, 10, 0.03) 40px
            );
          pointer-events: none;
          z-index: 0;
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
          padding-top: 20px;
        }

        /* Celebration Header */
        .celebration-header {
          text-align: center;
          padding-top: 0px;
          margin-bottom: 60px;
          position: relative;
          overflow: visible;
        }

        /* Confetti */
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: visible;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: confettiFloat 3s ease-out infinite;
          z-index: -1;
        }

        .confetti-1 { left: 10%; top: 20%; background: #30D158; animation-delay: 0s; }
        .confetti-2 { left: 20%; top: 60%; background: #FF9500; animation-delay: 0.4s; }
        .confetti-3 { left: 35%; top: 10%; background: #1871BE; animation-delay: 0.8s; }
        .confetti-4 { left: 50%; top: 50%; background: #FFD700; animation-delay: 1.2s; }
        .confetti-5 { left: 65%; top: 15%; background: #30D158; animation-delay: 1.6s; }
        .confetti-6 { left: 80%; top: 55%; background: #FF453A; animation-delay: 2.0s; }
        .confetti-7 { left: 5%; top: 70%; background: #FFD700; animation-delay: 2.4s; }
        .confetti-8 { left: 90%; top: 30%; background: #FF9500; animation-delay: 2.8s; }

        @keyframes confettiFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-50px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Mascotte icon (sans cercle) */
        .mascotte-icon {
          width: 240px;
          height: 200px;
          object-fit: contain;
          margin: 0px auto;
          display: block;
          animation: mascotteEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
          opacity: 0;
          transform: scale(0.3);
        }

        @keyframes mascotteEntrance {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          60% {
            opacity: 1;
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Victory Title */
        .victory-title {
          font-size: 55px;
          font-weight: 900;
          font-style: italic;
          color: #FFFFFF;
          margin: 0;
          
          transform: skewX(-5deg);
          animation: titleSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s forwards;
          opacity: 0;
        }

        .title-hash {
          color: #30D158 !important;
          text-shadow: 0 0 20px rgba(48, 209, 88, 0.6);
          margin-right: -25px;
        }

        .victory-subtitle {
          font-size: 16px;
          font-weight: 600;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 8px 0 20px;
          animation: titleSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
          opacity: 0;
        }

        @keyframes titleSlide {
          from {
            opacity: 0;
            transform: translateY(20px) skewX(-5deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) skewX(-5deg);
          }
        }

        /* Rings Row - Accuracy + Time côte à côte */
        .rings-row {
          display: flex;
          gap: 24px;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 32px;
          animation: ringsEntrance 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
          opacity: 0;
        }

        @keyframes ringsEntrance {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .ring-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ring-container {
          position: relative;
          width: 120px;
          height: 120px;
          overflow: visible;
        }

        .ring-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
          overflow: visible;
        }

        .ring-progress {
          transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .accuracy-progress {
          filter: drop-shadow(0 0 6px rgba(48, 209, 88, 0.6));
        }

        .time-progress {
          filter: drop-shadow(0 0 6px rgba(24, 113, 190, 0.6));
        }

        .ring-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .ring-value {
          font-size: 28px;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1;
        }

        .ring-value.time-value {
          font-size: 22px;
          color: #FFFFFF;
        }

        .ring-fraction {
          font-size: 12px;
          font-weight: 600;
          color: #8E8E93;
          margin-top: 4px;
        }

        .ring-label {
          font-size: 11px;
          font-weight: 700;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 10px;
        }

        /* Slider XP combiné */
        .slider-container {
          width: 100%;
          animation: sliderEntrance 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
          opacity: 0;
        }

        @keyframes sliderEntrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .xp-slider {
          position: relative;
          width: 100%;
          height: 72px;
          background: linear-gradient(90deg, #FF9500 0%, #FF6B00 100%);
          border-radius: 36px;
          overflow: visible;
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          cursor: grab;
          user-select: none;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .xp-slider:active {
          cursor: grabbing;
        }

        .slider-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(135deg, #04d839ff 0%, #017e20ff 100%);
          border-radius: 36px;
          transition: width 0.05s ease-out;
          box-shadow: 0 0 20px rgba(28, 150, 3, 0.4);
        }

        .slider-thumb {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          background: #000000ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 12px rgba(255, 149, 0, 0.4),
            0 0 0 4px rgba(255, 149, 0, 0.3);
          transition: left 0.05s ease-out;
          z-index: 2;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .slider-thumb.xp-thumb {
          animation: xpThumbPulse 2s ease-in-out infinite;
        }

        @keyframes xpThumbPulse {
          0%, 100% {
            box-shadow:
              0 4px 12px rgba(255, 149, 0, 0.4),
              0 0 0 4px rgba(255, 149, 0, 0.3);
          }
          50% {
            box-shadow:
              0 4px 16px rgba(255, 149, 0, 0.6),
              0 0 0 8px rgba(255, 149, 0, 0.2);
          }
        }

        .slider-star {
          font-size: 26px;
          filter: drop-shadow(0 0 8px rgba(235, 141, 0, 0.6));
        }

        .xp-slider-text {
          position: absolute;
          top: 50%;
          right: 24px;
          transform: translateY(-50%) skewX(-10deg);
          font-size: 85px;
          font-weight: 900;
          font-style: italic;
          color: #ffffffff;
          text-shadow: 0 0 10px rgba(255, 149, 0, 0.4);
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

        .terminal-line {
          color: #30D158;
          min-height: 1.6em;
        }

        .terminal-success {
          color: #30D158;
          font-weight: 700;
        }

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
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          margin-top: 20px;
          overflow: hidden;
        }

        .tap-zone:active:not(.with-buttons) {
          transform: scale(0.95);
          background: rgba(48, 209, 88, 0.08);
          border-color: rgba(48, 209, 88, 0.5);
        }

        .tap-zone.with-buttons {
          border-style: solid;
          border-color: rgba(48, 209, 88, 0.5);
          background: rgba(48, 209, 88, 0.05);
          padding: 20px;
        }

        /* XP Content */
        .xp-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn 0.3s ease;
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

        /* Choice Buttons */
        .choice-buttons {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .choice-btn {
          width: 100%;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .choice-btn .btn-icon {
          font-size: 20px;
        }

        .choice-btn.next-level {
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 16px rgba(48, 209, 88, 0.4);
        }

        .choice-btn.next-level:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(48, 209, 88, 0.5);
        }

        .choice-btn.next-level:active {
          transform: scale(0.98);
        }

        .choice-btn.back-menu {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .choice-btn.back-menu:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .choice-btn.back-menu:active {
          transform: scale(0.98);
        }

        .footer {
          margin-top: auto;
          padding-top: 20px;
          color: #8E8E93;
          font-size: 22px;
          font-weight: 400;
          text-align: center;
          font-family: "Jersey 25", cursive;
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .mascotte-icon {
            width: 100px;
            height: 100px;
            margin: 12px auto;
          }
          .victory-title {
            font-size: 32px;
          }
          .rings-row {
            gap: 16px;
          }
          .ring-container {
            width: 100px;
            height: 100px;
          }
          .ring-value {
            font-size: 24px;
          }
          .ring-value.time-value {
            font-size: 18px;
          }
          .ring-fraction {
            font-size: 10px;
          }
          .xp-slider {
            height: 64px;
          }
          .slider-thumb {
            width: 48px;
            height: 48px;
          }
          .slider-star {
            font-size: 22px;
          }
          .xp-slider-text {
            font-size: 16px;
          }
          .terminal-block { font-size: 14px; padding: 16px; }
          .xp-display { font-size: 56px; }
        }
      `}</style>

      {phase === 'stats' ? (
        /* ==================== STATS PHASE ==================== */
        <div className="stats-phase">
          {/* Celebration Header */}
          <div className="celebration-header">
            {/* Title en premier */}
            <h1 className="victory-title">
              <span className="title-hash">//</span> Level {levelNumber}
            </h1>
            <p className="victory-subtitle">Completed</p>

            {/* Mascotte sans cercle */}
            <img src={MascotteHappy} alt="Mascotte" className="mascotte-icon" />

            {/* Confetti particles */}
            <div className="confetti-container">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`confetti confetti-${i + 1}`} />
              ))}
            </div>
          </div>

          {/* Rings Row - Accuracy + Time côte à côte */}
          <div className="rings-row">
            {/* Accuracy Ring */}
            <div className="ring-item accuracy">
              <div className="ring-container">
                <svg className="ring-svg" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#30D158" />
                      <stop offset="100%" stopColor="#088201" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="ring-bg"
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                  />
                  <circle
                    className="ring-progress accuracy-progress"
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="url(#accuracyGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={accuracyOffset}
                  />
                </svg>
                <div className="ring-center">
                  <div className="ring-value">{animatedPercentage}%</div>
                </div>
              </div>
              <div className="ring-label">Accuracy</div>
            </div>

            {/* Time Ring (horloge style) */}
            <div className="ring-item time">
              <div className="ring-container">
                <svg className="ring-svg" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1871BE" />
                      <stop offset="100%" stopColor="#0A4A7A" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="ring-bg"
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                  />
                  <circle
                    className="ring-progress time-progress"
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="url(#timeGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={timeOffset}
                  />
                </svg>
                <div className="ring-center">
                  <div className="ring-value time-value">{formatTime(seconds)}</div>
                </div>
              </div>
              <div className="ring-label">Time</div>
            </div>
          </div>

          {/* XP Slider combiné */}
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
                className="slider-thumb xp-thumb"
                style={{ left: `calc(${slideProgress}% - ${slideProgress * 0.56}px + 8px)` }}
              >
                <span className="slider-star">⭐</span>
              </div>
              <div className="xp-slider-text">+{xpValue}XP</div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== XP COLLECT PHASE ==================== */
        <div className="xp-phase" onClick={handleTap}>
          <div className="xp-header">
            <h2 className="xp-title">// XP Earned</h2>
          </div>

          <div className={`terminal-block ${isComplete ? 'success' : ''}`}>
            <div className="terminal-content">
              {/* Lignes complétées */}
              {completedLines.map((line, idx) => (
                <div key={idx} className="terminal-line">{line}</div>
              ))}
              {/* Ligne en cours de frappe */}
              {!isComplete && currentTyping && (
                <div className="terminal-line">
                  {currentTyping}
                  <span className="cursor"></span>
                </div>
              )}
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


          <div className={`tap-zone ${showChoiceButtons ? 'with-buttons' : ''}`}>
            {!showChoiceButtons ? (
              // Affichage XP
              <div className="xp-content">
                <div className="xp-display">+{xpValue}</div>
                <div className="xp-label">XP</div>
              </div>
            ) : (
              // Boutons de choix
              <div className="choice-buttons">
                <button className="choice-btn next-level" onClick={handleNextLevel}>
                  <span className="btn-icon">→</span>
                  <span className="btn-text">Niveau suivant</span>
                </button>
                <button className="choice-btn back-menu" onClick={handleBackToMenu}>
                  <span className="btn-icon">⌂</span>
                  <span className="btn-text">Menu</span>
                </button>
              </div>
              
            )}
          </div>
          

          {showGlow && <FeedbackGlow type="success" />}
        </div>
      )}
    </div>
  );
};

export default LevelComplete;
