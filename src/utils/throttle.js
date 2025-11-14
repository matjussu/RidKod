/**
 * Throttle utility - Limite le nombre d'appels d'une fonction par intervalle de temps
 *
 * Exemple :
 * const throttledFunc = throttle(myFunction, 1000); // Max 1 appel par seconde
 * throttledFunc(); // Exécuté
 * throttledFunc(); // Ignoré (trop rapide)
 * setTimeout(() => throttledFunc(), 1100); // Exécuté
 */

export const throttle = (func, delay) => {
  let lastCall = 0;
  let timeout = null;

  return function throttledFunction(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    // Si assez de temps s'est écoulé, exécuter immédiatement
    if (timeSinceLastCall >= delay) {
      lastCall = now;
      return func.apply(this, args);
    }

    // Sinon, planifier pour plus tard (trailing call)
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      lastCall = Date.now();
      func.apply(this, args);
    }, delay - timeSinceLastCall);

    return Promise.reject(new Error('Rate limited - trop d\'appels rapides'));
  };
};

/**
 * Debounce utility - Attend que l'utilisateur arrête d'appeler avant d'exécuter
 *
 * Exemple :
 * const debouncedFunc = debounce(myFunction, 500); // Attend 500ms de calme
 * debouncedFunc(); // Planifié
 * debouncedFunc(); // Replanifié (annule le précédent)
 * // Exécuté 500ms après le dernier appel
 */

export const debounce = (func, delay) => {
  let timeout = null;

  return function debouncedFunction(...args) {
    if (timeout) {
      clearTimeout(timeout);
    }

    return new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        try {
          const result = func.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

/**
 * Rate limiter basé sur compteur - Limite le nombre d'appels par fenêtre de temps
 *
 * Exemple :
 * const limiter = createRateLimiter(5, 60000); // Max 5 appels par minute
 * limiter.check('user123'); // true
 * // ... après 5 appels
 * limiter.check('user123'); // false (limite atteinte)
 */

export const createRateLimiter = (maxCalls, windowMs) => {
  const calls = new Map(); // userId -> [timestamps]

  return {
    check: (userId) => {
      const now = Date.now();
      const userCalls = calls.get(userId) || [];

      // Nettoyer les appels expirés
      const validCalls = userCalls.filter(timestamp => now - timestamp < windowMs);

      if (validCalls.length >= maxCalls) {
        calls.set(userId, validCalls);
        return false; // Limite atteinte
      }

      // Enregistrer l'appel
      validCalls.push(now);
      calls.set(userId, validCalls);
      return true; // OK
    },

    reset: (userId) => {
      calls.delete(userId);
    },

    getRemaining: (userId) => {
      const now = Date.now();
      const userCalls = calls.get(userId) || [];
      const validCalls = userCalls.filter(timestamp => now - timestamp < windowMs);
      return Math.max(0, maxCalls - validCalls.length);
    },

    getTimeUntilReset: (userId) => {
      const userCalls = calls.get(userId) || [];
      if (userCalls.length === 0) return 0;

      const oldestCall = Math.min(...userCalls);
      const resetTime = oldestCall + windowMs;
      return Math.max(0, resetTime - Date.now());
    }
  };
};

/**
 * Rate limiter pour exercices - Configuration spécifique ReadCod
 * Limite : 30 exercices par minute (1 toutes les 2 secondes)
 */

export const exerciseRateLimiter = createRateLimiter(30, 60000);

/**
 * Rate limiter pour signup - Protection contre spam création comptes
 * Limite : 3 signups par heure par IP (nécessite backend pour vrai tracking IP)
 */

export const signupRateLimiter = createRateLimiter(3, 3600000);

/**
 * Rate limiter pour leçons - Plus permissif que les exercices
 * Limite : 60 actions par minute
 */

export const lessonRateLimiter = createRateLimiter(60, 60000);
