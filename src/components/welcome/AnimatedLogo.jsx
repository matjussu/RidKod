import React from 'react';

const AnimatedLogo = ({ stage }) => {
  return (
    <div style={{
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      pointerEvents: 'none',
      color: 'white'
    }}>
      <h1 style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '3rem',
        fontWeight: 900,
        letterSpacing: '-0.05em',
        position: 'relative'
      }}>
        {/* "read" part - Appears at stage 3 */}
        <span style={{
          fontFamily: 'Merriweather, serif',
          letterSpacing: '-0.025em',
          opacity: stage >= 3 ? 1 : 0,
          transition: 'opacity 700ms'
        }}>
          read
        </span>

        {/* The Slash and Bracket Design */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 0.25rem',
          position: 'relative'
        }}>
          {/* Green Slash - Appears at stage 1 */}
          <div style={{ position: 'relative' }}>
            <span style={{
              display: 'block',
              transform: 'skewX(-12deg)',
              fontWeight: 'normal',
              fontSize: '5rem',
              lineHeight: 1,
              marginTop: '-0.5rem',
              color: '#088201',
              opacity: stage >= 1 ? 1 : 0,
              transition: 'opacity 100ms'
            }}>
              /
            </span>
            {/* Blinking Cursor for Stage 1 */}
            {stage === 1 && (
              <span style={{
                position: 'absolute',
                top: '50%',
                right: '-1rem',
                transform: 'translateY(-50%)',
                color: '#10B981',
                fontSize: '2.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                fontFamily: 'JetBrains Mono, monospace'
              }}>_</span>
            )}
          </div>

          {/* Orange Bracket - Appears at stage 2 */}
          <div style={{ position: 'relative' }}>
            <span style={{
              display: 'block',
              color: '#FF9500',
              fontWeight: 'bold',
              fontSize: '5rem',
              lineHeight: 1,
              marginLeft: '-0.5rem',
              marginTop: '-0.5rem',
              opacity: stage >= 2 ? 1 : 0,
              transition: 'opacity 100ms'
            }}>
              &lt;
            </span>
            {/* Blinking Cursor for Stage 2 */}
            {stage === 2 && (
              <span style={{
                position: 'absolute',
                top: '50%',
                right: '-2rem',
                transform: 'translateY(-50%)',
                color: '#FF9500',
                fontSize: '2.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                fontFamily: 'JetBrains Mono, monospace'
              }}>_</span>
            )}
          </div>
        </div>

        {/* "ode" part - Appears at stage 3 */}
        <span style={{
          fontFamily: 'Merriweather, serif',
          letterSpacing: '-0.025em',
          marginLeft: '-0.5rem',
          opacity: stage >= 3 ? 1 : 0,
          transition: 'opacity 700ms'
        }}>
          ode
        </span>
      </h1>

      {/* Subtitle - Fades in at stage 4 */}
      <div style={{
        marginTop: '1rem',
        opacity: stage >= 4 ? 1 : 0,
        maxHeight: stage >= 4 ? '5rem' : 0,
        transform: stage >= 4 ? 'translateY(0)' : 'translateY(1rem)',
        transition: 'all 1000ms',
        overflow: 'hidden'
      }}>
        <p style={{
          color: '#A1A1AA',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.875rem',
          letterSpacing: '0.1em'
        }}>
          &lt;Trust the process&gt;
        </p>
      </div>

      {/* Responsive styles for larger screens */}
      <style>{`
        @media (min-width: 768px) {
          h1 {
            font-size: 4.5rem;
          }
          h1 span:first-child {
            font-size: 4.5rem;
          }
          h1 div div span:first-child {
            font-size: 6rem;
            margin-top: -1rem;
          }
          h1 div div:last-child span:first-child {
            font-size: 6rem;
            margin-left: -1rem;
            margin-top: -1rem;
          }
          .subtitle {
            font-size: 1.25rem;
            margin-top: 2rem;
          }
        }
        @media (min-width: 1024px) {
          h1 {
            font-size: 8rem;
          }
          h1 div div span:first-child {
            font-size: 10rem;
          }
          h1 div div:last-child span:first-child {
            font-size: 10rem;
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
      `}</style>
    </div>
  );
};

export default AnimatedLogo;
