/**
 * pathLayout.js - Configuration et calculs de positionnement pour le path des leçons
 * Centralise les constantes pour synchroniser PathSVG et les composants de leçons
 */

/**
 * Configuration du path zigzag
 */
export const PATH_CONFIG = {
  startY: 60,        // Position verticale du premier point (px)
  spacing: 140,      // Espacement vertical entre chaque leçon (px)
  amplitude: 100,    // Amplitude horizontale du zigzag (distance du centre) (px)
  centerX: 200       // Centre horizontal du SVG viewBox (px)
};

/**
 * Calcule la position (x, y) d'une leçon sur le path
 * @param {number} index - Index de la leçon (0-based)
 * @returns {{ x: number, y: number }} Position absolue de la leçon
 */
export const calculateLessonPosition = (index) => {
  const { startY, spacing, amplitude, centerX } = PATH_CONFIG;

  // Position verticale : startY + (index + 1) * spacing
  // +1 car la première leçon est à spacing du startY
  const y = startY + ((index + 1) * spacing);

  // Position horizontale : alternance gauche/droite
  // index pair (0, 2, 4...) = gauche (centerX - amplitude)
  // index impair (1, 3, 5...) = droite (centerX + amplitude)
  const x = (index + 1) % 2 === 0
    ? centerX + amplitude
    : centerX - amplitude;

  return { x, y };
};

/**
 * Calcule la position (x, y) du boss fight
 * @param {number} totalLessons - Nombre total de leçons dans le module
 * @returns {{ x: number, y: number }} Position absolue du boss
 */
export const calculateBossPosition = (totalLessons) => {
  const { startY, spacing, centerX } = PATH_CONFIG;

  // Le boss est toujours au centre horizontalement
  const x = centerX;

  // Position verticale : après toutes les leçons + un espacement supplémentaire
  const y = startY + ((totalLessons + 1) * spacing) + 60;

  return { x, y };
};

/**
 * Calcule la position d'un checkpoint (étoile) sur le path
 * @param {number} checkpointIndex - Index du checkpoint dans la liste des checkpoints
 * @param {number} lessonIndex - Index de la leçon correspondante
 * @returns {{ x: number, y: number }} Position absolue du checkpoint
 */
export const calculateCheckpointPosition = (lessonIndex) => {
  // Un checkpoint est positionné exactement comme une leçon
  return calculateLessonPosition(lessonIndex);
};
