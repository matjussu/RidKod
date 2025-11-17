/**
 * Exercise State Reducer
 *
 * Gère l'état de l'exercice de manière atomique pour éviter les race conditions
 * et simplifier la gestion du state.
 */

// Initial state pour un exercice
export const initialExerciseState = {
  // Selection state
  selectedOption: null,
  userInput: '',
  selectedLine: null,

  // Validation state
  isSubmitted: false,

  // Feedback state
  showGlow: false,
  glowType: null, // 'success' | 'error'

  // Explanation state
  isExplanationExpanded: false,
  highlightedLines: [],

  // Modal state
  showExitModal: false,

  // Progress state
  currentExerciseIndex: 0,
  blockStats: {
    correctAnswers: 0,
    incorrectAnswers: 0,
    xpGained: 0,
    currentUserLevel: 1,
    streak: 0,
    totalAnswered: 0,
    timeElapsed: 0
  }
};

// Action types
export const EXERCISE_ACTIONS = {
  // Selection actions
  SELECT_OPTION: 'SELECT_OPTION',
  SELECT_LINE: 'SELECT_LINE',
  UPDATE_INPUT: 'UPDATE_INPUT',
  CLEAR_INPUT: 'CLEAR_INPUT',

  // Validation actions
  VALIDATE_ANSWER: 'VALIDATE_ANSWER',

  // Navigation actions
  CONTINUE_TO_NEXT: 'CONTINUE_TO_NEXT',
  RESET_FOR_NEXT_EXERCISE: 'RESET_FOR_NEXT_EXERCISE',

  // Feedback actions
  SHOW_GLOW: 'SHOW_GLOW',
  HIDE_GLOW: 'HIDE_GLOW',

  // Explanation actions
  TOGGLE_EXPLANATION: 'TOGGLE_EXPLANATION',
  SET_HIGHLIGHTED_LINES: 'SET_HIGHLIGHTED_LINES',

  // Modal actions
  SHOW_EXIT_MODAL: 'SHOW_EXIT_MODAL',
  HIDE_EXIT_MODAL: 'HIDE_EXIT_MODAL',

  // Stats actions
  UPDATE_BLOCK_STATS: 'UPDATE_BLOCK_STATS',

  // Init action
  INITIALIZE: 'INITIALIZE'
};

/**
 * Reducer principal pour l'état de l'exercice
 */
export const exerciseReducer = (state, action) => {
  switch (action.type) {
    // ============================================
    // SELECTION ACTIONS
    // ============================================
    case EXERCISE_ACTIONS.SELECT_OPTION:
      return {
        ...state,
        selectedOption: action.payload
      };

    case EXERCISE_ACTIONS.SELECT_LINE:
      return {
        ...state,
        selectedLine: action.payload
      };

    case EXERCISE_ACTIONS.UPDATE_INPUT:
      return {
        ...state,
        userInput: action.payload
      };

    case EXERCISE_ACTIONS.CLEAR_INPUT:
      return {
        ...state,
        userInput: ''
      };

    // ============================================
    // VALIDATION ACTIONS
    // ============================================
    case EXERCISE_ACTIONS.VALIDATE_ANSWER:
      const { isCorrect } = action.payload;
      return {
        ...state,
        isSubmitted: true,
        showGlow: true,
        glowType: isCorrect ? 'success' : 'error'
      };

    // ============================================
    // NAVIGATION ACTIONS
    // ============================================
    case EXERCISE_ACTIONS.CONTINUE_TO_NEXT:
      return {
        ...state,
        currentExerciseIndex: state.currentExerciseIndex + 1
      };

    case EXERCISE_ACTIONS.RESET_FOR_NEXT_EXERCISE:
      return {
        ...state,
        selectedOption: null,
        userInput: '',
        selectedLine: null,
        isSubmitted: false,
        showGlow: false,
        glowType: null,
        isExplanationExpanded: false,
        highlightedLines: []
      };

    // ============================================
    // FEEDBACK ACTIONS
    // ============================================
    case EXERCISE_ACTIONS.SHOW_GLOW:
      return {
        ...state,
        showGlow: true,
        glowType: action.payload.type
      };

    case EXERCISE_ACTIONS.HIDE_GLOW:
      return {
        ...state,
        showGlow: false
      };

    // ============================================
    // EXPLANATION ACTIONS
    // ============================================
    case EXERCISE_ACTIONS.TOGGLE_EXPLANATION:
      const newExplanationState = !state.isExplanationExpanded;
      return {
        ...state,
        isExplanationExpanded: newExplanationState,
        highlightedLines: newExplanationState ? action.payload.lines : []
      };

    case EXERCISE_ACTIONS.SET_HIGHLIGHTED_LINES:
      return {
        ...state,
        highlightedLines: action.payload
      };

    // ============================================
    // MODAL ACTIONS
    // ============================================
    case EXERCISE_ACTIONS.SHOW_EXIT_MODAL:
      return {
        ...state,
        showExitModal: true
      };

    case EXERCISE_ACTIONS.HIDE_EXIT_MODAL:
      return {
        ...state,
        showExitModal: false
      };

    // ============================================
    // STATS ACTIONS
    // ============================================
    case EXERCISE_ACTIONS.UPDATE_BLOCK_STATS:
      const { isCorrect: correct, xpGained } = action.payload;
      return {
        ...state,
        blockStats: {
          ...state.blockStats,
          correctAnswers: state.blockStats.correctAnswers + (correct ? 1 : 0),
          incorrectAnswers: state.blockStats.incorrectAnswers + (correct ? 0 : 1),
          xpGained: state.blockStats.xpGained + xpGained,
          totalAnswered: state.blockStats.totalAnswered + 1
        }
      };

    // ============================================
    // INIT ACTION
    // ============================================
    case EXERCISE_ACTIONS.INITIALIZE:
      return {
        ...initialExerciseState,
        blockStats: {
          ...initialExerciseState.blockStats,
          currentUserLevel: action.payload.userLevel || 1,
          streak: action.payload.streak || 0
        }
      };

    default:
      return state;
  }
};

/**
 * Helper pour créer le state initial avec des valeurs custom
 */
export const createInitialState = (userLevel = 1, streak = 0) => {
  return {
    ...initialExerciseState,
    blockStats: {
      ...initialExerciseState.blockStats,
      currentUserLevel: userLevel,
      streak: streak
    }
  };
};
