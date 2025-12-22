import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Génère un seed déterministe basé sur la date
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {number} Seed numérique
 */
const generateSeed = (dateStr) => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Générateur de nombres pseudo-aléatoires avec seed
 * @param {number} seed - Seed initial
 * @returns {function} Fonction qui retourne un nombre entre 0 et 1
 */
const seededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
};

/**
 * Mélange un tableau de manière déterministe avec un seed
 * @param {Array} array - Tableau à mélanger
 * @param {number} seed - Seed pour le mélange
 * @returns {Array} Tableau mélangé
 */
const shuffleWithSeed = (array, seed) => {
  const shuffled = [...array];
  const random = seededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/**
 * Obtenir la date du jour au format YYYY-MM-DD (UTC)
 * @returns {string} Date formatée
 */
export const getTodayDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Charger tous les exercices disponibles
 * @returns {Promise<Array>} Liste des exercices
 */
const loadAllExercises = async () => {
  try {
    const [easyModule, mediumModule, hardModule] = await Promise.all([
      import('../data/exercises-easy.json'),
      import('../data/exercises-medium.json'),
      import('../data/exercises-hard.json')
    ]);

    return [
      ...easyModule.default,
      ...mediumModule.default,
      ...hardModule.default
    ];
  } catch (error) {
    console.error('Error loading exercises:', error);
    return [];
  }
};

/**
 * Obtenir les exercices du défi du jour
 * Sélection déterministe basée sur la date
 * @param {string} dateStr - Date au format YYYY-MM-DD (optionnel, défaut: aujourd'hui)
 * @returns {Promise<object>} { success, exercises, date, error }
 */
export const getDailyChallengeExercises = async (dateStr = null) => {
  try {
    const date = dateStr || getTodayDateString();
    const seed = generateSeed(date);

    // Charger tous les exercices
    const allExercises = await loadAllExercises();

    if (allExercises.length === 0) {
      return { success: false, error: 'No exercises available' };
    }

    // Mélanger avec le seed de la date
    const shuffled = shuffleWithSeed(allExercises, seed);

    // Sélectionner 5 exercices (mix de difficultés)
    // Prendre les 5 premiers du tableau mélangé
    const selectedExercises = shuffled.slice(0, 5);

    // Calculer le XP total possible
    const totalPossibleXP = selectedExercises.reduce(
      (sum, ex) => sum + (ex.xpGain || 10),
      0
    );

    return {
      success: true,
      exercises: selectedExercises,
      date,
      totalPossibleXP,
      exerciseCount: 5
    };
  } catch (error) {
    console.error('Error getting daily challenge:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Vérifier si l'utilisateur a déjà complété le défi du jour
 * @param {string} userId - ID de l'utilisateur
 * @param {string} dateStr - Date au format YYYY-MM-DD (optionnel)
 * @returns {Promise<object>} { completed, score, completedAt }
 */
export const hasCompletedDailyChallenge = async (userId, dateStr = null) => {
  try {
    const date = dateStr || getTodayDateString();
    const scoreRef = doc(db, 'daily_scores', date, 'scores', userId);
    const scoreSnap = await getDoc(scoreRef);

    if (scoreSnap.exists()) {
      const data = scoreSnap.data();
      return {
        completed: true,
        score: data.score,
        correctAnswers: data.correctAnswers,
        timeSeconds: data.timeSeconds,
        completedAt: data.completedAt
      };
    }

    return { completed: false };
  } catch (error) {
    console.error('Error checking daily completion:', error);
    return { completed: false, error: error.message };
  }
};

/**
 * Sauvegarder le score du défi du jour
 * @param {string} userId - ID de l'utilisateur
 * @param {string} username - Nom d'utilisateur
 * @param {object} scoreData - { score, correctAnswers, incorrectAnswers, timeSeconds }
 * @param {string} dateStr - Date au format YYYY-MM-DD (optionnel)
 * @returns {Promise<object>} { success, error }
 */
export const saveDailyChallengeScore = async (userId, username, scoreData, dateStr = null) => {
  try {
    const date = dateStr || getTodayDateString();
    const scoreRef = doc(db, 'daily_scores', date, 'scores', userId);

    const scoreDoc = {
      userId,
      username: username || 'Joueur anonyme',
      score: scoreData.score || 0,
      correctAnswers: scoreData.correctAnswers || 0,
      incorrectAnswers: scoreData.incorrectAnswers || 0,
      timeSeconds: scoreData.timeSeconds || 0,
      completedAt: new Date().toISOString()
    };

    await setDoc(scoreRef, scoreDoc);

    return { success: true };
  } catch (error) {
    console.error('Error saving daily score:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtenir le classement du défi du jour
 * @param {string} dateStr - Date au format YYYY-MM-DD (optionnel)
 * @param {number} limitCount - Nombre de scores à récupérer (défaut: 20)
 * @returns {Promise<object>} { success, leaderboard, error }
 */
export const getDailyLeaderboard = async (dateStr = null, limitCount = 20) => {
  try {
    const date = dateStr || getTodayDateString();
    const scoresRef = collection(db, 'daily_scores', date, 'scores');

    // Trier par score décroissant, puis par temps croissant
    const q = query(
      scoresRef,
      orderBy('score', 'desc'),
      orderBy('timeSeconds', 'asc'),
      limit(limitCount)
    );

    const scoresSnap = await getDocs(q);

    const leaderboard = scoresSnap.docs.map((scoreDoc, index) => ({
      rank: index + 1,
      oderId: scoreDoc.id,
      ...scoreDoc.data()
    }));

    return { success: true, leaderboard, date };
  } catch (error) {
    console.error('Error getting daily leaderboard:', error);
    return { success: false, error: error.message, leaderboard: [] };
  }
};

/**
 * Obtenir le rang de l'utilisateur dans le classement du jour
 * @param {string} userId - ID de l'utilisateur
 * @param {string} dateStr - Date au format YYYY-MM-DD (optionnel)
 * @returns {Promise<object>} { success, rank, totalParticipants, error }
 */
export const getUserDailyRank = async (userId, dateStr = null) => {
  try {
    const date = dateStr || getTodayDateString();

    // Récupérer le score de l'utilisateur
    const userScoreRef = doc(db, 'daily_scores', date, 'scores', userId);
    const userScoreSnap = await getDoc(userScoreRef);

    if (!userScoreSnap.exists()) {
      return { success: false, error: 'User has not completed today\'s challenge' };
    }

    const userScore = userScoreSnap.data().score;
    const userTime = userScoreSnap.data().timeSeconds;

    // Récupérer tous les scores
    const scoresRef = collection(db, 'daily_scores', date, 'scores');
    const q = query(scoresRef, orderBy('score', 'desc'), orderBy('timeSeconds', 'asc'));
    const allScoresSnap = await getDocs(q);

    let rank = 1;
    for (const scoreDoc of allScoresSnap.docs) {
      if (scoreDoc.id === userId) {
        break;
      }
      rank++;
    }

    return {
      success: true,
      rank,
      totalParticipants: allScoresSnap.size,
      userScore,
      userTime
    };
  } catch (error) {
    console.error('Error getting user daily rank:', error);
    return { success: false, error: error.message };
  }
};
