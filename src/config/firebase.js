// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';

// Debug Firebase config
console.log('[Firebase] Initializing...');
console.log('[Firebase] Platform:', Capacitor.getPlatform());
console.log('[Firebase] isNative:', Capacitor.isNativePlatform());

// Configuration Firebase depuis variables d'environnement
// IMPORTANT : Toutes les variables doivent être définies dans .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: afficher la config (sans la clé API complète pour la sécurité)
console.log('[Firebase] Config:', {
  apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-6) : 'MISSING',
  authDomain: firebaseConfig.authDomain || 'MISSING',
  projectId: firebaseConfig.projectId || 'MISSING'
});

// Validation : vérifier que toutes les variables sont définies
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  throw new Error(
    `❌ Variables Firebase manquantes dans .env :\n${missingVars.join('\n')}\n\n` +
    `Consultez FIREBASE_SETUP.md pour la configuration.`
  );
}

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
console.log('[Firebase] App initialized');

// Authentification avec persistence adaptée à la plateforme
// Sur iOS/Android natif, utiliser indexedDBLocalPersistence
// Sur web, utiliser browserLocalPersistence
let auth;
if (Capacitor.isNativePlatform()) {
  console.log('[Firebase] Using initializeAuth for native platform');
  try {
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    });
    console.log('[Firebase] Auth initialized with indexedDBLocalPersistence');
  } catch (error) {
    console.warn('[Firebase] initializeAuth failed, falling back to getAuth:', error.message);
    auth = getAuth(app);
  }
} else {
  console.log('[Firebase] Using getAuth for web platform');
  auth = getAuth(app);
}

console.log('[Firebase] Auth ready');

// Firestore Database
export const db = getFirestore(app);
console.log('[Firebase] Firestore ready');

export { auth };
export default app;
