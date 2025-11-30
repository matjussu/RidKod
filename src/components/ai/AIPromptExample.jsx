import React from 'react';
import PropTypes from 'prop-types';

/**
 * AIPromptExample - Affiche un prompt donné à une IA (ChatGPT, Copilot, etc.)
 * Design style chat/conversation
 */
const AIPromptExample = ({ prompt, aiModel, tip }) => {
  return (
    <div className="ai-prompt-container">
      {/* Badge AI Model */}
      <div className="ai-model-badge">
        <span className="ai-model-icon">🤖</span>
        <span className="ai-model-text">{aiModel || 'ChatGPT'}</span>
      </div>

      {/* Prompt Box */}
      <div className="ai-prompt-box">
        {/* User Icon */}
        <div className="ai-prompt-user">
          <span className="user-icon">👤</span>
          <span className="user-label">Vous</span>
        </div>

        {/* Prompt Text */}
        <div className="ai-prompt-text">
          "{prompt}"
        </div>
      </div>

      {/* Optional Tip */}
      {tip && (
        <div className="ai-prompt-tip">
          <span className="tip-icon">💡</span>
          <span className="tip-text">{tip}</span>
        </div>
      )}

      <style>{`
        .ai-prompt-container {
          width: 100%;
          margin: 24px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* AI Model Badge */
        .ai-model-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 153, 0, 0.15);
          border: 1px solid rgba(255, 153, 0, 0.3);
          border-radius: 8px;
          padding: 8px 16px;
          align-self: flex-start;
        }

        .ai-model-icon {
          font-size: 18px;
          line-height: 1;
        }

        .ai-model-text {
          font-size: 14px;
          font-weight: 700;
          color: #FF9500;
          letter-spacing: 0.5px;
        }

        /* Prompt Box */
        .ai-prompt-box {
          background: rgba(44, 44, 46, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* User Section */
        .ai-prompt-user {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .user-icon {
          font-size: 24px;
          line-height: 1;
        }

        .user-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Prompt Text */
        .ai-prompt-text {
          font-size: 16px;
          font-weight: 500;
          font-style: italic;
          color: #FFFFFF;
          line-height: 1.6;
          padding-left: 32px;
        }

        /* Tip */
        .ai-prompt-tip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(255, 215, 0, 0.1);
          border-left: 3px solid #FFD700;
          border-radius: 6px;
          padding: 12px 16px;
        }

        .tip-icon {
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tip-text {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .ai-prompt-box {
            padding: 16px;
          }

          .ai-prompt-text {
            font-size: 15px;
            padding-left: 24px;
          }

          .tip-text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

AIPromptExample.propTypes = {
  prompt: PropTypes.string.isRequired,
  aiModel: PropTypes.string,
  tip: PropTypes.string
};

export default React.memo(AIPromptExample);
