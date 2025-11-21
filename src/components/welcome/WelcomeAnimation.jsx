import React, { useState, useEffect, useCallback, useRef } from 'react';
import AnimatedLogo from './AnimatedLogo';
import CyberpunkBackground from './CyberpunkBackground';

const WelcomeAnimation = ({ onComplete }) => {
  // Stage 4 is the "Finished" state so it looks complete on initial load
  const [animationStage, setAnimationStage] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);

  const timeoutRefs = useRef([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(id => window.clearTimeout(id));
    timeoutRefs.current = [];
  };

  const startAnimation = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    clearAllTimeouts();

    // Timeline Sequence:
    // 0ms: Blank
    // 1000ms: Slash typed
    // 1800ms: Bracket typed
    // 2800ms: "read" and "ode" appear
    // 4000ms: Subtitle appears & finish

    // Step 0: Reset to blank
    setAnimationStage(0);

    // Step 1: Type "/"
    const t1 = window.setTimeout(() => {
      setAnimationStage(1);
    }, 1000);

    // Step 2: Type "<"
    const t2 = window.setTimeout(() => {
      setAnimationStage(2);
    }, 1800);

    // Step 3: Show "read ... ode"
    const t3 = window.setTimeout(() => {
      setAnimationStage(3);
    }, 2800);

    // Step 4: Show Subtitle & Finish
    const t4 = window.setTimeout(() => {
      setAnimationStage(4);
      setIsAnimating(false);

      // Call onComplete callback if provided (after a small delay)
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
    }, 4000);

    timeoutRefs.current.push(t1, t2, t3, t4);
  }, [isAnimating, onComplete]);

  // Auto-start animation on mount
  useEffect(() => {
    // Start animation automatically after a short delay
    const autoStartTimer = setTimeout(() => {
      startAnimation();
    }, 500);

    return () => {
      clearTimeout(autoStartTimer);
      clearAllTimeouts();
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#000000',
      overflow: 'hidden',
      fontFamily: 'sans-serif'
    }}>

      {/* Background Layer */}
      <CyberpunkBackground />

      {/* Fixed Center Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none'
      }}>
        <AnimatedLogo stage={animationStage} />
      </div>

      {/* Static Noise Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        opacity: 0.03,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
    </div>
  );
};

export default WelcomeAnimation;
