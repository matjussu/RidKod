import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getUserRank } from './leaderboardService';

/**
 * Structure des stats challenges (stockée dans progress.challengeStats):
 * {
 *   duelsWon: number,
 *   duelsPlayed: number,
 *   dailyChallengesCompleted: number,
 *   lastDailyDate: string (YYYY-MM-DD)
 * }
 */

/**
 * Récupérer les stats challenges d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} { duelsWon, dailyChallengesCompleted, rank }
 */
export const getChallengeStats = async (userId) => {
  try {
    // Récupérer les stats depuis progress
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    let challengeStats = {
      duelsWon: 0,
      duelsPlayed: 0,
      dailyChallengesCompleted: 0
    };

    if (progressSnap.exists()) {
      const data = progressSnap.data();
      challengeStats = data.challengeStats || challengeStats;
    }

    // Récupérer le rang
    const rankResult = await getUserRank(userId);
    const rank = rankResult.success ? rankResult.rank : null;

    return {
      success: true,
      stats: {
        duelsWon: challengeStats.duelsWon || 0,
        dailyChallengesCompleted: challengeStats.dailyChallengesCompleted || 0,
        rank: rank
      }
    };
  } catch (error) {
    console.error('Error getting challenge stats:', error);
    return {
      success: false,
      error: error.message,
      stats: {
        duelsWon: 0,
        dailyChallengesCompleted: 0,
        rank: null
      }
    };
  }
};

/**
 * Incrémenter le compteur de défis quotidiens complétés
 * @param {string} userId - ID de l'utilisateur
 * @param {string} dateStr - Date du défi (YYYY-MM-DD)
 * @returns {Promise<object>} { success, newCount, error }
 */
export const incrementDailyChallengeCompleted = async (userId, dateStr) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      // Créer le document progress si n'existe pas
      await setDoc(progressRef, {
        userId,
        challengeStats: {
          duelsWon: 0,
          duelsPlayed: 0,
          dailyChallengesCompleted: 1,
          lastDailyDate: dateStr
        }
      });
      return { success: true, newCount: 1 };
    }

    const data = progressSnap.data();
    const currentStats = data.challengeStats || {
      duelsWon: 0,
      duelsPlayed: 0,
      dailyChallengesCompleted: 0,
      lastDailyDate: null
    };

    // Vérifier si déjà complété ce jour (éviter double comptage)
    if (currentStats.lastDailyDate === dateStr) {
      return {
        success: true,
        newCount: currentStats.dailyChallengesCompleted,
        alreadyCounted: true
      };
    }

    const newCount = (currentStats.dailyChallengesCompleted || 0) + 1;

    await updateDoc(progressRef, {
      challengeStats: {
        ...currentStats,
        dailyChallengesCompleted: newCount,
        lastDailyDate: dateStr
      }
    });

    return { success: true, newCount };
  } catch (error) {
    console.error('Error incrementing daily challenge:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Incrémenter les stats de duel
 * @param {string} userId - ID de l'utilisateur
 * @param {boolean} won - true si l'utilisateur a gagné
 * @returns {Promise<object>} { success, newDuelsWon, newDuelsPlayed, error }
 */
export const incrementDuelStats = async (userId, won) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      // Créer le document progress si n'existe pas
      await setDoc(progressRef, {
        userId: userId,
        challengeStats: {
          duelsWon: won ? 1 : 0,
          duelsPlayed: 1,
          dailyChallengesCompleted: 0,
          lastDailyDate: null
        }
      });
      return {
        success: true,
        newDuelsWon: won ? 1 : 0,
        newDuelsPlayed: 1
      };
    }

    const data = progressSnap.data();
    const currentStats = data.challengeStats || {
      duelsWon: 0,
      duelsPlayed: 0,
      dailyChallengesCompleted: 0,
      lastDailyDate: null
    };

    const newDuelsWon = (currentStats.duelsWon || 0) + (won ? 1 : 0);
    const newDuelsPlayed = (currentStats.duelsPlayed || 0) + 1;

    await updateDoc(progressRef, {
      challengeStats: {
        ...currentStats,
        duelsWon: newDuelsWon,
        duelsPlayed: newDuelsPlayed
      }
    });

    return {
      success: true,
      newDuelsWon,
      newDuelsPlayed
    };
  } catch (error) {
    console.error('Error incrementing duel stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupérer les stats pour un utilisateur non connecté (localStorage)
 * @returns {object} { duelsWon, dailyChallengesCompleted, rank }
 */
export const getLocalChallengeStats = () => {
  try {
    const stats = localStorage.getItem('challengeStats');
    if (stats) {
      return JSON.parse(stats);
    }
    return {
      duelsWon: 0,
      dailyChallengesCompleted: 0,
      rank: null
    };
  } catch (error) {
    console.error('Error getting local challenge stats:', error);
    return {
      duelsWon: 0,
      dailyChallengesCompleted: 0,
      rank: null
    };
  }
};

/**
 * Sauvegarder les stats en local (pour utilisateurs non connectés)
 * @param {object} stats - Stats à sauvegarder
 */
export const saveLocalChallengeStats = (stats) => {
  try {
    const current = getLocalChallengeStats();
    const updated = { ...current, ...stats };
    localStorage.setItem('challengeStats', JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving local challenge stats:', error);
    return null;
  }
};
