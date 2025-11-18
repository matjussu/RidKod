/**
 * pathLayout.js - Configuration et calculs de positionnement pour le path des leçons
 * Centralise les constantes pour synchroniser PathSVG et les composants de leçons
 */

/**
 * Configuration du path zigzag
 */
export const PATH_CONFIG = {
  startY: 20,        // Position verticale du premier point (px)
  spacing: 180,      // Espacement vertical entre chaque leçon (px)
  amplitude: 130,    // Amplitude horizontale du zigzag (distance du centre) (px)
  centerX: 200,      // Centre horizontal du SVG viewBox (px)

  // Offsets individuels pour positionner chaque cercle de leçon
  // x = décalage horizontal (+ = droite, - = gauche)
  // y = décalage vertical (+ = bas, - = haut)
  lessonOffsets: {
    0: { x: 30, y: -30 },    // Leçon 1 (index 0)
    1: { x: -100, y: -20 },    // Leçon 2 (index 1)
    2: { x: 30, y: -10 },    // Leçon 3 (index 2)
    3: { x: -90, y: -1 },    // Leçon 4 (index 3)
    4: { x: 20, y: 10 },    // Leçon 5 (index 4)
    5: { x: -100, y: 30 },    // Leçon 6 (index 5)
    6: { x: 20, y: 40 },    // Leçon 7 (index 6)
    7: { x: 0, y: 0 },    // Leçon 8 (index 7)
    8: { x: 0, y: 0 },    // Leçon 9 (index 8)
    9: { x: 0, y: 0 },    // Leçon 10 (index 9)
    // Ajouter plus de leçons si nécessaire
  },

  // Offset pour le boss (même système que les leçons)
  // x = décalage horizontal (+ = droite, - = gauche)
  // y = décalage vertical (+ = bas, - = haut)
  bossOffset: { x: -50, y: 145}
};

/**
 * Calcule la position (x, y) d'une leçon sur le path
 * @param {number} index - Index de la leçon (0-based)
 * @returns {{ x: number, y: number }} Position absolue de la leçon
 */
export const calculateLessonPosition = (index) => {
  const { startY, spacing, amplitude, centerX, lessonOffsets } = PATH_CONFIG;

  // Position de base du zigzag
  // Position verticale : startY + (index + 1) * spacing
  // +1 car la première leçon est à spacing du startY
  const baseY = startY + ((index + 1) * spacing);

  // Position horizontale : alternance gauche/droite
  // index pair (0, 2, 4...) = gauche (centerX - amplitude)
  // index impair (1, 3, 5...) = droite (centerX + amplitude)
  const baseX = (index + 1) % 2 === 0
    ? centerX + amplitude
    : centerX - amplitude;

  // Appliquer l'offset individuel de cette leçon
  const offset = lessonOffsets[index] || { x: 0, y: 0 };

  return {
    x: baseX + offset.x,
    y: baseY + offset.y
  };
};

/**
 * Calcule la position (x, y) du boss fight
 * @param {number} totalLessons - Nombre total de leçons dans le module
 * @returns {{ x: number, y: number }} Position absolue du boss
 */
export const calculateBossPosition = (totalLessons) => {
  const { startY, spacing, centerX, bossOffset } = PATH_CONFIG;

  // Position de base du boss (centre horizontal)
  const baseX = centerX;

  // Position verticale : après toutes les leçons + un espacement supplémentaire
  const baseY = startY + ((totalLessons + 1) * spacing) + 60;

  // Appliquer l'offset du boss
  return {
    x: baseX + bossOffset.x,
    y: baseY + bossOffset.y
  };
};
