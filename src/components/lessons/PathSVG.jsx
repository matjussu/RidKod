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
  startAnimation = false, // Nouvelle prop pour l'animation de départ
  completedLessons = [], // IDs des leçons complétées
  xpNodesCollected = {} // { "xp_1": true, "xp_2": false, ... }
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

  // Calculer le stroke-dashoffset avec nœuds XP
  const { targetProgress, segmentLengths } = useMemo(() => {
    console.log('🔍 PathSVG - Props reçues:', {
      completedLessons,
      xpNodesCollected,
      totalLessons,
      startAnimation
    });

    if (startAnimation) {
      // Si animation de départ : on remplit jusqu'à la première leçon
      return {
        targetProgress: firstLessonLength / totalLength,
        segmentLengths: []
      };
    }

    // Calculer les longueurs cumulées de chaque segment
    const startNode = getStartNodePosition();
    const segments = [];
    let cumulativeLength = 0;
    let lastPoint = startNode;

    // Segment Start → Leçon 1
    const firstLesson = calculateLessonPosition(0);
    const dx0 = firstLesson.x - lastPoint.x;
    const dy0 = firstLesson.y - lastPoint.y;
    const len0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
    cumulativeLength += len0;
    segments.push({
      from: 'start',
      to: 'lesson_0',
      length: len0,
      cumulative: cumulativeLength
    });
    lastPoint = firstLesson;

    // Segments entre leçons
    for (let i = 0; i < totalLessons - 1; i++) {
      const currentLesson = calculateLessonPosition(i);
      const nextLesson = calculateLessonPosition(i + 1);
      const dx = nextLesson.x - currentLesson.x;
      const dy = nextLesson.y - currentLesson.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      cumulativeLength += len;
      segments.push({
        from: `lesson_${i}`,
        to: `lesson_${i + 1}`,
        length: len,
        cumulative: cumulativeLength,
        xpNodeId: `xp_${i + 1}` // Nœud XP au milieu de ce segment
      });
    }

    // Dernier segment : dernière leçon → Boss
    const lastLesson = calculateLessonPosition(totalLessons - 1);
    const bossPoint = calculateBossPosition(totalLessons);
    const dxBoss = bossPoint.x - lastLesson.x;
    const dyBoss = bossPoint.y - lastLesson.y;
    const lenBoss = Math.sqrt(dxBoss * dxBoss + dyBoss * dyBoss);
    cumulativeLength += lenBoss;
    segments.push({
      from: `lesson_${totalLessons - 1}`,
      to: 'boss',
      length: lenBoss,
      cumulative: cumulativeLength
    });

    console.log('📊 Segments calculés:', segments);

    // Calculer la progression en fonction des leçons + nœuds XP
    let targetLength = 0;

    for (let i = 0; i < totalLessons; i++) {
      const isLessonCompleted = completedLessons[i] || false;
      console.log(`\n🔄 Iteration ${i} - Leçon ${i + 1}:`, {
        isLessonCompleted,
        targetLengthAvant: targetLength
      });

      if (i === 0) {
        // Première leçon : segment Start → Leçon 1
        if (isLessonCompleted) {
          targetLength = segments[0].cumulative;
          console.log('  ✅ Leçon 1 complétée → targetLength =', targetLength);

          // Si leçon 1 complétée, vérifier le nœud XP suivant
          if (totalLessons > 1) {
            const nextSegment = segments[1]; // Segment L1 → L2
            const xpNodeId = nextSegment?.xpNodeId;
            const isXPCollected = xpNodesCollected[xpNodeId] || false;
            console.log('  🔍 Vérif XP suivant:', { xpNodeId, isXPCollected });

            if (!isXPCollected) {
              // XP pas collecté → s'arrêter au nœud XP (milieu du segment)
              targetLength = segments[0].cumulative + (nextSegment.length / 2);
              console.log('  ⏸️ XP non collecté → stop au nœud, targetLength =', targetLength);
            } else {
              // XP collecté → continuer jusqu'à la leçon suivante
              targetLength = nextSegment.cumulative;
              console.log('  ✅ XP collecté → continue jusqu\'à L2, targetLength =', targetLength);
            }
          }
        }
      } else {
        // Leçons suivantes
        const previousSegment = segments[i]; // Segment lesson[i-1] → lesson[i]
        const xpNodeId = previousSegment?.xpNodeId;
        const isPreviousXPCollected = xpNodesCollected[xpNodeId] || false;

        console.log(`  🔍 Leçon ${i + 1} - Vérif XP précédent:`, {
          previousSegment: previousSegment?.from + ' → ' + previousSegment?.to,
          xpNodeId,
          isPreviousXPCollected,
          isLessonCompleted
        });

        // Pour avancer vers la leçon i, il faut que la leçon i-1 soit complétée ET que l'XP soit collecté
        if (isPreviousXPCollected && isLessonCompleted) {
          // Leçon complétée → tracé jusqu'à la leçon
          targetLength = previousSegment.cumulative;
          console.log(`  ✅ XP collecté + Leçon ${i + 1} complétée → targetLength =`, targetLength);

          // Vérifier le nœud XP suivant (sauf pour la dernière leçon)
          if (i < totalLessons - 1) {
            const nextSegment = segments[i + 1]; // Segment L[i] → L[i+1]
            const nextXpNodeId = nextSegment?.xpNodeId;
            const isNextXPCollected = xpNodesCollected[nextXpNodeId] || false;
            console.log('  🔍 Vérif XP suivant:', { nextXpNodeId, isNextXPCollected });

            if (!isNextXPCollected) {
              // XP pas collecté → s'arrêter au nœud XP (milieu du segment suivant)
              targetLength = previousSegment.cumulative + (nextSegment.length / 2);
              console.log('  ⏸️ XP suivant non collecté → stop au nœud, targetLength =', targetLength);
            } else {
              // XP collecté → continuer jusqu'à la leçon suivante
              targetLength = nextSegment.cumulative;
              console.log('  ✅ XP suivant collecté → continue, targetLength =', targetLength);
            }
          }
        } else {
          console.log(`  ❌ Condition non remplie (XP=${isPreviousXPCollected}, Leçon=${isLessonCompleted}) → skip`);
        }
      }
    }

    // Vérifier si on doit continuer jusqu'au boss
    console.log('\n🎮 Vérification boss:');
    const lastLessonCompleted = completedLessons[totalLessons - 1] || false;
    console.log(`  Dernière leçon (${totalLessons}) complétée: ${lastLessonCompleted}`);

    if (lastLessonCompleted && totalLessons > 0) {
      // Vérifier le dernier XP node
      const lastSegment = segments[totalLessons - 1]; // Segment avant-dernière → dernière leçon
      const lastXPNodeId = lastSegment?.xpNodeId;
      const isLastXPCollected = xpNodesCollected[lastXPNodeId] || false;

      console.log(`  Dernier XP (${lastXPNodeId}): ${isLastXPCollected ? '✅' : '❌'}`);

      if (isLastXPCollected) {
        // XP collecté → continuer jusqu'au boss
        const bossSegment = segments[totalLessons]; // Segment dernière leçon → boss
        if (bossSegment) {
          targetLength = bossSegment.cumulative;
          console.log(`  🎯 Boss segment trouvé → targetLength = ${targetLength} (jusqu'au boss)`);
        }
      } else {
        console.log('  ⏸️ Dernier XP non collecté → stop avant le boss');
      }
    }

    const finalProgress = Math.min(targetLength / totalLength, 1);
    console.log('\n🎯 Résultat final:', {
      targetLength,
      totalLength,
      targetProgress: finalProgress,
      pourcentage: (finalProgress * 100).toFixed(1) + '%'
    });

    return {
      targetProgress: finalProgress,
      segmentLengths: segments
    };
  }, [startAnimation, firstLessonLength, totalLength, totalLessons, completedLessons, xpNodesCollected]);

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
          <stop offset="0%" stopColor="#30D158" /> {/* Vert pour la progression */}
          <stop offset="100%" stopColor="#34C759" />
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
  startAnimation: PropTypes.bool,
  completedLessons: PropTypes.array,
  xpNodesCollected: PropTypes.object
};

export default React.memo(PathSVG);
