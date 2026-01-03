import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import LevelComplete from '../../components/exercise/LevelComplete';

const XPCollect = () => {
  const { language, moduleId, nodeId } = useParams();
  const navigate = useNavigate();
  const { progress, updateProgress } = useProgress();

  // Vérifier si le nœud est déjà collecté
  useEffect(() => {
    if (!progress) return;

    // Si déjà collecté, retourner immédiatement
    if (progress.xpNodesCollected?.[nodeId]) {
      console.warn(`Nœud XP ${nodeId} déjà collecté`);
      navigate(`/lessons/${language}/${moduleId}/lessons`, { replace: true });
    }
  }, [progress, nodeId, language, moduleId, navigate]);

  // Gérer la collecte de l'XP
  const handleCollectXP = async () => {
    try {
      console.log(`💎 Collecte de +30 XP pour le nœud ${nodeId}`);

      // Mettre à jour la progression
      await updateProgress({
        totalXP: (progress?.totalXP || 0) + 30,
        xpNodesCollected: {
          ...progress?.xpNodesCollected,
          [nodeId]: true
        }
      });

      // Attendre un peu pour l'animation
      setTimeout(() => {
        navigate(`/lessons/${language}/${moduleId}/lessons`);
      }, 300);
    } catch (error) {
      console.error('Erreur lors de la collecte d\'XP:', error);
      // Retourner quand même
      navigate(`/lessons/${language}/${moduleId}/lessons`);
    }
  };

  // Stats factices pour LevelComplete (on affiche juste l'XP)
  const dummyStats = {
    correctAnswers: 1,
    incorrectAnswers: 0,
    timeElapsed: 0,
    streak: progress?.streak?.current || 0
  };

  if (!progress) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0F0F12 0%, #2C2C2E 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF'
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <LevelComplete
      stats={dummyStats}
      level={`xp_${nodeId.split('_')[1]}`} // Format "xp_1"
      onContinue={handleCollectXP}
    />
  );
};

export default XPCollect;
