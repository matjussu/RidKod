const useHaptic = () => {
  const triggerSuccess = () => {
    if (navigator.vibrate) {
      // Pattern : courte vibration agréable
      navigator.vibrate([50]);
    }
  };

  const triggerError = () => {
    if (navigator.vibrate) {
      // Pattern : double vibration (feedback négatif)
      navigator.vibrate([100, 50, 100]);
    }
  };

  const triggerLight = () => {
    if (navigator.vibrate) {
      // Pattern : très courte vibration pour selection
      navigator.vibrate([25]);
    }
  };

  const triggerMedium = () => {
    if (navigator.vibrate) {
      // Pattern : vibration moyenne pour feedback intermédiaire
      navigator.vibrate([40]);
    }
  };

  return {
    triggerSuccess,
    triggerError,
    triggerLight,
    triggerMedium
  };
};

export default useHaptic;