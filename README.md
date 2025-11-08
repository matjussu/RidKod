# ReadCod - Apprendre à LIRE du code

> La première application mobile pour apprendre à **lire et comprendre du code** (pas l'écrire).

![Version](https://img.shields.io/badge/version-1.0.0--rc2-blue)
![React](https://img.shields.io/badge/React-19.1-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-12.4-orange)
![Tests](https://img.shields.io/badge/tests-97%20passing-success)
![Complétion](https://img.shields.io/badge/complétion-83%25-yellow)

---

## 🎯 Concept

**ReadCod** comble un gap important dans l'apprentissage de la programmation :

- 70% du temps des développeurs est consacré à **lire du code**
- L'IA génère 50% du code en 2025
- Personne n'enseigne à **auditer et comprendre** du code
- **ReadCod** enseigne cette compétence essentielle

### Public cible

- Débutants en programmation
- Développeurs juniors
- Devs souhaitant améliorer leur code review
- Étudiants en informatique

---

## ✨ Features

### ✅ Implémenté (83% complet)

- **50 exercices Python** (3 niveaux : Easy, Medium, Hard)
- **4 types d'exercices** : Predict output, Find error, Trace execution, Concept understanding
- **3 modes d'input** : Multiple choice, Free input, Clickable lines
- **Authentification Firebase** : Email/Password + Mode invité
- **Système de progression** : XP, niveaux, stats, streak
- **Module Leçons** : Chapitres structurés avec exercices intégrés
- **Profile utilisateur** : Stats détaillées + activity calendar
- **PWA configuré** : Service Worker, manifest, offline support
- **Design iOS-style** : Interface mobile-first native
- **Tests unitaires** : 97 tests (100% réussite)

### 🔄 En cours

- Fix bug layout mobile (iPhone)
- Icônes PWA
- Pages Challenges et AI Understanding

---

## 🛠️ Stack Technique

### Frontend
- **React 19.1** - UI framework
- **Vite 7.1** - Build tool
- **React Router DOM 7.9** - Navigation
- **React Syntax Highlighter 15.6** - Code display

### Backend
- **Firebase Authentication** - Email/Password auth
- **Firestore Database** - Progression cloud

### Styling
- **CSS pur** - 9 fichiers (~2300 lignes)
- **CSS Variables** - Theming
- **Mobile-first** - Responsive design

### Testing
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **97 tests** - 100% passing

### Production
- **PWA** - Service Worker, manifest
- **Vercel** - Hosting (configuration prête)

---

## 📁 Structure Projet

```
src/
├── components/          # 15 composants React organisés
│   ├── exercise/        # QuestionCard, CodeBlock, OptionButton, ActionButton, CustomKeyboard, LevelComplete
│   ├── common/          # FeedbackGlow, ExitConfirmModal
│   ├── auth/            # AuthButton
│   ├── language/        # LanguageCard
│   ├── difficulty/      # DifficultyCard
│   ├── profile/         # ActivityCalendar
│   └── lessons/         # ChapterCard, LessonSection, ProgressCircle
├── pages/               # 12 pages (10 complètes)
│   ├── Welcome.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Home.jsx
│   ├── Profile.jsx
│   ├── Language.jsx
│   ├── Difficulty.jsx
│   ├── Exercise.jsx
│   ├── Contact.jsx
│   └── lessons/         # LessonLanguage, LessonChapters, LessonContent
├── context/             # AuthContext, ProgressContext
├── services/            # progressService, userService
├── data/                # exercises.json, lessons/
├── styles/              # 9 CSS files
└── tests/               # 97 tests unitaires
```

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm 9+
- Compte Firebase (pour auth + database)

### Installation

```bash
# Clone le repo
git clone https://github.com/YOUR_USERNAME/RidKod.git
cd RidKod

# Installe les dépendances
npm install

# Configure Firebase
cp .env.example .env
# Édite .env avec tes clés Firebase

# Lance le serveur dev
npm run dev
```

### Commandes disponibles

```bash
npm run dev              # Serveur local Vite
npm run build           # Build production
npm run preview         # Preview build
npm run lint            # ESLint check

# Tests
npm test                 # Tests en mode watch
npm run test:run         # Tests une fois
npm run test:ui          # Interface UI interactive
npm run test:coverage    # Rapport couverture

# Firebase
firebase deploy --only firestore:rules  # Déployer règles Firestore
firebase deploy --only hosting          # Déployer sur Firebase Hosting

# Vercel
vercel                   # Déployer preview
vercel --prod            # Déployer production
```

---

## 📖 Documentation

**📚 [DOCS_INDEX.md](DOCS_INDEX.md)** - Index complet de toute la documentation (19 fichiers)

### 🚀 Démarrage rapide
- **[PROJECT_SNAPSHOT.md](PROJECT_SNAPSHOT.md)** - Snapshot complet en 1 page ⭐

### 🏗️ Architecture
- **[CLAUDE.md](CLAUDE.md)** - Documentation principale complète ⭐⭐⭐
- **[PAGES_STATUS.md](PAGES_STATUS.md)** - État détaillé des 12 pages

### 🔐 Firebase
- **[QUICKSTART_AUTH.md](QUICKSTART_AUTH.md)** - Setup Firebase en 5 minutes
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Guide complet
- **[FIRESTORE_SECURITY.md](FIRESTORE_SECURITY.md)** - Règles sécurité

### 🧪 Tests
- **[TESTING.md](TESTING.md)** - Guide tests unitaires
- **[TEST_RESULTS.md](TEST_RESULTS.md)** - Résultats (97 tests)

### 🚀 Production
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guide déploiement
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Checklist
- **[PWA_SETUP.md](PWA_SETUP.md)** - Documentation PWA

**Total :** 19 fichiers Markdown (~5,000+ lignes)

---

## 🐛 Issues Connues

### 🔴 Critique
- **Layout mobile iPhone** - Pages Home/Language/Difficulty occupent 70% hauteur (bug iOS Safari flexbox)

### ⚠️ Haute priorité
- Contact.jsx ligne 79 - Email FormSubmit.co à configurer
- LessonChapters lignes 28-40 - Lock system désactivé (test mode)
- LessonContent lignes 167-168 - Remplacer alert() par modal

### 📦 Avant production
- 2 pages placeholder (Challenges, AI Understanding)
- Icônes PWA à générer (8 tailles)
- Déployer Firestore Rules

---

## 📊 Métriques

| Métrique | Valeur |
|----------|--------|
| **Complétion globale** | 83% |
| **Pages complètes** | 10/12 |
| **Composants React** | 15 |
| **Routes configurées** | 15 |
| **Tests unitaires** | 97 (100% pass) |
| **Exercices Python** | 50 |
| **Lignes JSX** | ~3,180 |
| **Lignes CSS** | ~2,300 |

---

## 🤝 Contribution

Développement actuel : Solo dev

**Roadmap :**
1. Fix bug layout mobile
2. Implémenter pages Challenges et AI Understanding
3. Créer plus de chapitres de leçons
4. Ajouter support JavaScript, Java, C++
5. Système de badges/achievements
6. Leaderboard

---

## 📝 License

MIT License - Voir [LICENSE](LICENSE) pour détails

---

## 👤 Auteur

**M/E** - Développeur Full Stack

- Portfolio : [À venir]
- GitHub : [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Twitter : [@YOUR_TWITTER](https://twitter.com/YOUR_TWITTER)

---

## 🙏 Remerciements

- React Team pour React 19
- Firebase pour l'infrastructure backend
- Vite pour le build tool ultra-rapide
- La communauté open source

---

**Status :** 🚀 Production-ready avec TODOs identifiés
**Version :** 1.0.0-rc2 (Release Candidate 2)
**Dernière mise à jour :** 7 janvier 2025
