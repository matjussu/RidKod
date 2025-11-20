// Firebase Configuration pour React Native
// NOTE: React Native Firebase utilise une configuration différente de Web
// Les credentials Firebase sont configurés dans:
// - ios/GoogleService-Info.plist (iOS)
// - android/app/google-services.json (Android)

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Export des services Firebase
export { auth, firestore };

// Helper function pour initialiser Firebase (si nécessaire)
export const initializeFirebase = () => {
  console.log('Firebase initialized for React Native');
  // La configuration se fait automatiquement via les fichiers natifs
};

export default {
  auth: auth(),
  db: firestore()
};
