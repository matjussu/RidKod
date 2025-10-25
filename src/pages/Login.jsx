import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useHaptic from '../hooks/useHaptic';

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

        .login-container {
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
        .login-back-button {
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

        .login-back-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .login-back-button:active {
          transform: scale(0.95);
        }

        .login-back-button svg {
          color: #FFFFFF;
          width: 24px;
          height: 24px;
        }

        /* Header */
        .login-header {
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

        .login-title {
          font-family: "JetBrains Mono", monospace;
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 12px 0;
        }

        .login-title-bracket {
          color: #FF9500;
          font-size: 30px;
        }

        .login-subtitle {
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          font-weight: 600;
          color: #8E8E93;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        /* Input Group */
        .login-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-label {
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .login-input {
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

        .login-input::placeholder {
          color: #8E8E93;
        }

        .login-input:focus {
          border-color: #30D158;
          background: #3A3A3C;
        }

        /* Error Message */
        .login-error {
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
        .login-submit {
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

        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(48, 209, 88, 0.4);
        }

        .login-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading Spinner */
        .login-spinner {
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
        .login-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
        }

        .login-link {
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

        .login-link:hover {
          color: #FFFFFF;
        }

        .login-link:active {
          transform: scale(0.95);
        }

        .login-link-primary {
          color: #30D158;
        }

        .login-link-primary:hover {
          color: #40E168;
        }

        /* Responsive */
        @media (max-width: 375px) {
          .login-container {
            padding: max(env(safe-area-inset-top), 16px) max(16px, env(safe-area-inset-left)) max(env(safe-area-inset-bottom), 24px);
          }

          .login-header {
            margin-top: 50px;
            margin-bottom: 32px;
          }

          .login-title {
            font-size: 24px;
          }

          .login-title-bracket {
            font-size: 26px;
          }

          .login-subtitle {
            font-size: 13px;
          }

          .login-input,
          .login-submit {
            height: 52px;
            font-size: 15px;
          }
        }
      `}</style>

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
