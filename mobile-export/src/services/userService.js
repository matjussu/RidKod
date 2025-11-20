import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Palette de couleurs pour les avatars
 * Design system iOS-style avec gradients 135°
 */
export const AVATAR_COLORS = [
  { name: 'Vert', value: 'linear-gradient(135deg, #30D158 0%, #088201 100%)', id: 'green' },
  { name: 'Bleu', value: 'linear-gradient(135deg, #0A84FF 0%, #0051D5 100%)', id: 'blue' },
  { name: 'Violet', value: '#670a8fff', id: 'purple' },
  { name: 'Rose', value: 'linear-gradient(135deg, #ff4b6cff 0%, #D62651 100%)', id: 'pink' },
  { name: 'Orange', value: 'linear-gradient(135deg, #FF9500 0%, #FF8800 100%)', id: 'orange' },
  { name: 'Jaune', value: 'linear-gradient(135deg, #FFD60A 0%, #FFC700 100%)', id: 'yellow' },
  { name: 'Gris', value: 'linear-gradient(135deg, #8E8E93 0%, #6C6C70 100%)', id: 'gray' },
  { name: 'Rouge', value: '#cc0000ff', id: 'red' }
];

/**
 * Créer un profil utilisateur dans Firestore
 * @param {string} userId - ID utilisateur Firebase Auth
 * @param {object} profileData - { username, avatarColor, email }
 * @returns {Promise<object>} { success, error }
 */
export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);

    const profile = {
      username: profileData.username,
      avatarColor: profileData.avatarColor || AVATAR_COLORS[0].value,
      email: profileData.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userRef, profile);

    return { success: true, profile };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupérer un profil utilisateur depuis Firestore
 * @param {string} userId - ID utilisateur Firebase Auth
 * @returns {Promise<object>} { success, profile, error }
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, profile: userSnap.data() };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Mettre à jour un profil utilisateur dans Firestore
 * @param {string} userId - ID utilisateur Firebase Auth
 * @param {object} updates - Données à mettre à jour
 * @returns {Promise<object>} { success, error }
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(userRef, updatedData);

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtenir une couleur avatar par son ID
 * @param {string} colorId - ID de la couleur
 * @returns {string} Gradient CSS
 */
export const getAvatarColorById = (colorId) => {
  const color = AVATAR_COLORS.find(c => c.id === colorId);
  return color ? color.value : AVATAR_COLORS[0].value;
};

/**
 * Obtenir une couleur avatar par son value (gradient)
 * @param {string} colorValue - Gradient CSS
 * @returns {object} Couleur complète { name, value, id }
 */
export const getAvatarColorByValue = (colorValue) => {
  const color = AVATAR_COLORS.find(c => c.value === colorValue);
  return color || AVATAR_COLORS[0];
};
