import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import Language from './pages/Language';
import Difficulty from './pages/Difficulty';

// Composant pour gérer la route principale "/"
const RootRoute = () => {
  const { hasSeenWelcome } = useAuth();

  // Si l'utilisateur a déjà vu le Welcome (soit connecté, soit passé), aller à Home
  // Sinon, afficher Welcome
  return hasSeenWelcome() ? <Navigate to="/home" replace /> : <Welcome />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route principale avec redirection intelligente */}
          <Route path="/" element={<RootRoute />} />

          {/* Routes d'authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes de l'application */}
          <Route path="/home" element={<Home />} />
          <Route path="/language" element={<Language />} />
          <Route path="/difficulty" element={<Difficulty />} />
          <Route path="/exercise" element={<Exercise />} />

          {/* Routes en développement */}
          <Route path="/lessons" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Leçons - En cours de développement</div>} />
          <Route path="/challenges" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Challenges - En cours de développement</div>} />
          <Route path="/ai-understanding" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Comprendre l'IA - En cours de développement</div>} />
          <Route path="/contact" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Contact - En cours de développement</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;