import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthButton = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="auth-button-container">
      <style>{`
        .auth-button-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          padding: 0;
        }

        /* User Info */
        .auth-user-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .auth-user-info:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .auth-user-info:active {
          transform: scale(0.98);
        }

        .auth-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "JetBrains Mono", monospace;
          font-weight: 800;
          font-size: 18px;
          color: #FFFFFF;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .auth-user-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .auth-user-email {
          font-family: "JetBrains Mono", monospace;
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1;
          text-align: center;
        }

        .auth-user-status {
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          font-weight: 600;
          color: #30D158;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }

        /* Guest Mode */
        .auth-guest-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .auth-guest-info:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .auth-guest-info:active {
          transform: scale(0.98);
        }

        .auth-guest-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .auth-guest-text {
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          font-weight: 700;
          color: #8E8E93;
          text-align: center;
        }

        /* Buttons */
        .auth-button {
          background: linear-gradient(135deg, #FF9500 0%, #FF8800 100%);
          border: none;
          border-radius: 12px;
          padding: 10px 16px;
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          font-weight: 800;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(255, 149, 0, 0.3);
          white-space: nowrap;
        }

        .auth-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 149, 0, 0.4);
        }

        .auth-button:active {
          transform: scale(0.98);
        }

        .auth-logout-button {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .auth-logout-button:hover {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Responsive */
        @media (max-width: 375px) {
          .auth-button-container {
            gap: 10px;
          }

          .auth-user-avatar,
          .auth-guest-avatar {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .auth-user-email,
          .auth-guest-text {
            font-size: 13px;
          }

          .auth-user-status {
            font-size: 10px;
          }

          .auth-button {
            padding: 8px 14px;
            font-size: 11px;
          }
        }
      `}</style>

      {isAuthenticated ? (
        <>
          {/* Utilisateur connecté */}
          <div className="auth-user-info" onClick={handleProfileClick}>
            <div
              className="auth-user-avatar"
              style={{
                background: user?.avatarColor || 'linear-gradient(135deg, #30D158 0%, #088201 100%)'
              }}
            >
              {user?.username ? user.username[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : '?')}
            </div>
            <div className="auth-user-details">
              <div className="auth-user-email">
                {user?.username || user?.email?.split('@')[0] || 'Utilisateur'}
              </div>
              <div className="auth-user-status">Voir profil →</div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mode invité */}
          <div className="auth-guest-info" onClick={handleProfileClick}>
            <div className="auth-guest-avatar">👤</div>
            <div className="auth-guest-text">Voir profil →</div>
          </div>
          <button className="auth-button" onClick={handleLoginClick}>
            Se connecter
          </button>
        </>
      )}
    </div>
  );
};

export default AuthButton;
