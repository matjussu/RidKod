/**
 * pathLayout.js - Configuration et calculs de positionnement pour le path des leçons
 * Utilise une courbe sinusoïdale pour un rendu fluide et organique (style Duolingo)
 */

/**
 * Configuration du path sinusoïdal
 */
export const PATH_CONFIG = {
  startY: 50,        // Position verticale du premier point (px)
  spacing: 140,      // Espacement vertical entre chaque leçon (px)
  amplitude: 90,     // Amplitude horizontale de la courbe (px)
  centerX: 200,      // Centre horizontal du SVG viewBox (px)
  waveLength: 600,   // Longueur d'onde verticale (px) pour un cycle complet

  // Configuration du Boss
  bossSpacing: 180   // Espace supplémentaire avant le boss
};

/**
 * Calcule la position (x, y) sur la courbe pour une hauteur y donnée
 * @param {number} y - Position verticale
 * @returns {{ x: number, y: number }} Coordonnées
 */
export const getPathPoint = (y) => {
  const { centerX, amplitude, waveLength, startY } = PATH_CONFIG;

  // Calcul de l'angle pour la sinusoïde
  // On commence à 0 (centre)
  const angle = ((y - startY) / waveLength) * 2 * Math.PI;

  // Formule x = center + amp * sin(angle)
  const x = centerX + amplitude * Math.sin(angle);

  return { x, y };
};

/**
 * Calcule la position (x, y) d'une leçon sur le path
 * @param {number} index - Index de la leçon (0-based)
 * @returns {{ x: number, y: number }} Position absolue de la leçon
 */
export const calculateLessonPosition = (index) => {
  const { startY, spacing } = PATH_CONFIG;

  // Position verticale basée sur l'index
  const y = startY + (index * spacing);

  return getPathPoint(y);
};

/**
 * Calcule la position (x, y) du boss fight
 * @param {number} totalLessons - Nombre total de leçons dans le module
 * @returns {{ x: number, y: number }} Position absolue du boss
 */
export const calculateBossPosition = (totalLessons) => {
  const { startY, spacing, bossSpacing } = PATH_CONFIG;

  // Le boss est placé après la dernière leçon
  // On utilise la même logique de courbe pour qu'il soit aligné
  const lastLessonY = startY + ((totalLessons - 1) * spacing);
  const bossY = lastLessonY + bossSpacing;

  return getPathPoint(bossY);
};
