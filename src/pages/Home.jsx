import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/long_logo.png';
import AuthButton from '../components/auth/AuthButton';
import '../styles/Layout.css';
import '../styles/Home.css';

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
