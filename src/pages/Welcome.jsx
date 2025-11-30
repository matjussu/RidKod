import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/long_logo.png';
import WelcomeAnimation from '../components/welcome/WelcomeAnimation';
import WelcomeCodeTagline from '../components/welcome/WelcomeCodeTagline';
import AnimatedCodeSnippet from '../components/welcome/AnimatedCodeSnippet';
import '../styles/Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { skipAuth } = useAuth();

  // Check if user has seen the animation
  const [showAnimation, setShowAnimation] = useState(() => {
    return !localStorage.getItem('hasSeenWelcomeAnimation');
  });

  // Transition state for smooth fade
  const [isTransitioning, setIsTransitioning] = useState(true);

  const handleAnimationComplete = () => {
    localStorage.setItem('hasSeenWelcomeAnimation', 'true');

    // Trigger smooth transition
    setIsTransitioning(true);

    // Delay hiding animation to allow fade out
    setTimeout(() => {
      setShowAnimation(false);
      // Keep isTransitioning true for Welcome fade in animations
    }, 100);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSkip = () => {
    skipAuth();
    navigate('/home');
  };

  return (
    <div className="welcome-wrapper">
      {/* Show animation on first visit */}
      {showAnimation && (
        <WelcomeAnimation onComplete={handleAnimationComplete} />
      )}

      {/* Welcome content - fades in after animation */}
      {!showAnimation && (
        <div className={`welcome-container ${isTransitioning ? 'transitioning' : ''}`}>
          {/* Top Section */}
      <div className="welcome-top">
        {/* Logo */}
        <div className="welcome-logo-container">
          <img src={logoImage} alt="ReadCod Logo" />
        </div>

        {/* Code Tagline */}
        <WelcomeCodeTagline />

        {/* Animated Code Snippet */}
        <AnimatedCodeSnippet />
      </div>

      {/* Buttons Section */}
      <div className="welcome-buttons">
        <button className="welcome-button-primary" onClick={handleSignup}>
          Créer un compte
        </button>

        <button className="welcome-button-secondary" onClick={handleLogin}>
          Se connecter
        </button>

        <button className="welcome-skip" onClick={handleSkip}>
          Continuer sans compte
        </button>
      </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
