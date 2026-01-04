/**
 * hapticService.js
 * Service de vibrations natives iOS (Taptic Engine) avec fallback web
 * Utilise @capacitor/haptics pour iOS natif
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

// Détection plateforme native (iOS/Android via Capacitor)
const isNative = Capacitor.isNativePlatform();

/**
 * Patterns haptic Apple-style
 * - impact: feedback tactile pour interactions UI
 * - notification: feedback pour résultats (success/error/warning)
 * - selection: feedback ultra-léger pour changements de sélection
 */
export const haptic = {
  // === IMPACTS (interactions UI) ===

  /**
   * Impact léger - Sélection, navigation, tap léger
   * iOS: UIImpactFeedbackGenerator(.light)
   */
  light: async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch (e) {
      // Silently fail - haptics not critical
    }
  },

  /**
   * Impact moyen - Validation bouton, action confirmée
   * iOS: UIImpactFeedbackGenerator(.medium)
   */
  medium: async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else if (navigator.vibrate) {
        navigator.vibrate(25);
      }
    } catch (e) {
      // Silently fail
    }
  },

  /**
   * Impact fort - Action importante, fin de niveau
   * iOS: UIImpactFeedbackGenerator(.heavy)
   */
  heavy: async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else if (navigator.vibrate) {
        navigator.vibrate(40);
      }
    } catch (e) {
      // Silently fail
    }
  },

  // === NOTIFICATIONS (résultats) ===

  /**
   * Notification succès - Réponse correcte, validation réussie
   * iOS: UINotificationFeedbackGenerator(.success)
   */
  success: async () => {
    try {
      if (isNative) {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
    } catch (e) {
      // Silently fail
    }
  },

  /**
   * Notification erreur - Réponse incorrecte, échec validation
   * iOS: UINotificationFeedbackGenerator(.error)
   */
  error: async () => {
    try {
      if (isNative) {
        await Haptics.notification({ type: NotificationType.Error });
      } else if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50, 30, 50]);
      }
    } catch (e) {
      // Silently fail
    }
  },

  /**
   * Notification warning - Attention requise
   * iOS: UINotificationFeedbackGenerator(.warning)
   */
  warning: async () => {
    try {
      if (isNative) {
        await Haptics.notification({ type: NotificationType.Warning });
      } else if (navigator.vibrate) {
        navigator.vibrate([30, 20, 60]);
      }
    } catch (e) {
      // Silently fail
    }
  },

  // === SELECTION (changement de sélection) ===

  /**
   * Sélection - Changement d'option, scroll picker
   * iOS: UISelectionFeedbackGenerator
   * Le plus léger des feedbacks
   */
  selection: async () => {
    try {
      if (isNative) {
        await Haptics.selectionChanged();
      } else if (navigator.vibrate) {
        navigator.vibrate(5);
      }
    } catch (e) {
      // Silently fail
    }
  }
};

// Export par défaut pour import simplifié
export default haptic;
