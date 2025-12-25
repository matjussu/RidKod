/**
 * Utilitaire de gestion d'erreurs
 * Fournit des messages utilisateur clairs et une gestion cohérente des erreurs
 */

// Types d'erreurs connus
const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'auth',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  RATE_LIMIT: 'rate_limit',
  UNKNOWN: 'unknown'
};

// Messages utilisateur par type d'erreur
const USER_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Problème de connexion. Vérifie ta connexion internet et réessaie.',
  [ERROR_TYPES.AUTH]: 'Session expirée. Reconnecte-toi pour continuer.',
  [ERROR_TYPES.PERMISSION]: 'Tu n\'as pas accès à cette ressource.',
  [ERROR_TYPES.NOT_FOUND]: 'La ressource demandée n\'existe pas.',
  [ERROR_TYPES.RATE_LIMIT]: 'Trop de requêtes. Attends quelques secondes et réessaie.',
  [ERROR_TYPES.UNKNOWN]: 'Une erreur inattendue s\'est produite. Réessaie dans un moment.'
};

/**
 * Identifier le type d'erreur à partir du code/message Firebase
 * @param {Error} error - L'erreur à analyser
 * @returns {string} Le type d'erreur
 */
export const identifyErrorType = (error) => {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code?.toLowerCase() || '';

  // Erreurs réseau
  if (
    code.includes('network') ||
    code.includes('unavailable') ||
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('offline')
  ) {
    return ERROR_TYPES.NETWORK;
  }

  // Erreurs d'authentification
  if (
    code.includes('auth/') ||
    code.includes('unauthenticated') ||
    message.includes('not authenticated') ||
    message.includes('token expired')
  ) {
    return ERROR_TYPES.AUTH;
  }

  // Erreurs de permission
  if (
    code.includes('permission-denied') ||
    code.includes('permission_denied') ||
    message.includes('permission denied') ||
    message.includes('insufficient permissions')
  ) {
    return ERROR_TYPES.PERMISSION;
  }

  // Erreurs not found
  if (
    code.includes('not-found') ||
    code.includes('not_found') ||
    message.includes('not found') ||
    message.includes('introuvable')
  ) {
    return ERROR_TYPES.NOT_FOUND;
  }

  // Erreurs rate limit
  if (
    code.includes('resource-exhausted') ||
    message.includes('rate limit') ||
    message.includes('too many') ||
    message.includes('quota exceeded')
  ) {
    return ERROR_TYPES.RATE_LIMIT;
  }

  return ERROR_TYPES.UNKNOWN;
};

/**
 * Obtenir un message utilisateur friendly à partir d'une erreur
 * @param {Error} error - L'erreur à transformer
 * @returns {string} Message utilisateur friendly
 */
export const getUserFriendlyMessage = (error) => {
  const errorType = identifyErrorType(error);
  return USER_MESSAGES[errorType];
};

/**
 * Logger une erreur avec contexte (pour debugging)
 * @param {string} context - Le contexte de l'erreur (nom de fonction, etc.)
 * @param {Error} error - L'erreur à logger
 * @param {Object} metadata - Données additionnelles optionnelles
 */
export const logError = (context, error, metadata = {}) => {
  const errorType = identifyErrorType(error);

  console.error(`[${context}] ${errorType}:`, {
    message: error?.message,
    code: error?.code,
    ...metadata
  });

  // TODO: Intégrer Sentry ou autre service de monitoring
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(error, {
  //     tags: { context, errorType },
  //     extra: metadata
  //   });
  // }
};

/**
 * Créer une erreur avec un message utilisateur et le contexte technique
 * @param {Error} originalError - L'erreur originale
 * @param {string} context - Le contexte de l'erreur
 * @returns {Error} Nouvelle erreur avec message utilisateur
 */
export const createUserError = (originalError, context) => {
  const userMessage = getUserFriendlyMessage(originalError);

  // Logger l'erreur technique
  logError(context, originalError);

  // Créer une nouvelle erreur avec le message utilisateur
  const userError = new Error(userMessage);
  userError.originalError = originalError;
  userError.context = context;
  userError.type = identifyErrorType(originalError);

  return userError;
};

/**
 * Vérifier si une erreur est récupérable (retry possible)
 * @param {Error} error - L'erreur à vérifier
 * @returns {boolean} True si un retry est recommandé
 */
export const isRetryable = (error) => {
  const errorType = identifyErrorType(error);

  // Les erreurs réseau et rate limit sont généralement récupérables
  return errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.RATE_LIMIT;
};

/**
 * Exécuter une fonction avec retry automatique
 * @param {Function} fn - Fonction async à exécuter
 * @param {Object} options - Options de retry
 * @returns {Promise} Résultat de la fonction
 */
export const withRetry = async (fn, options = {}) => {
  const { maxRetries = 3, delay = 1000, context = 'unknown' } = options;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Ne pas retry si l'erreur n'est pas récupérable
      if (!isRetryable(error)) {
        throw createUserError(error, context);
      }

      // Ne pas retry si c'est la dernière tentative
      if (attempt === maxRetries) {
        break;
      }

      console.warn(`[${context}] Tentative ${attempt}/${maxRetries} échouée, retry dans ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw createUserError(lastError, context);
};

export default {
  identifyErrorType,
  getUserFriendlyMessage,
  logError,
  createUserError,
  isRetryable,
  withRetry,
  ERROR_TYPES
};
