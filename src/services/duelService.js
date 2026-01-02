import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { loadAllExercises, shuffleWithSeed as shuffleExercises } from '../data/loaders/trainingLoader';

/**
 * Nettoie un objet en remplacant les valeurs undefined par null
 * Firestore n'accepte pas les valeurs undefined
 * @param {any} obj - Objet a nettoyer
 * @returns {any} Objet nettoye
 */
const cleanUndefinedValues = (obj) => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefinedValues(item));
  }
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value === undefined) {
        cleaned[key] = null;
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = cleanUndefinedValues(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
  return obj;
};

/**
 * Generer un code de duel unique (6 caracteres alphanumeriques)
 * @returns {string} Code de duel
 */
const generateDuelCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans I, O, 0, 1 pour eviter confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generer un seed deterministe pour les exercices
 * @param {string} code - Code du duel
 * @returns {number} Seed numerique
 */
const generateSeed = (code) => {
  let hash = 0;
  const str = code + Date.now().toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Melanger un tableau avec un seed
 * @param {Array} array - Tableau a melanger
 * @param {number} seed - Seed pour le melange
 * @returns {Array} Tableau melange
 */
const shuffleWithSeed = (array, seed) => {
  const shuffled = [...array];
  let state = seed;

  const random = () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/**
 * Charger les exercices pour un duel
 * @param {number} seed - Seed pour la selection
 * @returns {Promise<Array>} 5 exercices selectionnes
 */
const loadDuelExercises = async (seed) => {
  try {
    const allExercises = await loadAllExercises('python');
    const shuffled = shuffleExercises(allExercises, seed);
    return shuffled.slice(0, 5);
  } catch (error) {
    console.error('Error loading duel exercises:', error);
    return [];
  }
};

/**
 * Creer un nouveau duel (ami)
 * @param {string} hostId - ID de l'hote
 * @param {string} hostUsername - Nom de l'hote
 * @returns {Promise<object>} { success, duelCode, duelId, error }
 */
export const createDuel = async (hostId, hostUsername) => {
  try {
    const code = generateDuelCode();
    const seed = generateSeed(code);
    const exercises = await loadDuelExercises(seed);

    if (exercises.length === 0) {
      return { success: false, error: 'Failed to load exercises' };
    }

    const duelRef = doc(db, 'duels', code);

    const duelData = {
      code,
      seed,
      status: 'waiting', // waiting, playing, finished
      host: {
        oderId: hostId,
        username: hostUsername,
        ready: false,
        correctAnswers: 0,
        errors: 0,
        currentQuestion: 0,
        finishedAt: null
      },
      guest: null,
      exercises: exercises.map(ex => ({
        id: ex.id,
        question: ex.question,
        code: ex.code,
        language: ex.language,
        options: ex.options || [],
        correctAnswer: ex.correctAnswer,
        inputType: ex.inputType || 'options',
        acceptedAnswers: ex.acceptedAnswers || [],
        clickableLines: ex.clickableLines || [],
        xpGain: ex.xpGain || 10
      })),
      exerciseCount: 5,
      createdAt: serverTimestamp(),
      startedAt: null,
      finishedAt: null
    };

    // Nettoyer les valeurs undefined avant d'envoyer a Firestore
    const cleanedData = cleanUndefinedValues(duelData);
    // Restaurer serverTimestamp qui a ete converti en null
    cleanedData.createdAt = serverTimestamp();

    await setDoc(duelRef, cleanedData);

    return { success: true, duelCode: code, duelId: code };
  } catch (error) {
    console.error('Error creating duel:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Rejoindre un duel existant
 * @param {string} code - Code du duel
 * @param {string} oderId - ID de l'invite
 * @param {string} guestUsername - Nom de l'invite
 * @returns {Promise<object>} { success, duelData, error }
 */
export const joinDuel = async (code, oderId, guestUsername) => {
  try {
    const duelRef = doc(db, 'duels', code.toUpperCase());
    const duelSnap = await getDoc(duelRef);

    if (!duelSnap.exists()) {
      return { success: false, error: 'Duel non trouve' };
    }

    const duelData = duelSnap.data();

    if (duelData.status !== 'waiting') {
      return { success: false, error: 'Ce duel a deja commence ou est termine' };
    }

    if (duelData.guest !== null) {
      return { success: false, error: 'Ce duel est deja complet' };
    }

    if (duelData.host.oderId === oderId) {
      return { success: false, error: 'Tu ne peux pas rejoindre ton propre duel' };
    }

    await updateDoc(duelRef, {
      guest: {
        oderId: oderId,
        username: guestUsername,
        ready: false,
        correctAnswers: 0,
        errors: 0,
        currentQuestion: 0,
        finishedAt: null
      },
      status: 'ready'
    });

    return { success: true, duelData: { ...duelData, code } };
  } catch (error) {
    console.error('Error joining duel:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Marquer un joueur comme pret
 * @param {string} code - Code du duel
 * @param {string} oderId - ID du joueur
 * @returns {Promise<object>} { success, error }
 */
export const setPlayerReady = async (code, oderId) => {
  try {
    const duelRef = doc(db, 'duels', code);
    const duelSnap = await getDoc(duelRef);

    if (!duelSnap.exists()) {
      return { success: false, error: 'Duel non trouve' };
    }

    const duelData = duelSnap.data();
    const isHost = duelData.host.oderId === oderId;

    if (isHost) {
      await updateDoc(duelRef, { 'host.ready': true });
    } else if (duelData.guest && duelData.guest.oderId === oderId) {
      await updateDoc(duelRef, { 'guest.ready': true });
    }

    // Verifier si les deux joueurs sont prets
    const updatedSnap = await getDoc(duelRef);
    const updatedData = updatedSnap.data();

    if (updatedData.host.ready && updatedData.guest?.ready) {
      await updateDoc(duelRef, {
        status: 'playing',
        startedAt: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error setting player ready:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Mettre a jour le score d'un joueur
 * @param {string} code - Code du duel
 * @param {string} oderId - ID du joueur
 * @param {object} update - { correctAnswers, errors, currentQuestion, finishedAt }
 * @returns {Promise<object>} { success, error }
 */
export const updatePlayerScore = async (code, oderId, update) => {
  try {
    const duelRef = doc(db, 'duels', code);
    const duelSnap = await getDoc(duelRef);

    if (!duelSnap.exists()) {
      return { success: false, error: 'Duel non trouve' };
    }

    const duelData = duelSnap.data();
    const isHost = duelData.host.oderId === oderId;
    const playerKey = isHost ? 'host' : 'guest';

    const updates = {};
    if (update.correctAnswers !== undefined) updates[`${playerKey}.correctAnswers`] = update.correctAnswers;
    if (update.errors !== undefined) updates[`${playerKey}.errors`] = update.errors;
    if (update.currentQuestion !== undefined) updates[`${playerKey}.currentQuestion`] = update.currentQuestion;
    if (update.finishedAt !== undefined) updates[`${playerKey}.finishedAt`] = update.finishedAt;

    await updateDoc(duelRef, updates);

    // Verifier si les deux joueurs ont termine
    const updatedSnap = await getDoc(duelRef);
    const updatedData = updatedSnap.data();

    if (updatedData.host.finishedAt && updatedData.guest?.finishedAt) {
      await updateDoc(duelRef, {
        status: 'finished',
        finishedAt: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating player score:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Recuperer un duel par son code
 * @param {string} code - Code du duel
 * @returns {Promise<object>} { success, duelData, error }
 */
export const getDuel = async (code) => {
  try {
    const duelRef = doc(db, 'duels', code.toUpperCase());
    const duelSnap = await getDoc(duelRef);

    if (!duelSnap.exists()) {
      return { success: false, error: 'Duel non trouve' };
    }

    return { success: true, duelData: duelSnap.data() };
  } catch (error) {
    console.error('Error getting duel:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Ecouter les mises a jour d'un duel en temps reel
 * @param {string} code - Code du duel
 * @param {function} callback - Fonction de callback
 * @returns {function} Fonction pour arreter l'ecoute
 */
export const subscribeToDuel = (code, callback) => {
  const duelRef = doc(db, 'duels', code.toUpperCase());

  return onSnapshot(duelRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ success: true, duelData: snapshot.data() });
    } else {
      callback({ success: false, error: 'Duel non trouve' });
    }
  }, (error) => {
    console.error('Error subscribing to duel:', error);
    callback({ success: false, error: error.message });
  });
};

/**
 * Supprimer un duel (par l'hote uniquement)
 * @param {string} code - Code du duel
 * @param {string} hostId - ID de l'hote
 * @returns {Promise<object>} { success, error }
 */
export const deleteDuel = async (code, hostId) => {
  try {
    const duelRef = doc(db, 'duels', code);
    const duelSnap = await getDoc(duelRef);

    if (!duelSnap.exists()) {
      return { success: false, error: 'Duel non trouve' };
    }

    const duelData = duelSnap.data();
    if (duelData.host.oderId !== hostId) {
      return { success: false, error: 'Seul l\'hote peut supprimer le duel' };
    }

    await deleteDoc(duelRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting duel:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Nettoyer les duels expires (plus de 30 minutes)
 * Cette fonction peut etre appelee periodiquement ou via Cloud Functions
 */
export const cleanupExpiredDuels = async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const duelsRef = collection(db, 'duels');
    const q = query(duelsRef, where('createdAt', '<', thirtyMinutesAgo));
    const expiredSnap = await getDocs(q);

    const deletePromises = expiredSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true, deleted: expiredSnap.size };
  } catch (error) {
    console.error('Error cleaning up duels:', error);
    return { success: false, error: error.message };
  }
};
