import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProgressCircle - Cercle SVG de progression
 * Utilisé pour afficher la progression d'un chapitre (exercices complétés)
 */
const ProgressCircle = ({
  current = 0,
  total = 5,
  size = 60,
  strokeWidth = 6,
  color = '#30D158',
  backgroundColor = 'rgba(255, 255, 255, 0.1)'
}) => {
  // Calcul du pourcentage
  const percentage = total > 0 ? (current / total) * 100 : 0;

  // Calcul rayon et circonférence
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="progress-circle"
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0
      }}
    >
      {/* SVG Circle */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: 'rotate(-90deg)',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
      </svg>

      {/* Text Center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: '"JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace',
          fontSize: size > 50 ? '14px' : '12px',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1
        }}
      >
        {current}/{total}
      </div>
    </div>
  );
};

ProgressCircle.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default React.memo(ProgressCircle);
