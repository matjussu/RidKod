/**
 * Training Loader - Chargement dynamique des exercices
 * Gère le chargement par catégorie, type et difficulté
 *
 * Structure des exercices:
 * - training/python/*.json (exercices principaux par catégorie)
 * - training/python/find-error/*.json (exercices find_error)
 * - training/python/free-input/*.json (exercices free_input)
 * - training/python/concept-understanding/*.json (exercices concept_understanding)
 */

// Cache pour éviter les rechargements
const exerciseCache = new Map();

// Types d'exercices avec leurs dossiers
const EXERCISE_TYPES = ['find-error', 'free-input', 'concept-understanding'];
const CATEGORIES = ['basics', 'strings', 'control-flow', 'data-structures', 'functions', 'advanced'];

/**
 * Charge les exercices d'une catégorie spécifique
 * @param {string} language - Langage (python, javascript, etc.)
 * @param {string} category - Catégorie (basics, control-flow, etc.)
 * @returns {Promise<Array>} Liste des exercices
 */
export const loadCategoryExercises = async (language, category) => {
  const cacheKey = `${language}/${category}`;

  if (exerciseCache.has(cacheKey)) {
    return exerciseCache.get(cacheKey);
  }

  try {
    const module = await import(`../training/${language}/${category}.json`);
    const exercises = module.default.exercises || module.default;
    exerciseCache.set(cacheKey, exercises);
    return exercises;
  } catch (error) {
    console.error(`Failed to load category ${category} for ${language}:`, error);
    return [];
  }
};

/**
 * Charge les exercices d'un type spécifique (find-error, free-input, concept-understanding)
 * @param {string} language - Langage
 * @param {string} type - Type d'exercice (find-error, free-input, concept-understanding)
 * @param {string} category - Catégorie (basics, strings, etc.)
 * @returns {Promise<Array>} Liste des exercices
 */
export const loadTypeExercises = async (language, type, category) => {
  const cacheKey = `${language}/${type}/${category}`;

  if (exerciseCache.has(cacheKey)) {
    return exerciseCache.get(cacheKey);
  }

  try {
    const module = await import(`../training/${language}/${type}/${category}.json`);
    const exercises = module.default.exercises || module.default;
    exerciseCache.set(cacheKey, exercises);
    return exercises;
  } catch (error) {
    // Fichier peut ne pas exister, c'est normal
    console.debug(`No ${type}/${category} exercises for ${language}`);
    return [];
  }
};

/**
 * Charge tous les exercices d'un type spécifique
 * @param {string} type - Type d'exercice
 * @param {string} language - Langage
 * @returns {Promise<Array>} Tous les exercices du type
 */
export const loadAllTypeExercises = async (type, language = 'python') => {
  const cacheKey = `${language}/${type}/all`;

  if (exerciseCache.has(cacheKey)) {
    return exerciseCache.get(cacheKey);
  }

  const allExercises = [];
  for (const category of CATEGORIES) {
    const exercises = await loadTypeExercises(language, type, category);
    allExercises.push(...exercises);
  }

  exerciseCache.set(cacheKey, allExercises);
  return allExercises;
};

/**
 * Charge l'index des catégories pour un langage
 * @param {string} language - Langage
 * @returns {Promise<Object>} Index avec métadonnées
 */
export const loadLanguageIndex = async (language) => {
  const cacheKey = `${language}/index`;

  if (exerciseCache.has(cacheKey)) {
    return exerciseCache.get(cacheKey);
  }

  try {
    const module = await import(`../training/${language}/index.json`);
    exerciseCache.set(cacheKey, module.default);
    return module.default;
  } catch (error) {
    console.error(`Failed to load index for ${language}:`, error);
    return null;
  }
};

/**
 * Charge tous les exercices d'un langage (y compris les nouveaux types)
 * @param {string} language - Langage (défaut: python)
 * @param {boolean} includeNewTypes - Inclure find-error, free-input, concept-understanding (défaut: true)
 * @returns {Promise<Array>} Tous les exercices
 */
export const loadAllExercises = async (language = 'python', includeNewTypes = true) => {
  const cacheKey = includeNewTypes ? `${language}/all-with-types` : `${language}/all`;

  if (exerciseCache.has(cacheKey)) {
    return exerciseCache.get(cacheKey);
  }

  try {
    const index = await loadLanguageIndex(language);
    if (!index || !index.categories) {
      throw new Error('Invalid index structure');
    }

    const allExercises = [];

    // Charger les exercices principaux par catégorie
    for (const cat of index.categories) {
      const exercises = await loadCategoryExercises(language, cat.id);
      allExercises.push(...exercises);
    }

    // Charger les exercices des nouveaux types (find-error, free-input, concept-understanding)
    if (includeNewTypes) {
      for (const type of EXERCISE_TYPES) {
        const typeExercises = await loadAllTypeExercises(type, language);
        allExercises.push(...typeExercises);
      }
    }

    exerciseCache.set(cacheKey, allExercises);
    return allExercises;
  } catch (error) {
    console.error(`Failed to load all exercises for ${language}:`, error);
    return [];
  }
};

/**
 * Charge les exercices filtrés par difficulté
 * Fonction de compatibilité avec l'ancien système
 * @param {number} difficulty - 1 (easy), 2 (medium), 3 (hard)
 * @param {string} language - Langage (défaut: python)
 * @returns {Promise<Array>} Exercices filtrés
 */
export const loadExercisesByDifficulty = async (difficulty, language = 'python') => {
  const allExercises = await loadAllExercises(language);
  return allExercises.filter(ex => ex.difficulty === difficulty);
};

/**
 * Charge les exercices filtrés par tags
 * @param {Array<string>} tags - Tags à rechercher
 * @param {string} language - Langage
 * @returns {Promise<Array>} Exercices correspondants
 */
export const loadExercisesByTags = async (tags, language = 'python') => {
  const allExercises = await loadAllExercises(language);
  return allExercises.filter(ex =>
    ex.tags && ex.tags.some(tag => tags.includes(tag))
  );
};

/**
 * Mélange un tableau avec un seed déterministe
 * @param {Array} array - Tableau à mélanger
 * @param {number} seed - Seed pour reproductibilité
 * @returns {Array} Tableau mélangé
 */
export const shuffleWithSeed = (array, seed) => {
  const shuffled = [...array];
  let currentSeed = seed;

  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
    const j = currentSeed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/**
 * Sélectionne N exercices aléatoires
 * @param {number} count - Nombre d'exercices à sélectionner
 * @param {string} language - Langage
 * @param {number} seed - Seed optionnel pour reproductibilité
 * @returns {Promise<Array>} Exercices sélectionnés
 */
export const getRandomExercises = async (count, language = 'python', seed = null) => {
  const allExercises = await loadAllExercises(language);

  if (seed !== null) {
    const shuffled = shuffleWithSeed(allExercises, seed);
    return shuffled.slice(0, count);
  }

  // Mélange aléatoire sans seed
  const shuffled = [...allExercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Vide le cache (utile pour hot reload en dev)
 */
export const clearCache = () => {
  exerciseCache.clear();
};
