// Service pour gérer la progression utilisateur dans Firestore
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  enqueueExercise,
  flushQueue,
  getQueueSize,
  calculateOptimisticProgress,
  getQueueManager
} from '../utils/debounce';

/**
 * Structure de données de progression :
 * {
 *   userId: string,
 *   totalXP: number,
 *   userLevel: number,                    // Niveau global utilisateur (basé sur XP)
 *   currentLevel: number,                 // Dernier niveau d'exercice EN COURS
 *   completedLevels: [1, 2, 3],          // Niveaux d'exercices terminés (verrouillés)
 *   levelStats: {                         // Stats par niveau d'exercice
 *     1: { correct: 8, incorrect: 2, xp: 80, completedAt: timestamp },
 *     2: { correct: 10, incorrect: 0, xp: 100, completedAt: timestamp }
 *   },
 *   lessonProgress: {                     // Progression des leçons
 *     python: {
 *       py_ch_001: { completed: true, exercisesCompleted: ['ex1', 'ex2'], lastCompletedAt: timestamp },
 *       py_ch_002: { completed: false, exercisesCompleted: ['ex1'], lastCompletedAt: timestamp }
 *     }
 *   },
 *   streak: {
 *     current: number,
 *     longest: number,
 *     lastActivityDate: timestamp
 *   },
 *   stats: {                              // Stats globales
 *     totalExercises: number,
 *     correctAnswers: number,
 *     incorrectAnswers: number
 *   },
 *   createdAt: timestamp,
 *   updatedAt: timestamp
 * }
 */

// Calculer le niveau utilisateur basé sur l'XP total (niveau global, pas niveau d'exercice)
export const calculateLevel = (totalXP) => {
  if (totalXP < 100) return 1;
  if (totalXP < 250) return 2;
  if (totalXP < 500) return 3;
  if (totalXP < 1000) return 4;
  if (totalXP < 2000) return 5;
  if (totalXP < 3500) return 6;
  if (totalXP < 5500) return 7;
  if (totalXP < 8000) return 8;
  if (totalXP < 11000) return 9;
  return 10;
};

// Nombre d'exercices par niveau
export const EXERCISES_PER_LEVEL = 10;

// XP requis pour passer au niveau suivant
export const getXPForNextLevel = (currentLevel) => {
  const levels = [100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];
  return levels[currentLevel - 1] || 15000;
};

// Calculer le streak (jours consécutifs)
const calculateStreak = (lastActivityDate) => {
  if (!lastActivityDate) return 1;

  const now = new Date();
  const lastActivity = lastActivityDate.toDate();

  // Réinitialiser les heures pour comparer uniquement les jours
  now.setHours(0, 0, 0, 0);
  lastActivity.setHours(0, 0, 0, 0);

  const diffTime = now - lastActivity;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

// Initialiser la progression pour un nouvel utilisateur
export const initializeProgress = async (userId) => {
  try {
    const progressRef = doc(db, 'progress', userId);

    const initialProgress = {
      userId,
      totalXP: 0,
      userLevel: 1,                  // Niveau global utilisateur
      currentLevel: 1,               // Commence au niveau 1 d'exercices
      completedLevels: [],           // Aucun niveau complété
      levelStats: {},                // Pas de stats de niveau encore
      lessonProgress: {},            // Progression des leçons (vide au départ)
      streak: {
        current: 0,
        longest: 0,
        lastActivityDate: null
      },
      stats: {
        totalExercises: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
      },
      dailyActivity: {},             // Activité quotidienne (pour calendrier GitHub-style)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(progressRef, initialProgress);
    return initialProgress;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la progression:', error);
    throw error;
  }
};

// Récupérer la progression d'un utilisateur
export const getUserProgress = async (userId) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return progressSnap.data();
    } else {
      // Si pas de progression, initialiser
      return await initializeProgress(userId);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la progression:', error);
    throw error;
  }
};

// Sauvegarder la complétion d'un exercice (NOUVELLE LOGIQUE - par niveau)
export const saveExerciseCompletion = async (userId, exerciseData) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    let currentProgress;
    if (progressSnap.exists()) {
      currentProgress = progressSnap.data();
    } else {
      currentProgress = await initializeProgress(userId);
    }

    const { exerciseLevel, isCorrect, xpGained } = exerciseData;

    // Vérifier si le niveau est déjà complété (verrouillé)
    if (currentProgress.completedLevels?.includes(exerciseLevel)) {
      console.warn(`Niveau ${exerciseLevel} déjà complété - pas de XP gagné`);
      return {
        totalXP: currentProgress.totalXP,
        userLevel: currentProgress.userLevel,
        xpGained: 0,
        leveledUp: false,
        alreadyCompleted: true
      };
    }

    // Récupérer les stats du niveau actuel
    const levelStats = currentProgress.levelStats?.[exerciseLevel] || {
      correct: 0,
      incorrect: 0,
      xp: 0
    };

    // Mettre à jour les stats du niveau
    const updatedLevelStats = {
      ...currentProgress.levelStats,
      [exerciseLevel]: {
        correct: levelStats.correct + (isCorrect ? 1 : 0),
        incorrect: levelStats.incorrect + (isCorrect ? 0 : 1),
        xp: levelStats.xp + xpGained
      }
    };

    // Calculer nouveau total XP et niveau utilisateur
    const newTotalXP = currentProgress.totalXP + xpGained;
    const newUserLevel = calculateLevel(newTotalXP);

    // Mettre à jour le streak
    const daysSinceLastActivity = currentProgress.streak.lastActivityDate
      ? calculateStreak(currentProgress.streak.lastActivityDate)
      : 0;

    let newStreak = currentProgress.streak;
    if (daysSinceLastActivity === 0) {
      // Même jour - conserver le streak
      newStreak = {
        ...currentProgress.streak,
        lastActivityDate: serverTimestamp()
      };
    } else if (daysSinceLastActivity === 1) {
      // Jour consécutif - incrémenter le streak
      const newCurrentStreak = currentProgress.streak.current + 1;
      newStreak = {
        current: newCurrentStreak,
        longest: Math.max(newCurrentStreak, currentProgress.streak.longest),
        lastActivityDate: serverTimestamp()
      };
    } else {
      // Plus d'un jour - réinitialiser le streak
      newStreak = {
        current: 1,
        longest: currentProgress.streak.longest,
        lastActivityDate: serverTimestamp()
      };
    }

    // Mettre à jour les stats globales
    const updatedStats = {
      totalExercises: currentProgress.stats.totalExercises + 1,
      correctAnswers: currentProgress.stats.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: currentProgress.stats.incorrectAnswers + (isCorrect ? 0 : 1)
    };

    // Mettre à jour l'activité quotidienne (pour le calendrier GitHub-style)
    const today = new Date().toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    const currentDailyActivity = currentProgress.dailyActivity || {};
    const todayCount = currentDailyActivity[today] || 0;
    const updatedDailyActivity = {
      ...currentDailyActivity,
      [today]: todayCount + 1
    };

    // Préparer les données mises à jour
    const updatedData = {
      totalXP: newTotalXP,
      userLevel: newUserLevel,
      levelStats: updatedLevelStats,
      streak: newStreak,
      stats: updatedStats,
      dailyActivity: updatedDailyActivity,
      updatedAt: serverTimestamp()
    };

    // Mettre à jour dans Firestore
    await updateDoc(progressRef, updatedData);

    // Retourner les données complètes mises à jour (pour éviter un rechargement)
    const fullUpdatedProgress = {
      ...currentProgress,
      ...updatedData,
      // Remplacer serverTimestamp() par la date actuelle pour l'état local
      updatedAt: new Date(),
      streak: {
        ...newStreak,
        lastActivityDate: new Date()
      }
    };

    return {
      totalXP: newTotalXP,
      userLevel: newUserLevel,
      xpGained: xpGained,
      leveledUp: newUserLevel > currentProgress.userLevel,
      alreadyCompleted: false,
      updatedProgress: fullUpdatedProgress  // Ajout des données complètes
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
    throw error;
  }
};

/**
 * ========================================
 * DEBOUNCED VERSION - Avec Queue & Batch
 * ========================================
 */

/**
 * Sauvegarder la complétion d'un exercice avec debounce (OPTIMISÉ)
 *
 * Fonctionnement :
 * 1. Calcul optimiste local (XP, niveau) pour UI réactive
 * 2. Ajouter à la queue (localStorage backup)
 * 3. Flush automatique après 5s d'inactivité
 *
 * @param {string} userId - ID utilisateur
 * @param {Object} exerciseData - { exerciseLevel, isCorrect, xpGained }
 * @returns {Object} { totalXP, userLevel, xpGained, leveledUp, isOptimistic: true }
 */
export const saveExerciseCompletionDebounced = async (userId, exerciseData) => {
  try {
    // 1. Récupérer la progression actuelle (cache local si possible)
    const currentProgress = await getUserProgress(userId);

    // 2. Vérifier si le niveau est déjà complété
    if (currentProgress.completedLevels?.includes(exerciseData.exerciseLevel)) {
      console.warn(`Niveau ${exerciseData.exerciseLevel} déjà complété - pas de XP gagné`);
      return {
        totalXP: currentProgress.totalXP,
        userLevel: currentProgress.userLevel,
        xpGained: 0,
        leveledUp: false,
        alreadyCompleted: true,
        isOptimistic: false
      };
    }

    // 3. Calcul optimiste local (UI réactive)
    const optimisticResult = calculateOptimisticProgress(currentProgress, exerciseData);

    // 4. Ajouter à la queue (backup localStorage + timer 5s)
    enqueueExercise({
      userId,
      ...exerciseData
    });

    console.log(`📝 Exercice ajouté à la queue (${getQueueSize()} en attente)`);

    // 5. Retourner immédiatement le résultat optimiste (UI ne bloque pas)
    return {
      ...optimisticResult,
      isOptimistic: true,
      queueSize: getQueueSize()
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde optimiste:', error);

    // Fallback : sauvegarde directe sans debounce
    return await saveExerciseCompletion(userId, exerciseData);
  }
};

/**
 * Écrire un batch d'exercices dans Firestore (agrégation)
 *
 * Appelé par le QueueManager après 5s d'inactivité
 *
 * @param {string} exerciseLevel - Niveau d'exercice (ex: "1_1")
 * @param {Object} aggregated - { correct, incorrect, xpGained }
 * @returns {Promise<Object>} Résultat de l'écriture
 */
const writeBatchToFirestore = async (userId, exerciseLevel, aggregated) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      throw new Error('Progression utilisateur introuvable');
    }

    const currentProgress = progressSnap.data();

    // Vérifier si le niveau est déjà complété
    if (currentProgress.completedLevels?.includes(exerciseLevel)) {
      console.warn(`Batch ignoré : niveau ${exerciseLevel} déjà complété`);
      return { skipped: true };
    }

    // Récupérer les stats du niveau actuel
    const levelStats = currentProgress.levelStats?.[exerciseLevel] || {
      correct: 0,
      incorrect: 0,
      xp: 0
    };

    // Agréger les stats du batch avec les stats existantes
    const updatedLevelStats = {
      ...currentProgress.levelStats,
      [exerciseLevel]: {
        correct: levelStats.correct + aggregated.correct,
        incorrect: levelStats.incorrect + aggregated.incorrect,
        xp: levelStats.xp + aggregated.xpGained
      }
    };

    // Calculer nouveau total XP et niveau utilisateur
    const newTotalXP = currentProgress.totalXP + aggregated.xpGained;
    const newUserLevel = calculateLevel(newTotalXP);

    // Mettre à jour le streak (simplifié pour batch)
    const daysSinceLastActivity = currentProgress.streak.lastActivityDate
      ? calculateStreak(currentProgress.streak.lastActivityDate)
      : 0;

    let newStreak = currentProgress.streak;
    if (daysSinceLastActivity === 0) {
      newStreak = {
        ...currentProgress.streak,
        lastActivityDate: serverTimestamp()
      };
    } else if (daysSinceLastActivity === 1) {
      const newCurrentStreak = currentProgress.streak.current + 1;
      newStreak = {
        current: newCurrentStreak,
        longest: Math.max(newCurrentStreak, currentProgress.streak.longest),
        lastActivityDate: serverTimestamp()
      };
    } else {
      newStreak = {
        current: 1,
        longest: currentProgress.streak.longest,
        lastActivityDate: serverTimestamp()
      };
    }

    // Mettre à jour les stats globales (agréger le batch)
    const updatedStats = {
      totalExercises: currentProgress.stats.totalExercises + aggregated.correct + aggregated.incorrect,
      correctAnswers: currentProgress.stats.correctAnswers + aggregated.correct,
      incorrectAnswers: currentProgress.stats.incorrectAnswers + aggregated.incorrect
    };

    // Mettre à jour l'activité quotidienne
    const today = new Date().toISOString().split('T')[0];
    const currentDailyActivity = currentProgress.dailyActivity || {};
    const todayCount = currentDailyActivity[today] || 0;
    const updatedDailyActivity = {
      ...currentDailyActivity,
      [today]: todayCount + aggregated.correct + aggregated.incorrect
    };

    // Préparer les données mises à jour
    const updatedData = {
      totalXP: newTotalXP,
      userLevel: newUserLevel,
      levelStats: updatedLevelStats,
      streak: newStreak,
      stats: updatedStats,
      dailyActivity: updatedDailyActivity,
      updatedAt: serverTimestamp()
    };

    // 🔥 ÉCRITURE UNIQUE FIRESTORE pour tout le batch
    await updateDoc(progressRef, updatedData);

    console.log(`✅ Batch écrit : ${aggregated.correct + aggregated.incorrect} exercices (niveau ${exerciseLevel})`);

    return {
      success: true,
      exerciseLevel,
      itemsWritten: aggregated.correct + aggregated.incorrect
    };
  } catch (error) {
    console.error('Erreur lors de l\'écriture batch:', error);
    throw error;
  }
};

/**
 * Wrapper pour writeBatchToFirestore (utilisé par QueueManager)
 */
const createBatchWriter = (userId) => {
  return async (exerciseLevel, aggregated) => {
    return await writeBatchToFirestore(userId, exerciseLevel, aggregated);
  };
};

/**
 * Flusher manuellement la queue (utilitaire public)
 * @param {string} userId - ID utilisateur
 */
export const flushExerciseQueue = async (userId) => {
  const batchWriter = createBatchWriter(userId);
  return await flushQueue(batchWriter);
};

/**
 * Traiter la queue au chargement de la page (récupération après crash/offline)
 * À appeler dans ProgressContext au mount
 */
export const processQueueOnLoad = async (userId) => {
  const queueSize = getQueueSize();

  if (queueSize === 0) {
    return { processed: 0 };
  }

  console.log(`🔄 Traitement queue au chargement : ${queueSize} exercices en attente`);

  try {
    const batchWriter = createBatchWriter(userId);
    const result = await flushQueue(batchWriter);

    console.log(`✅ Queue traitée : ${result.flushed} exercices → ${result.writes} écritures Firestore`);

    return result;
  } catch (error) {
    console.error('❌ Erreur traitement queue:', error);
    return { processed: 0, error };
  }
};

/**
 * ========================================
 * OPTIMISÉ : Compléter un niveau entier (batch)
 * ========================================
 */

/**
 * Compléter un niveau entier avec stats agrégées (1 seule écriture Firestore)
 *
 * @param {string} userId - ID utilisateur
 * @param {string} exerciseLevel - Niveau d'exercice (ex: "1_1")
 * @param {Object} levelStats - { correctAnswers, incorrectAnswers, xpGained }
 * @returns {Promise<Object>} Progression mise à jour
 */
export const completeLevelBatch = async (userId, exerciseLevel, levelStats) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      // Initialiser si n'existe pas encore
      await initializeProgress(userId);
      const newSnap = await getDoc(progressRef);
      return await completeLevelBatch(userId, exerciseLevel, levelStats);
    }

    const currentProgress = progressSnap.data();

    // Vérifier si le niveau est déjà complété
    if (currentProgress.completedLevels?.includes(exerciseLevel)) {
      console.warn(`Niveau ${exerciseLevel} déjà complété - ignoré`);
      return {
        totalXP: currentProgress.totalXP,
        userLevel: currentProgress.userLevel,
        xpGained: 0,
        alreadyCompleted: true
      };
    }

    const { correctAnswers, incorrectAnswers, xpGained } = levelStats;
    const totalExercises = correctAnswers + incorrectAnswers;

    // Mettre à jour les stats du niveau
    const updatedLevelStats = {
      ...currentProgress.levelStats,
      [exerciseLevel]: {
        correct: correctAnswers,
        incorrect: incorrectAnswers,
        xp: xpGained,
        completedAt: serverTimestamp()
      }
    };

    // Calculer nouveau total XP et niveau utilisateur
    const newTotalXP = currentProgress.totalXP + xpGained;
    const newUserLevel = calculateLevel(newTotalXP);

    // Mettre à jour le streak
    const daysSinceLastActivity = currentProgress.streak.lastActivityDate
      ? calculateStreak(currentProgress.streak.lastActivityDate)
      : 0;

    let newStreak = currentProgress.streak;
    if (daysSinceLastActivity === 0) {
      // Même jour - conserver le streak
      newStreak = {
        ...currentProgress.streak,
        lastActivityDate: serverTimestamp()
      };
    } else if (daysSinceLastActivity === 1) {
      // Jour consécutif - incrémenter le streak
      const newCurrentStreak = currentProgress.streak.current + 1;
      newStreak = {
        current: newCurrentStreak,
        longest: Math.max(newCurrentStreak, currentProgress.streak.longest),
        lastActivityDate: serverTimestamp()
      };
    } else {
      // Plus d'un jour - réinitialiser le streak
      newStreak = {
        current: 1,
        longest: currentProgress.streak.longest,
        lastActivityDate: serverTimestamp()
      };
    }

    // Mettre à jour les stats globales
    const updatedStats = {
      totalExercises: currentProgress.stats.totalExercises + totalExercises,
      correctAnswers: currentProgress.stats.correctAnswers + correctAnswers,
      incorrectAnswers: currentProgress.stats.incorrectAnswers + incorrectAnswers
    };

    // Mettre à jour l'activité quotidienne
    const today = new Date().toISOString().split('T')[0];
    const currentDailyActivity = currentProgress.dailyActivity || {};
    const todayCount = currentDailyActivity[today] || 0;
    const updatedDailyActivity = {
      ...currentDailyActivity,
      [today]: todayCount + totalExercises
    };

    // Ajouter le niveau aux niveaux complétés
    const updatedCompletedLevels = [...(currentProgress.completedLevels || []), exerciseLevel];

    // Préparer les données mises à jour
    const updatedData = {
      totalXP: newTotalXP,
      userLevel: newUserLevel,
      levelStats: updatedLevelStats,
      completedLevels: updatedCompletedLevels,
      currentLevel: exerciseLevel + 1, // Passer au niveau suivant
      streak: newStreak,
      stats: updatedStats,
      dailyActivity: updatedDailyActivity,
      updatedAt: serverTimestamp()
    };

    // 🔥 ÉCRITURE UNIQUE FIRESTORE pour tout le niveau
    await updateDoc(progressRef, updatedData);

    console.log(`✅ Niveau ${exerciseLevel} complété en batch : ${correctAnswers}/${totalExercises} corrects, +${xpGained} XP`);

    // Retourner les données complètes mises à jour
    return {
      totalXP: newTotalXP,
      userLevel: newUserLevel,
      xpGained,
      leveledUp: newUserLevel > currentProgress.userLevel,
      alreadyCompleted: false,
      updatedProgress: {
        ...currentProgress,
        ...updatedData,
        updatedAt: new Date(),
        streak: {
          ...newStreak,
          lastActivityDate: new Date()
        }
      }
    };
  } catch (error) {
    console.error('Erreur lors de la complétion du niveau batch:', error);
    throw error;
  }
};

// Marquer un niveau comme complété (appelé après les 10 exercices)
export const completeLevelBlock = async (userId, exerciseLevel) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      throw new Error('Progression utilisateur introuvable');
    }

    const currentProgress = progressSnap.data();

    // Vérifier si déjà complété
    if (currentProgress.completedLevels?.includes(exerciseLevel)) {
      console.warn(`Niveau ${exerciseLevel} déjà complété`);
      return currentProgress;
    }

    // Ajouter le niveau aux niveaux complétés
    const updatedCompletedLevels = [...(currentProgress.completedLevels || []), exerciseLevel];

    // Marquer la date de complétion dans levelStats
    const updatedLevelStats = {
      ...currentProgress.levelStats,
      [exerciseLevel]: {
        ...currentProgress.levelStats[exerciseLevel],
        completedAt: serverTimestamp()
      }
    };

    // Passer au niveau suivant
    const nextLevel = exerciseLevel + 1;

    // Mettre à jour dans Firestore
    await updateDoc(progressRef, {
      completedLevels: updatedCompletedLevels,
      currentLevel: nextLevel,
      levelStats: updatedLevelStats,
      updatedAt: serverTimestamp()
    });

    return {
      ...currentProgress,
      completedLevels: updatedCompletedLevels,
      currentLevel: nextLevel,
      levelStats: updatedLevelStats
    };
  } catch (error) {
    console.error('Erreur lors de la complétion du niveau:', error);
    throw error;
  }
};

// Migrer la progression depuis localStorage vers Firestore (NOUVELLE STRUCTURE)
export const migrateFromLocalStorage = async (userId) => {
  try {
    // Récupérer les données de localStorage
    const localProgress = localStorage.getItem('userProgress');

    if (!localProgress) {
      return null; // Rien à migrer
    }

    const parsedProgress = JSON.parse(localProgress);

    // Vérifier si l'utilisateur a déjà de la progression dans Firestore
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      // Déjà de la progression dans Firestore - ne pas écraser
      console.log('Progression Firestore déjà existante - migration ignorée');
      return null;
    }

    // Créer la progression dans Firestore à partir de localStorage (NOUVELLE STRUCTURE)
    const migratedProgress = {
      userId,
      totalXP: parsedProgress.totalXP || 0,
      userLevel: parsedProgress.level || 1,
      currentLevel: parsedProgress.currentLevel || 1,
      completedLevels: parsedProgress.completedLevels || [],
      levelStats: parsedProgress.levelStats || {},
      streak: parsedProgress.streak || {
        current: 0,
        longest: 0,
        lastActivityDate: null
      },
      stats: parsedProgress.stats || {
        totalExercises: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
      },
      dailyActivity: parsedProgress.dailyActivity || {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(progressRef, migratedProgress);

    // Nettoyer localStorage après migration réussie
    localStorage.removeItem('userProgress');

    console.log('Migration localStorage → Firestore réussie !');
    return migratedProgress;
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    throw error;
  }
};

// Sauvegarder la progression en mode invité (localStorage uniquement)
export const saveProgressLocally = (progressData) => {
  try {
    const currentProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');

    const updatedProgress = {
      ...currentProgress,
      ...progressData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
    return updatedProgress;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde locale:', error);
    throw error;
  }
};

// Récupérer la progression locale (mode invité) - NOUVELLE STRUCTURE
export const getLocalProgress = () => {
  try {
    const progress = localStorage.getItem('userProgress');
    if (!progress) {
      return {
        totalXP: 0,
        userLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        levelStats: {},
        streak: { current: 0, longest: 0 },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 },
        dailyActivity: {}
      };
    }
    return JSON.parse(progress);
  } catch (error) {
    console.error('Erreur lors de la récupération locale:', error);
    return {
      totalXP: 0,
      userLevel: 1,
      currentLevel: 1,
      completedLevels: [],
      levelStats: {},
      streak: { current: 0, longest: 0 },
      stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 },
      dailyActivity: {}
    };
  }
};

/**
 * Mettre à jour la progression utilisateur (pour leçons, achievements, etc.)
 * Permet de modifier des champs spécifiques sans recharger toute la progression
 */
export const updateUserProgress = async (userId, updatedFields) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      throw new Error('Progression utilisateur introuvable');
    }

    const currentProgress = progressSnap.data();

    // Préparer les données mises à jour
    const updatedData = {
      ...updatedFields,
      updatedAt: serverTimestamp()
    };

    // Mettre à jour dans Firestore
    await updateDoc(progressRef, updatedData);

    // Retourner les données complètes mises à jour
    const fullUpdatedProgress = {
      ...currentProgress,
      ...updatedFields,
      updatedAt: new Date()
    };

    return fullUpdatedProgress;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la progression:', error);
    throw error;
  }
};
