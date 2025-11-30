import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import AITopicCard from '../../components/ai/AITopicCard';
import topicsData from '../../data/ai/topics.json';
import '../../styles/Lessons.css';

const AIHome = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { triggerLight } = useHaptic();

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setTopics(topicsData.topics);
  }, []);

  /**
   * Calculer la progression d'un topic
   * (Pour l'instant simplifié - sera enrichi avec les exercices plus tard)
   */
  const calculateTopicProgress = (topicId) => {
    // Vérifier si le topic est complété dans le progress
    const topicProgress = progress?.aiTopicProgress?.[topicId];

    return {
      completed: topicProgress?.completed || false,
      completionPercentage: topicProgress?.completionPercentage || 0
    };
  };

  const handleTopicClick = (topic) => {
    triggerLight();
    navigate(`/ai-understanding/${topic.id}`);
  };

  const handleBackClick = () => {
    triggerLight();
    navigate('/home');
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
          Comprendre l'IA
        </h1>
        <p className="ai-intro-text">
          L'IA génère 50% du code en 2025. Apprends à comprendre et auditer le code généré par ChatGPT, Copilot et autres IA.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="modules-grid">
        {topics.map((topic) => {
          const topicProgress = calculateTopicProgress(topic.id);

          return (
            <AITopicCard
              key={topic.id}
              topic={topic}
              progress={topicProgress}
              onClick={() => handleTopicClick(topic)}
            />
          );
        })}
      </div>

      <style>{`
        .ai-intro-text {
          font-size: 16px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-top: 32px;
          max-width: 600px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .ai-intro-text {
            font-size: 14px;
            margin-top: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default AIHome;
