import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useHaptic from '../hooks/useHaptic';
import { getUserProfile } from '../services/userService';
import '../styles/Layout.css';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, skipAuth } = useAuth();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs.');
      triggerError();
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      triggerSuccess();

      // Vérifier si l'onboarding est complété
      try {
        const profileResult = await getUserProfile(result.user.uid);
        if (profileResult.success && !profileResult.profile?.onboarding?.completed) {
          navigate('/onboarding');
        } else {
          navigate('/home');
        }
      } catch {
        // En cas d'erreur, aller à home par défaut
        navigate('/home');
      }
    } else {
      setErrorMessage(result.error);
      triggerError();
    }

    setIsLoading(false);
  };

  const handleSkip = () => {
    triggerLight();
    skipAuth();
    navigate('/home');
  };

  const handleGoToSignup = () => {
    triggerLight();
    navigate('/signup');
  };

  const handleBack = () => {
    triggerLight();
    navigate('/');
  };

  return (
    <div className="login-container">
      {/* Back Button */}
      <button className="login-back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div className="login-header">
        <h1 className="login-title">
          <span className="login-title-bracket">{"<"}</span>
          Connexion
          <span className="login-title-bracket">{"/>"}</span>
        </h1>
        <p className="login-subtitle">Ravis de te revoir !</p>
      </div>

      {/* Form */}
      <form className="login-form" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="login-error">{errorMessage}</div>
        )}

        <div className="login-input-group">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder="ton.email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="login-input-group">
          <label htmlFor="password" className="login-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="login-submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              Connexion...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      {/* Links */}
      <div className="login-links">
        <button className="login-link login-link-primary" onClick={handleGoToSignup}>
          Pas encore de compte ? Créer un compte
        </button>
        <button className="login-link" onClick={handleSkip}>
          Continuer sans compte
        </button>
      </div>
    </div>
  );
};

export default Login;
