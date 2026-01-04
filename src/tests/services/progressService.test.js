import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateLevel,
  getXPForNextLevel,
  saveProgressLocally,
  getLocalProgress
} from '../../services/progressService';

describe('progressService - Calculations', () => {
  describe('calculateLevel', () => {
    it('devrait retourner le niveau 1 pour 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(50)).toBe(1);
      expect(calculateLevel(99)).toBe(1);
    });

    it('devrait retourner le niveau 2 pour 100-249 XP', () => {
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(150)).toBe(2);
      expect(calculateLevel(249)).toBe(2);
    });

    it('devrait retourner le niveau 3 pour 250-499 XP', () => {
      expect(calculateLevel(250)).toBe(3);
      expect(calculateLevel(300)).toBe(3);
      expect(calculateLevel(499)).toBe(3);
    });

    it('devrait retourner le niveau 4 pour 500-999 XP', () => {
      expect(calculateLevel(500)).toBe(4);
      expect(calculateLevel(750)).toBe(4);
      expect(calculateLevel(999)).toBe(4);
    });

    it('devrait retourner le niveau 5 pour 1000-1999 XP', () => {
      expect(calculateLevel(1000)).toBe(5);
      expect(calculateLevel(1500)).toBe(5);
      expect(calculateLevel(1999)).toBe(5);
    });

    it('devrait retourner le niveau 6 pour 2000-3499 XP', () => {
      expect(calculateLevel(2000)).toBe(6);
      expect(calculateLevel(2750)).toBe(6);
      expect(calculateLevel(3499)).toBe(6);
    });

    it('devrait retourner le niveau 7 pour 3500-5499 XP', () => {
      expect(calculateLevel(3500)).toBe(7);
      expect(calculateLevel(4500)).toBe(7);
      expect(calculateLevel(5499)).toBe(7);
    });

    it('devrait retourner le niveau 8 pour 5500-7999 XP', () => {
      expect(calculateLevel(5500)).toBe(8);
      expect(calculateLevel(6750)).toBe(8);
      expect(calculateLevel(7999)).toBe(8);
    });

    it('devrait retourner le niveau 9 pour 8000-10999 XP', () => {
      expect(calculateLevel(8000)).toBe(9);
      expect(calculateLevel(9500)).toBe(9);
      expect(calculateLevel(10999)).toBe(9);
    });

    it('devrait retourner le niveau 10 pour 11000+ XP', () => {
      expect(calculateLevel(11000)).toBe(10);
      expect(calculateLevel(15000)).toBe(10);
      expect(calculateLevel(99999)).toBe(10);
    });
  });

  describe('getXPForNextLevel', () => {
    it('devrait retourner l\'XP requis pour chaque niveau', () => {
      expect(getXPForNextLevel(1)).toBe(100);
      expect(getXPForNextLevel(2)).toBe(250);
      expect(getXPForNextLevel(3)).toBe(500);
      expect(getXPForNextLevel(4)).toBe(1000);
      expect(getXPForNextLevel(5)).toBe(2000);
      expect(getXPForNextLevel(6)).toBe(3500);
      expect(getXPForNextLevel(7)).toBe(5500);
      expect(getXPForNextLevel(8)).toBe(8000);
      expect(getXPForNextLevel(9)).toBe(11000);
      expect(getXPForNextLevel(10)).toBe(15000);
    });

    it('devrait retourner 15000 pour les niveaux au-delà de 10', () => {
      expect(getXPForNextLevel(11)).toBe(15000);
      expect(getXPForNextLevel(100)).toBe(15000);
    });
  });
});

describe('progressService - LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveProgressLocally', () => {
    it('devrait sauvegarder la progression dans localStorage', () => {
      const progressData = {
        totalXP: 150,
        level: 2,
        completedExercises: ['py_easy_001'],
        streak: { current: 5, longest: 10 }
      };

      const result = saveProgressLocally(progressData);

      expect(result.totalXP).toBe(150);
      expect(result.level).toBe(2);
      expect(result.completedExercises).toEqual(['py_easy_001']);
      expect(result.updatedAt).toBeDefined();
    });

    it('devrait fusionner avec la progression existante', () => {
      // Première sauvegarde
      saveProgressLocally({ totalXP: 100, level: 1 });

      // Deuxième sauvegarde (mise à jour)
      const updated = saveProgressLocally({ totalXP: 150, level: 2 });

      expect(updated.totalXP).toBe(150);
      expect(updated.level).toBe(2);
    });

    it('devrait ajouter un timestamp updatedAt', () => {
      const result = saveProgressLocally({ totalXP: 50 });
      expect(result.updatedAt).toBeDefined();
      expect(typeof result.updatedAt).toBe('string');
    });
  });

  describe('getLocalProgress', () => {
    it('devrait retourner la progression par défaut si localStorage est vide', () => {
      const progress = getLocalProgress();

      expect(progress).toEqual({
        totalXP: 0,
        userLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        levelStats: {},
        lessonProgress: {},
        xpNodesCollected: {},
        bossCompleted: {},
        streak: { current: 0, longest: 0 },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 },
        dailyActivity: {}
      });
    });

    it('devrait retourner la progression sauvegardée', () => {
      const savedProgress = {
        totalXP: 250,
        level: 3,
        completedExercises: ['py_easy_001', 'py_easy_002'],
        streak: { current: 7, longest: 12 },
        stats: { totalExercises: 2, correctAnswers: 2, incorrectAnswers: 0 }
      };

      localStorage.setItem('userProgress', JSON.stringify(savedProgress));

      const progress = getLocalProgress();
      expect(progress.totalXP).toBe(250);
      expect(progress.level).toBe(3);
      expect(progress.completedExercises.length).toBe(2);
    });

    it('devrait gérer les données corrompues gracieusement', () => {
      localStorage.setItem('userProgress', 'invalid-json{{{');

      const progress = getLocalProgress();
      expect(progress).toEqual({
        totalXP: 0,
        userLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        levelStats: {},
        lessonProgress: {},
        xpNodesCollected: {},
        bossCompleted: {},
        streak: { current: 0, longest: 0 },
        stats: { totalExercises: 0, correctAnswers: 0, incorrectAnswers: 0 },
        dailyActivity: {}
      });
    });
  });
});

describe('progressService - Edge Cases', () => {
  it('calculateLevel devrait gérer les valeurs négatives', () => {
    expect(calculateLevel(-10)).toBe(1);
    expect(calculateLevel(-100)).toBe(1);
  });

  it('calculateLevel devrait gérer les très grandes valeurs', () => {
    expect(calculateLevel(999999)).toBe(10);
    expect(calculateLevel(Infinity)).toBe(10);
  });

  it('getXPForNextLevel devrait gérer les niveaux négatifs', () => {
    expect(getXPForNextLevel(-1)).toBe(15000);
    expect(getXPForNextLevel(0)).toBe(15000);
  });
});
