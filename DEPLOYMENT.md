# 🚀 Guide de Déploiement - ReadCod

Ce guide explique comment déployer ReadCod en production avec Firestore Security Rules, PWA et Vercel.

---

## 📋 Prérequis

### Outils nécessaires
- Node.js 18+ et npm
- Compte Firebase (gratuit)
- Compte Vercel (gratuit)
- Git configuré
- Firebase CLI : `npm install -g firebase-tools`

### Configuration locale
```bash
# Cloner le projet
git clone <repo-url>
cd RidKod

# Installer les dépendances
npm install

# Créer .env depuis .env.example
cp .env.example .env
# Puis éditer .env avec vos credentials Firebase
```

---

## 🔒 Étape 1 : Déployer Firestore Security Rules (CRITIQUE)

### 1.1 Authentification Firebase CLI

```bash
# Connexion à Firebase
firebase login

# Initialiser Firebase dans le projet (si pas déjà fait)
firebase init

# Sélectionner :
# - Firestore: Configure security rules and indexes files
# - Hosting (optionnel pour Firebase Hosting)
```

### 1.2 Déployer les règles de sécurité

```bash
# Déployer uniquement les règles Firestore
firebase deploy --only firestore:rules

# Vérifier dans Firebase Console
# https://console.firebase.google.com/
# > Firestore Database > Règles
```

### 1.3 Vérifier les règles (IMPORTANT)

Les règles Firestore actuelles protègent :
- ✅ Chaque utilisateur ne peut lire/écrire que SES propres données
- ✅ Validation des champs obligatoires (totalXP, level, completedExercises)
- ✅ Interdiction de suppression des données
- ✅ Blocage de toute autre collection non autorisée

**Test manuel** :
1. Ouvrir Firebase Console > Firestore Database
2. Essayer de lire un document d'un autre utilisateur → devrait être refusé
3. Essayer de créer un document sans authentification → devrait être refusé

---

## 📱 Étape 2 : Préparer PWA (Progressive Web App)

### 2.1 Vérifier la configuration

Les fichiers suivants ont été créés :
- ✅ `public/manifest.json` - Métadonnées PWA
- ✅ `vite.config.js` - Plugin PWA configuré avec Workbox
- ✅ `index.html` - Meta tags PWA et mobile

### 2.2 Créer les icônes PWA (REQUIS)

Le manifest.json référence des icônes dans `/public/icons/` :
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

**Créer les icônes** :
1. Partir du logo ReadCod (long_logo.png ou full_logo.png)
2. Utiliser un outil comme https://realfavicongenerator.net/ ou Photoshop
3. Exporter aux tailles requises
4. Placer dans `/public/icons/`

**Alternative rapide** :
```bash
# Copier le logo existant et redimensionner avec ImageMagick
mkdir -p public/icons
convert public/long_logo.png -resize 192x192 public/icons/icon-192x192.png
convert public/long_logo.png -resize 512x512 public/icons/icon-512x512.png
# Répéter pour toutes les tailles
```

### 2.3 Tester PWA localement

```bash
# Build de production
npm run build

# Preview du build
npm run preview

# Ouvrir http://localhost:4173
# Tester l'installation PWA (bouton "+" dans Chrome)
# Vérifier mode offline (DevTools > Application > Service Workers)
```

---

## ☁️ Étape 3 : Déployer sur Vercel

### 3.1 Créer un compte Vercel

1. Aller sur https://vercel.com
2. Se connecter avec GitHub/GitLab
3. Importer le repository ReadCod

### 3.2 Configuration Vercel

**Option A : Via Dashboard Vercel**

1. Cliquer sur "New Project"
2. Importer le repo Git
3. Vercel détecte automatiquement Vite (framework preset)
4. **Ajouter les variables d'environnement** :
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

5. Cliquer sur "Deploy"

**Option B : Via Vercel CLI**

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les prompts :
# - Set up and deploy? Yes
# - Which scope? <votre compte>
# - Link to existing project? No
# - Project name? readcod
# - Directory? ./
# - Override settings? No
```

### 3.3 Ajouter les variables d'environnement (CLI)

```bash
# Ajouter chaque variable
vercel env add VITE_FIREBASE_API_KEY
# Entrer la valeur quand demandé
# Sélectionner : Production, Preview, Development

# Répéter pour toutes les 7 variables Firebase
```

### 3.4 Redéployer avec les variables

```bash
# Trigger un nouveau déploiement
vercel --prod
```

---

## 🧪 Étape 4 : Tests Post-Déploiement

### 4.1 Tests fonctionnels

- [ ] **Navigation** : Toutes les pages se chargent correctement
- [ ] **Authentification** : Inscription, connexion, déconnexion
- [ ] **Exercices** :
  - Affichage exercices Easy/Medium/Hard
  - Validation réponses correctes/incorrectes
  - Navigation entre exercices
  - Feedback visuel (vert/rouge)
- [ ] **Progression** :
  - XP s'incrémente après exercice correct
  - Niveaux se débloquent (10 exercices = 1 niveau)
  - Stats dans Profile correctes
- [ ] **Firestore** :
  - Données sauvegardées dans cloud
  - Données persistent après déconnexion/reconnexion
  - Pas d'accès aux données d'autres utilisateurs

### 4.2 Tests PWA

- [ ] **Installation** :
  - Navigateur propose d'installer l'app
  - App s'installe et s'ouvre en standalone
  - Icône correcte sur home screen
- [ ] **Offline** :
  - Désactiver réseau dans DevTools
  - App continue de fonctionner (cache)
  - Exercices restent accessibles
- [ ] **Performance** :
  - Lighthouse score 90+ (Performance, PWA)
  - Service Worker actif (DevTools > Application)

### 4.3 Tests sécurité

```bash
# Test : Accès non authentifié (devrait échouer)
curl -X GET https://firestore.googleapis.com/v1/projects/YOUR_PROJECT/databases/(default)/documents/progress/test_user

# Test : Tentative modification données autre utilisateur (devrait échouer)
# Se connecter comme user A, essayer de modifier doc de user B dans Console
```

---

## 🔧 Étape 5 : Configuration Avancée (Optionnel)

### 5.1 Domaine personnalisé

**Vercel** :
1. Dashboard Vercel > Project Settings > Domains
2. Ajouter votre domaine (ex: readcod.app)
3. Configurer DNS avec CNAME vers `cname.vercel-dns.com`
4. Attendre propagation DNS (10-30 min)

### 5.2 Analytics

**Vercel Analytics** (gratuit) :
```bash
npm install @vercel/analytics

# Dans src/main.jsx
import { inject } from '@vercel/analytics';
inject();
```

**Firebase Analytics** (déjà configuré) :
- Voir statistiques dans Firebase Console > Analytics

### 5.3 Error Monitoring

**Sentry** (optionnel) :
```bash
npm install @sentry/react

# Configuration dans src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

---

## 🚨 Troubleshooting

### Problème : Build échoue sur Vercel

**Solution** :
```bash
# Vérifier build local
npm run build

# Si erreur : nettoyer et réinstaller
rm -rf node_modules dist
npm install
npm run build
```

### Problème : Variables d'environnement non chargées

**Solution** :
- Vérifier que toutes les variables commencent par `VITE_`
- Redéployer après ajout des variables : `vercel --prod`
- Vérifier dans Vercel Dashboard > Settings > Environment Variables

### Problème : Firestore permissions denied

**Solution** :
```bash
# Redéployer les règles
firebase deploy --only firestore:rules

# Vérifier dans Firebase Console que les règles sont actives
```

### Problème : PWA ne s'installe pas

**Solution** :
- Vérifier que l'app est servie en HTTPS (Vercel le fait automatiquement)
- Vérifier manifest.json dans DevTools > Application > Manifest
- Vérifier Service Worker dans DevTools > Application > Service Workers
- Tester dans Chrome/Edge (meilleur support PWA que Safari)

### Problème : Service Worker ne se met pas à jour

**Solution** :
```javascript
// Dans vite.config.js, changer skipWaiting à true
workbox: {
  skipWaiting: true, // Force mise à jour immédiate
  clientsClaim: true
}
```

---

## 📊 Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] ✅ Firestore Rules déployées et testées
- [ ] ✅ Toutes les variables d'environnement configurées sur Vercel
- [ ] ✅ Build Vercel réussi (statut vert)
- [ ] ✅ App accessible via URL Vercel (https://readcod.vercel.app)
- [ ] ✅ Authentification fonctionne (signup/login/logout)
- [ ] ✅ Exercices s'affichent et validation fonctionne
- [ ] ✅ XP et progression sauvegardés dans Firestore
- [ ] ✅ PWA installable sur mobile
- [ ] ✅ Service Worker actif (cache offline)
- [ ] ✅ Lighthouse score 90+ (Performance, PWA, Accessibility)
- [ ] ✅ Tests sécurité Firestore passés
- [ ] ✅ Git repository à jour avec toutes les modifications

---

## 📚 Ressources Utiles

- **Vercel Documentation** : https://vercel.com/docs
- **Firebase Documentation** : https://firebase.google.com/docs
- **Vite PWA Plugin** : https://vite-pwa-org.netlify.app/
- **Workbox (Service Worker)** : https://developers.google.com/web/tools/workbox
- **Lighthouse** : https://developers.google.com/web/tools/lighthouse

---

## 🆘 Support

En cas de problème :
1. Vérifier PRODUCTION_CHECKLIST.md
2. Consulter les logs Vercel : Dashboard > Deployments > Logs
3. Consulter les logs Firebase : Console > Firestore Database > Usage
4. Ouvrir une issue sur GitHub

---

**Dernière mise à jour** : 31 octobre 2025
**Version** : 1.0.0
**Status** : ✅ Prêt pour production
