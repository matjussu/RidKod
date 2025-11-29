import React from 'react';

/**
 * CyberpunkBackground Component - Version 3 Optimized
 * Dark cyberpunk UI background with grid, brackets, and decorative elements
 * Purely aesthetic layer - no interactive elements
 */
const CyberpunkBackground = () => {
  // Base container style
  const containerStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  };

  // Main background style
  const backgroundStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#1A1919', // Brand dark background
    color: '#10B981', // Brand green
    fontFamily: 'JetBrains Mono, monospace',
    padding: '1.5rem',
    overflow: 'hidden'
  };

  // Grid overlay style
  const gridStyle = {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
    backgroundSize: '40px 40px'
  };

  // Corner bracket base style
  const bracketStyle = {
    position: 'absolute',
    width: '4rem',
    height: '4rem',
    borderColor: '#3F3F46',
    borderWidth: '2px',
    borderStyle: 'solid'
  };

  // Bottom system text style
  const systemTextStyle = {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: '#cdcddfff', // Plus visible (avant: #27272A)
    fontSize: '12px', // Plus grand (avant: 10px)
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    fontWeight: '700'
  };

  // Vignette overlay style
  const vignetteStyle = {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      {/* Dark Cyberpunk UI Background */}
      <div style={backgroundStyle}>
        {/* Subtle Grid Background */}
        <div style={gridStyle} aria-hidden="true" />

        {/* Corner Brackets - Top Left */}
        <div
          style={{
            ...bracketStyle,
            top: '2rem',
            left: '2rem',
            borderRight: 'none',
            borderBottom: 'none'
          }}
          aria-hidden="true"
        />

        {/* Corner Brackets - Top Right */}
        <div
          style={{
            ...bracketStyle,
            top: '2rem',
            right: '2rem',
            borderLeft: 'none',
            borderBottom: 'none'
          }}
          aria-hidden="true"
        />

        {/* Corner Brackets - Bottom Left */}
        <div
          style={{
            ...bracketStyle,
            bottom: '2rem',
            left: '2rem',
            borderRight: 'none',
            borderTop: 'none'
          }}
          aria-hidden="true"
        />

        {/* Corner Brackets - Bottom Right */}
        <div
          style={{
            ...bracketStyle,
            bottom: '2rem',
            right: '2rem',
            borderLeft: 'none',
            borderTop: 'none'
          }}
          aria-hidden="true"
        />

        {/* Bottom System Text */}
        <div style={systemTextStyle} aria-hidden="true">
          System Ready // v.0.1.0
        </div>
      </div>

      {/* Vignette Overlay for focus */}
      <div style={vignetteStyle} aria-hidden="true" />

      {/* Responsive & Accessibility Styles */}
      <style>{`
        /* Print styles - hide decorative elements */
        @media print {
          [aria-hidden="true"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(CyberpunkBackground);
