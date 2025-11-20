import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Import exercise data
import exercisesData from '../data/exercises.json';

const ExerciseScreen = ({ navigation, route }) => {
  const { difficulty = 1 } = route?.params || {};

  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Charger les exercices selon la difficulté
  useEffect(() => {
    const filteredExercises = exercisesData.filter(ex => ex.difficulty === difficulty);
    setExercises(filteredExercises.slice(0, 10)); // 10 exercices par niveau
  }, [difficulty]);

  const currentExercise = exercises[currentIndex];

  // Gérer la sélection d'une réponse
  const handleSelectOption = (index) => {
    if (isValidated) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(index);
  };

  // Valider la réponse
  const handleValidate = () => {
    if (selectedAnswer === null) return;

    Haptics.notificationAsync(
      selectedAnswer === currentExercise.correctAnswer
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );

    setIsCorrect(selectedAnswer === currentExercise.correctAnswer);
    setIsValidated(true);
  };

  // Continuer vers l'exercice suivant
  const handleContinue = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsValidated(false);
      setIsCorrect(false);
    } else {
      // Fin du niveau
      navigation.navigate('Home');
    }
  };

  if (!currentExercise) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#088201" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / exercises.length) * 100}%` }
              ]}
            />
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionType}>
            {getQuestionTypeLabel(currentExercise.type)}
          </Text>
          <Text style={styles.questionText}>{currentExercise.question}</Text>
          <Text style={styles.xpBadge}>+{currentExercise.xpGain} XP</Text>
        </View>

        {/* Code Block */}
        <View style={styles.codeBlock}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.codeText}>{currentExercise.code}</Text>
          </ScrollView>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentExercise.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentExercise.correctAnswer;

            let optionStyle = styles.option;
            if (isValidated) {
              if (isCorrectAnswer) {
                optionStyle = styles.optionCorrect;
              } else if (isSelected) {
                optionStyle = styles.optionIncorrect;
              } else {
                optionStyle = styles.optionDisabled;
              }
            } else if (isSelected) {
              optionStyle = styles.optionSelected;
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleSelectOption(index)}
                disabled={isValidated}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {isValidated && (
          <View style={styles.feedbackContainer}>
            <Text style={[
              styles.feedbackText,
              isCorrect ? styles.feedbackSuccess : styles.feedbackError
            ]}>
              {isCorrect ? `✓ Bravo ! +${currentExercise.xpGain} XP` : '✗ Bien essayé !'}
            </Text>
            <Text style={styles.explanationText}>{currentExercise.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            !selectedAnswer && !isValidated && styles.actionButtonDisabled,
            isValidated && !isCorrect && styles.actionButtonError,
            isValidated && isCorrect && styles.actionButtonSuccess
          ]}
          onPress={isValidated ? handleContinue : handleValidate}
          disabled={!selectedAnswer && !isValidated}
        >
          <Text style={styles.actionButtonText}>
            {isValidated ? 'Continuer' : 'Valider'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper function pour les labels de type d'exercice
const getQuestionTypeLabel = (type) => {
  const labels = {
    predict_output: '📊 Prédire la sortie',
    find_error: '🐛 Trouver l\'erreur',
    trace_execution: '🔍 Tracer l\'exécution',
    concept_understanding: '💡 Comprendre le concept'
  };
  return labels[type] || 'Exercice';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1919',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#088201',
    borderRadius: 2,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  questionType: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 12,
  },
  xpBadge: {
    fontSize: 14,
    color: '#088201',
    fontWeight: '600',
  },
  codeBlock: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 200,
  },
  codeText: {
    color: '#FFFFFF',
    fontFamily: 'Courier',
    fontSize: 14,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#3A3A3C',
    borderColor: '#30D158',
  },
  optionCorrect: {
    backgroundColor: '#088201',
    borderColor: '#088201',
  },
  optionIncorrect: {
    backgroundColor: '#FF383C',
    borderColor: '#FF383C',
  },
  optionDisabled: {
    backgroundColor: '#2C2C2E',
    opacity: 0.5,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  feedbackSuccess: {
    color: '#30D158',
  },
  feedbackError: {
    color: '#FF9500',
  },
  explanationText: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1919',
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    backgroundColor: '#30D158',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#3A3A3C',
  },
  actionButtonSuccess: {
    backgroundColor: '#088201',
  },
  actionButtonError: {
    backgroundColor: '#FF383C',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ExerciseScreen;
