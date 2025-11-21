import React from 'react';

const CyberpunkBackground = () => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      {/* Dark Cyberpunk UI Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#1A1919',
        color: '#10B981',
        fontFamily: 'JetBrains Mono, monospace',
        padding: '1.5rem',
        overflow: 'hidden'
      }}>
        {/* Subtle Grid Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Corner Brackets - Top Left */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          width: '4rem',
          height: '4rem',
          borderLeft: '2px solid #3F3F46',
          borderTop: '2px solid #3F3F46'
        }} />

        {/* Corner Brackets - Top Right */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          width: '4rem',
          height: '4rem',
          borderRight: '2px solid #3F3F46',
          borderTop: '2px solid #3F3F46'
        }} />

        {/* Corner Brackets - Bottom Left */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          width: '4rem',
          height: '4rem',
          borderLeft: '2px solid #3F3F46',
          borderBottom: '2px solid #3F3F46'
        }} />

        {/* Corner Brackets - Bottom Right */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          width: '4rem',
          height: '4rem',
          borderRight: '2px solid #3F3F46',
          borderBottom: '2px solid #3F3F46'
        }} />

        {/* Decorative Side Menu - Hidden on mobile */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '3rem',
          transform: 'translateY(-50%)',
          display: 'none',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#52525B'
        }} className="lg-visible">
          <div>01 INITIALIZE</div>
          <div>02 PARSE</div>
          <div style={{ color: '#10B981' }}>03 RENDER</div>
          <div>04 EXIT</div>
        </div>

        {/* Bottom System Text */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          width: '100%',
          textAlign: 'center',
          color: '#27272A',
          fontSize: '10px',
          letterSpacing: '0.5em',
          textTransform: 'uppercase'
        }}>
          System Ready // v.2.0.4
        </div>
      </div>

      {/* Vignette Overlay for focus */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-visible {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CyberpunkBackground;
