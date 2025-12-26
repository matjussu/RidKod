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
        /* Language Card Component - DOJO THEME */
        .language-card {
          width: 100%;
          height: 90px;
          border-radius: 20px;
          border: 2px solid rgba(0, 221, 179, 0.15);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 4px 24px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(0, 221, 179, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .language-card:not(.coming-soon):hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(0, 221, 179, 0.4);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(0, 221, 179, 0.2),
            0 0 0 1px rgba(0, 221, 179, 0.3);
        }

        .language-card:not(.coming-soon):active {
          transform: translateY(-2px) scale(0.98);
          box-shadow:
            0 6px 25px rgba(0, 0, 0, 0.25),
            0 0 15px rgba(0, 221, 179, 0.15);
        }

        .language-card.coming-soon {
          opacity: 0.5;
          cursor: not-allowed;
          filter: saturate(0.5) brightness(0.8);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .language-card-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          padding: 0 20px 0 0;
          position: relative;
          z-index: 1;
          gap: 12px;
        }

        .language-icon {
          width: 56px;
          height: 56px;
          object-fit: contain;
          margin: 0;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .language-card:not(.coming-soon):hover .language-icon {
          transform: scale(1.1);
        }

        .language-text {
          color: #FFFFFF;
          font-size: 100px;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -3px;
          line-height: 1;
          text-shadow:
            0 4px 8px rgba(0, 0, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.3);
          transform: skewX(-5deg);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex: 1;
          text-align: left;
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
            padding: 0 16px 0 0;
            gap: 10px;
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
            padding: 0 12px 0 0;
            gap: 8px;
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
            padding: 0 16px 0 0;
            gap: 10px;
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