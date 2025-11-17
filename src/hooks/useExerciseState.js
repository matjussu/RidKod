import { useReducer, useCallback } from 'react';
import { exerciseReducer, createInitialState, EXERCISE_ACTIONS } from '../reducers/exerciseReducer';

/**
 * Hook custom pour gérer l'état d'un exercice
 *
 * Encapsule toute la logique de state management et fournit des
 * actions stables (useCallback) pour manipuler l'état.
 *
 * @param {Object} exercise - L'exercice actuel
 * @param {number} userLevel - Niveau de l'utilisateur
 * @param {number} streak - Streak actuelle de l'utilisateur
 * @returns {Object} State et actions
 */
export const useExerciseState = (exercise, userLevel = 1, streak = 0) => {
  const [state, dispatch] = useReducer(
    exerciseReducer,
    createInitialState(userLevel, streak)
  );

  // ============================================
  // SELECTION ACTIONS
  // ============================================

  const selectOption = useCallback((index) => {
    dispatch({
      type: EXERCISE_ACTIONS.SELECT_OPTION,
      payload: index
    });
  }, []);

  const selectLine = useCallback((lineNumber) => {
    dispatch({
      type: EXERCISE_ACTIONS.SELECT_LINE,
      payload: lineNumber
    });
  }, []);

  const updateInput = useCallback((value) => {
    dispatch({
      type: EXERCISE_ACTIONS.UPDATE_INPUT,
      payload: value
    });
  }, []);

  const clearInput = useCallback(() => {
    dispatch({ type: EXERCISE_ACTIONS.CLEAR_INPUT });
  }, []);

  // ============================================
  // VALIDATION LOGIC
  // ============================================

  /**
   * Vérifie si la réponse actuelle est correcte
   */
  const checkAnswer = useCallback(() => {
    const inputType = exercise?.inputType || 'options';

    if (inputType === 'options') {
      return state.selectedOption === exercise?.correctAnswer;
    } else if (inputType === 'free_input') {
      const acceptedAnswers = exercise?.acceptedAnswers || [];
      return acceptedAnswers.some(answer =>
        answer.toLowerCase().trim() === state.userInput.toLowerCase().trim()
      );
    } else if (inputType === 'clickable_lines') {
      return state.selectedLine === exercise?.correctAnswer;
    }
    return false;
  }, [exercise, state.selectedOption, state.userInput, state.selectedLine]);

  /**
   * Valide la réponse actuelle
   */
  const validateAnswer = useCallback((isCorrect) => {
    dispatch({
      type: EXERCISE_ACTIONS.VALIDATE_ANSWER,
      payload: { isCorrect }
    });
  }, []);

  /**
   * Met à jour les stats du bloc après validation
   */
  const updateBlockStats = useCallback((isCorrect, xpGained) => {
    dispatch({
      type: EXERCISE_ACTIONS.UPDATE_BLOCK_STATS,
      payload: { isCorrect, xpGained }
    });
  }, []);

  // ============================================
  // NAVIGATION ACTIONS
  // ============================================

  const continueToNext = useCallback(() => {
    dispatch({ type: EXERCISE_ACTIONS.CONTINUE_TO_NEXT });
  }, []);

  const resetForNextExercise = useCallback(() => {
    dispatch({ type: EXERCISE_ACTIONS.RESET_FOR_NEXT_EXERCISE });
  }, []);

  // ============================================
  // FEEDBACK ACTIONS
  // ============================================

  const showGlow = useCallback((type) => {
    dispatch({
      type: EXERCISE_ACTIONS.SHOW_GLOW,
      payload: { type }
    });
  }, []);

  const hideGlow = useCallback(() => {
    dispatch({ type: EXERCISE_ACTIONS.HIDE_GLOW });
  }, []);

  // ============================================
  // EXPLANATION ACTIONS
  // ============================================

  const toggleExplanation = useCallback(() => {
    const lines = exercise?.highlightedLines || [];
    dispatch({
      type: EXERCISE_ACTIONS.TOGGLE_EXPLANATION,
      payload: { lines }
    });
  }, [exercise]);

  const setHighlightedLines = useCallback((lines) => {
    dispatch({
      type: EXERCISE_ACTIONS.SET_HIGHLIGHTED_LINES,
      payload: lines
    });
  }, []);

  // ============================================
  // MODAL ACTIONS
  // ============================================

  const showExitModal = useCallback(() => {
    dispatch({ type: EXERCISE_ACTIONS.SHOW_EXIT_MODAL });
  }, []);

  const hideExitModal = useCallback(() => {
    dispatch({ type: EXERCISE_ACTIONS.HIDE_EXIT_MODAL });
  }, []);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const isCorrect = checkAnswer();

  const isAnswerSelected = useCallback(() => {
    const inputType = exercise?.inputType || 'options';

    if (inputType === 'options') {
      return state.selectedOption !== null;
    } else if (inputType === 'free_input') {
      return state.userInput.trim() !== '';
    } else if (inputType === 'clickable_lines') {
      return state.selectedLine !== null;
    }
    return false;
  }, [exercise, state.selectedOption, state.userInput, state.selectedLine]);

  // ============================================
  // RETURN INTERFACE
  // ============================================

  return {
    // State
    state,

    // Computed values
    isCorrect,
    isAnswerSelected: isAnswerSelected(),

    // Selection actions
    selectOption,
    selectLine,
    updateInput,
    clearInput,

    // Validation actions
    checkAnswer,
    validateAnswer,
    updateBlockStats,

    // Navigation actions
    continueToNext,
    resetForNextExercise,

    // Feedback actions
    showGlow,
    hideGlow,

    // Explanation actions
    toggleExplanation,
    setHighlightedLines,

    // Modal actions
    showExitModal,
    hideExitModal
  };
};
