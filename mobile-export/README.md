# ReadKode Mobile 📱

Application mobile React Native + Expo pour apprendre à **lire du code** (pas l'écrire).

Version mobile native de [RidKod](https://github.com/VOTRE_USERNAME/RidKod) avec support iOS et Android.

---

## 🎯 Vue d'ensemble

**ReadKode Mobile** est la version native de l'application web ReadCod. Cette app permet aux développeurs d'apprendre à lire et comprendre du code à travers des exercices interactifs.

### Différences avec la version Web

| Feature | Web (RidKod) | Mobile (ReadKode-Mobile) |
|---------|--------------|--------------------------|
| Framework | React + Vite | React Native + Expo |
| Navigation | React Router | React Navigation |
| Storage | localStorage | AsyncStorage |
| Styles | CSS | StyleSheet |
| Firebase | Web SDK | Native SDK |
| Distribution | Web (Vercel) | App Store + Google Play |
| Offline | PWA | Native support |

---

## 🛠️ Stack Technique

### Core
- **React Native** 0.76.5 - Framework mobile
- **Expo** ~52.0.0 - Toolchain et services
- **React** 19.0.0 - UI library

### Navigation & UI
- **@react-navigation/native** ^7.0.0 - Navigation
- **@react-navigation/stack** ^7.0.0 - Stack navigator
- **expo-haptics** ~14.0.0 - Vibrations natives

### Backend & Data
- **@react-native-firebase/app** ^21.0.0 - Firebase core
- **@react-native-firebase/auth** ^21.0.0 - Authentification
- **@react-native-firebase/firestore** ^21.0.0 - Base de données
- **@react-native-async-storage/async-storage** 1.23.1 - Stockage local

### Code Display
- **react-native-syntax-highlighter** ^2.1.0 - Coloration syntaxique

---

## 📁 Structure du Projet

```
ReadKode-Mobile/
├── App.js                        # Entry point principal
├── app.json                      # Configuration Expo
├── package.json                  # Dépendances
├── babel.config.js               # Configuration Babel
├── src/
│   ├── screens/                  # Écrans de l'app (5 écrans)
│   │   ├── HomeScreen.js         # Dashboard principal
│   │   ├── ExerciseScreen.js     # Interface exercice (POC) ✅
│   │   ├── ProfileScreen.js      # Profil utilisateur
│   │   ├── LoginScreen.js        # Connexion
│   │   └── SignupScreen.js       # Inscription
│   ├── navigation/               # Configuration navigation
│   │   └── AppNavigator.js       # Stack navigator
│   ├── contexts/                 # State management
│   │   └── AuthContext.jsx       # Context auth (adapté RN)
│   ├── services/                 # Logique métier (copié depuis RidKod)
│   │   ├── progressService.js    # Gestion progression
│   │   └── userService.js        # Gestion utilisateurs
│   ├── data/                     # Données exercices (copié depuis RidKod)
│   │   ├── exercises.json        # 50 exercices Python
│   │   └── lessons/              # Leçons Python
│   ├── config/                   # Configuration
│   │   └── firebase.js           # Firebase RN setup
│   ├── components/               # Composants UI (à implémenter)
│   ├── hooks/                    # Hooks custom
│   ├── utils/                    # Utilitaires
│   └── constants/                # Constantes
└── assets/                       # Images, icônes, fonts
```

---

## 🚀 Installation & Setup

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac uniquement) ou Android Studio
- Compte Expo (gratuit)

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE_USERNAME/ReadKode-Mobile.git
cd ReadKode-Mobile
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Firebase

**React Native Firebase nécessite une configuration native différente du web.**

#### iOS (GoogleService-Info.plist)

1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Créer/Ouvrir ton projet Firebase
3. Ajouter une app iOS
4. Télécharger `GoogleService-Info.plist`
5. Placer dans `ios/` (après `expo prebuild`)

#### Android (google-services.json)

1. Sur Firebase Console
2. Ajouter une app Android
3. Télécharger `google-services.json`
4. Placer dans `android/app/` (après `expo prebuild`)

### 4. Lancer l'app

```bash
# Développement avec Expo Go
npm start

# Scanner le QR code avec :
# - iOS : Caméra iPhone
# - Android : Expo Go app
```

```bash
# Build natif iOS (nécessite Mac)
expo prebuild
npm run ios

# Build natif Android
expo prebuild
npm run android
```

---

## 🎮 Features Implémentées

### ✅ Actuellement Disponible

1. **Écran Exercise (POC)** ✅
   - Chargement 10 exercices par difficulté
   - Support type `predict_output` avec options
   - États visuels (sélection, validation, feedback)
   - Progress bar 1-10
   - Haptic feedback natif
   - Explication après validation
   - Navigation auto vers exercice suivant

2. **Navigation** ✅
   - Stack Navigator avec 5 écrans
   - Transitions natives iOS/Android
   - Header customisé avec thème sombre

3. **Écrans de base** ✅
   - HomeScreen : Dashboard avec 4 menu cards
   - ProfileScreen : Stats utilisateur (placeholder)
   - LoginScreen : Formulaire connexion
   - SignupScreen : Inscription + avatar picker

4. **Authentification** ✅
   - AuthContext adapté pour React Native
   - Firebase Auth configuré (setup natif requis)
   - AsyncStorage pour persistance
   - Mode invité fonctionnel

5. **Data** ✅
   - 50 exercices Python copiés depuis RidKod
   - Leçons Python (11 chapitres JSON)
   - Services progressService et userService

### ⚠️ À Implémenter

1. **Types d'exercices** (2/4 types)
   - ✅ `predict_output` avec options
   - ❌ `free_input` avec CustomKeyboard
   - ❌ `clickable_lines` avec CodeBlock interactif
   - ❌ `concept_understanding`

2. **Firebase Firestore**
   - Services copiés mais pas testés
   - Nécessite configuration native
   - Sync progression cloud

3. **Composants manquants**
   - CustomKeyboard (clavier numérique)
   - CodeBlock clickable
   - LevelComplete modal
   - ActivityCalendar

4. **Pages complètes**
   - Leçons (3 écrans)
   - Challenges
   - AI Understanding

5. **Système progression**
   - Calcul XP/niveaux
   - Stats utilisateur
   - Streak tracking

---

## 🔥 Démarrage Rapide (5 min)

### Test POC Exercise

```bash
# 1. Install
npm install

# 2. Start
npm start

# 3. Scanner QR code avec Expo Go

# 4. Dans l'app :
#    - Cliquer "Entraînements" sur Home
#    - Faire un exercice Python facile
#    - Valider une réponse
#    - Observer feedback + haptic
```

---

## 📝 Migration Web → Mobile

### Code Réutilisable (40%)

Fichiers copiés directement depuis RidKod :

```bash
# Data (100% compatible)
src/data/exercises.json
src/data/lessons/

# Services (adaptable)
src/services/progressService.js
src/services/userService.js
```

### Code Adapté (30%)

Fichiers modifiés pour React Native :

```javascript
// localStorage → AsyncStorage
// Avant (Web)
localStorage.setItem('key', 'value');

// Après (Mobile)
await AsyncStorage.setItem('key', 'value');
```

```javascript
// Firebase Web SDK → React Native SDK
// Avant (Web)
import { getAuth } from 'firebase/auth';

// Après (Mobile)
import auth from '@react-native-firebase/auth';
```

### Code Réécrit (30%)

Interface UI complètement réécrite :

```jsx
// Avant (Web - CSS)
<div className="option-button">Click</div>

// Après (Mobile - StyleSheet)
<TouchableOpacity style={styles.option}>
  <Text>Click</Text>
</TouchableOpacity>
```

---

## 🐛 Issues Connues

1. **Firebase Native Config** ⚠️
   - Nécessite `GoogleService-Info.plist` (iOS)
   - Nécessite `google-services.json` (Android)
   - Sans ces fichiers, auth ne fonctionnera pas

2. **Syntax Highlighting** ⚠️
   - `react-native-syntax-highlighter` peut être lent
   - Envisager custom solution avec `Text` + couleurs

3. **Exercices partiels** ⚠️
   - Seulement `predict_output` implémenté
   - `free_input` et `clickable_lines` TODO

4. **Services non testés** ⚠️
   - progressService et userService copiés mais pas validés
   - Firestore sync à tester

---

## 🚢 Déploiement

### Expo EAS Build (Recommandé)

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Login Expo
eas login

# 3. Configurer projet
eas build:configure

# 4. Build iOS (nécessite compte Apple Developer 99$/an)
eas build --platform ios

# 5. Build Android (Google Play 25$ one-time)
eas build --platform android
```

### TestFlight (iOS Beta)

```bash
# Soumettre à TestFlight
eas submit --platform ios
```

### Google Play (Android Beta)

```bash
# Soumettre à Play Console
eas submit --platform android
```

---

## 📚 Documentation Complémentaire

- **[MIGRATION.md](./docs/MIGRATION.md)** - Guide migration Web → Mobile détaillé
- **[FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md)** - Configuration Firebase Native
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Guide développement avancé
- **[ROADMAP.md](./docs/ROADMAP.md)** - Feuille de route features

---

## 🔄 Workflow Développement

### Branches

```bash
# main - Version stable production
# develop - Développement actif
# feature/nom - Nouvelles features
```

### Commits

```bash
feat: Ajouter CustomKeyboard pour free_input
fix: Corriger crash sur ExerciseScreen
style: Améliorer design ProfileScreen
refactor: Optimiser AuthContext
docs: Mettre à jour README
```

---

## 🤝 Contribution

Ce projet est un work-in-progress. Contributions bienvenues !

### Priorités

1. ✅ Implémenter CustomKeyboard (free_input)
2. ✅ Implémenter CodeBlock clickable
3. ✅ Tester Firebase Firestore sync
4. ✅ Créer composants manquants
5. ✅ Compléter écrans Leçons

---

## 📄 Licence

MIT License - Voir [LICENSE](./LICENSE)

---

## 🔗 Liens

- **Repo Web Original** : [github.com/VOTRE_USERNAME/RidKod](https://github.com/VOTRE_USERNAME/RidKod)
- **Expo Docs** : [docs.expo.dev](https://docs.expo.dev)
- **React Native Docs** : [reactnative.dev](https://reactnative.dev)
- **Firebase RN** : [rnfirebase.io](https://rnfirebase.io)

---

## 💬 Contact

Des questions ? Besoin d'aide ?

- **Email** : votre.email@example.com
- **Discord** : Serveur ReadCod
- **Twitter** : @readcod

---

**Version** : 1.0.0-POC
**Status** : 🚧 En développement actif
**Dernière mise à jour** : 20 novembre 2025

---

## 🎉 Quick Start Commands

```bash
# Installation
npm install

# Développement
npm start

# Build iOS
npm run ios

# Build Android
npm run android

# Tests (à venir)
npm test
```

**Ready to code!** 🚀
