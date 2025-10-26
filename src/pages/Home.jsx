import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/long_logo.png';
import AuthButton from '../components/auth/AuthButton';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // Animation de sortie élégante
    const homeContainer = document.querySelector('.home-container');
    if (homeContainer) {
      homeContainer.style.transform = 'scale(0.95)';
      homeContainer.style.opacity = '0';

      setTimeout(() => {
        navigate(path);
      }, 200);
    } else {
      navigate(path);
    }
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
          opacity: 0;
          transform: scale(1.05);
          animation: fadeInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOutScale {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        /* Logo container */
        .logo-container {
          width: 260px;
          height: auto;
          margin-bottom: 32px;
          margin-top: 16px;
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
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
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
        }

        /* Menu cards */
        .menu-card {
          background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
          border-radius: 20px;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: none;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-weight: 800;
          font-size:12px;
          color: #FFFFFF;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          padding: 20px 12px;
          text-align: center;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.15),
            0 1px 3px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 0.5px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .menu-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 20px;
        }

        .menu-card:hover::before {
          opacity: 1;
        }

        .menu-card:active {
          transform: scale(0.96);
          box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.2),
            0 1px 3px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .menu-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.25),
            0 3px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .menu-card-icon {
          font-size: 32px;
          margin-bottom: 8px;
          line-height: 1;
        }

        .menu-card-text {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #FFFFFF;
        }

        .menu-card-bracket {
          color: #FF9500;
          font-weight: 800;
          font-size: 15px;
        }

        /* Contact button */
        .contact-button {
          background: linear-gradient(135deg, #FF9500 0%, #FF8800 100%);
          border-radius: 20px;
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
          box-shadow:
            0 4px 20px rgba(255, 149, 0, 0.3),
            0 2px 8px rgba(255, 149, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
        }

        .contact-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 20px;
        }

        .contact-button:hover::before {
          opacity: 1;
        }

        .contact-button:active {
          transform: scale(0.96);
          box-shadow:
            0 2px 10px rgba(255, 149, 0, 0.4),
            0 1px 4px rgba(255, 149, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .contact-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 30px rgba(255, 149, 0, 0.4),
            0 4px 12px rgba(255, 149, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
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
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* iPhone 14/15 Pro Max */
        @media (max-width: 430px) {
          .home-container {
            padding-left: max(18px, env(safe-area-inset-left));
            padding-right: max(18px, env(safe-area-inset-right));
          }
        }

        /* iPhone 14/15 Pro */
        @media (max-width: 393px) {
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
            font-size: 16px;
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

      {/* Auth Button */}
      <AuthButton />

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
          onClick={() => handleNavigation('/language')}
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