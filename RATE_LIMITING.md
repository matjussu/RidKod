# 🛡️ Rate Limiting Implementation - ReadCod

## 📊 RÉSUMÉ

Protection contre le spam et l'abus des quotas Firebase en limitant le nombre d'opérations par utilisateur.

**Implémenté** : Client-side rate limiting (Approche A)
**Futur** : Server-side Cloud Functions (Approche B)

---

## ✅ APPROCHE A : Client-Side Rate Limiting (IMPLÉMENTÉ)

### Configuration actuelle

#### 1. Exercices Training
```javascript
// src/utils/throttle.js
export const exerciseRateLimiter = createRateLimiter(30, 60000);
```

**Limite** : 30 exercices par minute (1 toutes les 2 secondes)

**Pourquoi cette limite** :
- Un utilisateur normal fait 1 exercice toutes les 10-30 secondes
- 30/minute permet la fluidité sans bloquer l'usage légitime
- Protège contre le spam automatisé (bots cliquant rapidement)

**Impact si dépassé** :
```
Error: "Trop d'exercices complétés trop rapidement. Attendez X secondes."
```

---

#### 2. Leçons
```javascript
export const lessonRateLimiter = createRateLimiter(60, 60000);
```

**Limite** : 60 actions par minute (1 par seconde)

**Pourquoi plus permissif** :
- Navigation rapide entre sections de leçons
- Lecture de code ne consomme pas de quotas critiques
- Meilleure UX pour parcourir les chapitres

---

#### 3. Signup (Préparé mais non utilisé)
```javascript
export const signupRateLimiter = createRateLimiter(3, 3600000);
```

**Limite** : 3 signups par heure

**Usage futur** : Protéger Firebase Auth contre création de comptes en masse

---

### Implémentation dans ProgressContext

**Ligne 74-87** (completeExercise)
```javascript
const completeExercise = async (exerciseData) => {
  // Rate limiting check
  const userId = user?.uid || 'guest';
  if (!exerciseRateLimiter.check(userId)) {
    const timeUntilReset = exerciseRateLimiter.getTimeUntilReset(userId);
    const secondsRemaining = Math.ceil(timeUntilReset / 1000);

    throw new Error(
      `Trop d'exercices complétés trop rapidement. Attendez ${secondsRemaining} secondes.`
    );
  }

  // ... reste du code
};
```

**Ligne 274-287** (updateProgress)
```javascript
const updateProgress = async (updatedFields) => {
  // Rate limiting leçons
  const userId = user?.uid || 'guest';
  if (!lessonRateLimiter.check(userId)) {
    const timeUntilReset = lessonRateLimiter.getTimeUntilReset(userId);
    throw new Error(`Trop d'actions trop rapidement. Attendez ${secondsRemaining}s.`);
  }

  // ... reste du code
};
```

---

## 🔧 UTILITIES (src/utils/throttle.js)

### 1. throttle()
Limite la fréquence d'exécution d'une fonction.

**Exemple** :
```javascript
const saveData = throttle(actualSaveFunction, 1000);
saveData(); // Exécuté
saveData(); // Ignoré (< 1s)
setTimeout(() => saveData(), 1100); // Exécuté
```

**Usage** : Limiter appels API, scroll handlers, resize events

---

### 2. debounce()
Attend que l'utilisateur arrête d'appeler avant d'exécuter.

**Exemple** :
```javascript
const search = debounce(performSearch, 500);
// L'utilisateur tape...
search(); // Planifié
search(); // Replanifié (annule le précédent)
// Exécuté 500ms après la dernière frappe
```

**Usage** : Search bars, auto-save, form validation

---

### 3. createRateLimiter()
Gestionnaire de quotas par fenêtre glissante.

**API** :
```javascript
const limiter = createRateLimiter(maxCalls, windowMs);

limiter.check(userId);              // true/false
limiter.getRemaining(userId);       // Appels restants
limiter.getTimeUntilReset(userId);  // Temps en ms avant reset
limiter.reset(userId);              // Reset manuel
```

**Exemple** :
```javascript
const apiLimiter = createRateLimiter(100, 3600000); // 100 req/heure

if (apiLimiter.check('user123')) {
  await callAPI();
} else {
  const remaining = apiLimiter.getRemaining('user123');
  console.log(`Quota épuisé. Réessayer dans ${remaining}ms`);
}
```

---

## 📊 MÉTRIQUES & MONITORING

### Quotas Firebase Spark Plan (Gratuit)
- **Firestore Reads** : 50,000/jour
- **Firestore Writes** : 20,000/jour
- **Auth Sign-ins** : 10,000/mois

### Scénario sans rate limiting
**1000 users × 50 exercices/jour (bot attack)** :
- Writes : 50,000/jour ❌ Dépasse quota (20K)
- Coût dépassement : $0.18/10K writes = **$5.40/jour**

### Scénario avec rate limiting
**1000 users × 30 exercices max/heure** :
- Writes : 30,000/jour ⚠️ Toujours au-dessus
- Mais impossible de spammer rapidement
- Utilisateurs légitimes non affectés

**Vrai protection** : Cloud Functions (Approche B)

---

## 🚨 LIMITATIONS APPROCHE CLIENT-SIDE

### ❌ Contournable
- Utilisateur peut ouvrir DevTools → Application → Clear Storage
- Supprime le rate limiter stocké en mémoire
- Recharge page = reset compteur

### ❌ Par appareil, pas par utilisateur
- Mode invité : rate limit sur l'appareil
- Mode connecté : rate limit sur userId
- Un utilisateur peut se déconnecter/reconnecter pour bypass

### ❌ Pas de synchronisation multi-tabs
- Chaque onglet a son propre compteur
- Un bot peut ouvrir 10 tabs = 10x limite

---

## 🔐 APPROCHE B : Server-Side Cloud Functions (FUTUR)

### Architecture recommandée

#### 1. Cloud Function proxy
**functions/index.js** :
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Rate limiter serveur avec Redis ou Firestore
const rateLimit = require('express-rate-limit');

exports.completeExercise = functions.https.onCall(async (data, context) => {
  // Vérifier authentification
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilisateur non connecté');
  }

  const userId = context.auth.uid;

  // Rate limiting serveur (stocké dans Firestore)
  const rateLimitDoc = await admin.firestore()
    .collection('rateLimits')
    .doc(userId)
    .get();

  const now = Date.now();
  const rateLimit = rateLimitDoc.data() || { count: 0, resetAt: now + 60000 };

  // Vérifier limite
  if (now < rateLimit.resetAt && rateLimit.count >= 30) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Rate limit dépassé. Réessayez dans 1 minute.'
    );
  }

  // Réinitialiser compteur si fenêtre expirée
  if (now >= rateLimit.resetAt) {
    rateLimit.count = 0;
    rateLimit.resetAt = now + 60000;
  }

  // Incrémenter compteur
  rateLimit.count += 1;
  await admin.firestore()
    .collection('rateLimits')
    .doc(userId)
    .set(rateLimit);

  // Traiter l'exercice
  const { exerciseData } = data;
  // ... logique métier

  return { success: true, xpGained: 10 };
});
```

#### 2. Client appelle Cloud Function
**src/services/progressService.js** :
```javascript
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export const saveExerciseCompletion = async (userId, exerciseData) => {
  const completeExercise = httpsCallable(functions, 'completeExercise');

  try {
    const result = await completeExercise({ exerciseData });
    return result.data;
  } catch (error) {
    if (error.code === 'functions/resource-exhausted') {
      throw new Error('Rate limit dépassé');
    }
    throw error;
  }
};
```

---

### Avantages Approche B

✅ **Impossible à contourner** (logique serveur)
✅ **Rate limit par utilisateur global** (multi-appareil)
✅ **Logs centralisés** (Firebase Console)
✅ **IP banning** (Firestore + Cloud Functions)
✅ **Flexible** (changer limites sans redéployer app)

### Inconvénients

❌ **Requiert Blaze plan** (pay-as-you-go, ~$0.40/million invocations)
❌ **Latence +50-100ms** (appel Cloud Function)
❌ **Complexité** (setup, déploiement, monitoring)
❌ **Coût** (~$10-20/mois pour 1000 users actifs)

---

## 🎯 RECOMMANDATIONS

### Pour MVP (0-1000 users)
✅ **Approche A actuelle suffit**
- Protège contre spam basique
- Pas de coût
- UX instantanée

**Actions** :
- Monitorer quotas Firebase Console
- Ajouter alertes (50% quota utilisé)

---

### Pour Production (1000-10000 users)
⚠️ **Migrer vers Approche B**

**Trigger** :
- Quota Firestore dépassé régulièrement
- Détection d'abus (DevTools bypass)
- Coût dépassement > $20/mois

**Migration** :
1. Upgrade Blaze plan
2. Déployer Cloud Functions
3. Migrer logique progressService
4. Tester en staging
5. Rollout progressif (10% users → 100%)

---

### Pour Scale (10000+ users)
🚀 **Architecture complète**

**Stack** :
- Cloud Functions + Redis (rate limiting ultra-rapide)
- Cloud Firestore triggers (audit trail)
- BigQuery (analytics abus)
- Cloud Armor (DDoS protection)

**Budget estimé** : $100-500/mois

---

## 📚 FICHIERS MODIFIÉS

### Nouveaux fichiers
- **src/utils/throttle.js** (155 lignes) - Utilities rate limiting

### Fichiers modifiés
- **src/context/ProgressContext.jsx**
  - Ligne 15 : Import throttle utils
  - Ligne 74-87 : Rate limiting exercices
  - Ligne 274-287 : Rate limiting leçons

---

## ✅ TESTS MANUELS

### Test 1 : Rate limit exercices
```javascript
// Ouvrir DevTools Console
for (let i = 0; i < 35; i++) {
  completeExercise({ exerciseLevel: 1, isCorrect: true, xpGained: 10 });
}
// Attendu : Les 30 premiers passent, 5 derniers rejetés
```

### Test 2 : Reset après 1 minute
```javascript
// Attendre 60 secondes
setTimeout(() => {
  completeExercise({ exerciseLevel: 1, isCorrect: true, xpGained: 10 });
  // Attendu : OK (compteur reset)
}, 61000);
```

### Test 3 : Multi-utilisateurs
```javascript
// User A
completeExercise(); // OK

// User B (autre compte)
completeExercise(); // OK (compteur séparé)
```

---

## 🐛 EDGE CASES

### 1. Page refresh
**Comportement** : Rate limiter stocké en mémoire → reset au refresh
**Impact** : Utilisateur peut bypass en rechargeant
**Mitigation** : Approche B (serveur)

### 2. Mode invité
**Comportement** : Rate limit sur "guest" (partagé entre tous invités)
**Impact** : Un invité spammant bloque les autres
**Fix** : Générer ID unique par session
```javascript
const guestId = sessionStorage.getItem('guestId') || crypto.randomUUID();
sessionStorage.setItem('guestId', guestId);
```

### 3. Erreur réseau
**Comportement** : Rate limit consommé même si requête échoue
**Impact** : Utilisateur pénalisé pour erreurs serveur
**Fix** : Ne décrémenter que si succès
```javascript
try {
  const result = await saveExerciseCompletion(...);
  return result;
} catch (error) {
  // Recréditer l'appel
  exerciseRateLimiter.getRemaining(userId); // +1
  throw error;
}
```

---

## 📊 MONITORING (À implémenter)

### Métriques à tracker

1. **Taux de rejection**
   ```javascript
   Analytics.logEvent('rate_limit_hit', {
     userId: userId,
     limit_type: 'exercise',
     remaining_time: secondsRemaining
   });
   ```

2. **Utilisateurs abusifs**
   ```javascript
   if (rejectionCount > 5) {
     Analytics.logEvent('potential_abuse', { userId });
   }
   ```

3. **Quota Firebase**
   - Firebase Console → Usage
   - Email alerts si >80%

---

## 🔧 CONFIGURATION AVANCÉE

### Ajuster limites par niveau utilisateur

```javascript
const getExerciseLimit = (userLevel) => {
  if (userLevel >= 10) return 60; // Users avancés
  if (userLevel >= 5) return 45;
  return 30; // Débutants
};

// Dans completeExercise()
const limit = getExerciseLimit(progress.userLevel);
const customLimiter = createRateLimiter(limit, 60000);
```

### Weekend mode (limites relâchées)

```javascript
const isWeekend = () => {
  const day = new Date().getDay();
  return day === 0 || day === 6; // Dimanche ou Samedi
};

const exerciseLimit = isWeekend() ? 60 : 30;
```

---

**Dernière mise à jour** : 10 janvier 2025
**Status** : ✅ Approche A implémentée - Approche B documentée
