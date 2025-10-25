// Service pour gérer la progression utilisateur dans Firestore
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Structure de données de progression :
 * {
 *   userId: string,
 *   totalXP: number,
 *   level: number,
 *   completedExercises: [
 *     {
 *       exerciseId: string,
 *       language: string,
 *       difficulty: number,
 *       xpGained: number,
 *       completedAt: timestamp,
 *       attempts: number
 *     }
 *   ],
 *   streak: {
 *     current: number,
 *     longest: number,
 *     lastActivityDate: timestamp
 *   },
 *   stats: {
 *     totalExercises: number,
 *     correctAnswers: number,
 *     incorrectAnswers: number
 *   },
 *   createdAt: timestamp,
 *   updatedAt: timestamp
 * }
 */

// Calculer le niveau basé sur l'XP total
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
      level: 1,
      completedExercises: [],
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

// Sauvegarder la complétion d'un exercice
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

    // Vérifier si l'exercice a déjà été complété
    const existingExerciseIndex = currentProgress.completedExercises.findIndex(
      ex => ex.exerciseId === exerciseData.exerciseId
    );

    let updatedExercises;
    let xpToAdd = exerciseData.xpGained;

    if (existingExerciseIndex >= 0) {
      // Exercice déjà fait - ne pas donner d'XP supplémentaire, juste mettre à jour
      updatedExercises = [...currentProgress.completedExercises];
      updatedExercises[existingExerciseIndex] = {
        ...exerciseData,
        completedAt: serverTimestamp()
      };
      xpToAdd = 0; // Pas d'XP pour refaire un exercice
    } else {
      // Nouvel exercice complété
      updatedExercises = [
        ...currentProgress.completedExercises,
        {
          ...exerciseData,
          completedAt: serverTimestamp()
        }
      ];
    }

    // Calculer nouveau total XP et niveau
    const newTotalXP = currentProgress.totalXP + xpToAdd;
    const newLevel = calculateLevel(newTotalXP);

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

    // Mettre à jour les stats
    const updatedStats = {
      totalExercises: currentProgress.stats.totalExercises + (existingExerciseIndex >= 0 ? 0 : 1),
      correctAnswers: currentProgress.stats.correctAnswers + (exerciseData.isCorrect ? 1 : 0),
      incorrectAnswers: currentProgress.stats.incorrectAnswers + (exerciseData.isCorrect ? 0 : 1)
    };

    // Mettre à jour dans Firestore
    await updateDoc(progressRef, {
      totalXP: newTotalXP,
      level: newLevel,
      completedExercises: updatedExercises,
      streak: newStreak,
      stats: updatedStats,
      updatedAt: serverTimestamp()
    });

    return {
      totalXP: newTotalXP,
      level: newLevel,
      xpGained: xpToAdd,
      leveledUp: newLevel > currentProgress.level
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
    throw error;
  }
};

// Migrer la progression depuis localStorage vers Firestore
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

    // Créer la progression dans Firestore à partir de localStorage
    const migratedProgress = {
      userId,
      totalXP: parsedProgress.totalXP || 0,
      level: parsedProgress.level || 1,
      completedExercises: parsedProgress.completedExercises || [],
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

// Récupérer la progression locale (mode invité)
export const getLocalProgress = () => {
  try {
    const progress = localStorage.getItem('userProgress');
    if (!progress) {
      return {
        totalXP: 0,
        level: 1,
        completedExercises: [],
        streak: { current: 0, longest: 0 },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 }
      };
    }
    return JSON.parse(progress);
  } catch (error) {
    console.error('Erreur lors de la récupération locale:', error);
    return {
      totalXP: 0,
      level: 1,
      completedExercises: [],
      streak: { current: 0, longest: 0 },
      stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 }
    };
  }
};
