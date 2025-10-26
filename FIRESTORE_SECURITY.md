# 🔒 Sécurité Firestore - ReadCod

## 📋 Vue d'ensemble

Ce guide explique comment configurer les règles de sécurité Firestore pour protéger les données utilisateur dans ReadCod.

**État actuel** : Firestore est implémenté côté code, mais les règles de sécurité doivent être configurées dans Firebase Console.

---

## 🎯 Structure Firestore

### Collection : `progress`

Chaque document représente la progression d'un utilisateur :

```
/progress/{userId}
  - userId: string
  - totalXP: number
  - level: number
  - completedExercises: array
    - exerciseId: string
    - language: string
    - difficulty: number
    - xpGained: number
    - completedAt: timestamp
    - attempts: number
    - isCorrect: boolean
  - streak: object
    - current: number
    - longest: number
    - lastActivityDate: timestamp
  - stats: object
    - totalExercises: number
    - correctAnswers: number
    - incorrectAnswers: number
  - createdAt: timestamp
  - updatedAt: timestamp
```

---

## 🛡️ Règles de Sécurité Recommandées

### 1. Configuration Firebase Console

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionner votre projet ReadCod
3. Aller dans **Firestore Database** > **Règles**
4. Copier-coller les règles ci-dessous

### 2. Règles Firestore (Production)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Collection de progression utilisateur
    match /progress/{userId} {
      // Autoriser la lecture uniquement si l'utilisateur lit SES propres données
      allow read: if request.auth != null && request.auth.uid == userId;

      // Autoriser la création uniquement si :
      // 1. L'utilisateur est authentifié
      // 2. Le document créé a le même userId que l'utilisateur
      // 3. Les champs obligatoires sont présents
      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.userId == userId
                    && request.resource.data.totalXP is number
                    && request.resource.data.level is number
                    && request.resource.data.completedExercises is list;

      // Autoriser la mise à jour uniquement si :
      // 1. L'utilisateur est authentifié
      // 2. L'utilisateur modifie SES propres données
      // 3. Le userId ne peut pas être modifié
      // 4. Validation basique des données
      allow update: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.userId == userId
                    && request.resource.data.totalXP >= 0
                    && request.resource.data.level >= 1
                    && request.resource.data.level <= 10;

      // Interdire la suppression (garder historique)
      allow delete: if false;
    }

    // Bloquer tout accès aux autres collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Règles de Développement (Test uniquement)

⚠️ **NE PAS UTILISER EN PRODUCTION** ⚠️

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Autoriser tout accès en lecture/écriture
      // À utiliser UNIQUEMENT pour tester le code
      allow read, write: if true;
    }
  }
}
```

---

## 🔐 Validation Avancée (Optionnel)

Pour une sécurité maximale, vous pouvez ajouter des validations plus strictes :

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Fonctions helper pour validation
    function isValidExercise(exercise) {
      return exercise.keys().hasAll(['exerciseId', 'language', 'difficulty', 'xpGained'])
             && exercise.difficulty >= 1
             && exercise.difficulty <= 3
             && exercise.xpGained >= 0
             && exercise.xpGained <= 30;
    }

    function isValidStats(stats) {
      return stats.keys().hasAll(['totalExercises', 'correctAnswers', 'incorrectAnswers'])
             && stats.totalExercises >= 0
             && stats.correctAnswers >= 0
             && stats.incorrectAnswers >= 0
             && stats.totalExercises == (stats.correctAnswers + stats.incorrectAnswers);
    }

    match /progress/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;

      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.userId == userId
                    && request.resource.data.totalXP >= 0
                    && request.resource.data.level >= 1
                    && request.resource.data.level <= 10
                    && isValidStats(request.resource.data.stats);

      allow update: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.userId == resource.data.userId
                    && request.resource.data.totalXP >= resource.data.totalXP
                    && request.resource.data.level >= resource.data.level
                    && request.resource.data.level <= 10
                    && isValidStats(request.resource.data.stats);

      allow delete: if false;
    }
  }
}
```

---

## 🚀 Déploiement des Règles

### Méthode 1 : Via Firebase Console (Recommandé)

1. Copier les règles ci-dessus
2. Aller sur [Firebase Console](https://console.firebase.google.com/)
3. **Firestore Database** > **Règles**
4. Coller les règles
5. Cliquer **Publier**

### Méthode 2 : Via Firebase CLI

1. Installer Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Se connecter :
```bash
firebase login
```

3. Initialiser Firestore :
```bash
firebase init firestore
```

4. Éditer `firestore.rules` avec les règles ci-dessus

5. Déployer :
```bash
firebase deploy --only firestore:rules
```

---

## ✅ Tester les Règles

### 1. Simulateur Firebase Console

1. Aller dans **Firestore** > **Règles** > **Onglet Simulateur**
2. Configurer :
   - **Simulator type** : `get` (lecture)
   - **Location** : `/progress/USER_ID_ICI`
   - **Authenticated** : ✅ Coché
   - **Provider** : Firebase
   - **UID** : `USER_ID_ICI` (même que dans le path)
3. Cliquer **Exécuter**
4. Devrait afficher : ✅ **Autorisé**

### 2. Test Négatif (Accès Refusé)

1. Même configuration mais avec :
   - **UID** : `different-user-id` (différent du path)
2. Devrait afficher : ❌ **Refusé**

---

## 🔍 Exemples de Requêtes

### ✅ Autorisé

```javascript
// Utilisateur lit SES propres données
const userId = auth.currentUser.uid;
const progressRef = doc(db, 'progress', userId);
const progressSnap = await getDoc(progressRef);
// ✅ Succès
```

```javascript
// Utilisateur crée SA progression
const userId = auth.currentUser.uid;
const progressRef = doc(db, 'progress', userId);
await setDoc(progressRef, {
  userId,
  totalXP: 0,
  level: 1,
  // ...
});
// ✅ Succès
```

### ❌ Refusé

```javascript
// Utilisateur essaie de lire données d'un autre utilisateur
const progressRef = doc(db, 'progress', 'autre-user-id');
const progressSnap = await getDoc(progressRef);
// ❌ Permission denied
```

```javascript
// Utilisateur non connecté essaie d'accéder
// (auth.currentUser === null)
const progressRef = doc(db, 'progress', 'some-user-id');
const progressSnap = await getDoc(progressRef);
// ❌ Permission denied
```

---

## 📊 Monitoring Sécurité

### 1. Alertes Firebase Console

- Aller dans **Firestore** > **Usage**
- Surveiller :
  - Nombre de lectures/écritures
  - Erreurs de permission
  - Requêtes rejetées

### 2. Logs d'Erreurs

Les erreurs de permission apparaissent dans la console navigateur :

```
FirebaseError: Missing or insufficient permissions.
```

Cela signifie que les règles bloquent l'accès (normal si utilisateur malveillant).

---

## 🛠️ Dépannage

### Problème : "Permission denied" pour utilisateur légitime

**Causes possibles** :
1. L'utilisateur n'est pas authentifié
2. Le `userId` dans le path ne correspond pas à `auth.uid`
3. Les règles ne sont pas publiées

**Solution** :
```javascript
// Vérifier l'authentification
console.log('User:', auth.currentUser);
console.log('UID:', auth.currentUser?.uid);

// Vérifier le path Firestore
const userId = auth.currentUser.uid;
const progressRef = doc(db, 'progress', userId); // ✅ Bon
// PAS doc(db, 'progress', 'hardcoded-id'); ❌ Mauvais
```

### Problème : Règles ne s'appliquent pas

**Solution** :
1. Vérifier que les règles sont bien publiées (bouton **Publier** dans Console)
2. Attendre 1-2 minutes pour propagation
3. Vider le cache navigateur (`Ctrl+Shift+R`)
4. Vérifier dans l'onglet **Règles** que la version est bien à jour

---

## 📚 Ressources

- [Documentation Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Guide des règles Firestore](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Tester les règles Firestore](https://firebase.google.com/docs/firestore/security/test-rules-emulator)

---

## ✨ Prochaines Étapes

1. ✅ Copier les règles de sécurité dans Firebase Console
2. ✅ Publier les règles
3. ✅ Tester avec le simulateur
4. ✅ Déployer l'app et tester en conditions réelles
5. ✅ Surveiller les logs d'erreurs pendant 1 semaine

**Status** : 🟢 Firestore implémenté - Règles de sécurité à configurer

---

**Dernière mise à jour** : 26 octobre 2025
**Version** : 1.0
