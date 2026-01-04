import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useHaptic from '../hooks/useHaptic';
import { AVATAR_COLORS } from '../services/userService';
import '../styles/Layout.css';
import '../styles/Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, skipAuth } = useAuth();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('Veuillez remplir tous les champs.');
      triggerError();
      return;
    }

    if (username.length < 3 || username.length > 15) {
      setErrorMessage('Le pseudo doit contenir entre 3 et 15 caractères.');
      triggerError();
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setErrorMessage('Le pseudo ne peut contenir que des lettres, chiffres et underscores.');
      triggerError();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      triggerError();
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      triggerError();
      return;
    }

    setIsLoading(true);

    const result = await signup(email, password, username, avatarColor);

    if (result.success) {
      triggerSuccess();
      navigate('/onboarding');
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

  const handleGoToLogin = () => {
    triggerLight();
    navigate('/login');
  };

  const handleBack = () => {
    triggerLight();
    navigate('/');
  };

  return (
    <div className="signup-container">
      {/* Back Button */}
      <button className="signup-back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div className="signup-header">
        <h1 className="signup-title">
          <span className="signup-title-hash">//</span>
          Inscription
        </h1>
        <p className="signup-subtitle">Crée ton compte en quelques secondes</p>
      </div>

      {/* Form */}
      <form className="signup-form" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="signup-error">{errorMessage}</div>
        )}

        <div className="signup-input-group">
          <label htmlFor="username" className="signup-label">Pseudo</label>
          <input
            type="text"
            id="username"
            className="signup-input"
            placeholder="Choisis ton pseudo (3-15 caractères)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            maxLength={15}
          />
        </div>

        <div className="signup-input-group">
          <label htmlFor="email" className="signup-label">Email</label>
          <input
            type="email"
            id="email"
            className="signup-input"
            placeholder="ton.email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="signup-input-group">
          <label htmlFor="password" className="signup-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="signup-input"
            placeholder="Au moins 6 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="signup-input-group">
          <label htmlFor="confirmPassword" className="signup-label">Confirmer mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            className="signup-input"
            placeholder="Même mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Sélecteur couleur avatar */}
        <div className="signup-input-group">
          <label className="signup-label">Couleur de ton avatar</label>
          <div className="signup-color-grid">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={`signup-color-option ${avatarColor === color.value ? 'selected' : ''}`}
                style={{ background: color.value }}
                onClick={() => {
                  setAvatarColor(color.value);
                  triggerLight();
                }}
                disabled={isLoading}
                aria-label={`Couleur ${color.name}`}
                title={color.name}
              >
                {avatarColor === color.value && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="signup-submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="signup-spinner"></div>
              Création...
            </>
          ) : (
            'Créer mon compte'
          )}
        </button>
      </form>

      {/* Links */}
      <div className="signup-links">
        <button className="signup-link signup-link-primary" onClick={handleGoToLogin}>
          Déjà un compte ? Se connecter
        </button>
        <button className="signup-link" onClick={handleSkip}>
          Continuer sans compte
        </button>
      </div>
    </div>
  );
};

export default Signup;
