import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import PathLesson from '../../components/lessons/PathLesson';
import PathXPNode from '../../components/lessons/PathXPNode';
import BossFight from '../../components/lessons/BossFight';
import PathSVG from '../../components/lessons/PathSVG';
import StartNode from '../../components/lessons/StartNode';
import { calculateLessonPosition, calculateXPNodePosition, calculateBossPosition, getStartNodePosition, PATH_CONFIG } from '../../constants/pathLayout';
import modulesData from '../../data/lessons/python/modules.json';
import lessonsData from '../../data/lessons/python/lessons.json';
import '../../styles/Lessons.css';

// Map des offsets XP par module (numérotation globale)
const MODULE_XP_OFFSETS = {
  'py_mod_001': 0,   // xp_1 to xp_6 (6 nodes)
  'py_mod_002': 6,   // xp_7 to xp_12 (6 nodes)
  'py_mod_003': 12,  // xp_13 to xp_16 (4 nodes)
  'py_mod_004': 16,  // xp_17 to xp_21 (5 nodes)
  'py_mod_005': 21,  // xp_22 to xp_26 (5 nodes)
  'py_mod_006': 26   // xp_27 to xp_31 (5 nodes)
};

const LessonList = () => {
  const navigate = useNavigate();
  const { language, moduleId } = useParams();
  const { progress, updateProgress } = useProgress();
  const { triggerLight, triggerSuccess } = useHaptic();

  const [lessons, setLessons] = useState([]);
  const [moduleData, setModuleData] = useState(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [firstLessonActivated, setFirstLessonActivated] = useState(false);

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

  // Tableau de booléens indiquant quelles leçons sont complétées (par index)
  const lessonsCompletedByIndex = lessons.map(lesson => isLessonCompleted(lesson.id));

  // Récupérer les nœuds XP collectés
  const xpNodesCollected = progress?.xpNodesCollected || {};

  console.log('📋 LessonList - Progress state:', {
    completedLessonsCount,
    lessonsCompletedByIndex,
    xpNodesCollected,
    progressRaw: progress?.xpNodesCollected
  });

  // Boss unlocked si toutes les leçons complétées
  const bossUnlocked = completedLessonsCount === lessons.length && lessons.length > 0;

  // Boss defeated si déjà battu (vérifier dans progress.bossesDefeated)
  const bossDefeated = progress?.bossesDefeated?.[moduleId] || false;

  const handleLessonClick = (lesson) => {
    triggerLight();
    navigate(`/lessons/${language}/${moduleId}/${lesson.id}`);
  };

  const handleBossClick = () => {
    if (!bossUnlocked) return;

    triggerSuccess();
    // Navigate to boss fight
    navigate(`/lessons/${language}/${moduleId}/boss`);
  };

  const handleXPNodeClick = (nodeId) => {
    triggerLight();
    navigate(`/lessons/${language}/${moduleId}/xp-collect/${nodeId}`);
  };

  const handleBackClick = () => {
    triggerLight();
    navigate(`/lessons/${language}/modules`);
  };

  const handleStartComplete = () => {
    setStartAnimation(true);

    // Sauvegarder dans le progress que le start est activé
    updateProgress({
      moduleStartActivated: {
        ...progress.moduleStartActivated,
        [moduleId]: true
      }
    });

    // Activer la première leçon après que le path l'atteigne
    const pathAnimationDuration = 1500; // 1.5s pour que le path atteigne lesson 1
    setTimeout(() => {
      setFirstLessonActivated(true);
    }, pathAnimationDuration);
  };

  if (!moduleData) {
    return null;
  }

  const startPos = getStartNodePosition();

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
            startAnimation={startAnimation}
            completedLessons={lessonsCompletedByIndex}
            xpNodesCollected={xpNodesCollected}
          />
          {/* Log props passées à PathSVG */}
          {console.log('➡️ Props passées à PathSVG:', {
            totalLessons: lessons.length,
            completedCount: completedLessonsCount,
            startAnimation,
            completedLessons: lessonsCompletedByIndex,
            xpNodesCollected
          })}

          {/* Start Circle (Interactive) */}
          <StartNode
            x={startPos.x}
            y={startPos.y}
            onComplete={handleStartComplete}
            initialCompleted={progress?.moduleStartActivated?.[moduleId] || false}
          />

          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            // Calculer la position absolue de la leçon
            const { x, y } = calculateLessonPosition(index);

            // Déterminer la position du label (gauche ou droite) selon la position X
            // Si x > centerX (droite), label à droite (ou gauche selon préférence)
            // Ici : si le point est à droite, on met le label à droite (row-reverse) pour qu'il pointe vers l'intérieur
            const position = x > PATH_CONFIG.centerX ? 'right' : 'left';

            // Pour les leçons suivantes (index > 0), vérifier que l'XP précédent est collecté
            const xpOffset = MODULE_XP_OFFSETS[moduleId] || 0;
            const previousXPNodeId = index > 0 ? `xp_${xpOffset + index}` : null;
            const isPreviousXPCollected = previousXPNodeId ? (xpNodesCollected[previousXPNodeId] || false) : true;

            // La leçon est active si :
            // - Leçon 1 : après l'animation du path
            // - Autres leçons : leçon précédente complétée ET XP précédent collecté
            const isActive = !completed && (
              (index === 0 && firstLessonActivated) || // Première leçon : après animation path
              (index > 0 && isLessonCompleted(lessons[index - 1]?.id) && isPreviousXPCollected) // Autres : leçon précédente + XP collecté
            );

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

          {/* XP Nodes entre les leçons */}
          {lessons.map((lesson, index) => {
            // Pas de nœud XP après la dernière leçon
            if (index >= lessons.length - 1) return null;

            // Calculer le nodeId global avec l'offset du module
            const xpOffset = MODULE_XP_OFFSETS[moduleId] || 0;
            const nodeId = `xp_${xpOffset + index + 1}`;

            // Le nœud est débloqué si la leçon précédente est complétée
            const isLocked = !isLessonCompleted(lesson.id);

            // Le nœud est collecté si dans progress.xpNodesCollected
            const isCollected = progress?.xpNodesCollected?.[nodeId] || false;

            console.log(`🔵 Nœud ${nodeId}:`, {
              lessonId: lesson.id,
              lessonCompleted: isLessonCompleted(lesson.id),
              isLocked,
              isCollected,
              rendered: !isLocked && !isCollected ? '✅ OUI' : '❌ NON'
            });

            // Ne rendre que les nœuds déverrouillés ET non collectés
            // Les nœuds verrouillés (gris) ne s'affichent pas
            if (isLocked || isCollected) return null;

            const { x, y } = calculateXPNodePosition(index);

            return (
              <PathXPNode
                key={nodeId}
                nodeId={nodeId}
                x={x}
                y={y}
                xpAmount={30}
                isLocked={false} // Toujours unlocked si rendu
                isCollected={false} // Toujours non collecté si rendu
                onClick={() => handleXPNodeClick(nodeId)}
              />
            );
          })}

          {/* Boss Fight */}
          <BossFight
            module={moduleData}
            x={calculateBossPosition(lessons.length).x}
            y={calculateBossPosition(lessons.length).y}
            unlocked={bossUnlocked}
            defeated={bossDefeated}
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
