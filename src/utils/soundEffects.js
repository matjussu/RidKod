// Sound Effects using Web Audio API (no external files needed)

// Créer un contexte audio global
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Son de frappe clavier mécanique (très court)
 * Fréquence haute + decay rapide = "click"
 */
export const playTypingSound = () => {
  try {
    const ctx = getAudioContext();

    // Oscillateur pour le "click"
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Fréquence haute pour un son de click
    oscillator.frequency.value = 800;
    oscillator.type = 'square';

    // Volume très faible et decay ultra rapide
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    // Jouer
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.02);
  } catch (error) {
    // Silently fail si Web Audio API non supporté
    console.debug('Web Audio API not supported:', error);
  }
};

/**
 * Son de succès (mélodie courte ascendante)
 * 3 notes rapides qui montent
 */
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();

    // Notes de la mélodie (Do - Mi - Sol en Hz)
    const notes = [523.25, 659.25, 783.99];
    const noteDuration = 0.15;

    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Type d'onde sinusoïdale pour un son doux
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      // Envelope: attack + decay
      const startTime = ctx.currentTime + (index * noteDuration);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      // Jouer
      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    });
  } catch (error) {
    console.debug('Web Audio API not supported:', error);
  }
};

/**
 * Son d'erreur (mélodie descendante)
 * 2 notes qui descendent
 */
export const playErrorSound = () => {
  try {
    const ctx = getAudioContext();

    // Notes descendantes (La - Fa)
    const notes = [440, 349.23];
    const noteDuration = 0.2;

    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;

      const startTime = ctx.currentTime + (index * noteDuration);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    });
  } catch (error) {
    console.debug('Web Audio API not supported:', error);
  }
};

/**
 * Son de tap léger (pour les taps intermédiaires)
 */
export const playTapSound = () => {
  try {
    const ctx = getAudioContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  } catch (error) {
    console.debug('Web Audio API not supported:', error);
  }
};

// Fonction pour initialiser l'AudioContext (à appeler au premier user interaction)
export const initAudio = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (error) {
    console.debug('Could not initialize audio:', error);
  }
};
