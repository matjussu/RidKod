/**
 * Lesson Loader - Chargement dynamique des leçons
 * Remplace les 37 imports statiques par du chargement à la demande
 */

// Cache pour les leçons chargées
const lessonCache = new Map();

/**
 * Extrait le numéro de module et de leçon depuis l'ID
 * @param {string} lessonId - Ex: 'py_les_1_1'
 * @returns {Object} { moduleNum, lessonNum }
 */
const parseLesson = (lessonId) => {
  // Format: py_les_X_Y où X = module, Y = leçon
  const match = lessonId.match(/py_les_(\d+)_(\d+)/);
  if (!match) {
    throw new Error(`Invalid lesson ID format: ${lessonId}`);
  }
  return {
    moduleNum: match[1],
    lessonNum: match[2]
  };
};

/**
 * Charge dynamiquement une leçon
 * @param {string} language - Langage (python, javascript, etc.)
 * @param {string} lessonId - ID de la leçon (ex: py_les_1_1)
 * @returns {Promise<Object>} Données de la leçon
 */
export const loadLesson = async (language, lessonId) => {
  const cacheKey = `${language}/${lessonId}`;

  if (lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey);
  }

  try {
    const { moduleNum, lessonNum } = parseLesson(lessonId);

    // Pad module number pour le nom de dossier (001, 002, etc.)
    const modulePadded = moduleNum.padStart(3, '0');

    const module = await import(
      `../lessons/${language}/module-${modulePadded}/lesson-${moduleNum}-${lessonNum}.json`
    );

    lessonCache.set(cacheKey, module.default);
    return module.default;
  } catch (error) {
    console.error(`Failed to load lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Charge les métadonnées des modules d'un langage
 * @param {string} language - Langage
 * @returns {Promise<Object>} Métadonnées des modules
 */
export const loadModules = async (language) => {
  const cacheKey = `${language}/modules`;

  if (lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey);
  }

  try {
    const module = await import(`../lessons/${language}/modules.json`);
    lessonCache.set(cacheKey, module.default);
    return module.default;
  } catch (error) {
    console.error(`Failed to load modules for ${language}:`, error);
    throw error;
  }
};

/**
 * Charge l'index des leçons d'un langage
 * @param {string} language - Langage
 * @returns {Promise<Object>} Index des leçons
 */
export const loadLessonsIndex = async (language) => {
  const cacheKey = `${language}/lessons`;

  if (lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey);
  }

  try {
    const module = await import(`../lessons/${language}/lessons.json`);
    lessonCache.set(cacheKey, module.default);
    return module.default;
  } catch (error) {
    console.error(`Failed to load lessons index for ${language}:`, error);
    throw error;
  }
};

/**
 * Charge un boss fight
 * @param {string} language - Langage
 * @param {string} moduleId - ID du module (ex: py_mod_001)
 * @returns {Promise<Object>} Données du boss
 */
export const loadBoss = async (language, moduleId) => {
  const cacheKey = `${language}/boss/${moduleId}`;

  if (lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey);
  }

  try {
    // Extraire le numéro de module depuis l'ID
    const match = moduleId.match(/py_mod_(\d+)/);
    if (!match) {
      throw new Error(`Invalid module ID format: ${moduleId}`);
    }
    const moduleNum = match[1].padStart(3, '0');

    const module = await import(
      `../lessons/${language}/boss/boss-mod-${moduleNum}.json`
    );

    lessonCache.set(cacheKey, module.default);
    return module.default;
  } catch (error) {
    console.error(`Failed to load boss for ${moduleId}:`, error);
    throw error;
  }
};

/**
 * Précharge plusieurs leçons (pour navigation fluide)
 * @param {string} language - Langage
 * @param {Array<string>} lessonIds - IDs des leçons à précharger
 */
export const preloadLessons = async (language, lessonIds) => {
  const promises = lessonIds.map(id => loadLesson(language, id).catch(() => null));
  await Promise.all(promises);
};

/**
 * Vide le cache (utile pour hot reload en dev)
 */
export const clearCache = () => {
  lessonCache.clear();
};
