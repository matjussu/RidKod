/**
 * Exercise Page Layout Constants
 *
 * Centralizes all magic numbers and layout values for the Exercise page
 * to improve maintainability and consistency.
 */

// ============================================
// EXERCISES & PROGRESSION
// ============================================
export const EXERCISES_PER_LEVEL = 5;
export const TOTAL_DIFFICULTY_LEVELS = 3;

// Nombre d'exercices par difficulté (incluant find-error, free-input, concept-understanding)
export const EXERCISES_COUNT = {
  1: 204,  // Easy
  2: 204,  // Medium
  3: 192   // Hard
};

/**
 * Calculer le nombre max de niveaux pour une difficulté
 * @param {number} difficulty - Niveau de difficulté (1-3)
 * @returns {number} Nombre max de niveaux
 */
export const getMaxLevelsForDifficulty = (difficulty) => {
  return Math.ceil((EXERCISES_COUNT[difficulty] || 30) / EXERCISES_PER_LEVEL);
};

// ============================================
// COMPONENT HEIGHTS (px)
// ============================================
export const CODE_BLOCK = {
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 500,
  MAX_HEIGHT_COMPACT: 600,
};

export const OPTION_BUTTON = {
  HEIGHT: 52,
};

export const ACTION_BUTTON = {
  HEIGHT: 52,
};

export const PROGRESS_BAR = {
  HEIGHT: 10,
};

export const CLOSE_BUTTON = {
  SIZE: 20,
  SIZE_SMALL: 18,
  SIZE_TINY: 16,
};

// ============================================
// OPTIONS CONTAINER
// ============================================
export const OPTIONS_CONTAINER = {
  MAX_HEIGHT: 300, // 4 buttons × 52px + 3 gaps × 10px + margin
  GRID_GAP: 10,
  GRID_GAP_SMALL: 8,
  COLUMNS: 2,
};

// ============================================
// BORDER RADIUS (px)
// ============================================
export const BORDER_RADIUS = {
  SMALL: 10,
  MEDIUM: 12,
  LARGE: 14,
};

// ============================================
// SPACING SYSTEM (px)
// ============================================
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

// ============================================
// SAFE AREA INSETS - BASE VALUES (px)
// ============================================
export const SAFE_AREA = {
  TOP: 8,
  TOP_LANDSCAPE: 6,
  LEFT: 16,
  RIGHT: 16,
  BOTTOM: 16,
};

// ============================================
// CLOSE BUTTON POSITIONING (px)
// ============================================
export const CLOSE_BUTTON_POSITION = {
  TOP: 4,
  TOP_LANDSCAPE: 6,
  LEFT: 16,
  PADDING: 20,
  PADDING_SMALL: 4,
  PADDING_TINY: 3,
};

// ============================================
// PROGRESS CONTAINER PADDING (px)
// ============================================
export const PROGRESS_PADDING = {
  HORIZONTAL: 48,
  HORIZONTAL_430: 50,
  HORIZONTAL_375: 44,
  HORIZONTAL_320: 40,
};

// ============================================
// SCROLLBAR DIMENSIONS (px)
// ============================================
export const SCROLLBAR = {
  WIDTH: 4,
  RADIUS: 2,
};

// ============================================
// FONT SIZES (px)
// ============================================
export const FONT_SIZE = {
  CODE: 14,
  CODE_SMALL: 13,
};

// ============================================
// LINE HEIGHTS
// ============================================
export const LINE_HEIGHT = {
  CODE: 1.5,
  CODE_COMPACT: 1.4,
};

// ============================================
// RESPONSIVE BREAKPOINTS (px)
// ============================================
export const BREAKPOINTS = {
  PRO_MAX: 430,    // iPhone 14/15 Pro Max
  PRO: 393,        // iPhone 14/15 Pro
  STANDARD: 375,   // iPhone SE, 12/13 mini
  SMALL: 320,      // iPhone SE (1st gen)
  SHORT: 667,      // Max height for compact code
};

// ============================================
// RESPONSIVE SAFE AREA ADJUSTMENTS (px)
// ============================================
export const RESPONSIVE_SAFE_AREA = {
  // 430px (Pro Max)
  430: {
    LEFT: 18,
    RIGHT: 18,
  },
  // 375px (Standard)
  375: {
    LEFT: 14,
    RIGHT: 14,
  },
  // 320px (Small)
  320: {
    LEFT: 12,
    RIGHT: 12,
  },
  // Landscape
  LANDSCAPE: {
    LEFT: 12,
    RIGHT: 12,
  },
};

// ============================================
// ANIMATION DURATIONS (ms)
// ============================================
export const ANIMATION = {
  DURATION_FAST: 300,
  DURATION_MEDIUM: 600,
  EASING: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// ============================================
// Z-INDEX LAYERS
// ============================================
export const Z_INDEX = {
  HEADER: 100,
  CLOSE_BUTTON: 101,
  MODAL: 1000,
  FEEDBACK_GLOW: 50,
};

// ============================================
// COLORS (HEX)
// ============================================
export const COLORS = {
  BG_PRIMARY: '#0F0F12',
  BG_CODE: '#030303ff',
  BG_CARD: '#FFFFFF',
  BG_PROGRESS: '#3A3A3C',
  BG_SCROLLBAR: '#3A3A3C',
  SUCCESS: '#088201',
  ERROR: '#FF453A',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_DARK: '#000000',
};

// ============================================
// XP VALUES BY DIFFICULTY
// ============================================
export const XP_VALUES = {
  BEGINNER: 10,
  INTERMEDIATE: 20,
  ADVANCED: 30,
};

// ============================================
// LEVEL THRESHOLDS (XP required for each level)
// ============================================
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1350,   // Level 7
  1750,   // Level 8
  2200,   // Level 9
  2700,   // Level 10
];

// ============================================
// HAPTIC FEEDBACK PATTERNS (ms)
// ============================================
export const HAPTIC = {
  LIGHT: 10,
  MEDIUM: 20,
  HEAVY: 30,
  SUCCESS: [10, 50, 10],
  ERROR: [20, 100, 20],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate XP required for a specific level
 * @param {number} level - Target level (1-10)
 * @returns {number} XP required
 */
export const getXPForLevel = (level) => {
  if (level < 1 || level > 10) return 0;
  return LEVEL_THRESHOLDS[level - 1];
};

/**
 * Calculate current level from XP
 * @param {number} xp - Current XP
 * @returns {number} Current level (1-10)
 */
export const getLevelFromXP = (xp) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

/**
 * Calculate XP needed for next level
 * @param {number} currentXP - Current XP
 * @returns {number} XP needed for next level
 */
export const getXPForNextLevel = (currentXP) => {
  const currentLevel = getLevelFromXP(currentXP);
  if (currentLevel >= 10) return 0;
  return LEVEL_THRESHOLDS[currentLevel] - currentXP;
};

/**
 * Get XP value for difficulty
 * @param {number} difficulty - Difficulty level (1-3)
 * @returns {number} XP value
 */
export const getXPForDifficulty = (difficulty) => {
  switch (difficulty) {
    case 1: return XP_VALUES.BEGINNER;
    case 2: return XP_VALUES.INTERMEDIATE;
    case 3: return XP_VALUES.ADVANCED;
    default: return 0;
  }
};

/**
 * Check if exercise block is complete
 * @param {number} exerciseIndex - Current exercise index (0-based)
 * @returns {boolean} True if block is complete
 */
export const isBlockComplete = (exerciseIndex) => {
  return (exerciseIndex + 1) % EXERCISES_PER_LEVEL === 0 && exerciseIndex !== 0;
};
