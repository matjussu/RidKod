import React, { useState, useEffect, useCallback, useRef } from 'react';
import AnimatedLogo from './AnimatedLogo';
import CyberpunkBackground from './CyberpunkBackground';

/**
 * WelcomeAnimation Component - Version 3 Optimized
 * Premium welcome screen with animated logo reveal
 *
 * Features:
 * - 2.5s optimized timeline (down from 4s)
 * - Optional audio effects (lazy-loaded)
 * - Tap-to-skip functionality
 * - PWA detection for returning users
 * - Accessibility support (prefers-reduced-motion)
 * - Auto-skip for installed app users (after 3+ visits)
 *
 * @param {function} onComplete - Callback when animation completes or is skipped
 */
const WelcomeAnimation = ({ onComplete }) => {
  // Animation state
  const [animationStage, setAnimationStage] = useState(0); // Stage 0 = blank on initial load (fixed)
  const [isAnimating, setIsAnimating] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Refs
  const timeoutRefs = useRef([]);
  const audioModuleRef = useRef(null);

  /**
   * Clear all animation timeouts
   */
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(id => window.clearTimeout(id));
    timeoutRefs.current = [];
  }, []);

  /**
   * Skip animation immediately
   */
  const skipAnimation = useCallback(() => {
    clearAllTimeouts();
    setAnimationStage(4); // Jump to final stage
    setIsAnimating(false);

    // Call onComplete after a brief delay
    if (onComplete) {
      setTimeout(onComplete, 300);
    }
  }, [clearAllTimeouts, onComplete]);

  /**
   * Check if user prefers reduced motion
   */
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /**
   * Check if app is installed (PWA standalone mode)
   */
  const isStandaloneApp = useCallback(() => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }, []);

  /**
   * Get visit count for auto-skip logic
   */
  const getVisitCount = useCallback(() => {
    const count = parseInt(localStorage.getItem('readcod_visit_count') || '0', 10);
    return count;
  }, []);

  /**
   * Lazy load audio module
   */
  const loadAudio = useCallback(async () => {
    if (!audioModuleRef.current) {
      try {
        const audioModule = await import('../../utils/audio');
        audioModuleRef.current = audioModule;

        // Initialize audio context
        const isEnabled = audioModule.isAudioEnabled();
        setAudioEnabled(isEnabled);

        return audioModule;
      } catch (error) {
        console.warn('Audio module failed to load:', error);
        return null;
      }
    }
    return audioModuleRef.current;
  }, []);

  /**
   * Play sound effect (with fallback)
   */
  const playSound = useCallback(async (soundType) => {
    if (!audioEnabled) return;

    const audio = await loadAudio();
    if (!audio) return;

    try {
      switch (soundType) {
        case 'type':
          audio.playTypeSound();
          break;
        case 'swell':
          audio.playSwellSound();
          break;
        case 'finish':
          audio.playFinishSound();
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [audioEnabled, loadAudio]);

  /**
   * Start animation sequence
   * Timeline (4.7s total with transition):
   * 0ms     → Stage 0: Blank
   * 500ms   → Stage 1: "/" appears + click sound
   * 1000ms  → Stage 2: "<" appears + click sound
   * 1500ms  → Stage 3: "readode" appears + swell sound
   * 3000ms  → Stage 4: Subtitle appears + chime sound
   * 4500ms  → Stage 5: Logo fade out (200ms transition) - Subtitle visible 1.5s
   * 4700ms  → onComplete callback → Welcome fade in
   */
  const startAnimation = useCallback(async () => {
    if (isAnimating) return;

    // Check if user prefers reduced motion
    if (prefersReducedMotion()) {
      skipAnimation();
      return;
    }

    setIsAnimating(true);
    clearAllTimeouts();

    // Pre-load audio module (don't block animation)
    loadAudio();

    // Stage 0: Reset to blank
    setAnimationStage(0);

    // Stage 1: Type "/" (500ms)
    const t1 = window.setTimeout(() => {
      setAnimationStage(1);
      playSound('type');
    }, 500);

    // Stage 2: Type "<" (1000ms)
    const t2 = window.setTimeout(() => {
      setAnimationStage(2);
      playSound('type');
    }, 1000);

    // Stage 3: Show "read...ode" (1500ms)
    const t3 = window.setTimeout(() => {
      setAnimationStage(3);
      playSound('swell');
    }, 1500);

    // Stage 4: Show Subtitle (3000ms)
    const t4 = window.setTimeout(() => {
      setAnimationStage(4);
      playSound('finish');
    }, 3000);

    // Stage 5: Fade out logo (4500ms)
    const t5 = window.setTimeout(() => {
      setAnimationStage(5);
      setIsAnimating(false);

      // Call onComplete AFTER fade out for smooth transition
      if (onComplete) {
        setTimeout(onComplete, 200); // 200ms fade duration
      }
    }, 4500);

    timeoutRefs.current.push(t1, t2, t3, t4, t5);
  }, [isAnimating, clearAllTimeouts, prefersReducedMotion, skipAnimation, playSound, loadAudio, onComplete]);

  /**
   * Auto-start animation on mount (with intelligent skip logic)
   */
  useEffect(() => {
    // Increment visit count
    const visitCount = getVisitCount();
    localStorage.setItem('readcod_visit_count', String(visitCount + 1));

    // Auto-skip for installed app users after 3+ visits
    if (isStandaloneApp() && visitCount >= 3) {
      skipAnimation();
      return;
    }

    // Auto-skip if prefers reduced motion
    if (prefersReducedMotion()) {
      skipAnimation();
      return;
    }

    // Start animation after a short delay
    const autoStartTimer = setTimeout(() => {
      startAnimation();
    }, 500);

    // Cleanup on unmount
    return () => {
      clearTimeout(autoStartTimer);
      clearAllTimeouts();

      // Cleanup audio context
      if (audioModuleRef.current?.cleanupAudio) {
        audioModuleRef.current.cleanupAudio();
      }
    };
  }, []); // Empty deps - only run once on mount

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Escape or Space to skip
      if ((e.key === 'Escape' || e.key === ' ') && isAnimating) {
        e.preventDefault();
        skipAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, skipAnimation]);

  /**
   * Handle tap anywhere to skip
   */
  const handleTapToSkip = useCallback((e) => {
    // Only skip if animation is running
    if (isAnimating) {
      e.preventDefault();
      skipAnimation();
    }
  }, [isAnimating, skipAnimation]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
        cursor: isAnimating ? 'pointer' : 'default'
      }}
      onClick={handleTapToSkip}
      role="main"
      aria-label="Welcome animation"
    >
      {/* Background Layer */}
      <CyberpunkBackground />

      {/* Fixed Center Layer - Logo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          pointerEvents: 'none'
        }}
      >
        <AnimatedLogo stage={animationStage} />
      </div>

      {/* Static Noise Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40,
          opacity: 0.03,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {/* Accessibility Styles */}
      <style>{`
        /* Ensure smooth transitions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Accessibility: Focus visible */
        *:focus-visible {
          outline: 2px solid #10B981;
          outline-offset: 4px;
        }

        /* Accessibility: Skip animation for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          [role="main"] * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeAnimation;
