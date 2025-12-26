import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import useHaptic from '../../hooks/useHaptic';
import AITopicCard from '../../components/ai/AITopicCard';
import topicsData from '../../data/ai/topics.json';

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
    <div className="ai-home-container">
      {/* Back Button */}
      <button className="ai-back-button" onClick={handleBackClick} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Header Section */}
      <div className="ai-header-section">
        <h1 className="ai-page-title">
          <span className="ai-title-hash">{"//"}</span>
          Comprendre l'IA
        </h1>
        <p className="ai-intro-text">
          L'IA génère 50% du code en 2025. Apprends à comprendre et auditer le code généré par ChatGPT, Copilot et autres IA.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="ai-topics-grid">
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
        /* AI Home Container - NEON WHITE Theme */
        .ai-home-container {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          background: #0F0F12;
          padding: 20px;
          padding-top: max(env(safe-area-inset-top), 20px);
          padding-bottom: max(env(safe-area-inset-bottom), 40px);
          padding-left: max(env(safe-area-inset-left), 20px);
          padding-right: max(env(safe-area-inset-right), 20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          opacity: 0;
          transform: scale(0.95) translateY(20px);
          filter: blur(10px);
          animation: dojoEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Tatami Grid Pattern - White */
        .ai-home-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(255, 255, 255, 0.02) 39px,
              rgba(255, 255, 255, 0.02) 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(255, 255, 255, 0.02) 39px,
              rgba(255, 255, 255, 0.02) 40px
            );
          pointer-events: none;
          z-index: 0;
        }

        @keyframes dojoEnter {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        /* Back Button */
        .ai-back-button {
          position: absolute;
          top: max(env(safe-area-inset-top), 20px);
          left: max(env(safe-area-inset-left), 20px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .ai-back-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .ai-back-button svg {
          color: #FFFFFF;
          display: block;
        }

        /* Header Section */
        .ai-header-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 60px;
          margin-bottom: 40px;
          z-index: 1;
        }

        .ai-page-title {
          font-size: 32px;
          font-weight: 900;
          color: #FFFFFF;
          text-align: center;
          margin: 0;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          position: relative;
        }

        /* White separator line under title */
        .ai-page-title::after {
          content: '';
          position: absolute;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          border-radius: 2px;
        }

        .ai-title-hash {
          color: #FFFFFF;
          font-weight: 900;
          margin-right: 8px;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .ai-intro-text {
          font-size: 16px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-top: 32px;
          max-width: 600px;
          text-align: center;
        }

        /* Topics Grid */
        .ai-topics-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 500px;
          z-index: 1;
        }

        @media (max-width: 480px) {
          .ai-home-container {
            padding: 16px;
          }

          .ai-page-title {
            font-size: 26px;
          }

          .ai-intro-text {
            font-size: 14px;
            margin-top: 24px;
          }

          .ai-header-section {
            margin-top: 50px;
            margin-bottom: 32px;
          }
        }

        @media (max-width: 375px) {
          .ai-page-title {
            font-size: 22px;
          }

          .ai-intro-text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default AIHome;
