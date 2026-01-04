/**
 * useHaptic.js
 * Hook React pour haptic feedback natif iOS (Taptic Engine)
 * Utilise @capacitor/haptics avec fallback web
 */

import { useCallback } from 'react';
import { haptic } from '../utils/hapticService';

/**
 * Hook pour déclencher des vibrations haptiques
 * Conserve l'API existante (triggerSuccess, triggerError, triggerLight, triggerMedium)
 * + Ajoute de nouveaux patterns (triggerSelection, triggerHeavy, triggerWarning)
 */
const useHaptic = () => {
  // === Patterns existants (compatibilité) ===

  /**
   * Vibration succès - Réponse correcte
   */
  const triggerSuccess = useCallback(() => {
    haptic.success();
  }, []);

  /**
   * Vibration erreur - Réponse incorrecte
   */
  const triggerError = useCallback(() => {
    haptic.error();
  }, []);

  /**
   * Vibration légère - Sélection, tap
   */
  const triggerLight = useCallback(() => {
    haptic.light();
  }, []);

  /**
   * Vibration moyenne - Action confirmée
   */
  const triggerMedium = useCallback(() => {
    haptic.medium();
  }, []);

  // === Nouveaux patterns ===

  /**
   * Vibration forte - Fin de niveau, action importante
   */
  const triggerHeavy = useCallback(() => {
    haptic.heavy();
  }, []);

  /**
   * Vibration sélection - Changement d'option (ultra-léger)
   */
  const triggerSelection = useCallback(() => {
    haptic.selection();
  }, []);

  /**
   * Vibration warning - Attention requise
   */
  const triggerWarning = useCallback(() => {
    haptic.warning();
  }, []);

  return {
    // Compatibilité existante
    triggerSuccess,
    triggerError,
    triggerLight,
    triggerMedium,
    // Nouveaux patterns
    triggerHeavy,
    triggerSelection,
    triggerWarning
  };
};

export default useHaptic;
