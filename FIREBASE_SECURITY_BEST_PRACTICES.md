# 🔒 Firebase Security Best Practices - ReadCod

## ✅ SÉCURITÉ IMPLÉMENTÉE

### 1. Variables d'environnement sécurisées

**Avant** ❌
```javascript
// Clés exposées en dur dans firebase.js
apiKey: "AIzaSyBwZAOBTohWBtOb0KsbrMdf_PtLe1TbNYo"
```

**Après** ✅
```javascript
// Clés chargées depuis .env
apiKey: import.meta.env.VITE_FIREBASE_API_KEY
```

**Fichiers modifiés** :
- [src/config/firebase.js](src/config/firebase.js) - Validation automatique des variables
- [.env](.env) - Variables Firebase (gitignored)
- [.env.example](.env.example) - Template pour autres développeurs

---

## 🛡️ CONFIGURATION FIREBASE CONSOLE (À FAIRE)

### Étape 1 : Restreindre les domaines autorisés

1. Aller sur [Firebase Console](https://console.firebase.google.com/project/readkode/settings/general)
2. **Authentication** → **Settings** → **Authorized domains**
3. Ajouter UNIQUEMENT :
   ```
   localhost (développement)
   readkode.firebaseapp.com
   votre-domaine-vercel.vercel.app
   readcod.app (si domaine custom)
   ```
4. Supprimer tous les autres domaines

**Impact** : Empêche l'utilisation de vos clés depuis d'autres domaines

---

### Étape 2 : Restreindre les API Keys

1. **Google Cloud Console** → [API & Services → Credentials](https://console.cloud.google.com/apis/credentials?project=readkode)
2. Cliquer sur votre API Key (Browser key)
3. **Application restrictions** :
   - Sélectionner "HTTP referrers"
   - Ajouter :
     ```
     http://localhost:*/*
     https://readkode.firebaseapp.com/*
     https://*.vercel.app/*
     https://readcod.app/* (si applicable)
     ```
4. **API restrictions** :
   - Sélectionner "Restrict key"
   - Activer UNIQUEMENT :
     - Identity Toolkit API
     - Cloud Firestore API
     - Firebase Authentication API

**Impact** : Limite l'utilisation de la clé API uniquement aux services nécessaires

---

### Étape 3 : App Check (Recommandé pour production)

Firebase App Check protège contre les bots et l'abus d'API.

1. **Firebase Console** → **App Check**
2. Enregistrer votre app web
3. Choisir un provider :
   - **reCAPTCHA v3** (recommandé pour web)
   - **reCAPTCHA Enterprise** (production à large échelle)
4. Activer l'enforcement pour :
   - Authentication
   - Firestore

**Code à ajouter** (src/config/firebase.js) :
```javascript
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

---

## 🚨 FIRESTORE SECURITY RULES (Déjà déployées)

Vos règles Firestore sont excellentes et déjà en production :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny
    match /{document=**} {
      allow read, write: false;
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.username is string
                    && request.resource.data.username.size() >= 3
                    && request.resource.data.username.size() <= 15;
      allow update: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.email == resource.data.email;
      allow delete: if false; // Jamais supprimer
    }

    // Progress collection
    match /progress/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create, update: if request.auth != null
                            && request.auth.uid == userId
                            && request.resource.data.totalXP >= 0
                            && request.resource.data.userLevel >= 1
                            && request.resource.data.userLevel <= 10;
      allow delete: if false;
    }
  }
}
```

**Points forts** :
- ✅ Zero trust (deny par défaut)
- ✅ Lecture/écriture uniquement sur ses propres données
- ✅ Validation côté serveur (tailles, types, ranges)
- ✅ Email immutable (pas de changement)
- ✅ Pas de suppression (historique préservé)

---

## 📊 MONITORING & ALERTES (À configurer)

### 1. Quotas et limites Firebase

Configurer des alertes dans Firebase Console :

1. **Usage and Billing** → **Details & settings**
2. **Set budget alerts** :
   - Reads : 50,000/jour (gratuit = 50K/jour)
   - Writes : 20,000/jour (gratuit = 20K/jour)
   - Deletes : 5,000/jour (gratuit = 20K/jour)

**Email d'alerte** : votre-email@example.com

---

### 2. Anomaly Detection

Activer les alertes pour :
- Pic de reads/writes (>200% de la moyenne)
- Erreurs authentication répétées (>10/minute)
- Nouvelles IP géographiques suspectes

**Outils** :
- Firebase Console → Analytics → Events
- Google Cloud Monitoring → Alerting

---

## 🔐 CHECKLIST SÉCURITÉ PRODUCTION

Avant de lancer en production, vérifier :

### Configuration Firebase
- [ ] ✅ Variables .env configurées (déjà fait)
- [ ] ✅ .env dans .gitignore (déjà fait)
- [ ] ⚠️ Domaines autorisés restreints (Firebase Console)
- [ ] ⚠️ API Key restrictions configurées (Google Cloud Console)
- [ ] ❌ App Check activé (reCAPTCHA v3)

### Firestore
- [ ] ✅ Security Rules déployées (déjà fait)
- [ ] ✅ Indexes optimisés (déjà fait)
- [ ] ⚠️ Budget alerts configurées
- [ ] ❌ Backup automatique activé

### Authentification
- [ ] ✅ Email/Password activé (déjà fait)
- [ ] ❌ Password reset fonctionnel (à implémenter)
- [ ] ❌ Rate limiting sur signup (Cloud Functions)
- [ ] ❌ Email verification obligatoire (optionnel)

### Monitoring
- [ ] ❌ Google Analytics configuré
- [ ] ❌ Sentry error tracking
- [ ] ❌ Logs Cloud Functions (si utilisées)

---

## 🚀 ACTIONS PRIORITAIRES

### Haute priorité (À faire maintenant)

1. **Restreindre domaines autorisés** (5 min)
   - Firebase Console → Authentication → Settings
   - Supprimer tous sauf localhost + vos domaines

2. **Restreindre API Key** (5 min)
   - Google Cloud Console → Credentials
   - Limiter aux HTTP referrers + APIs nécessaires

### Moyenne priorité (Avant production)

3. **Activer App Check** (30 min)
   - Configurer reCAPTCHA v3
   - Tester en dev avant d'activer enforcement

4. **Configurer alertes budget** (10 min)
   - Éviter dépassement quotas gratuits

### Basse priorité (Nice to have)

5. **Email verification** (2h)
   - Forcer vérification email avant accès complet

6. **Rate limiting** (voir TÂCHE 3)
   - Cloud Functions pour limiter spam

---

## 📚 RESSOURCES

- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
- [App Check Documentation](https://firebase.google.com/docs/app-check)
- [Security Checklist](https://firebase.google.com/support/guides/security-checklist)
- [Best Practices](https://firebase.google.com/docs/rules/best-practices)

---

**Dernière mise à jour** : 10 janvier 2025
**Status** : ✅ Variables sécurisées - ⚠️ Configuration Firebase Console à faire
