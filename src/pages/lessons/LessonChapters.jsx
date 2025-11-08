import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import ChapterCard from '../../components/lessons/ChapterCard';
import useHaptic from '../../hooks/useHaptic';
import '../../styles/Lessons.css';

// Import des données chapitres
import pythonChapters from '../../data/lessons/python/chapters.json';

const LessonChapters = () => {
  const navigate = useNavigate();
  const { language } = useParams();
  const { triggerLight, triggerSuccess } = useHaptic();
  const { progress } = useProgress();

  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    // Charger les chapitres selon le langage
    if (language === 'python') {
      setChapters(pythonChapters.chapters);
    }
  }, [language]);

  // Vérifier si un chapitre est déverrouillé
  const isChapterUnlocked = (chapter) => {
    // 🔓 MODE TEST : Tous les chapitres déverrouillés temporairement
    // TODO: Réactiver le système de lock en production
    return true;

    // Code original (commenté pour test) :
    // // Premier chapitre toujours déverrouillé
    // if (!chapter.unlockRequirement) return true;
    //
    // // Vérifier si le chapitre requis est complété
    // const lessonProgress = progress?.lessonProgress?.[language] || {};
    // const requiredChapter = lessonProgress[chapter.unlockRequirement];
    // return requiredChapter?.completed === true;
  };

  // Vérifier si un chapitre est complété
  const isChapterCompleted = (chapterId) => {
    const lessonProgress = progress?.lessonProgress?.[language] || {};
    return lessonProgress[chapterId]?.completed === true;
  };

  // Récupérer la progression d'un chapitre
  const getChapterProgress = (chapterId) => {
    const lessonProgress = progress?.lessonProgress?.[language] || {};
    const chapterData = lessonProgress[chapterId];

    if (!chapterData) return { completedExercises: 0 };

    return {
      completedExercises: chapterData.exercisesCompleted?.length || 0
    };
  };

  const handleChapterClick = (chapter) => {
    const unlocked = isChapterUnlocked(chapter);

    if (!unlocked) {
      triggerLight();
      // Animation shake pour chapitre verrouillé
      const card = document.querySelector(`[data-chapter-id="${chapter.id}"]`);
      if (card) {
        card.style.animation = 'unlockShake 0.5s ease';
        setTimeout(() => {
          card.style.animation = '';
        }, 500);
      }
      return;
    }

    triggerSuccess();

    // Animation de sortie
    const container = document.querySelector('.lesson-chapters-container');
    if (container) {
      container.style.transform = 'scale(0.95)';
      container.style.opacity = '0';

      setTimeout(() => {
        navigate(`/lessons/${language}/${chapter.id}`);
      }, 200);
    } else {
      navigate(`/lessons/${language}/${chapter.id}`);
    }
  };

  const handleBack = () => {
    triggerLight();

    const container = document.querySelector('.lesson-chapters-container');
    if (container) {
      container.style.transform = 'scale(0.95)';
      container.style.opacity = '0';

      setTimeout(() => {
        navigate('/lessons/language');
      }, 200);
    } else {
      navigate('/lessons/language');
    }
  };

  return (
    <div className="lesson-chapters-container">
      {/* Back Button */}
      <button className="lesson-back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header Section */}
      <div className="lesson-header-section">
        <h1 className="lesson-page-title">
          <span className="lesson-title-bracket">{"<"}</span>
          Chapitres
          <span className="lesson-title-bracket">{"/"}</span>
        </h1>
        <h2 className="lesson-page-subtitle">
          <span className="lesson-subtitle-bracket">{"/"}</span>
          Python
          <span className="lesson-subtitle-bracket">{">"}</span>
        </h2>
      </div>

      {/* Chapters Grid */}
      <div className="lesson-chapters-grid">
        {chapters.map((chapter) => {
          const unlocked = isChapterUnlocked(chapter);
          const completed = isChapterCompleted(chapter.id);
          const chapterProgress = getChapterProgress(chapter.id);

          return (
            <div key={chapter.id} data-chapter-id={chapter.id}>
              <ChapterCard
                title={chapter.title}
                description={chapter.description}
                icon={chapter.icon}
                difficulty={chapter.difficulty}
                isLocked={!unlocked}
                isCompleted={completed}
                totalExercises={chapter.totalExercises}
                completedExercises={chapterProgress.completedExercises}
                xpReward={chapter.xpReward}
                estimatedTime={chapter.estimatedTime}
                onClick={() => handleChapterClick(chapter)}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="lesson-footer">
        By M/E
      </div>
    </div>
  );
};

export default LessonChapters;
