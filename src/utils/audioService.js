/**
 * audioService.js
 * Service audio Web Audio API optimisé pour iOS
 * Sons générés procéduralement (pas de fichiers audio)
 */

let audioContext = null;
let isInitialized = false;

/**
 * Initialise le contexte audio (requis au premier touch sur iOS)
 * Doit être appelé dans un gestionnaire d'événement utilisateur
 */
export const initAudioSystem = async () => {
  if (isInitialized) return true;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    isInitialized = true;
    return true;
  } catch (e) {
    console.debug('Audio non supporté:', e);
    return false;
  }
};

/**
 * Vérifie si les sons doivent être joués
 * Respecte les préférences d'accessibilité
 */
const shouldPlaySound = () => {
  if (!isInitialized || !audioContext) return false;

  // Respecter prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return false;

  return audioContext.state === 'running';
};

/**
 * Crée un oscillateur avec envelope
 */
const createTone = (frequency, duration, type = 'sine', volume = 0.1) => {
  if (!shouldPlaySound()) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Silently fail
  }
};

/**
 * Sons Apple-style générés par Web Audio API
 */
export const sounds = {
  /**
   * Tick - Click léger pour sélection
   * Son: 800Hz, 5ms, très subtil
   */
  tick: () => {
    if (!shouldPlaySound()) return;

    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.005);

      gain.gain.setValueAtTime(0.02, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.005);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.01);
    } catch (e) {}
  },

  /**
   * Pop - Son de validation bouton
   * Son: Slide 400Hz→200Hz, 15ms
   */
  pop: () => {
    if (!shouldPlaySound()) return;

    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.015);

      gain.gain.setValueAtTime(0.03, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.025);
    } catch (e) {}
  },

  /**
   * Success - Arpège ascendant C5-E5-G5
   * Son: Accord majeur rapide, joyeux
   */
  success: () => {
    if (!shouldPlaySound()) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteDelay = 0.08;
    const noteDuration = 0.15;

    notes.forEach((freq, i) => {
      try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startTime = audioContext.currentTime + (i * noteDelay);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(startTime);
        osc.stop(startTime + noteDuration);
      } catch (e) {}
    });
  },

  /**
   * Error - Deux notes descendantes A4-F4
   * Son: Descente mineure, feedback négatif
   */
  error: () => {
    if (!shouldPlaySound()) return;

    const notes = [440, 349.23]; // A4, F4
    const noteDelay = 0.12;
    const noteDuration = 0.15;

    notes.forEach((freq, i) => {
      try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startTime = audioContext.currentTime + (i * noteDelay);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(startTime);
        osc.stop(startTime + noteDuration);
      } catch (e) {}
    });
  },

  /**
   * Coin - Ding métallique pour XP
   * Son: 1200Hz avec harmoniques, métallique
   */
  coin: () => {
    if (!shouldPlaySound()) return;

    try {
      // Note principale
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1200, audioContext.currentTime);

      gain1.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

      osc1.connect(gain1);
      gain1.connect(audioContext.destination);

      osc1.start();
      osc1.stop(audioContext.currentTime + 0.35);

      // Harmonique haute
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2400, audioContext.currentTime);

      gain2.gain.setValueAtTime(0.03, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

      osc2.connect(gain2);
      gain2.connect(audioContext.destination);

      osc2.start();
      osc2.stop(audioContext.currentTime + 0.2);
    } catch (e) {}
  },

  /**
   * Chime - Accord majeur pour fin de niveau
   * Son: C5-E5-G5-C6 simultanés avec decay long
   */
  chime: () => {
    if (!shouldPlaySound()) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const delay = i * 0.03;
        const startTime = audioContext.currentTime + delay;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        // Volume décroissant pour les notes hautes
        const vol = 0.08 - (i * 0.015);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      } catch (e) {}
    });
  },

  /**
   * Typing - Son de frappe clavier
   * Son: Click rapide 800Hz
   */
  typing: () => {
    if (!shouldPlaySound()) return;

    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, audioContext.currentTime);

      gain.gain.setValueAtTime(0.015, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.025);
    } catch (e) {}
  }
};

// Alias pour compatibilité avec l'ancien système
export const playTypingSound = sounds.typing;
export const playSuccessSound = sounds.success;
export const playErrorSound = sounds.error;
export const playTapSound = sounds.pop;

// Export par défaut
export default sounds;
