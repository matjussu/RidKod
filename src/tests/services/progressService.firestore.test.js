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
  auth: { currentUser: null },
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
          userLevel: 1,
          currentLevel: 1,
          completedLevels: [],
          levelStats: {},
          lessonProgress: {},
          xpNodesCollected: {},
          bossCompleted: {},
          streak: {
            current: 0,
            longest: 0,
            lastActivityDate: null
          },
          stats: {
            totalExercises: 0,
            correctAnswers: 0,
            incorrectAnswers: 0
          },
          dailyActivity: {}
        })
      );

      // Vérifier le résultat
      expect(result).toMatchObject({
        userId,
        totalXP: 0,
        userLevel: 1,
        currentLevel: 1,
        completedLevels: []
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
        userLevel: 2,
        currentLevel: 2,
        completedLevels: [1],
        levelStats: { 1: { correct: 8, incorrect: 2, xp: 100 } },
        stats: {
          totalExercises: 10,
          correctAnswers: 8,
          incorrectAnswers: 2
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
        userLevel: 1,
        currentLevel: 1,
        completedLevels: []
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
        userLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        levelStats: {},
        streak: { current: 0, longest: 0, lastActivityDate: null },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 }
      };

      const exerciseData = {
        exerciseLevel: 1,
        xpGained: 10,
        isCorrect: true
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
        userLevel: 1,
        xpGained: 10,
        leveledUp: false
      });

      // Vérifier que updateDoc a été appelé
      expect(updateDoc).toHaveBeenCalled();
    });

    it('ne devrait pas donner d\'XP pour un niveau déjà complété', async () => {
      const userId = 'test-user-123';

      const currentProgress = {
        userId,
        totalXP: 100,
        userLevel: 2,
        currentLevel: 2,
        completedLevels: [1], // Niveau 1 déjà complété
        levelStats: { 1: { correct: 10, incorrect: 0, xp: 100 } },
        streak: { current: 1, longest: 1, lastActivityDate: null },
        stats: { totalExercises: 10, correctAnswers: 10, incorrectAnswers: 0 }
      };

      const exerciseData = {
        exerciseLevel: 1, // Niveau déjà complété
        xpGained: 10,
        isCorrect: true
      };

      const mockDocRef = { id: 'progress/test-user-123' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => currentProgress
      });

      const result = await saveExerciseCompletion(userId, exerciseData);

      // L'XP ne devrait pas augmenter car niveau déjà complété
      expect(result.totalXP).toBe(100);
      expect(result.xpGained).toBe(0);
      expect(result.alreadyCompleted).toBe(true);
    });

    it('devrait indiquer leveledUp quand l\'utilisateur passe un niveau', async () => {
      const userId = 'test-user-123';

      const currentProgress = {
        userId,
        totalXP: 95, // Juste avant de passer niveau 2 (100 XP)
        userLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        levelStats: {},
        streak: { current: 0, longest: 0, lastActivityDate: null },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 }
      };

      const exerciseData = {
        exerciseLevel: 1,
        xpGained: 10, // Va passer à 105 XP = niveau 2
        isCorrect: true
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
      expect(result.userLevel).toBe(2);
      expect(result.leveledUp).toBe(true);
    });
  });

  describe('migrateFromLocalStorage', () => {
    it('devrait migrer la progression de localStorage vers Firestore', async () => {
      const userId = 'migrated-user-789';
      const localData = {
        totalXP: 80,
        userLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        levelStats: { 1: { correct: 5, incorrect: 1, xp: 80 } },
        stats: {
          totalExercises: 6,
          correctAnswers: 5,
          incorrectAnswers: 1
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
          totalXP: 80
        })
      );

      // Vérifier que localStorage a été nettoyé
      expect(localStorage.getItem('userProgress')).toBeNull();
    });

    it('devrait merger localStorage avec Firestore existant', async () => {
      const userId = 'existing-user-999';
      const localData = {
        totalXP: 50,
        userLevel: 1,
        completedLevels: [1],
        levelStats: { 1: { correct: 5, incorrect: 0, xp: 50 } }
      };

      const firestoreData = {
        userId,
        totalXP: 30,
        userLevel: 1,
        completedLevels: [],
        levelStats: {}
      };

      localStorage.setItem('userProgress', JSON.stringify(localData));

      const mockDocRef = { id: 'progress/existing-user-999' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => firestoreData
      });
      updateDoc.mockResolvedValue(undefined);

      const result = await migrateFromLocalStorage(userId);

      // Devrait appeler updateDoc pour merger les données (pas setDoc)
      expect(updateDoc).toHaveBeenCalled();
      // localStorage nettoyé après migration
      expect(localStorage.getItem('userProgress')).toBeNull();
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
