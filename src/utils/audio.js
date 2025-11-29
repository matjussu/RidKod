/**
 * Audio Manager for Welcome Animation
 * Premium UI sounds using Web Audio API
 * Lazy-loaded for performance optimization
 */

let audioCtx = null;

/**
 * Initialize audio context
 * Must be triggered by user interaction (browser policy)
 * @returns {AudioContext|null}
 */
export const initAudio = () => {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }

  // Resume if suspended (mobile browsers)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(e => console.warn('Audio resume failed:', e));
  }

  return audioCtx;
};

/**
 * Check if audio is supported and enabled
 * Respects user's motion preferences
 * @returns {boolean}
 */
export const isAudioEnabled = () => {
  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return false;

  // Check if audio context can be created
  const ctx = initAudio();
  return ctx !== null;
};

/**
 * Sound 1: "The Click"
 * Minimalist UI tick - crisp, short, organic (woodblock/glass tap feel)
 * Used for: Slash "/" and Bracket "<" typing
 *
 * Technical: 800Hz sine wave dropping to 150Hz in 40ms
 * Volume: 15% for subtlety
 */
export const playTypeSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Sine wave with quick pitch drop creates "bubble pop" or "woodblock" sound
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);

  // Very short, clean envelope
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05);
};

/**
 * Sound 2: "The Breath" (Swell)
 * Transparent, airy rise - not dramatic, just a "presence" appearing
 * Used for: "read...ode" text reveal
 *
 * Technical: Two harmonious sine waves (A4 + E5 = Perfect 5th interval)
 * Duration: 1.5s with slow attack/release
 * Volume: 5% for subtlety
 */
export const playSwellSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const t = ctx.currentTime;

  // Two gentle sine waves creating harmonious interval (Perfect 5th)
  const freqs = [440, 659.25]; // A4, E5

  freqs.forEach(f => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = f;

    // Slow attack, slow release
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.8); // Very quiet peak
    gain.gain.linearRampToValueAtTime(0, t + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.6);
  });
};

/**
 * Sound 3: "The Brand Chime" (Finish)
 * Clean, optimistic open chord - simple, pure, welcoming
 * Used for: Subtitle appearance & animation completion
 *
 * Technical: C Major Triad in open voicing (C4, G4, E5)
 * Duration: 2.5s decay with ringing tail
 * Volume: 8% for gentle finish
 */
export const playFinishSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const t = ctx.currentTime;

  // C Major Triad in Open Voicing for modern, airy feel
  const notes = [261.63, 392.00, 659.25]; // C4, G4, E5

  notes.forEach(f => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine'; // Cleanest waveform
    osc.frequency.value = f;

    // Gentle instant attack, nice ringing tail
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.05); // Soft pop attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5); // Long smooth decay

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 3.0);
  });
};

/**
 * Cleanup audio context
 * Call on component unmount
 */
export const cleanupAudio = () => {
  if (audioCtx) {
    audioCtx.close().catch(e => console.warn('Audio cleanup failed:', e));
    audioCtx = null;
  }
};
