import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProgress,
  saveExerciseCompletion,
  saveExerciseCompletionDebounced,
  completeLevelBlock,
  completeLevelBatch,
  migrateFromLocalStorage,
  saveProgressLocally,
  getLocalProgress,
  calculateLevel,  // ✅ Déjà importé
  getXPForNextLevel,
  EXERCISES_PER_LEVEL,
  updateUserProgress,
  processQueueOnLoad,
  flushExerciseQueue,
  updateDailyActivityByType  // ✅ Helper calendrier
} from '../services/progressService';
import { exerciseRateLimiter, lessonRateLimiter } from '../utils/throttle';
import { getQueueSize } from '../utils/debounce';
import { getUserFriendlyMessage, logError, isRetryable } from '../utils/errorHandler';

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

          // 🆕 DEBOUNCE: Traiter la queue d'exercices en attente (récupération après offline/crash)
          const queueSize = getQueueSize();
          if (queueSize > 0) {
            console.log(`📦 Queue détectée : ${queueSize} exercices en attente`);
            try {
              await processQueueOnLoad(user.uid);
              console.log('✅ Queue traitée avec succès');

              // Recharger la progression après traitement de la queue
              const updatedProgress = await getUserProgress(user.uid);
              setProgress(updatedProgress);
            } catch (queueError) {
              console.error('⚠️ Erreur traitement queue (continuera au prochain flush):', queueError);
              // Ne pas bloquer le chargement si la queue échoue
            }
          }
        } else {
          // Mode invité - charger depuis localStorage
          console.log('Chargement progression localStorage (mode invité)');
          const localProgress = getLocalProgress();
          setProgress(localProgress);
        }
      } catch (err) {
        logError('loadProgress', err, { userId: user?.uid });
        const friendlyMessage = getUserFriendlyMessage(err);
        setError(friendlyMessage);

        // En cas d'erreur, utiliser la progression locale comme fallback
        const localProgress = getLocalProgress();
        setProgress(localProgress);
        console.log('📱 Fallback vers progression locale');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user, isAuthenticated]);

  // 🆕 DEBOUNCE: Flusher la queue sur fermeture de la page (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      const queueSize = getQueueSize();

      if (queueSize > 0 && isAuthenticated && user) {
        // Tenter de flusher la queue avant fermeture (best effort)
        console.warn(`⚠️ beforeunload: ${queueSize} exercices en attente - tentative flush...`);

        try {
          // Note : beforeunload ne supporte pas bien l'async
          // La queue reste dans localStorage et sera traitée au prochain chargement
          await flushExerciseQueue(user.uid);
          console.log('✅ Queue flushée avant fermeture');
        } catch (error) {
          console.error('❌ Erreur flush beforeunload (queue persistée):', error);
          // La queue reste dans localStorage (récupération au prochain chargement)
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated, user]);

  // Sauvegarder la complétion d'un exercice (OPTIMISÉ + RATE LIMITED)
  const completeExercise = async (exerciseData) => {
    try {
      // Rate limiting : Max 30 exercices/minute (1 toutes les 2 secondes)
      const userId = user?.uid || 'guest';
      if (!exerciseRateLimiter.check(userId)) {
        const timeUntilReset = exerciseRateLimiter.getTimeUntilReset(userId);
        const secondsRemaining = Math.ceil(timeUntilReset / 1000);

        console.warn(`⚠️ Rate limit atteint pour ${userId} - Réessayer dans ${secondsRemaining}s`);
        throw new Error(
          `Trop d'exercices complétés trop rapidement. Attendez ${secondsRemaining} secondes.`
        );
      }

      if (isAuthenticated && user) {
        // 🆕 DEBOUNCE: Mode connecté - Update optimiste avec queue (batching automatique)
        const result = await saveExerciseCompletionDebounced(user.uid, exerciseData);

        // Calcul optimiste : update immédiat de l'UI (pas d'attente Firestore)
        if (result.isOptimistic) {
          // Mettre à jour localement avec les valeurs optimistes
          const optimisticProgress = {
            ...progress,
            totalXP: result.newTotalXP,
            userLevel: result.newUserLevel
          };
          setProgress(optimisticProgress);

          console.log(`⚡ Update optimiste: +${result.xpGained} XP (queue: ${result.queueSize})`);
        }

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

        // ✅ Mettre à jour l'activité quotidienne (pour le calendrier)
        const updatedDailyActivity = updateDailyActivityByType(
          currentProgress.dailyActivity,
          'training',
          1
        );

        const updatedProgress = {
          ...currentProgress,
          totalXP: newTotalXP,
          userLevel: newUserLevel,
          levelStats: updatedLevelStats,
          stats: updatedStats,
          dailyActivity: updatedDailyActivity
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
      logError('completeExercise', err, { userId: user?.uid });
      const friendlyMessage = getUserFriendlyMessage(err);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
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
      logError('completeLevel', err, { userId: user?.uid, exerciseLevel });
      const friendlyMessage = getUserFriendlyMessage(err);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  // ✅ OPTIMISÉ : Compléter un niveau avec stats batch (1 seule écriture Firestore)
  const completeLevelWithBatch = async (exerciseLevel, levelStats) => {
    try {
      if (isAuthenticated && user) {
        // Mode connecté - sauvegarder avec batch optimisé
        const result = await completeLevelBatch(user.uid, exerciseLevel, levelStats);

        // Mettre à jour la progression avec les données retournées
        if (result.updatedProgress) {
          setProgress(result.updatedProgress);
        }

        return result;
      } else {
        // Mode invité - sauvegarder localement
        const currentProgress = progress || getLocalProgress();
        const { correctAnswers, incorrectAnswers, xpGained } = levelStats;

        // Vérifier si déjà complété
        if (currentProgress.completedLevels?.includes(exerciseLevel)) {
          console.warn(`Niveau ${exerciseLevel} déjà complété`);
          return {
            totalXP: currentProgress.totalXP,
            userLevel: currentProgress.userLevel,
            xpGained: 0,
            alreadyCompleted: true
          };
        }

        const totalExercises = correctAnswers + incorrectAnswers;

        // Mettre à jour les stats du niveau
        const updatedLevelStats = {
          ...currentProgress.levelStats,
          [exerciseLevel]: {
            correct: correctAnswers,
            incorrect: incorrectAnswers,
            xp: xpGained,
            completedAt: new Date().toISOString()
          }
        };

        // Calculer nouveau total XP et niveau
        const newTotalXP = currentProgress.totalXP + xpGained;
        const newUserLevel = calculateLevel(newTotalXP);

        // Mettre à jour les stats globales
        const updatedStats = {
          totalExercises: currentProgress.stats.totalExercises + totalExercises,
          correctAnswers: currentProgress.stats.correctAnswers + correctAnswers,
          incorrectAnswers: currentProgress.stats.incorrectAnswers + incorrectAnswers
        };

        // Ajouter le niveau aux niveaux complétés
        const updatedCompletedLevels = [...(currentProgress.completedLevels || []), exerciseLevel];

        const updatedProgress = {
          ...currentProgress,
          totalXP: newTotalXP,
          userLevel: newUserLevel,
          levelStats: updatedLevelStats,
          completedLevels: updatedCompletedLevels,
          stats: updatedStats
        };

        saveProgressLocally(updatedProgress);
        setProgress(updatedProgress);

        return {
          totalXP: newTotalXP,
          userLevel: newUserLevel,
          xpGained,
          leveledUp: newUserLevel > currentProgress.userLevel,
          alreadyCompleted: false
        };
      }
    } catch (err) {
      logError('completeLevelWithBatch', err, { userId: user?.uid, exerciseLevel, levelStats });
      const friendlyMessage = getUserFriendlyMessage(err);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
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
        totalExercises: 0,
        correctAnswers: 0,
        completedLessons: 0,  // ✅ NOUVEAU : Leçons terminées au lieu de incorrectAnswers
        streak: { current: 0, longest: 0 }
      };
    }

    // ✅ NOUVEAU : Calculer le nombre total de leçons terminées
    let completedLessons = 0;
    if (progress.lessonProgress) {
      // Parcourir tous les langages (python, javascript, etc.)
      Object.values(progress.lessonProgress).forEach(languageProgress => {
        // Parcourir tous les chapitres du langage
        Object.values(languageProgress).forEach(chapterProgress => {
          if (chapterProgress?.completed === true) {
            completedLessons++;
          }
        });
      });
    }

    // ✅ CORRECTION BUG NIVEAU : Recalculer userLevel depuis totalXP au lieu d'utiliser la valeur stockée
    const currentTotalXP = progress.totalXP || 0;
    const calculatedUserLevel = calculateLevel(currentTotalXP);

    return {
      totalXP: currentTotalXP,
      userLevel: calculatedUserLevel,  // ✅ Recalculé dynamiquement (garantit cohérence)
      // ✅ CORRECTION: currentLevel retiré (jamais utilisé dans Profile.jsx)
      totalExercises: progress.stats?.totalExercises || 0,
      correctAnswers: progress.stats?.correctAnswers || 0,
      completedLessons,  // ✅ NOUVEAU : Remplace incorrectAnswers
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
    const currentXP = progress?.totalXP || 0;

    // ✅ CORRECTION : Recalculer le niveau depuis totalXP (même logique que getStats)
    const currentUserLevel = calculateLevel(currentXP);
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

  // Mettre à jour la progression directement (pour les leçons) - OPTIMISÉ + RATE LIMITED
  const updateProgress = async (updatedFields) => {
    try {
      // Rate limiting leçons : Max 60 updates/minute (plus permissif)
      const userId = user?.uid || 'guest';
      if (!lessonRateLimiter.check(userId)) {
        const timeUntilReset = lessonRateLimiter.getTimeUntilReset(userId);
        const secondsRemaining = Math.ceil(timeUntilReset / 1000);

        console.warn(`⚠️ Rate limit leçons atteint pour ${userId}`);
        throw new Error(
          `Trop d'actions trop rapidement. Attendez ${secondsRemaining} secondes.`
        );
      }

      if (isAuthenticated && user) {
        // Mode connecté - Update optimiste Firestore
        const updatedProgress = await updateUserProgress(user.uid, updatedFields);
        setProgress(updatedProgress);
        return updatedProgress;
      } else {
        // Mode invité - sauvegarder localement
        const currentProgress = progress || getLocalProgress();
        const updatedProgress = {
          ...currentProgress,
          ...updatedFields
        };
        saveProgressLocally(updatedProgress);
        setProgress(updatedProgress);
        return updatedProgress;
      }
    } catch (err) {
      logError('updateProgress', err, { userId: user?.uid });
      const friendlyMessage = getUserFriendlyMessage(err);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  // ✅ Enregistrer une activité quotidienne par type (pour le calendrier)
  // Types: 'training' | 'lessons' | 'ai' | 'challenges'
  const recordDailyActivity = async (type, count = 1) => {
    try {
      const currentProgress = progress || getLocalProgress();
      const updatedDailyActivity = updateDailyActivityByType(
        currentProgress.dailyActivity,
        type,
        count
      );

      if (isAuthenticated && user) {
        // Mode connecté - sauvegarder dans Firestore
        await updateUserProgress(user.uid, { dailyActivity: updatedDailyActivity });
      } else {
        // Mode invité - sauvegarder localement
        const updatedProgress = {
          ...currentProgress,
          dailyActivity: updatedDailyActivity
        };
        saveProgressLocally(updatedProgress);
      }

      // Mettre à jour l'état local
      setProgress(prev => ({
        ...prev,
        dailyActivity: updatedDailyActivity
      }));
    } catch (err) {
      console.error('Erreur enregistrement activité quotidienne:', err);
      // Ne pas throw - l'activité n'est pas critique
    }
  };

  const value = {
    progress,
    loading,
    error,
    completeExercise,
    completeLevel,
    completeLevelWithBatch,
    isLevelCompleted,
    getLevelStats,
    getStats,
    getProgressToNextLevel,
    updateProgress,
    recordDailyActivity  // ✅ Nouvelle fonction pour le calendrier
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
