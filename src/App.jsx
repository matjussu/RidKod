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
import LessonModules from './pages/lessons/LessonModules';
import LessonList from './pages/lessons/LessonList';
import LessonContent from './pages/lessons/LessonContent';
import XPCollectTraining from './pages/XPCollect';
import XPCollectLessons from './pages/lessons/XPCollectLessons';
import BossFightContent from './pages/lessons/BossFightContent';
import BossXPCollect from './pages/lessons/BossXPCollect';
import LevelComplete from './pages/LevelComplete';
import AIHome from './pages/ai/AIHome';
import AIContent from './pages/ai/AIContent';
import ChallengesHome from './pages/challenges/ChallengesHome';
import Leaderboard from './pages/challenges/Leaderboard';

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
          <Route path="/level-complete" element={<LevelComplete />} />
          <Route path="/xp-collect" element={<XPCollectTraining />} />

          {/* Routes Lessons */}
          <Route path="/lessons" element={<Navigate to="/lessons/language" replace />} />
          <Route path="/lessons/language" element={<LessonLanguage />} />
          <Route path="/lessons/:language/modules" element={<LessonModules />} />
          <Route path="/lessons/:language/:moduleId/lessons" element={<LessonList />} />
          <Route path="/lessons/:language/:moduleId/:lessonId" element={<LessonContent />} />
          <Route path="/lessons/:language/:moduleId/xp-collect/:nodeId" element={<XPCollectLessons />} />
          <Route path="/lessons/:language/:moduleId/boss" element={<BossFightContent />} />
          <Route path="/lessons/:language/:moduleId/boss-xp" element={<BossXPCollect />} />

          {/* Routes AI Understanding */}
          <Route path="/ai-understanding" element={<AIHome />} />
          <Route path="/ai-understanding/:topicId" element={<AIContent />} />

          {/* Routes Challenges */}
          <Route path="/challenges" element={<ChallengesHome />} />
          <Route path="/challenges/leaderboard" element={<Leaderboard />} />


          {/* Contact page */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
        </ProgressProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;