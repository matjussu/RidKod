# Guide de Test - Debounce Firestore Writes

## 📋 Vue d'ensemble

Ce guide explique comment tester le système de **debounce** et **batching** des écritures Firestore implémenté dans ReadCod.

**Objectif** : Réduire les écritures Firestore de **60%** en groupant les exercices complétés par batch.

---

## 🎯 Fonctionnalités à Tester

### 1. **Batching Automatique** (5 secondes)
- Exercices ajoutés à une queue localStorage
- Flush automatique après 5 secondes d'inactivité
- Agrégation par niveau d'exercice (ex: "1_1", "1_2")

### 2. **Calcul Optimiste**
- UI mise à jour immédiatement (pas d'attente Firestore)
- XP et niveau calculés localement
- Aucun lag ressenti par l'utilisateur

### 3. **Persistance Offline**
- Queue sauvegardée dans localStorage
- Récupération automatique au rechargement
- Traitement au prochain chargement si crash/offline

### 4. **Flush on Exit**
- Tentative de flush sur fermeture de page/tab
- Fallback sur localStorage si flush échoue
- Traitement garanti au prochain chargement

---

## 🧪 Tests Manuels

### Test 1 : Batching Automatique (5s)

**Objectif** : Vérifier que plusieurs exercices sont groupés en 1 écriture Firestore

**Étapes** :
1. Lancer l'app en mode dev : `npm run dev`
2. Se connecter avec un compte utilisateur
3. Démarrer un niveau d'exercices (ex: Easy niveau 1)
4. Compléter **5 exercices consécutifs rapidement** (< 5 secondes entre chaque)
5. Observer la console Chrome DevTools :
   ```
   📝 Exercice ajouté à la queue (1 en attente)
   📝 Exercice ajouté à la queue (2 en attente)
   📝 Exercice ajouté à la queue (3 en attente)
   📝 Exercice ajouté à la queue (4 en attente)
   📝 Exercice ajouté à la queue (5 en attente)
   ```
6. Attendre **5 secondes** sans toucher à rien
7. Observer le flush automatique :
   ```
   ✅ Batch écrit : 5 exercices (niveau 1_1)
   ✅ Flush réussi: 5 exercices → 1 écritures Firestore
   ```

**✅ Résultat attendu** :
- **5 exercices → 1 écriture Firestore** (au lieu de 5)
- **Réduction de 80%** des écritures

---

### Test 2 : Calcul Optimiste (UI Réactive)

**Objectif** : Vérifier que l'UI est mise à jour immédiatement sans attendre Firestore

**Étapes** :
1. Compléter un exercice
2. Observer la console :
   ```
   ⚡ Update optimiste: +10 XP (queue: 1)
   ```
3. Vérifier que l'XP est **immédiatement ajouté** dans la barre de progression (pas de lag)
4. Vérifier que le niveau utilisateur se met à jour instantanément

**✅ Résultat attendu** :
- UI réactive (< 50ms)
- Aucun loading spinner
- XP visible immédiatement

---

### Test 3 : Persistance Offline (localStorage)

**Objectif** : Vérifier que la queue survit à un rechargement/crash

**Étapes** :
1. Compléter 3 exercices rapidement
2. Observer la queue :
   ```
   📝 Exercice ajouté à la queue (3 en attente)
   ```
3. **AVANT le flush (< 5s)** :
   - Recharger la page (F5) ou fermer l'onglet
4. Rouvrir l'app et se reconnecter
5. Observer la console au chargement :
   ```
   📦 Queue détectée : 3 exercices en attente
   🔄 Traitement queue au chargement : 3 exercices en attente
   ✅ Queue traitée : 3 exercices → 1 écritures Firestore
   ```

**✅ Résultat attendu** :
- Queue persistée dans localStorage
- Traitement automatique au rechargement
- Aucune perte de données

---

### Test 4 : Flush on Exit (beforeunload)

**Objectif** : Vérifier que la queue est flushée à la fermeture de la page

**Étapes** :
1. Compléter 2 exercices rapidement
2. Observer la queue :
   ```
   📝 Exercice ajouté à la queue (2 en attente)
   ```
3. **Fermer immédiatement l'onglet/la fenêtre** (AVANT les 5 secondes)
4. Observer la console avant fermeture (si possible) :
   ```
   ⚠️ beforeunload: 2 exercices en attente - tentative flush...
   ✅ Queue flushée avant fermeture
   ```

**✅ Résultat attendu** :
- Tentative de flush avant fermeture
- Si flush échoue → queue reste dans localStorage (Test 3)

**Note** : `beforeunload` est **best-effort** (le navigateur peut bloquer les async). Si le flush échoue, la queue sera traitée au prochain chargement.

---

### Test 5 : Vérification Firestore (Console Firebase)

**Objectif** : Confirmer la réduction d'écritures dans Firestore

**Étapes** :
1. Ouvrir la **Firebase Console** : https://console.firebase.google.com
2. Aller dans **Firestore Database** → Collection `progress`
3. Activer les **logs en temps réel** (si disponible)
4. Compléter **10 exercices consécutifs** dans l'app (< 5s entre chaque)
5. Observer les écritures Firestore :
   - **SANS debounce** : 10 écritures
   - **AVEC debounce** : 1-2 écritures (selon timing)

**✅ Résultat attendu** :
- **Réduction de 60-80%** des écritures Firestore
- **Économie estimée : $8-10/mois** (à haute utilisation)

---

## 🔍 Debug Console (Chrome DevTools)

### Console Logs Clés

```javascript
// Enqueue (ajout à la queue)
📝 Exercice ajouté à la queue (X en attente)

// Update optimiste
⚡ Update optimiste: +10 XP (queue: X)

// Flush automatique (après 5s)
✅ Batch écrit : X exercices (niveau Y)
✅ Flush réussi: X exercices → Y écritures Firestore

// Flush beforeunload
⚠️ beforeunload: X exercices en attente - tentative flush...
✅ Queue flushée avant fermeture

// Traitement queue au chargement
📦 Queue détectée : X exercices en attente
🔄 Traitement queue au chargement : X exercices en attente
✅ Queue traitée : X exercices → Y écritures Firestore
```

### localStorage Inspection

Ouvrir **Application** → **Local Storage** → Chercher :
- `firestore_exercise_queue` : Queue d'exercices en attente (JSON array)

**Exemple de queue** :
```json
[
  {
    "userId": "abc123",
    "exerciseLevel": "1_1",
    "isCorrect": true,
    "xpGained": 10,
    "timestamp": 1704067200000
  },
  {
    "userId": "abc123",
    "exerciseLevel": "1_1",
    "isCorrect": false,
    "xpGained": 0,
    "timestamp": 1704067202000
  }
]
```

---

## 📊 Métriques de Performance

### Avant Debounce (Baseline)
- **10 exercices** = **10 écritures Firestore**
- Coût : ~$0.000002 par write × 10 = $0.00002
- Latence : 100-300ms par exercice (attente Firestore)

### Après Debounce (Optimisé)
- **10 exercices** = **1-2 écritures Firestore** (selon timing)
- Coût : ~$0.000002 × 2 = $0.000004 (**80% réduction**)
- Latence : < 50ms (calcul optimiste, pas d'attente)

### Gains Mensuels (Estimation)
Si l'utilisateur fait **1000 exercices/mois** :
- **Avant** : 1000 writes = $0.02/mois
- **Après** : 200 writes = $0.004/mois
- **Économie** : $0.016/mois par utilisateur

Avec **1000 utilisateurs actifs** :
- **Économie mensuelle** : **$16/mois**
- **Économie annuelle** : **$192/an**

---

## 🐛 Problèmes Connus & Solutions

### Problème 1 : Queue ne flush pas

**Symptômes** : Queue reste à X exercices après 5 secondes

**Solutions** :
1. Vérifier la console pour erreurs Firestore
2. Vérifier la connexion internet (offline = queue accumule)
3. Vérifier que l'utilisateur est bien authentifié

**Debug** :
```javascript
// Dans la console Chrome
import { getQueueSize } from './utils/debounce';
console.log('Queue size:', getQueueSize());
```

### Problème 2 : beforeunload ne flush pas

**Symptômes** : Queue reste en localStorage après fermeture

**Solutions** :
- **Normal** : `beforeunload` est best-effort (navigateur peut bloquer)
- La queue sera traitée au **prochain chargement** (Test 3)
- Aucune perte de données

### Problème 3 : Duplicate writes

**Symptômes** : 2 écritures Firestore pour le même batch

**Solutions** :
1. Vérifier qu'il n'y a pas de double appel `completeExercise`
2. Vérifier le rate limiting (throttle.js)
3. Vérifier la logique de flush (debounce.js ligne 110)

---

## ✅ Checklist de Validation

- [ ] **Test 1** : Batching automatique (5s) fonctionne
- [ ] **Test 2** : UI optimiste (< 50ms) fonctionne
- [ ] **Test 3** : Persistance localStorage fonctionne
- [ ] **Test 4** : Flush on exit fonctionne (best-effort)
- [ ] **Test 5** : Réduction Firestore writes confirmée (Firebase Console)
- [ ] Console logs corrects (pas d'erreurs)
- [ ] localStorage contient la queue
- [ ] Build production passe (`npm run build`)
- [ ] Tests unitaires passent (`npm test`)

---

## 🚀 Prochaines Étapes

Une fois le système de debounce validé, passer à :

**Phase 3.2 : Pre-tokenize Code Blocks** (2 jours)
- Tokenization au build time
- Réduction 90% du temps de render CodeBlock
- Gains : 50ms → 5ms par bloc de code

---

## 📚 Fichiers Modifiés

1. **src/utils/debounce.js** (NOUVEAU - 260 lignes)
   - ExerciseQueueManager class
   - Queue localStorage
   - Timer 5s + flush logic

2. **src/services/progressService.js** (MODIFIÉ)
   - `saveExerciseCompletionDebounced` (nouvelle fonction)
   - `writeBatchToFirestore` (batch writer)
   - `processQueueOnLoad` (traitement au chargement)

3. **src/context/ProgressContext.jsx** (MODIFIÉ)
   - `completeExercise` utilise debounced version
   - `useEffect` pour processQueueOnLoad
   - `useEffect` pour flush beforeunload

---

**Dernière mise à jour** : 17 janvier 2025
**Status** : ✅ Implémenté - En test
