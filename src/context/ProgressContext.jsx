import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProgress,
  saveExerciseCompletion,
  completeLevelBlock,
  migrateFromLocalStorage,
  saveProgressLocally,
  getLocalProgress,
  calculateLevel,
  getXPForNextLevel,
  EXERCISES_PER_LEVEL
} from '../services/progressService';

// Création du contexte
const ProgressContext = createContext({});

// Hook personnalisé pour utiliser le contexte
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress doit être utilisé dans un ProgressProvider');
  }
  return context;
};

// Provider de progression
export const ProgressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger la progression au montage ou quand l'utilisateur change
  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isAuthenticated && user) {
          // Mode connecté - charger depuis Firestore
          console.log('Chargement progression Firestore pour:', user.uid);

          // Tenter la migration depuis localStorage si c'est la première connexion
          await migrateFromLocalStorage(user.uid);

          // Charger la progression
          const userProgress = await getUserProgress(user.uid);
          setProgress(userProgress);
        } else {
          // Mode invité - charger depuis localStorage
          console.log('Chargement progression localStorage (mode invité)');
          const localProgress = getLocalProgress();
          setProgress(localProgress);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la progression:', err);
        setError(err.message);

        // En cas d'erreur, utiliser la progression locale
        const localProgress = getLocalProgress();
        setProgress(localProgress);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user, isAuthenticated]);

  // Sauvegarder la complétion d'un exercice (NOUVELLE LOGIQUE)
  const completeExercise = async (exerciseData) => {
    try {
      if (isAuthenticated && user) {
        // Mode connecté - sauvegarder dans Firestore
        const result = await saveExerciseCompletion(user.uid, exerciseData);

        // Recharger la progression pour avoir les données à jour
        const updatedProgress = await getUserProgress(user.uid);
        setProgress(updatedProgress);

        return result;
      } else {
        // Mode invité - sauvegarder localement (NOUVELLE LOGIQUE)
        const currentProgress = progress || getLocalProgress();
        const { exerciseLevel, isCorrect, xpGained } = exerciseData;

        // Vérifier si le niveau est déjà complété
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

        const newTotalXP = currentProgress.totalXP + xpGained;
        const newUserLevel = calculateLevel(newTotalXP);

        const updatedStats = {
          totalExercises: currentProgress.stats.totalExercises + 1,
          correctAnswers: currentProgress.stats.correctAnswers + (isCorrect ? 1 : 0),
          incorrectAnswers: currentProgress.stats.incorrectAnswers + (isCorrect ? 0 : 1)
        };

        const updatedProgress = {
          ...currentProgress,
          totalXP: newTotalXP,
          userLevel: newUserLevel,
          levelStats: updatedLevelStats,
          stats: updatedStats
        };

        saveProgressLocally(updatedProgress);
        setProgress(updatedProgress);

        return {
          totalXP: newTotalXP,
          userLevel: newUserLevel,
          xpGained: xpGained,
          leveledUp: newUserLevel > currentProgress.userLevel,
          alreadyCompleted: false
        };
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'exercice:', err);
      setError(err.message);
      throw err;
    }
  };

  // Compléter un niveau (appelé après 10 exercices)
  const completeLevel = async (exerciseLevel) => {
    try {
      if (isAuthenticated && user) {
        // Mode connecté - sauvegarder dans Firestore
        const updatedProgress = await completeLevelBlock(user.uid, exerciseLevel);
        setProgress(updatedProgress);
        return updatedProgress;
      } else {
        // Mode invité - sauvegarder localement
        const currentProgress = progress || getLocalProgress();

        // Vérifier si déjà complété
        if (currentProgress.completedLevels?.includes(exerciseLevel)) {
          console.warn(`Niveau ${exerciseLevel} déjà complété`);
          return currentProgress;
        }

        const updatedCompletedLevels = [...(currentProgress.completedLevels || []), exerciseLevel];
        const nextLevel = exerciseLevel + 1;

        const updatedLevelStats = {
          ...currentProgress.levelStats,
          [exerciseLevel]: {
            ...currentProgress.levelStats[exerciseLevel],
            completedAt: new Date().toISOString()
          }
        };

        const updatedProgress = {
          ...currentProgress,
          completedLevels: updatedCompletedLevels,
          currentLevel: nextLevel,
          levelStats: updatedLevelStats
        };

        saveProgressLocally(updatedProgress);
        setProgress(updatedProgress);

        return updatedProgress;
      }
    } catch (err) {
      console.error('Erreur lors de la complétion du niveau:', err);
      setError(err.message);
      throw err;
    }
  };

  // Vérifier si un niveau a été complété
  const isLevelCompleted = (exerciseLevel) => {
    if (!progress || !progress.completedLevels) return false;
    return progress.completedLevels.includes(exerciseLevel);
  };

  // Obtenir les statistiques actuelles
  const getStats = () => {
    if (!progress) {
      return {
        totalXP: 0,
        userLevel: 1,
        currentLevel: 1,
        totalExercises: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streak: { current: 0, longest: 0 }
      };
    }

    return {
      totalXP: progress.totalXP || 0,
      userLevel: progress.userLevel || 1,
      currentLevel: progress.currentLevel || 1,
      totalExercises: progress.stats?.totalExercises || 0,
      correctAnswers: progress.stats?.correctAnswers || 0,
      incorrectAnswers: progress.stats?.incorrectAnswers || 0,
      streak: progress.streak || { current: 0, longest: 0 }
    };
  };

  // Obtenir les stats d'un niveau spécifique
  const getLevelStats = (exerciseLevel) => {
    if (!progress || !progress.levelStats || !progress.levelStats[exerciseLevel]) {
      return { correct: 0, incorrect: 0, xp: 0 };
    }
    return progress.levelStats[exerciseLevel];
  };

  // Calculer la progression vers le niveau utilisateur suivant
  const getProgressToNextLevel = () => {
    const currentUserLevel = progress?.userLevel || 1;
    const currentXP = progress?.totalXP || 0;
    const xpForNextLevel = getXPForNextLevel(currentUserLevel);

    // XP du niveau précédent
    const previousLevelXP = currentUserLevel === 1 ? 0 : getXPForNextLevel(currentUserLevel - 1);

    const xpInCurrentLevel = currentXP - previousLevelXP;
    const xpNeededForLevel = xpForNextLevel - previousLevelXP;

    return {
      current: xpInCurrentLevel,
      required: xpNeededForLevel,
      percentage: Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100)
    };
  };

  // Mettre à jour la progression directement (pour les leçons)
  const updateProgress = async (updatedFields) => {
    try {
      const currentProgress = progress || getLocalProgress();
      const updatedProgress = {
        ...currentProgress,
        ...updatedFields
      };

      if (isAuthenticated && user) {
        // Mode connecté - sauvegarder dans Firestore
        // TODO: Ajouter fonction updateUserProgress dans progressService
        saveProgressLocally(updatedProgress);
      } else {
        // Mode invité - sauvegarder localement
        saveProgressLocally(updatedProgress);
      }

      setProgress(updatedProgress);
      return updatedProgress;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la progression:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    progress,
    loading,
    error,
    completeExercise,
    completeLevel,
    isLevelCompleted,
    getLevelStats,
    getStats,
    getProgressToNextLevel,
    updateProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
