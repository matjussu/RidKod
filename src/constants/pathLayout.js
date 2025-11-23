/**
 * pathLayout.js - Configuration et calculs de positionnement pour le path des leçons
 * Style géométrique / zigzag (Heartbeat style)
 */

/**
 * Configuration du path
 */
export const PATH_CONFIG = {
  startY: 80,        // Position verticale du cercle Start (px)
  spacing: 160,      // Espacement vertical entre chaque étage (px)
  amplitude: 140,    // Amplitude horizontale (distance du centre) (px)
  centerX: 200,      // Centre horizontal du SVG viewBox (px)

  // Configuration du Boss
  bossSpacing: 160   // Espace vertical pour le boss
};

/**
 * Retourne la position du noeud de départ (Start Circle)
 */
export const getStartNodePosition = () => {
  const { startY, centerX } = PATH_CONFIG;
  return { x: centerX, y: startY };
};

/**
 * Calcule la position (x, y) d'une leçon sur le path (Zigzag)
 * @param {number} index - Index de la leçon (0-based)
 * @returns {{ x: number, y: number }} Position absolue de la leçon
 */
export const calculateLessonPosition = (index) => {
  const { startY, spacing, amplitude, centerX } = PATH_CONFIG;

  // Position verticale : Start + (index + 1) * spacing
  const y = startY + ((index + 1) * spacing);

  // Position horizontale : Alternance Gauche / Droite
  // Index 0 (Leçon 1) -> Gauche (-1)
  // Index 1 (Leçon 2) -> Droite (+1)
  const direction = index % 2 === 0 ? -1 : 1;
  const x = centerX + (direction * amplitude);

  return { x, y };
};

/**
 * Calcule la position (x, y) d'un nœud XP entre deux leçons
 * @param {number} lessonIndex - Index de la leçon précédente (0-based)
 * @returns {{ x: number, y: number }} Position au milieu du segment entre leçon[i] et leçon[i+1]
 */
export const calculateXPNodePosition = (lessonIndex) => {
  // Positions des deux leçons encadrant le nœud XP
  const pos1 = calculateLessonPosition(lessonIndex);
  const pos2 = calculateLessonPosition(lessonIndex + 1);

  // Position au milieu du segment
  return {
    x: (pos1.x + pos2.x) / 2,
    y: (pos1.y + pos2.y) / 2
  };
};

/**
 * Calcule la position (x, y) du boss fight
 * @param {number} totalLessons - Nombre total de leçons dans le module
 * @returns {{ x: number, y: number }} Position absolue du boss (Centré)
 */
export const calculateBossPosition = (totalLessons) => {
  const { startY, spacing, bossSpacing, centerX } = PATH_CONFIG;

  // Le boss est placé après la dernière leçon
  const lastLessonY = startY + (totalLessons * spacing);
  const bossY = lastLessonY + bossSpacing;

  // Le boss revient au centre
  return { x: centerX, y: bossY };
};
