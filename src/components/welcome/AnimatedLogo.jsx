import React from 'react';

/**
 * AnimatedLogo Component - Version 3 Optimized
 * Premium animated logo reveal for welcome screen
 *
 * Timeline (4.7s total with fade out):
 * - Stage 0: Blank
 * - Stage 1: "/" appears (500ms)
 * - Stage 2: "<" appears (1000ms)
 * - Stage 3: "readode" appears (1500ms)
 * - Stage 4: Subtitle appears (3000ms)
 * - Stage 5: Fade out (4500ms, 200ms transition)
 *
 * @param {number} stage - Animation stage (0-5)
 */
const AnimatedLogo = ({ stage }) => {
  // Base styles with fade out support
  const containerStyle = {
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    pointerEvents: 'none',
    color: 'white',
    opacity: stage === 5 ? 0 : 1,
    transition: stage === 5 ? 'opacity 200ms ease-out' : 'none'
  };

  const h1Style = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '3rem',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    position: 'relative',
    margin: 0
  };

  const textPartStyle = {
    fontFamily: 'Merriweather, serif',
    letterSpacing: '-0.025em',
    opacity: stage >= 3 ? 1 : 0,
    transition: 'opacity 500ms ease-out' // Faster transition for 2.5s timeline
  };

  const symbolsContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '0 0.25rem',
    position: 'relative'
  };

  const slashStyle = {
    display: 'block',
    transform: 'skewX(-12deg)',
    fontWeight: 'normal',
    fontSize: '5rem',
    lineHeight: 1,
    marginTop: '-0.5rem',
    color: '#088201', // Brand green
    opacity: stage >= 1 ? 1 : 0,
    transition: 'opacity 100ms ease-out'
  };

  const bracketStyle = {
    display: 'block',
    color: '#FF9500', // Brand orange
    fontWeight: 'bold',
    fontSize: '5rem',
    lineHeight: 1,
    marginLeft: '-0.5rem',
    marginTop: '-0.5rem',
    opacity: stage >= 2 ? 1 : 0,
    transition: 'opacity 100ms ease-out'
  };

  const cursorStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '2.25rem',
    animation: 'logo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    fontFamily: 'JetBrains Mono, monospace'
  };

  const subtitleContainerStyle = {
    marginTop: '0.5rem',
    opacity: stage >= 4 ? 1 : 0,
    maxHeight: stage >= 4 ? '5rem' : 0,
    transform: stage >= 4 ? 'translateY(0)' : 'translateY(1rem)',
    transition: 'all 800ms ease-out', // Faster for 2.5s timeline
    overflow: 'hidden'
  };

  const subtitleStyle = {
    color: '#ffffffff',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.875rem',
    letterSpacing: '0.1em',
    margin: 0
  };

  return (
    <div style={containerStyle} role="img" aria-label="ReadCod animated logo">
      <h1 style={h1Style} aria-hidden="true">
        {/* "read" part - Appears at stage 3 */}
        <span style={textPartStyle}>
          read
        </span>

        {/* The Slash and Bracket Design */}
        <div style={symbolsContainerStyle}>
          {/* Green Slash - Appears at stage 1 */}
          <div style={{ position: 'relative' }}>
            <span style={slashStyle} aria-label="Slash symbol">
              /
            </span>
            {/* Blinking Cursor for Stage 1 */}
            {stage === 1 && (
              <span
                style={{
                  ...cursorStyle,
                  right: '-1rem',
                  color: '#10B981'
                }}
                aria-hidden="true"
              >
                _
              </span>
            )}
          </div>

          {/* Orange Bracket - Appears at stage 2 */}
          <div style={{ position: 'relative' }}>
            <span style={bracketStyle} aria-label="Less than symbol">
              &lt;
            </span>
            {/* Blinking Cursor for Stage 2 */}
            {stage === 2 && (
              <span
                style={{
                  ...cursorStyle,
                  right: '-2rem',
                  color: '#FF9500'
                }}
                aria-hidden="true"
              >
                _
              </span>
            )}
          </div>
        </div>

        {/* "ode" part - Appears at stage 3 */}
        <span style={{
          ...textPartStyle,
          marginLeft: '-0.25rem'
        }}>
          ode
        </span>
      </h1>

      {/* Subtitle - Fades in at stage 4 */}
      <div style={subtitleContainerStyle}>
        <p style={subtitleStyle} role="text">
          &lt;Trust the process&gt;
        </p>
      </div>

      {/* Animations & Responsive Styles */}
      <style>{`
        /* Cursor pulse animation */
        @keyframes logo-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Tablet breakpoint */
        @media (min-width: 768px) {
          [role="img"] h1 {
            font-size: 4.5rem !important;
          }
          [role="img"] h1 > span {
            font-size: 4.5rem !important;
          }
          [role="img"] h1 div div span:first-child {
            font-size: 6rem !important;
            margin-top: -1rem !important;
          }
          [role="img"] h1 div div:last-child span:first-child {
            font-size: 6rem !important;
            margin-left: -1rem !important;
            margin-top: -1rem !important;
          }
          [role="img"] div > div > p {
            font-size: 1.25rem !important;
            margin-top: 2rem !important;
          }
        }

        /* Desktop breakpoint */
        @media (min-width: 1024px) {
          [role="img"] h1 {
            font-size: 8rem !important;
          }
          [role="img"] h1 > span {
            font-size: 8rem !important;
          }
          [role="img"] h1 div div span:first-child {
            font-size: 10rem !important;
          }
          [role="img"] h1 div div:last-child span:first-child {
            font-size: 10rem !important;
          }
        }

        /* Accessibility: Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          [role="img"] * {
            animation: none !important;
            transition: none !important;
          }
          [role="img"] h1 > span,
          [role="img"] h1 div div span {
            opacity: 1 !important;
          }
          [role="img"] div > div {
            opacity: 1 !important;
            max-height: 5rem !important;
            transform: translateY(0) !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          [role="img"] h1 div div span:first-child {
            color: #00FF00 !important; /* Brighter green */
          }
          [role="img"] h1 div div:last-child span:first-child {
            color: #FFA500 !important; /* Brighter orange */
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(AnimatedLogo);
