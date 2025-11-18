import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PATH_CONFIG } from '../../constants/pathLayout';

/**
 * PathSVG - Chemin SVG animé reliant les leçons (style Duolingo)
 * Zigzag vertical avec gradient de progression
 */
const PathSVG = ({
  totalLessons = 7,
  completedCount = 0
}) => {
  // Calculer le path SVG zigzag
  const { pathData, totalLength, checkpoints } = useMemo(() => {
    const { startY, spacing, amplitude, centerX } = PATH_CONFIG;

    let path = `M ${centerX} ${startY}`; // Start point

    // Créer le zigzag pour chaque leçon
    for (let i = 1; i <= totalLessons; i++) {
      const y = startY + (i * spacing);
      // Alternance gauche/droite
      const x = i % 2 === 0 ? centerX + amplitude : centerX - amplitude;

      // Utiliser une courbe quadratic pour un path plus fluide
      const controlY = startY + ((i - 0.5) * spacing);
      path += ` Q ${centerX} ${controlY}, ${x} ${y}`;
    }

    // Boss fight final
    const bossY = startY + ((totalLessons + 1) * spacing) + 60;
    path += ` Q ${centerX} ${startY + ((totalLessons + 0.5) * spacing) + 60}, ${centerX} ${bossY}`;

    // Calculer checkpoints (tous les 2-3 niveaux)
    const checkpointPositions = [];
    for (let i = 2; i < totalLessons; i += 3) {
      const y = startY + (i * spacing);
      const x = i % 2 === 0 ? centerX + amplitude : centerX - amplitude;
      checkpointPositions.push({ x, y });
    }

    // Estimer la longueur du path (approximation)
    const length = totalLessons * spacing * 1.4;

    return {
      pathData: path,
      totalLength: length,
      checkpoints: checkpointPositions
    };
  }, [totalLessons]);

  // Calculer le stroke-dashoffset pour l'animation de progression
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  const dashOffset = totalLength - (totalLength * (progress / 100));

  // Calculer la hauteur SVG dynamiquement
  const svgHeight = (totalLessons + 2) * PATH_CONFIG.spacing + 120;

  return (
    <svg
      className="path-svg"
      viewBox={`0 0 400 ${svgHeight}`}
      preserveAspectRatio="xMidYMin meet"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {/* Définitions */}
      <defs>
        {/* Gradient de progression bleu → vert */}
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e5a8e" />
          <stop offset={`${progress}%`} stopColor="#30D158" />
          <stop offset={`${progress}%`} stopColor="#2C2C2E" />
          <stop offset="100%" stopColor="#2C2C2E" />
        </linearGradient>

        {/* Gradient pour checkpoints */}
        <radialGradient id="checkpointGradient">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF9500" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Path principal (fond gris) */}
      <path
        d={pathData}
        stroke="#2C2C2E"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/* Path de progression (gradient animé) */}
      <path
        d={pathData}
        stroke="url(#pathGradient)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
        style={{
          transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />

      {/* Checkpoints (étoiles) */}
      {checkpoints.map((checkpoint, index) => (
        <g key={index} transform={`translate(${checkpoint.x}, ${checkpoint.y})`}>
          {/* Glow effect */}
          <circle
            r="20"
            fill="url(#checkpointGradient)"
            opacity="0.6"
            style={{
              animation: 'checkpoint-glow 2s ease-in-out infinite',
              animationDelay: `${index * 0.3}s`
            }}
          />
          {/* Étoile */}
          <text
            fontSize="24"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#FFD700"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
              animation: 'checkpoint-float 3s ease-in-out infinite',
              animationDelay: `${index * 0.3}s`
            }}
          >
            ⭐
          </text>
        </g>
      ))}

      <style>{`
        @keyframes checkpoint-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes checkpoint-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </svg>
  );
};

PathSVG.propTypes = {
  totalLessons: PropTypes.number,
  completedCount: PropTypes.number
};

export default React.memo(PathSVG);
