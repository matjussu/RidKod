import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/long_logo.png';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
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
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          touch-action: manipulation;
        }

        .home-container {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          background: #1A1919;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: max(env(safe-area-inset-top), 20px);
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
          padding-bottom: max(env(safe-area-inset-bottom), 20px);
          max-width: min(428px, 100vw);
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* Logo container */
        .logo-container {
          width: 260px;
          height: auto;
          margin-bottom: 32px;
          margin-top: 16px;
        }

        .logo-container img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        /* Menu grid */
        .menu-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
          max-width: 100%;
          margin-bottom: 16px;
        }

        /* Menu cards */
        .menu-card {
          background: #393B3C;
          border-radius: 16px;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          font-size: 14px;
          color: #FFFFFF;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          padding: 20px 12px;
          text-align: center;
        }

        .menu-card:active {
          transform: scale(0.95);
          background: #3A3A3C;
        }

        .menu-card:hover {
          background: #3A3A3C;
        }

        .menu-card-icon {
          font-size: 32px;
          margin-bottom: 8px;
          line-height: 1;
        }

        .menu-card-text {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #FFFFFF;
        }

        .menu-card-bracket {
          color: #FF9500;
          font-weight: 800;
          font-size: 14px;
        }

        /* Contact button */
        .contact-button {
          background: #FF9500;
          border-radius: 16px;
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          font-size: 14px;
          color: #FFFFFF;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-button:active {
          transform: scale(0.98);
          background: #3A3A3C;
        }

        .contact-button:hover {
          background: #3A3A3C;
        }

        /* Footer */
        .footer {
          margin-top: auto;
          padding-top: 20px;
          color: #8E8E93;
          font-size: 22px;
          font-weight: 400;
          text-align: center;
          font-family: "Jersey 25", cursive;
        }

        /* iPhone 14/15 Pro Max - 430px */
        @media (max-width: 430px) and (min-width: 415px) {
          .home-container {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }
        }

        /* iPhone 14/15 Pro - 393px */
        @media (max-width: 414px) and (min-width: 376px) {
          .home-container {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }
        }

        /* iPhone SE, iPhone 12/13 mini - 375px */
        @media (max-width: 375px) {
          .home-container {
            padding-left: max(14px, env(safe-area-inset-left));
            padding-right: max(14px, env(safe-area-inset-right));
            padding-top: max(env(safe-area-inset-top), 16px);
          }

          .logo-container {
            width: 240px;
            margin-bottom: 28px;
            margin-top: 12px;
          }

          .menu-grid {
            gap: 10px;
          }

          .menu-card {
            padding: 16px 10px;
          }

          .menu-card-icon {
            font-size: 28px;
            margin-bottom: 6px;
          }

          .menu-card-text {
            font-size: 12px;
          }

          .contact-button {
            height: 52px;
            font-size: 13px;
          }
        }

        /* Très petits écrans - iPhone SE 1ère gen */
        @media (max-width: 320px) {
          .home-container {
            padding-left: max(12px, env(safe-area-inset-left));
            padding-right: max(12px, env(safe-area-inset-right));
            padding-top: max(env(safe-area-inset-top), 14px);
          }

          .logo-container {
            width: 220px;
            margin-bottom: 24px;
            margin-top: 8px;
          }

          .menu-grid {
            gap: 8px;
          }

          .menu-card {
            padding: 14px 8px;
          }

          .menu-card-icon {
            font-size: 26px;
            margin-bottom: 5px;
          }

          .menu-card-text {
            font-size: 11px;
          }

          .contact-button {
            height: 48px;
            font-size: 12px;
            margin-bottom: 20px;
          }
        }

        /* Fix Safari iOS et WebKit */
        @supports (-webkit-touch-callout: none) {
          .home-container {
            height: -webkit-fill-available;
            min-height: -webkit-fill-available;
          }

          body {
            height: -webkit-fill-available;
          }
        }

        /* Optimisations touch iOS */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        button, input, textarea {
          -webkit-user-select: text;
        }

        /* Fix zoom iOS */
        input, textarea, select {
          font-size: 16px;
        }

        /* Prevent overscroll bounce */
        body {
          overscroll-behavior-y: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* Logo */}
      <div className="logo-container">
        <img src={logoImage} alt="ReadCod Logo" />
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        <button
          className="menu-card"
          onClick={() => handleNavigation('/lessons')}
        >
          
          <div className="menu-card-text">
            <span className="menu-card-bracket">{"<"}</span>
            Leçons
            <span className="menu-card-bracket">{">"}</span>
          </div>
        </button>

        <button
          className="menu-card"
          onClick={() => handleNavigation('/exercise')}
        >
          <div className="menu-card-text">
            <span className="menu-card-bracket">{"<"}</span>
            Entraînements
            <span className="menu-card-bracket">{">"}</span>
          </div>
        </button>

        <button
          className="menu-card"
          onClick={() => handleNavigation('/challenges')}
        >
          <div className="menu-card-text">
            <span className="menu-card-bracket">{"<"}</span>
            Challenges
            <span className="menu-card-bracket">{">"}</span>
          </div>
        </button>

        <button
          className="menu-card"
          onClick={() => handleNavigation('/ai-understanding')}
        >
          <div className="menu-card-text">
            <span className="menu-card-bracket">{"<"}</span>
            Comprendre l'IA
            <span className="menu-card-bracket">{">"}</span>
          </div>
        </button>
      </div>

      {/* Contact Button */}
      <button
        className="contact-button"
        onClick={() => handleNavigation('/contact')}
      >
        Contactez-nous
      </button>

      {/* Footer */}
      <div className="footer">
        By M/E
      </div>
    </div>
  );
};

export default Home;