// Mock Firebase pour les tests
import { vi } from 'vitest';

// Mock Firebase Auth
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: vi.fn(),
};

export const mockDb = {
  collection: vi.fn(),
  doc: vi.fn(),
};

// Mock Firebase Auth functions
export const createUserWithEmailAndPassword = vi.fn();
export const signInWithEmailAndPassword = vi.fn();
export const signOut = vi.fn();
export const onAuthStateChanged = vi.fn();

// Mock Firestore functions
export const getDoc = vi.fn();
export const setDoc = vi.fn();
export const updateDoc = vi.fn();
export const doc = vi.fn();
export const serverTimestamp = vi.fn(() => new Date());
