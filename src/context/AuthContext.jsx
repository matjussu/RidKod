import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Sauvegarder dans localStorage pour persistance
      if (currentUser) {
        localStorage.setItem('hasAccount', 'true');
        localStorage.setItem('userEmail', currentUser.email);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Inscription
  const signup = async (email, password) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

  // Connexion
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (err) {
      let errorMessage = 'Une erreur est survenue lors de la connexion.';

      // Messages d'erreur en français
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cet email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Email ou mot de passe incorrect.';
          break;
        default:
          errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userEmail');
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
