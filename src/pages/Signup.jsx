import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useHaptic from '../hooks/useHaptic';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, skipAuth } = useAuth();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Veuillez remplir tous les champs.');
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

    const result = await signup(email, password);

    if (result.success) {
      triggerSuccess();
      navigate('/home');
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
      <style>{`
        /* Reset global */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
        }

        .signup-container {
          min-height: 100vh;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          padding: max(env(safe-area-inset-top), 20px) max(20px, env(safe-area-inset-left)) max(env(safe-area-inset-bottom), 30px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          position: relative;
          opacity: 0;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Back Button */
        .signup-back-button {
          position: absolute;
          top: max(env(safe-area-inset-top), 8px);
          left: max(16px, env(safe-area-inset-left));
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .signup-back-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .signup-back-button:active {
          transform: scale(0.95);
        }

        .signup-back-button svg {
          color: #FFFFFF;
          width: 24px;
          height: 24px;
        }

        /* Header */
        .signup-header {
          text-align: center;
          margin-top: 60px;
          margin-bottom: 40px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .signup-title {
          font-family: "JetBrains Mono", monospace;
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 12px 0;
        }

        .signup-title-bracket {
          color: #30D158;
          font-size: 30px;
        }

        .signup-subtitle {
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          font-weight: 600;
          color: #8E8E93;
        }

        /* Form */
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        /* Input Group */
        .signup-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .signup-label {
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .signup-input {
          background: #2C2C2E;
          border: 2px solid transparent;
          border-radius: 12px;
          height: 56px;
          padding: 0 16px;
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          transition: all 0.3s ease;
          outline: none;
        }

        .signup-input::placeholder {
          color: #8E8E93;
        }

        .signup-input:focus {
          border-color: #30D158;
          background: #3A3A3C;
        }

        /* Error Message */
        .signup-error {
          background: rgba(255, 69, 58, 0.15);
          border: 1px solid #FF453A;
          border-radius: 12px;
          padding: 12px 16px;
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          font-weight: 600;
          color: #FF453A;
          text-align: center;
        }

        /* Submit Button */
        .signup-submit {
          background: linear-gradient(135deg, #30D158 0%, #088201 100%);
          border: none;
          border-radius: 16px;
          height: 56px;
          font-family: "JetBrains Mono", monospace;
          font-size: 16px;
          font-weight: 800;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(48, 209, 88, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .signup-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(48, 209, 88, 0.4);
        }

        .signup-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .signup-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading Spinner */
        .signup-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Links Section */
        .signup-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
        }

        .signup-link {
          background: none;
          border: none;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          font-weight: 600;
          color: #8E8E93;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 8px;
        }

        .signup-link:hover {
          color: #FFFFFF;
        }

        .signup-link:active {
          transform: scale(0.95);
        }

        .signup-link-primary {
          color: #FF9500;
        }

        .signup-link-primary:hover {
          color: #FFA500;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .signup-container {
            padding: max(env(safe-area-inset-top), 16px) max(16px, env(safe-area-inset-left)) max(env(safe-area-inset-bottom), 24px);
          }

          .signup-header {
            margin-top: 50px;
            margin-bottom: 32px;
          }

          .signup-title {
            font-size: 24px;
          }

          .signup-title-bracket {
            font-size: 26px;
          }

          .signup-subtitle {
            font-size: 13px;
          }

          .signup-input,
          .signup-submit {
            height: 52px;
            font-size: 15px;
          }
        }
      `}</style>

      {/* Back Button */}
      <button className="signup-back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header */}
      <div className="signup-header">
        <h1 className="signup-title">
          <span className="signup-title-bracket">{"<"}</span>
          Inscription
          <span className="signup-title-bracket">{"/>"}</span>
        </h1>
        <p className="signup-subtitle">Crée ton compte en quelques secondes</p>
      </div>

      {/* Form */}
      <form className="signup-form" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="signup-error">{errorMessage}</div>
        )}

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
