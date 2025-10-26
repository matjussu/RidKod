// Tests pour les fonctions Firestore du progressService
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeProgress,
  getUserProgress,
  saveExerciseCompletion,
  migrateFromLocalStorage
} from '../../services/progressService';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => new Date())
}));

// Mock firebase config
vi.mock('../../config/firebase', () => ({
  db: {}
}));

// Import les mocks après la déclaration
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

describe('progressService - Firestore Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('initializeProgress', () => {
    it('devrait créer une progression initiale pour un nouvel utilisateur', async () => {
      const userId = 'test-user-123';

      // Mock des fonctions Firestore
      const mockDocRef = { id: 'progress/test-user-123' };
      doc.mockReturnValue(mockDocRef);
      setDoc.mockResolvedValue(undefined);

      const result = await initializeProgress(userId);

      // Vérifier que setDoc a été appelé avec les bonnes données
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          userId,
          totalXP: 0,
          level: 1,
          completedExercises: [],
          streak: {
            current: 0,
            longest: 0,
            lastActivityDate: null
          },
          stats: {
            totalExercises: 0,
            correctAnswers: 0,
            incorrectAnswers: 0
          }
        })
      );

      // Vérifier le résultat
      expect(result).toMatchObject({
        userId,
        totalXP: 0,
        level: 1,
        completedExercises: []
      });
    });

    it('devrait gérer les erreurs lors de l\'initialisation', async () => {
      const userId = 'test-user-123';
      const error = new Error('Firestore error');

      doc.mockReturnValue({ id: 'test' });
      setDoc.mockRejectedValue(error);

      await expect(initializeProgress(userId)).rejects.toThrow('Firestore error');
    });
  });

  describe('getUserProgress', () => {
    it('devrait retourner la progression existante d\'un utilisateur', async () => {
      const userId = 'test-user-123';
      const mockProgress = {
        userId,
        totalXP: 150,
        level: 2,
        completedExercises: [
          {
            exerciseId: 'py_beg_001',
            xpGained: 10,
            language: 'python',
            difficulty: 1
          }
        ],
        stats: {
          totalExercises: 1,
          correctAnswers: 1,
          incorrectAnswers: 0
        }
      };

      const mockDocRef = { id: 'progress/test-user-123' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockProgress
      });

      const result = await getUserProgress(userId);

      expect(result).toEqual(mockProgress);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('devrait initialiser la progression si l\'utilisateur n\'existe pas', async () => {
      const userId = 'new-user-456';

      const mockDocRef = { id: 'progress/new-user-456' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => false
      });
      setDoc.mockResolvedValue(undefined);

      const result = await getUserProgress(userId);

      // Devrait avoir initialisé une nouvelle progression
      expect(result).toMatchObject({
        userId,
        totalXP: 0,
        level: 1,
        completedExercises: []
      });
      expect(setDoc).toHaveBeenCalled();
    });
  });

  describe('saveExerciseCompletion', () => {
    it('devrait sauvegarder un nouvel exercice et ajouter de l\'XP', async () => {
      const userId = 'test-user-123';
      const currentProgress = {
        userId,
        totalXP: 50,
        level: 1,
        completedExercises: [],
        streak: { current: 0, longest: 0, lastActivityDate: null },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 }
      };

      const exerciseData = {
        exerciseId: 'py_beg_001',
        language: 'python',
        difficulty: 1,
        xpGained: 10,
        isCorrect: true,
        attempts: 1
      };

      const mockDocRef = { id: 'progress/test-user-123' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => currentProgress
      });
      updateDoc.mockResolvedValue(undefined);

      const result = await saveExerciseCompletion(userId, exerciseData);

      // Vérifier le résultat
      expect(result).toMatchObject({
        totalXP: 60, // 50 + 10
        level: 1,
        xpGained: 10,
        leveledUp: false
      });

      // Vérifier que updateDoc a été appelé
      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          totalXP: 60,
          level: 1,
          stats: {
            totalExercises: 1,
            correctAnswers: 1,
            incorrectAnswers: 0
          }
        })
      );
    });

    it('ne devrait pas donner d\'XP pour un exercice déjà complété', async () => {
      const userId = 'test-user-123';
      const exerciseId = 'py_beg_001';

      // Mock Firestore Timestamp
      const mockTimestamp = {
        toDate: () => new Date()
      };

      const currentProgress = {
        userId,
        totalXP: 50,
        level: 1,
        completedExercises: [
          {
            exerciseId,
            xpGained: 10,
            language: 'python',
            difficulty: 1
          }
        ],
        streak: { current: 1, longest: 1, lastActivityDate: mockTimestamp },
        stats: { totalExercises: 1, correctAnswers: 1, incorrectAnswers: 0 }
      };

      const exerciseData = {
        exerciseId,
        language: 'python',
        difficulty: 1,
        xpGained: 10,
        isCorrect: true,
        attempts: 1
      };

      const mockDocRef = { id: 'progress/test-user-123' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => currentProgress
      });
      updateDoc.mockResolvedValue(undefined);

      const result = await saveExerciseCompletion(userId, exerciseData);

      // L'XP ne devrait pas augmenter
      expect(result.totalXP).toBe(50);
      expect(result.xpGained).toBe(0);
    });

    it('devrait indiquer leveledUp quand l\'utilisateur passe un niveau', async () => {
      const userId = 'test-user-123';

      const currentProgress = {
        userId,
        totalXP: 95, // Juste avant de passer niveau 2
        level: 1,
        completedExercises: [],
        streak: { current: 0, longest: 0, lastActivityDate: null },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 }
      };

      const exerciseData = {
        exerciseId: 'py_beg_002',
        language: 'python',
        difficulty: 1,
        xpGained: 10, // Va passer à 105 XP = niveau 2
        isCorrect: true,
        attempts: 1
      };

      const mockDocRef = { id: 'progress/test-user-123' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => currentProgress
      });
      updateDoc.mockResolvedValue(undefined);

      const result = await saveExerciseCompletion(userId, exerciseData);

      expect(result.totalXP).toBe(105);
      expect(result.level).toBe(2);
      expect(result.leveledUp).toBe(true);
    });
  });

  describe('migrateFromLocalStorage', () => {
    it('devrait migrer la progression de localStorage vers Firestore', async () => {
      const userId = 'migrated-user-789';
      const localData = {
        totalXP: 80,
        level: 1,
        completedExercises: [
          {
            exerciseId: 'py_beg_001',
            xpGained: 10
          }
        ],
        stats: {
          totalExercises: 1,
          correctAnswers: 1,
          incorrectAnswers: 0
        }
      };

      // Simuler des données dans localStorage
      localStorage.setItem('userProgress', JSON.stringify(localData));

      const mockDocRef = { id: 'progress/migrated-user-789' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => false // Pas de progression Firestore existante
      });
      setDoc.mockResolvedValue(undefined);

      const result = await migrateFromLocalStorage(userId);

      // Vérifier que setDoc a été appelé avec les données migrées
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          userId,
          totalXP: 80,
          level: 1,
          completedExercises: localData.completedExercises
        })
      );

      // Vérifier que localStorage a été nettoyé
      expect(localStorage.getItem('userProgress')).toBeNull();
    });

    it('ne devrait pas écraser la progression Firestore existante', async () => {
      const userId = 'existing-user-999';
      const localData = {
        totalXP: 50,
        level: 1
      };

      localStorage.setItem('userProgress', JSON.stringify(localData));

      const mockDocRef = { id: 'progress/existing-user-999' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true // Progression Firestore déjà existante
      });

      const result = await migrateFromLocalStorage(userId);

      // Ne devrait pas appeler setDoc
      expect(setDoc).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('devrait retourner null si aucune donnée locale à migrer', async () => {
      const userId = 'no-data-user';

      // Pas de données dans localStorage
      localStorage.removeItem('userProgress');

      const result = await migrateFromLocalStorage(userId);

      expect(result).toBeNull();
      expect(doc).not.toHaveBeenCalled();
    });
  });
});
