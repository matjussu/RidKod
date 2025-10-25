# 🔥 Configuration Firebase pour ReadCod

Ce guide explique comment configurer Firebase Authentication pour ReadCod.

---

## 📋 Étapes de configuration

### 1️⃣ Créer un projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Cliquer sur **"Ajouter un projet"**
3. Nommer le projet (ex: `readcod-app`)
4. Désactiver Google Analytics (optionnel pour MVP)
5. Cliquer sur **"Créer le projet"**

---

### 2️⃣ Activer l'authentification Email/Password

1. Dans Firebase Console, aller dans **"Authentication"** (menu gauche)
2. Cliquer sur **"Commencer"**
3. Dans l'onglet **"Sign-in method"**, cliquer sur **"Email/Password"**
4. **Activer** "Email/Password"
5. **Désactiver** "Lien par e-mail (connexion sans mot de passe)" pour le MVP
6. Cliquer sur **"Enregistrer"**

---

### 3️⃣ Créer une application Web

1. Dans Firebase Console, cliquer sur l'icône **Web** (`</>`) dans la page d'accueil
2. Enregistrer l'application avec un nom (ex: `ReadCod Web App`)
3. **Ne pas** cocher "Configurer Firebase Hosting" pour l'instant
4. Cliquer sur **"Enregistrer l'application"**

---

### 4️⃣ Récupérer les clés de configuration

1. Dans Firebase Console, aller dans **"Paramètres du projet"** (icône engrenage en haut à gauche)
2. Scroller jusqu'à **"Vos applications"** > **"SDK Configuration"**
3. Copier les valeurs suivantes :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "readcod-app.firebaseapp.com",
  projectId: "readcod-app",
  storageBucket: "readcod-app.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

---

### 5️⃣ Configurer les variables d'environnement

1. Ouvrir le fichier `.env` à la racine du projet
2. Remplacer les valeurs par celles copiées :

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=readcod-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=readcod-app
VITE_FIREBASE_STORAGE_BUCKET=readcod-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

3. **Sauvegarder** le fichier `.env`

> ⚠️ **Important** : Le fichier `.env` est dans `.gitignore` et ne sera **jamais** commité sur Git pour des raisons de sécurité.

---

### 6️⃣ (Optionnel) Configurer Firestore Database

Si tu veux sauvegarder la progression utilisateur dans une base de données :

1. Dans Firebase Console, aller dans **"Firestore Database"**
2. Cliquer sur **"Créer une base de données"**
3. Choisir le mode **"Test"** pour commencer (⚠️ À changer en production !)
4. Sélectionner une région (ex: `europe-west1`)
5. Cliquer sur **"Activer"**

**Règles de sécurité de base** (à mettre à jour dans l'onglet "Règles") :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs peuvent lire/écrire uniquement leurs propres données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Progression utilisateur
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 Tester l'authentification

1. Démarrer le serveur de développement :
```bash
npm run dev
```

2. Ouvrir l'application dans le navigateur (généralement `http://localhost:5173`)

3. Tester les fonctionnalités :
   - ✅ Page Welcome affichée au premier lancement
   - ✅ Créer un compte avec email/password
   - ✅ Se connecter avec le compte créé
   - ✅ Voir le statut "Connecté" sur la page Home
   - ✅ Se déconnecter
   - ✅ "Continuer sans compte" (mode invité)

---

## 🐛 Dépannage

### Erreur : "Firebase: Error (auth/invalid-api-key)"
➡️ Vérifier que les clés dans `.env` correspondent exactement à celles de Firebase Console

### Erreur : "Firebase: Error (auth/operation-not-allowed)"
➡️ Vérifier que "Email/Password" est bien activé dans Firebase Console > Authentication > Sign-in method

### Le `.env` n'est pas lu
➡️ Redémarrer le serveur Vite (`npm run dev`) après avoir modifié `.env`

### Les modifications ne s'appliquent pas
➡️ Vider le cache du navigateur et recharger la page (Cmd+Shift+R sur Mac, Ctrl+Shift+R sur Windows)

---

## 📚 Ressources

- [Documentation Firebase Authentication](https://firebase.google.com/docs/auth)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Pricing Firebase](https://firebase.google.com/pricing) (Gratuit jusqu'à 10k utilisateurs)

---

## 🔒 Sécurité

**À faire avant la mise en production :**

1. ✅ Passer Firestore en mode **"Production"** avec règles strictes
2. ✅ Configurer les domaines autorisés dans Firebase Console > Authentication > Settings
3. ✅ Activer la vérification par email (optionnel)
4. ✅ Configurer App Check pour protéger contre les abus
5. ✅ Mettre en place un système de rate limiting

---

**Configuration terminée ! 🎉**

Tu peux maintenant utiliser l'authentification Firebase dans ReadCod.
