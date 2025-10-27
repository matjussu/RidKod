# 🐛 DEBUG FIRESTORE - Problème Sauvegarde Données

## 📋 SYMPTÔMES

1. **Profile.jsx affiche "Niveau NaN"** ✅ CORRIGÉ
   - Cause : `stats.level` au lieu de `stats.userLevel`
   - Fix : Ligne 394 et 403 de Profile.jsx

2. **XP gagnés affiche "+30" au lieu de "+100"**
   - Attendu : 10 exercices × 10 XP = 100 XP par niveau
   - Reçu : Seulement 30 XP
   - **À investiguer**

3. **Stats incorrectes sur LevelComplete**
   - Correct: 3, Incorrect: 7 (total = 10 ✅)
   - Mais l'utilisateur a dit avoir fait 2 niveaux = 20 exercices
   - **Stats du 1er niveau perdues ?**

4. **AUCUNE DONNÉE dans Firestore** ❌ CRITIQUE
   - User créé dans Authentication ✅
   - Mais `/progress/{userId}` vide dans Firestore ❌

---

## 🔍 HYPOTHÈSES

### Hypothèse 1 : Règles Firestore trop restrictives
```javascript
// Règles possibles qui bloquent les écritures :
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ❌ Bloque tout
    }
  }
}
```

**Action** : Vérifier les règles dans Firebase Console
- https://console.firebase.google.com
- Firestore Database → Rules
- Doit autoriser lecture/écriture pour utilisateurs authentifiés

### Hypothèse 2 : Firebase pas initialisé correctement
- Variables d'environnement manquantes ?
- `db` importé mais `undefined` ?

**Action** : Vérifier logs console navigateur
```bash
# Devrait afficher :
🔥 Firebase Config: { apiKey: 'AIzaSy...', projectId: '...' }
```

### Hypothèse 3 : Erreurs silencieuses
- `try/catch` attrape les erreurs mais ne les affiche pas ?
- User pas authentifié donc mode local ?

**Action** : Vérifier logs console avec nouveaux logs debug ajoutés

---

## 🧪 TESTS À EFFECTUER

### Test 1 : Vérifier authentification
```javascript
// Dans console navigateur :
console.log('User:', auth.currentUser);
// Si null → pas authentifié → mode localStorage
```

### Test 2 : Vérifier Firestore initialisé
```javascript
// Dans console navigateur :
console.log('Firestore DB:', db);
// Si undefined → problème config Firebase
```

### Test 3 : Test écriture manuelle Firestore
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from './config/firebase';

await setDoc(doc(db, 'test', 'test123'), {
  message: 'Hello Firestore',
  timestamp: new Date()
});
// Si erreur → problème règles ou permissions
```

---

## 📝 LOGS AJOUTÉS

### progressService.js
- ✅ `saveExerciseCompletion()` : logs au début, pendant, et fin
- ✅ `completeLevelBlock()` : logs avant chaque étape
- ✅ Logs d'erreur avec stack trace

### À surveiller dans console :
```
📝 saveExerciseCompletion appelé: { userId: "...", exerciseData: {...} }
✅ Progression existante chargée: {...}
🔍 Données exercice: { exerciseLevel: 1, isCorrect: true, xpGained: 10 }
💾 Mise à jour Firestore: {...}
✅ Firestore mis à jour avec succès!
```

**Si ces logs n'apparaissent PAS** → fonction jamais appelée
**Si erreur avant "✅ Firestore mis à jour"** → problème permissions

---

## 🔧 SOLUTIONS POSSIBLES

### Solution 1 : Règles Firestore permissives (dev mode)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Solution 2 : Vérifier .env
```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=votre-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-project-id
VITE_FIREBASE_STORAGE_BUCKET=votre-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

### Solution 3 : Forcer mode dev Firestore
```javascript
// Dans firebase.js, temporairement :
import { connectFirestoreEmulator } from 'firebase/firestore';
connectFirestoreEmulator(db, 'localhost', 8080); // Mode émulateur
```

---

## 📊 PROCHAINES ÉTAPES

1. ✅ Ajouter logs debug (FAIT)
2. ⏳ Tester avec nouveau compte + console ouverte
3. ⏳ Copier logs console ici
4. ⏳ Vérifier règles Firestore dans Firebase Console
5. ⏳ Corriger permissions si nécessaire
6. ⏳ Résoudre calcul XP incorrect

---

**Date:** 27 octobre 2025
**Status:** 🔴 Investigation en cours
