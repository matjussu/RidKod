import React from "react";

const ExitConfirmModal = ({ isVisible, onContinue, onExit }) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onContinue} />

      {/* Modal Container */}
      <div className="modal-container">
        <div className="modal-content">
          {/* Header Icon */}
          <div className="modal-icon">
            <span className="icon-warning">⚠️</span>
          </div>

          {/* Title */}
          <h3 className="modal-title">
            <span className="title-brace">{"{"}</span>
            Quitter l'entraînement ?
            <span className="title-brace">{"}"}</span>
          </h3>

          {/* Message */}
          <p className="modal-message">
            Ton progression sera sauvegardée mais tu vas perdre ta série actuelle.
          </p>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              className="action-btn continue-btn"
              onClick={onContinue}
            >
              Continuer l'entraînement
            </button>

            <button
              className="action-btn exit-btn"
              onClick={onExit}
            >
              Retourner au menu
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* Modal Backdrop */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          animation: fadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Modal Container */
        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1001;
          width: calc(100vw - 40px);
          max-width: 320px;
          animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Modal Content */
        .modal-content {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 8px 25px rgba(0, 0, 0, 0.2),
            0 0 0 0.5px rgba(255, 255, 255, 0.1);
          border: 0.5px solid rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .modal-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 149, 0, 0.3),
            transparent
          );
        }

        /* Modal Icon */
        .modal-icon {
          text-align: center;
          margin-bottom: 16px;
        }

        .icon-warning {
          font-size: 32px;
          display: inline-block;
          animation: warningPulse 2s ease-in-out infinite;
        }

        /* Modal Title */
        .modal-title {
          color: #000000;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 18px;
          font-weight: 800;
          text-align: center;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .title-brace {
          color: #FF9500;
          font-weight: 800;
          font-size: 19px;
        }

        /* Modal Message */
        .modal-message {
          color: #484848;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          line-height: 1.4;
          margin: 0 0 24px 0;
        }

        /* Action Buttons */
        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 12px;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
        }

        .action-btn:hover::before {
          opacity: 1;
        }

        .action-btn:active {
          transform: scale(0.98);
        }

        /* Continue Button */
        .continue-btn {
          background: linear-gradient(135deg, #088201 0%, #066601 100%);
          color: #FFFFFF;
          box-shadow:
            0 4px 15px rgba(8, 130, 1, 0.3),
            0 2px 8px rgba(8, 130, 1, 0.2);
        }

        .continue-btn:hover {
          box-shadow:
            0 6px 20px rgba(8, 130, 1, 0.4),
            0 3px 12px rgba(8, 130, 1, 0.3);
          transform: translateY(-1px);
        }

        /* Exit Button */
        .exit-btn {
          background: linear-gradient(135deg, #484848 0%, #3A3A3C 100%);
          color: #FFFFFF;
          box-shadow:
            0 4px 15px rgba(72, 72, 72, 0.3),
            0 2px 8px rgba(72, 72, 72, 0.2);
        }

        .exit-btn:hover {
          box-shadow:
            0 6px 20px rgba(72, 72, 72, 0.4),
            0 3px 12px rgba(72, 72, 72, 0.3);
          transform: translateY(-1px);
        }

        /* Button Icons */
        .btn-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes warningPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        /* Responsive */
        @media (max-width: 375px) {
          .modal-container {
            width: calc(100vw - 32px);
            max-width: 300px;
          }

          .modal-content {
            padding: 20px;
          }

          .modal-title {
            font-size: 16px;
          }

          .title-brace {
            font-size: 17px;
          }

          .modal-message {
            font-size: 13px;
          }

          .action-btn {
            height: 48px;
            font-size: 14px;
          }

          .btn-icon {
            font-size: 16px;
          }

          .icon-warning {
            font-size: 28px;
          }
        }

        @media (max-width: 320px) {
          .modal-container {
            width: calc(100vw - 24px);
            max-width: 280px;
          }

          .modal-content {
            padding: 18px;
          }

          .modal-title {
            font-size: 15px;
          }

          .title-brace {
            font-size: 16px;
          }

          .modal-message {
            font-size: 12px;
            margin-bottom: 20px;
          }

          .action-btn {
            height: 46px;
            font-size: 13px;
            gap: 6px;
          }

          .btn-icon {
            font-size: 15px;
          }

          .icon-warning {
            font-size: 26px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .modal-container {
            max-width: 300px;
          }

          .modal-content {
            padding: 18px;
          }

          .modal-title {
            font-size: 15px;
            margin-bottom: 10px;
          }

          .modal-message {
            font-size: 12px;
            margin-bottom: 18px;
          }

          .action-btn {
            height: 44px;
            font-size: 13px;
          }

          .modal-actions {
            gap: 10px;
          }

          .icon-warning {
            font-size: 24px;
          }

          .modal-icon {
            margin-bottom: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default ExitConfirmModal;