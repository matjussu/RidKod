import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PATH_CONFIG, getPathPoint } from '../../constants/pathLayout';

/**
 * PathSVG - Chemin SVG animé reliant les leçons (style Duolingo)
 * Courbe sinusoïdale fluide générée mathématiquement
 */
const PathSVG = ({
  totalLessons = 7,
  completedCount = 0
}) => {
  // Calculer le path SVG
  const { pathData, totalLength, maxY } = useMemo(() => {
    const { startY, spacing, bossSpacing } = PATH_CONFIG;

    // Point de départ
    let path = `M ${getPathPoint(startY).x} ${startY}`;

    // Calculer la hauteur totale
    // Dernière leçon + boss
    const lastLessonY = startY + ((totalLessons - 1) * spacing);
    const bossY = lastLessonY + bossSpacing;
    const endY = bossY + 50; // Un peu de marge après le boss

    // Générer des points intermédiaires pour une courbe fluide
    // Résolution : un point tous les 10px
    const step = 10;
    let length = 0;
    let lastPoint = { x: getPathPoint(startY).x, y: startY };

    for (let y = startY + step; y <= endY; y += step) {
      const point = getPathPoint(y);
      path += ` L ${point.x} ${point.y}`;

      // Calculer la longueur approximative
      const dx = point.x - lastPoint.x;
      const dy = point.y - lastPoint.y;
      length += Math.sqrt(dx * dx + dy * dy);

      lastPoint = point;
    }

    return {
      pathData: path,
      totalLength: length,
      maxY: endY
    };
  }, [totalLessons]);

  // Calculer le stroke-dashoffset pour l'animation de progression
  // On approxime la progression basée sur le nombre de leçons complétées
  const progressRatio = totalLessons > 0 ? (completedCount / totalLessons) : 0;
  // On ajuste pour ne pas remplir tout le chemin du boss si pas fini
  const adjustedProgress = Math.min(progressRatio * 0.9, 1);

  const dashOffset = totalLength - (totalLength * adjustedProgress);

  return (
    <svg
      className="path-svg"
      viewBox={`0 0 400 ${maxY}`}
      preserveAspectRatio="xMidYMin meet"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
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
          <stop offset={`${adjustedProgress * 100}%`} stopColor="#30D158" />
          <stop offset={`${adjustedProgress * 100}%`} stopColor="#2C2C2E" />
          <stop offset="100%" stopColor="#2C2C2E" />
        </linearGradient>
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

    </svg>
  );
};

PathSVG.propTypes = {
  totalLessons: PropTypes.number,
  completedCount: PropTypes.number
};

export default React.memo(PathSVG);
