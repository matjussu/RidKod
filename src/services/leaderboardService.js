import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Récupérer le classement global des joueurs par XP
 * @param {number} limitCount - Nombre de joueurs à récupérer (défaut: 50)
 * @returns {Promise<object>} { success, leaderboard, error }
 */
export const getGlobalLeaderboard = async (limitCount = 50) => {
  try {
    // 1. Récupérer les top progress par totalXP
    const progressRef = collection(db, 'progress');
    const q = query(
      progressRef,
      orderBy('totalXP', 'desc'),
      limit(limitCount)
    );

    const progressSnap = await getDocs(q);

    if (progressSnap.empty) {
      return { success: true, leaderboard: [] };
    }

    // 2. Pour chaque progress, récupérer le profil utilisateur
    const leaderboardPromises = progressSnap.docs.map(async (progressDoc, index) => {
      const progressData = progressDoc.data();
      const userId = progressDoc.id;

      // Récupérer le profil utilisateur
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;

      return {
        rank: index + 1,
        userId: userId,
        username: userData?.username || 'Joueur anonyme',
        avatarColor: userData?.avatarColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        userLevel: progressData.userLevel || 1,
        totalXP: progressData.totalXP || 0,
      };
    });

    const leaderboard = await Promise.all(leaderboardPromises);

    return { success: true, leaderboard };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { success: false, error: error.message, leaderboard: [] };
  }
};

/**
 * Récupérer le rang d'un utilisateur spécifique
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} { success, rank, userData, error }
 */
export const getUserRank = async (userId) => {
  try {
    // Récupérer le progress de l'utilisateur
    const progressRef = doc(db, 'progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return { success: false, error: 'User progress not found' };
    }

    const userXP = progressSnap.data().totalXP || 0;

    // Compter combien d'utilisateurs ont plus d'XP
    const progressCollection = collection(db, 'progress');
    const q = query(
      progressCollection,
      orderBy('totalXP', 'desc')
    );

    const allProgressSnap = await getDocs(q);
    let rank = 1;

    for (const progressDoc of allProgressSnap.docs) {
      if (progressDoc.id === userId) {
        break;
      }
      rank++;
    }

    // Récupérer le profil
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : null;

    return {
      success: true,
      rank,
      userData: {
        userId,
        username: userData?.username || 'Joueur anonyme',
        avatarColor: userData?.avatarColor,
        userLevel: progressSnap.data().userLevel || 1,
        totalXP: userXP,
      }
    };
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupérer le classement autour d'un utilisateur
 * (5 joueurs au-dessus, l'utilisateur, 5 joueurs en-dessous)
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} { success, leaderboard, userRank, error }
 */
export const getLeaderboardAroundUser = async (userId) => {
  try {
    // D'abord récupérer le rang de l'utilisateur
    const { success, rank, error } = await getUserRank(userId);

    if (!success) {
      return { success: false, error };
    }

    // Ensuite récupérer le leaderboard complet et extraire les joueurs autour
    const { success: lbSuccess, leaderboard, error: lbError } = await getGlobalLeaderboard(100);

    if (!lbSuccess) {
      return { success: false, error: lbError };
    }

    // Trouver les joueurs autour (5 avant, utilisateur, 5 après)
    const startIndex = Math.max(0, rank - 6);
    const endIndex = Math.min(leaderboard.length, rank + 5);
    const aroundLeaderboard = leaderboard.slice(startIndex, endIndex);

    return {
      success: true,
      leaderboard: aroundLeaderboard,
      userRank: rank,
    };
  } catch (error) {
    console.error('Error fetching leaderboard around user:', error);
    return { success: false, error: error.message };
  }
};
