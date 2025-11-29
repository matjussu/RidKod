import React from 'react';

/**
 * SkipButton Component
 * Subtle hint to skip the welcome animation
 * Appears after 1 second to avoid immediate skip
 *
 * @param {boolean} visible - Show/hide the button
 * @param {function} onSkip - Callback when user wants to skip
 */
const SkipButton = ({ visible, onSkip }) => {
  if (!visible) return null;

  return (
    <div
      onClick={onSkip}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 100,
        cursor: 'pointer',
        userSelect: 'none',
        animation: 'fadeIn 500ms ease-out',
        pointerEvents: visible ? 'auto' : 'none'
      }}
      role="button"
      aria-label="Skip animation"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSkip();
        }
      }}
    >
      {/* Hint Text */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        transition: 'all 200ms ease',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.75rem',
        color: '#A1A1AA',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}
        className="skip-button-hover"
      >
        {/* Pulse Indicator */}
        <span style={{
          display: 'block',
          width: '6px',
          height: '6px',
          backgroundColor: '#10B981',
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />

        <span>Tap to skip</span>

        {/* Arrow Icon */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            opacity: 0.6,
            transition: 'transform 200ms ease'
          }}
        >
          <path
            d="M2 6H10M10 6L6 2M10 6L6 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .skip-button-hover:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: #FFFFFF !important;
          transform: translateX(4px);
        }

        .skip-button-hover:hover svg {
          opacity: 1 !important;
          transform: translateX(2px) !important;
        }

        .skip-button-hover:active {
          transform: scale(0.95) !important;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .skip-button-hover {
            font-size: 0.7rem;
            padding: 0.6rem 0.8rem;
          }
        }

        /* Accessibility: Focus visible */
        .skip-button-hover:focus-visible {
          outline: 2px solid #10B981;
          outline-offset: 4px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .skip-button-hover,
          .skip-button-hover svg,
          .skip-button-hover span {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SkipButton;
