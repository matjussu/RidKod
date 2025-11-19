import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PATH_CONFIG, calculateLessonPosition, calculateBossPosition, getStartNodePosition } from '../../constants/pathLayout';

/**
 * PathSVG - Chemin SVG animé reliant les leçons (style Géométrique / Zigzag)
 * Lignes droites reliant les points clés
 */
const PathSVG = ({
  totalLessons = 7,
  completedCount = 0,
  startAnimation = false // Nouvelle prop pour l'animation de départ
}) => {
  // Calculer le path SVG
  const { pathData, totalLength, maxY, firstLessonLength } = useMemo(() => {
    const startNode = getStartNodePosition();

    // Point de départ (Start Circle)
    let path = `M ${startNode.x} ${startNode.y}`;
    let length = 0;
    let lastPoint = startNode;
    let firstLen = 0;

    // Ajouter chaque leçon comme un sommet
    for (let i = 0; i < totalLessons; i++) {
      const point = calculateLessonPosition(i);
      path += ` L ${point.x} ${point.y}`;

      // Calculer la distance
      const dx = point.x - lastPoint.x;
      const dy = point.y - lastPoint.y;
      const segmentLen = Math.sqrt(dx * dx + dy * dy);
      length += segmentLen;

      if (i === 0) firstLen = segmentLen;

      lastPoint = point;
    }

    // Ajouter le Boss à la fin
    const bossPoint = calculateBossPosition(totalLessons);
    path += ` L ${bossPoint.x} ${bossPoint.y}`;

    const dx = bossPoint.x - lastPoint.x;
    const dy = bossPoint.y - lastPoint.y;
    length += Math.sqrt(dx * dx + dy * dy);

    return {
      pathData: path,
      totalLength: length,
      maxY: bossPoint.y + 50,
      firstLessonLength: firstLen
    };
  }, [totalLessons]);

  // Calculer le stroke-dashoffset
  let targetProgress = 0;

  if (startAnimation) {
    // Si animation de départ : on remplit jusqu'à la première leçon
    targetProgress = firstLessonLength / totalLength;
  } else {
    // Sinon comportement normal basé sur la progression
    const progressRatio = totalLessons > 0 ? (completedCount / totalLessons) : 0;
    targetProgress = Math.min(progressRatio * 0.95, 1);
  }

  const dashOffset = totalLength - (totalLength * targetProgress);

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
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9500" /> {/* Orange pour le start */}
          <stop offset="100%" stopColor="#FFB340" />
        </linearGradient>
      </defs>

      {/* Background path */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Foreground path (progress) */}
      <path
        d={pathData}
        fill="none"
        stroke={startAnimation ? "#FF9500" : "url(#pathGradient)"} // Orange fixe si start
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
        style={{
          transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </svg>
  );
};

PathSVG.propTypes = {
  totalLessons: PropTypes.number,
  completedCount: PropTypes.number,
  startAnimation: PropTypes.bool
};

export default React.memo(PathSVG);
