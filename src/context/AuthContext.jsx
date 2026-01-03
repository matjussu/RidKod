import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile, getUserProfile } from '../services/userService';
import { checkRateLimit, recordAttempt } from '../utils/authRateLimiter';

// Création du contexte
const AuthContext = createContext({});

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    console.log('[AuthContext] Starting auth listener...');

    // Timeout de sécurité - si Firebase ne répond pas en 5s, continuer en mode invité
    // Critique pour iOS Capacitor où Firebase peut échouer silencieusement
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('[AuthContext] Firebase timeout (5s) - continuing as guest');
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[AuthContext] Auth state changed:', currentUser ? 'user logged in' : 'no user');
      clearTimeout(timeout); // Annuler le timeout si Firebase répond

      if (currentUser) {
        // Charger le profil Firestore
        try {
          const profileResult = await getUserProfile(currentUser.uid);

          if (profileResult.success) {
            // Merger les données Firebase Auth + Firestore
            setUser({
              ...currentUser,
              username: profileResult.profile.username,
              avatarColor: profileResult.profile.avatarColor
            });
          } else {
            // Fallback: utiliser seulement les données Firebase Auth
            setUser(currentUser);
          }
        } catch (profileError) {
          console.error('[AuthContext] Error loading profile:', profileError);
          setUser(currentUser); // Fallback
        }

        // Sauvegarder dans localStorage pour persistance (sans données sensibles)
        localStorage.setItem('hasAccount', 'true');
        // Note: userEmail supprimé pour raison de sécurité (accessible via XSS)
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    // Cleanup
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // Inscription
  const signup = async (email, password, username, avatarColor) => {
    try {
      setError(null);

      // Créer compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Créer profil Firestore
      const profileResult = await createUserProfile(userCredential.user.uid, {
        username,
        avatarColor,
        email
      });

      if (!profileResult.success) {
        console.error('Failed to create user profile:', profileResult.error);
      }

      return { success: true, user: userCredential.user };
    } catch (err) {
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';

      // Messages d'erreur en français
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cet email est déjà utilisé.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
          break;
        default:
          errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Connexion avec rate limiting
  const login = async (email, password) => {
    try {
      setError(null);

      // Vérifier le rate limit avant la tentative
      const rateLimitCheck = checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        setError(rateLimitCheck.message);
        return { success: false, error: rateLimitCheck.message };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Connexion réussie : réinitialiser le compteur
      recordAttempt(email, true);
      return { success: true, user: userCredential.user };
    } catch (err) {
      // Enregistrer l'échec pour le rate limiting
      recordAttempt(email, false);

      let errorMessage = 'Une erreur est survenue lors de la connexion.';

      // Messages d'erreur en français (génériques pour éviter l'énumération d'utilisateurs)
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          // Message générique pour ne pas révéler si l'email existe
          errorMessage = 'Email ou mot de passe incorrect.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format d\'email invalide.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard.';
          break;
        default:
          errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth);
      // Note: userEmail n'est plus stocké (supprimé pour sécurité)
      return { success: true };
    } catch (err) {
      setError('Erreur lors de la déconnexion.');
      return { success: false, error: err.message };
    }
  };

  // Marquer comme "passé sans compte"
  const skipAuth = () => {
    localStorage.setItem('hasSkipped', 'true');
  };

  // Vérifier si l'utilisateur a déjà passé l'écran de bienvenue
  const hasSeenWelcome = () => {
    return localStorage.getItem('hasSkipped') === 'true' || localStorage.getItem('hasAccount') === 'true';
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    skipAuth,
    hasSeenWelcome,
    isAuthenticated: !!user
  };

  // Écran de chargement pendant l'initialisation Firebase
  // Critique pour iOS Capacitor - afficher quelque chose même pendant le loading
  if (loading) {
    console.log('[AuthContext] Rendering loading screen...');
    return (
      <AuthContext.Provider value={value}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1A1919',
          color: 'white',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #333',
            borderTopColor: '#30D158',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '16px', fontSize: '14px', opacity: 0.8 }}>
            Chargement...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
