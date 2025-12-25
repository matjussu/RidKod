/**
 * Rate Limiter pour l'authentification
 * Protège contre les attaques par brute force
 */

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes en millisecondes

/**
 * Vérifie si l'email est bloqué (trop de tentatives)
 * @param {string} email - L'email à vérifier
 * @returns {Object} { allowed: boolean, remainingTime?: number, remainingAttempts?: number }
 */
export const checkRateLimit = (email) => {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const record = attempts.get(key);

  // Pas de tentative enregistrée = autorisé
  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Vérifier si le lockout a expiré
  if (now - record.timestamp >= LOCKOUT_TIME) {
    attempts.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Vérifier si le nombre max de tentatives est atteint
  if (record.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_TIME - (now - record.timestamp)) / 1000 / 60);
    return {
      allowed: false,
      remainingTime,
      message: `Trop de tentatives. Réessayez dans ${remainingTime} minute${remainingTime > 1 ? 's' : ''}.`
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - record.count
  };
};

/**
 * Enregistre une tentative de connexion
 * @param {string} email - L'email utilisé
 * @param {boolean} success - Si la tentative a réussi
 */
export const recordAttempt = (email, success) => {
  const key = email.toLowerCase().trim();

  if (success) {
    // Réinitialiser le compteur en cas de succès
    attempts.delete(key);
    return;
  }

  // Enregistrer l'échec
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.timestamp >= LOCKOUT_TIME) {
    // Nouvelle série de tentatives ou lockout expiré
    attempts.set(key, { count: 1, timestamp: now });
  } else {
    // Incrémenter le compteur
    attempts.set(key, {
      count: record.count + 1,
      timestamp: record.timestamp // Garder le timestamp original
    });
  }
};

/**
 * Réinitialise le compteur pour un email (utilisé après reset password)
 * @param {string} email - L'email à réinitialiser
 */
export const resetRateLimit = (email) => {
  const key = email.toLowerCase().trim();
  attempts.delete(key);
};

export default { checkRateLimit, recordAttempt, resetRateLimit };
