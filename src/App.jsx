import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import Language from './pages/Language';
import Difficulty from './pages/Difficulty';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import LessonLanguage from './pages/lessons/LessonLanguage';
import LessonChapters from './pages/lessons/LessonChapters';
import LessonContent from './pages/lessons/LessonContent';

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
        <ProgressProvider>
          <Routes>
            {/* Route principale avec redirection intelligente */}
            <Route path="/" element={<RootRoute />} />

          {/* Routes d'authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes de l'application */}
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/language" element={<Language />} />
          <Route path="/difficulty" element={<Difficulty />} />
          <Route path="/exercise" element={<Exercise />} />

          {/* Routes Lessons */}
          <Route path="/lessons" element={<Navigate to="/lessons/language" replace />} />
          <Route path="/lessons/language" element={<LessonLanguage />} />
          <Route path="/lessons/:language/chapters" element={<LessonChapters />} />
          <Route path="/lessons/:language/:chapterId" element={<LessonContent />} />

          {/* Routes en développement */}
          <Route path="/challenges" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Challenges - En cours de développement</div>} />
          <Route path="/ai-understanding" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Comprendre l'IA - En cours de développement</div>} />

          {/* Contact page */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
        </ProgressProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;