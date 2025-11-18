import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import ModuleCard from '../../components/lessons/ModuleCard';
import modulesData from '../../data/lessons/python/modules.json';
import lessonsData from '../../data/lessons/python/lessons.json';
import '../../styles/Lessons.css';

const LessonModules = () => {
  const navigate = useNavigate();
  const { language } = useParams();
  const { progress } = useProgress();
  const { triggerLight } = useHaptic();

  const [modules, setModules] = useState([]);

  useEffect(() => {
    if (language === 'python') {
      setModules(modulesData.modules);
    }
  }, [language]);

  const calculateModuleProgress = (moduleId) => {
    // Get all lessons for this module
    const moduleLessons = lessonsData.lessons.filter(l => l.moduleId === moduleId);

    // Count completed lessons
    const completedLessons = moduleLessons.filter(lesson =>
      progress?.lessonProgress?.[language]?.[lesson.id]?.completed
    );

    // Calculate percentage
    const percentage = moduleLessons.length > 0
      ? Math.round((completedLessons.length / moduleLessons.length) * 100)
      : 0;

    return {
      completed: percentage === 100,
      completedLessons: completedLessons.length,
      totalLessons: moduleLessons.length,
      completionPercentage: percentage
    };
  };

  const handleModuleClick = (module) => {
    triggerLight();
    navigate(`/lessons/${language}/${module.id}/lessons`);
  };

  const handleBackClick = () => {
    triggerLight();
    navigate('/lessons/language');
  };

  return (
    <div className="modules-container">
      {/* Back Button */}
      <button className="lesson-back-button" onClick={handleBackClick} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header Section */}
      <div className="lesson-header-section">
        <h1 className="lesson-page-title">
          <span className="lesson-title-hash">{"//"}</span>
          Units
        </h1>
      </div>

      {/* Modules Grid */}
      <div className="modules-grid">
        {modules.map((module) => {
          const moduleProgress = calculateModuleProgress(module.id);

          return (
            <ModuleCard
              key={module.id}
              module={module}
              progress={moduleProgress}
              onClick={() => handleModuleClick(module)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LessonModules;
