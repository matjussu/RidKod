import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import PathLesson from '../../components/lessons/PathLesson';
import BossFight from '../../components/lessons/BossFight';
import PathSVG from '../../components/lessons/PathSVG';
import { calculateLessonPosition, calculateBossPosition, PATH_CONFIG } from '../../constants/pathLayout';
import modulesData from '../../data/lessons/python/modules.json';
import lessonsData from '../../data/lessons/python/lessons.json';
import '../../styles/Lessons.css';

const LessonList = () => {
  const navigate = useNavigate();
  const { language, moduleId } = useParams();
  const { progress } = useProgress();
  const { triggerLight, triggerSuccess } = useHaptic();

  const [lessons, setLessons] = useState([]);
  const [moduleData, setModuleData] = useState(null);

  useEffect(() => {
    if (language === 'python') {
      // Get module data
      const module = modulesData.modules.find(m => m.id === moduleId);
      setModuleData(module);

      // Get lessons for this module
      const moduleLessons = lessonsData.lessons.filter(l => l.moduleId === moduleId);
      setLessons(moduleLessons);
    }
  }, [language, moduleId]);

  const isLessonCompleted = (lessonId) => {
    return progress?.lessonProgress?.[language]?.[lessonId]?.completed || false;
  };

  // Compter leçons complétées
  const completedLessonsCount = lessons.filter(lesson =>
    isLessonCompleted(lesson.id)
  ).length;

  // Boss unlocked si toutes les leçons complétées
  const bossUnlocked = completedLessonsCount === lessons.length && lessons.length > 0;

  const handleLessonClick = (lesson) => {
    triggerLight();
    navigate(`/lessons/${language}/${moduleId}/${lesson.id}`);
  };

  const handleBossClick = () => {
    if (!bossUnlocked) return;

    triggerSuccess();
    // TODO: Navigate to boss fight screen (module review ou quiz final)
    alert(`Boss Fight Unit ${moduleData.order} - À venir !`);
  };

  const handleBackClick = () => {
    triggerLight();
    navigate(`/lessons/${language}/modules`);
  };

  if (!moduleData) {
    return null;
  }

  return (
    <div className="path-container">
      {/* Back Button */}
      <button className="lesson-back-button" onClick={handleBackClick} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Header compact */}
      <div className="path-header">
        <div className="path-header-content">
          <span className="path-module-number">UNIT {moduleData.order}</span>

          {/* Mini progress bar */}
          <div className="path-progress">
            <div className="path-progress-bar">
              <div
                className="path-progress-fill"
                style={{ width: `${lessons.length > 0 ? (completedLessonsCount / lessons.length) * 100 : 0}%` }}
              />
            </div>
            <div className="path-progress-text">
              {completedLessonsCount}/{lessons.length} leçons • {moduleData.totalXP} XP
            </div>
          </div>
        </div>
      </div>

      {/* Path Background SVG */}
      <div className="path-lessons-wrapper">
        {/* Lessons on path */}
        <div
          className="path-lessons-list"
          style={{
            minHeight: `${(lessons.length + 2) * PATH_CONFIG.spacing + 120}px`
          }}
        >
          <PathSVG
            totalLessons={lessons.length}
            completedCount={completedLessonsCount}
          />

          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            // Calculer la position absolue de la leçon
            const { x, y } = calculateLessonPosition(index);

            // Déterminer la position du label (gauche ou droite) selon la position X
            // Si x > centerX (droite), label à droite (ou gauche selon préférence)
            // Ici : si le point est à droite, on met le label à droite (row-reverse) pour qu'il pointe vers l'intérieur
            const position = x > PATH_CONFIG.centerX ? 'right' : 'left';

            // La leçon est active si c'est la première non complétée
            const isActive = !completed &&
              (index === 0 || isLessonCompleted(lessons[index - 1]?.id));

            return (
              <PathLesson
                key={lesson.id}
                lesson={lesson}
                x={x}
                y={y}
                position={position}
                completed={completed}
                isActive={isActive}
                onClick={() => handleLessonClick(lesson)}
              />
            );
          })}

          {/* Boss Fight */}
          <BossFight
            module={moduleData}
            x={calculateBossPosition(lessons.length).x}
            y={calculateBossPosition(lessons.length).y}
            unlocked={bossUnlocked}
            completedLessons={completedLessonsCount}
            totalLessons={lessons.length}
            onClick={handleBossClick}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonList;
