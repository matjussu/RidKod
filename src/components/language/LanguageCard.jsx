import React from 'react';

const LanguageCard = ({
  language,
  icon,
  backgroundColor,
  isComingSoon = false,
  onClick
}) => {
  return (
    <button
      className={`language-card ${isComingSoon ? 'coming-soon' : ''}`}
      onClick={!isComingSoon ? onClick : undefined}
      disabled={isComingSoon}
      style={{
        background: backgroundColor
      }}
    >
      <div className="language-card-content">
        <img
          src={icon}
          alt={`${language} icon`}
          className="language-icon"
        />
        <span className="language-text">{language}</span>

      </div>

      <style>{`
        /* Language Card Component */
        .language-card {
          width: 100%;
          height: 90px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.15),
            0 1px 3px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 0.5px solid rgba(255, 255, 255, 0.1);
        }

        .language-card:not(.coming-soon):hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.25),
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .language-card:not(.coming-soon):active {
          transform: translateY(-2px) scale(0.98);
          box-shadow:
            0 6px 25px rgba(0, 0, 0, 0.2),
            0 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .language-card.coming-soon {
          opacity: 0.6;
          cursor: not-allowed;
          filter: saturate(0.7);
        }

        .language-card-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .language-icon {
          width: 56px;
          height: 56px;
          object-fit: contain;
          margin: -2px;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .language-card:not(.coming-soon):hover .language-icon {
          transform: scale(1.1);
        }

        .language-text {
          color: #FFFFFF;
          font-size: 100px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          line-height: 1.2;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          flex: 1;
        }

        /* Coming Soon Overlay */
        .coming-soon-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 4px 8px;
          z-index: 2;
        }



        /* Responsive adjustments */
        @media (max-width: 375px) {
          .language-card {
            height: 80px;
          }

          .language-card-content {
            padding: 0 16px;
          }

          .language-icon {
            width: 48px;
            height: 48px;
          }

          .language-text {
            font-size: 100px;
          }

          .coming-soon-text {
            font-size: 9px;
          }
        }

        @media (max-width: 320px) {
          .language-card {
            height: 75px;
          }

          .language-card-content {
            padding: 0 14px;
          }

          .language-icon {
            width: 44px;
            height: 44px;
          }

          .language-text {
            font-size: 100px;
          }

          .coming-soon-overlay {
            top: 6px;
            right: 6px;
            padding: 3px 6px;
          }



        /* Mode paysage */
        @media (orientation: landscape) {
          .language-card {
            height: 70px;
          }

          .language-card-content {
            padding: 0 16px;
          }

          .language-icon {
            width: 44px;
            height: 44px;
          }

          .language-text {
            font-size: 18px;
          }
        }
      `}</style>
    </button>
  );
};

export default LanguageCard;