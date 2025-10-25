import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProgress,
  saveExerciseCompletion,
  migrateFromLocalStorage,
  saveProgressLocally,
  getLocalProgress,
  calculateLevel,
  getXPForNextLevel
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

  // Sauvegarder la complétion d'un exercice
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
        // Mode invité - sauvegarder localement
        const currentProgress = progress || getLocalProgress();

        // Vérifier si l'exercice a déjà été complété
        const existingExerciseIndex = currentProgress.completedExercises.findIndex(
          ex => ex.exerciseId === exerciseData.exerciseId
        );

        let updatedExercises;
        let xpToAdd = exerciseData.xpGained;

        if (existingExerciseIndex >= 0) {
          // Exercice déjà fait - ne pas donner d'XP
          updatedExercises = [...currentProgress.completedExercises];
          updatedExercises[existingExerciseIndex] = {
            ...exerciseData,
            completedAt: new Date().toISOString()
          };
          xpToAdd = 0;
        } else {
          // Nouvel exercice
          updatedExercises = [
            ...currentProgress.completedExercises,
            {
              ...exerciseData,
              completedAt: new Date().toISOString()
            }
          ];
        }

        const newTotalXP = currentProgress.totalXP + xpToAdd;
        const newLevel = calculateLevel(newTotalXP);

        const updatedStats = {
          totalExercises: currentProgress.stats.totalExercises + (existingExerciseIndex >= 0 ? 0 : 1),
          correctAnswers: currentProgress.stats.correctAnswers + (exerciseData.isCorrect ? 1 : 0),
          incorrectAnswers: currentProgress.stats.incorrectAnswers + (exerciseData.isCorrect ? 0 : 1)
        };

        const updatedProgress = {
          ...currentProgress,
          totalXP: newTotalXP,
          level: newLevel,
          completedExercises: updatedExercises,
          stats: updatedStats
        };

        saveProgressLocally(updatedProgress);
        setProgress(updatedProgress);

        return {
          totalXP: newTotalXP,
          level: newLevel,
          xpGained: xpToAdd,
          leveledUp: newLevel > currentProgress.level
        };
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'exercice:', err);
      setError(err.message);
      throw err;
    }
  };

  // Vérifier si un exercice a été complété
  const isExerciseCompleted = (exerciseId) => {
    if (!progress || !progress.completedExercises) return false;
    return progress.completedExercises.some(ex => ex.exerciseId === exerciseId);
  };

  // Obtenir les statistiques actuelles
  const getStats = () => {
    if (!progress) {
      return {
        totalXP: 0,
        level: 1,
        totalExercises: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streak: { current: 0, longest: 0 }
      };
    }

    return {
      totalXP: progress.totalXP || 0,
      level: progress.level || 1,
      totalExercises: progress.stats?.totalExercises || 0,
      correctAnswers: progress.stats?.correctAnswers || 0,
      incorrectAnswers: progress.stats?.incorrectAnswers || 0,
      streak: progress.streak || { current: 0, longest: 0 }
    };
  };

  // Calculer la progression vers le niveau suivant
  const getProgressToNextLevel = () => {
    const currentLevel = progress?.level || 1;
    const currentXP = progress?.totalXP || 0;
    const xpForNextLevel = getXPForNextLevel(currentLevel);

    // XP du niveau précédent
    const previousLevelXP = currentLevel === 1 ? 0 : getXPForNextLevel(currentLevel - 1);

    const xpInCurrentLevel = currentXP - previousLevelXP;
    const xpNeededForLevel = xpForNextLevel - previousLevelXP;

    return {
      current: xpInCurrentLevel,
      required: xpNeededForLevel,
      percentage: Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100)
    };
  };

  const value = {
    progress,
    loading,
    error,
    completeExercise,
    isExerciseCompleted,
    getStats,
    getProgressToNextLevel
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
