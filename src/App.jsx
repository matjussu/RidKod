import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import Language from './pages/Language';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/language" element={<Language />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/lessons" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Leçons - En cours de développement</div>} />
        <Route path="/challenges" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Challenges - En cours de développement</div>} />
        <Route path="/ai-understanding" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Comprendre l'IA - En cours de développement</div>} />
        <Route path="/contact" element={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Contact - En cours de développement</div>} />
      </Routes>
    </Router>
  );
};

export default App;