// Service pour gérer la progression utilisateur dans Firestore
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

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

    // Mettre à jour dans Firestore
    await updateDoc(progressRef, {
      totalXP: newTotalXP,
      userLevel: newUserLevel,
      levelStats: updatedLevelStats,
      streak: newStreak,
      stats: updatedStats,
      dailyActivity: updatedDailyActivity,
      updatedAt: serverTimestamp()
    });

    return {
      totalXP: newTotalXP,
      userLevel: newUserLevel,
      xpGained: xpGained,
      leveledUp: newUserLevel > currentProgress.userLevel,
      alreadyCompleted: false
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
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
