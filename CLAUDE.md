# READCOD - Documentation Projet

## 🎯 VISION

ReadCod est la première application mobile pour apprendre à **LIRE du code** (pas l'écrire).

### Concept Core
- Les développeurs passent 70% de leur temps à lire du code
- L'IA génère 50% du code en 2025
- Personne n'enseigne à lire/auditer du code
- **ReadCod comble ce gap**

### Public Cible
- Débutants en programmation
- Développeurs juniors
- Devs qui veulent améliorer leur code review
- Étudiants en informatique

---

## 🛠️ STACK TECHNIQUE

### Frontend
- **React 19.1** - UI framework
- **Vite 7.1** - Build tool
- **React Router DOM 7.9** - Navigation
- **React Syntax Highlighter 15.6** - Code display
- **Lucide React 0.546** - Icons
- **Firebase 12.4** - Authentification et base de données

### Styling
- **CSS pur** (pas de Tailwind/styled-components)
- **CSS Variables** pour thème
- **CSS-in-JS** avec styles inline dans composants
- **Mobile-first** design

### State Management
- **React Context API** - AuthContext + ProgressContext
- Local state avec useState/useReducer
- Pas de state management externe

### Data
- **JSON local** pour exercices (50 exercices Python)
- **localStorage** pour progression utilisateur + état authentification
- **Firebase Authentication** pour comptes utilisateurs
- **Firestore Database** sauvegarde progression cloud

---

## 🎨 DESIGN SYSTEM

### Couleurs (iOS-inspired)
```css
/* Backgrounds */
--bg-primary: #1A1919         /* Background principal app */
--bg-secondary: #2C2C2E       /* Options normales */
--bg-tertiary: #484848        /* Options selected */
--bg-code: #000000            /* Code block */

/* Text */
--text-primary: #FFFFFF       /* Texte principal */
--text-secondary: #8E8E93     /* Texte disabled */
--text-dark: #000000          /* Sur fond clair */

/* Accents */
--color-success: #088201      /* Vert - correct */
--color-error: #FF383C        /* Rouge - incorrect */
--color-warning: #FF9500      /* Orange - feedback */
--color-info: #1871BE         /* Bleu - keywords code */

/* Card */
--card-bg: #FFFFFF            /* Background question card */
--card-radius: 16px
```

### Typography
```css
/* Fonts */
font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace

/* Sizes */
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px

/* Weights */
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extra-bold: 800        /* JetBrains Mono Bold */
```

### Spacing (iOS-compliant)
```css
/* Container spacing */
--container-padding-mobile: 20px
--container-padding-desktop: 24px

/* Component spacing */
--component-margin-group: 20px
--component-margin-section: 24px

/* Internal spacing */
--space-xs: 4px
--space-sm: 8px
--space-md: 12px
--space-lg: 16px
--space-xl: 20px
--space-2xl: 24px
--space-3xl: 32px
```

### Components Dimensions
```css
/* Buttons */
--button-height: 56px
--button-radius: 12px

/* Options */
--option-height: 56px
--option-radius: 12px

/* Cards */
--card-padding: 16px
--card-radius: 16px

/* Code Block */
--code-padding: 16px
--code-radius: 12px
--code-min-height: 400px
```

---

## 📁 STRUCTURE PROJET

```
readcod-app/
├── public/
│   ├── icons/                      ✅ 8 icônes PWA (72x72 → 512x512)
│   ├── logo.png                    ✅ Logo principal
│   ├── manifest.json               ✅ PWA manifest
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── exercise/               ✅ 7 composants exercices
│   │   │   ├── QuestionCard.jsx    ✅ Question + feedback + SVG icons (React.memo)
│   │   │   ├── CodeBlock.jsx       ✅ Syntax highlighting + clickable lines (React.memo)
│   │   │   ├── OptionButton.jsx    ✅ États visuels (React.memo)
│   │   │   ├── ActionButton.jsx    ✅ Validation/Continue (React.memo)
│   │   │   ├── CustomKeyboard.jsx  ✅ Clavier numérique/prédéfini
│   │   │   ├── LevelComplete.jsx   ✅ Feedback fin niveau
│   │   │   └── XPCollect.jsx       ✅ Animation collecte XP
│   │   ├── common/                 ✅ 2 composants communs
│   │   │   ├── FeedbackGlow.jsx    ✅ Effets visuels bordures
│   │   │   └── ExitConfirmModal.jsx ✅ Modal confirmation sortie
│   │   ├── auth/                   ✅ 1 composant auth
│   │   │   └── AuthButton.jsx      ✅ Bouton auth header
│   │   ├── language/               ✅ 1 composant langage
│   │   │   └── LanguageCard.jsx    ✅ Card langage réutilisable
│   │   ├── difficulty/             ✅ 1 composant difficulté
│   │   │   └── DifficultyCard.jsx  ✅ Card difficulté réutilisable
│   │   ├── profile/                ✅ 1 composant profil
│   │   │   └── ActivityCalendar.jsx ✅ Calendar heatmap activité
│   │   ├── lessons/                ✅ 4 composants leçons
│   │   │   ├── ChapterCard.jsx     ✅ Card chapitre + progression
│   │   │   ├── ChapterCompleteModal.jsx ✅ Modal fin chapitre
│   │   │   ├── LessonSection.jsx   ✅ Section leçon
│   │   │   └── ProgressCircle.jsx  ✅ Progress circle indicator
│   │   └── layout/                 (vide - réservé)
│   ├── pages/
│   │   ├── Welcome.jsx             ✅ Page onboarding
│   │   ├── Login.jsx               ✅ Page connexion
│   │   ├── Signup.jsx              ✅ Page inscription + avatar picker
│   │   ├── Home.jsx                ✅ Dashboard menu iOS-style
│   │   ├── Profile.jsx             ✅ Stats utilisateur + calendar
│   │   ├── Language.jsx            ✅ Sélection langage training
│   │   ├── Difficulty.jsx          ✅ Sélection difficulté
│   │   ├── Exercise.jsx            ✅ Interface exercice complète
│   │   ├── LevelComplete.jsx       ✅ Page fin de niveau
│   │   ├── XPCollect.jsx           ✅ Page collecte XP
│   │   ├── Contact.jsx             ✅ Terminal-style contact form
│   │   └── lessons/                ✅ Module Leçons (3 pages)
│   │       ├── LessonLanguage.jsx  ✅ Sélection langage leçons
│   │       ├── LessonChapters.jsx  ✅ Liste chapitres
│   │       └── LessonContent.jsx   ✅ Contenu leçon + exercices
│   ├── assets/                     ✅ Logos et icônes langages
│   │   ├── long_logo.png
│   │   ├── full_logo.png
│   │   ├── python_5968350.png
│   │   ├── java_5968282.png
│   │   ├── c_6132222.png
│   │   ├── html-5_5968267.png
│   │   ├── css-3_5968242.png
│   │   ├── settings_694900.png
│   │   └── react.svg
│   ├── hooks/
│   │   └── useHaptic.js            ✅ Hook vibration mobile
│   ├── utils/
│   │   ├── soundEffects.js         ✅ Web Audio API sounds
│   │   └── throttle.js             ✅ Throttle utility
│   ├── data/
│   │   ├── exercises.json          ✅ 50 exercices Python
│   │   └── lessons/
│   │       └── python/
│   │           ├── chapters.json   ✅ Liste 11 chapitres
│   │           ├── chapter-0.json  ✅ Introduction Python
│   │           ├── chapter-1.json  ✅ Variables & Types
│   │           ├── chapter-2.json  ✅ Conditions
│   │           ├── chapter-3.json  ✅ Boucles
│   │           ├── chapter-4.json  ✅ Listes
│   │           ├── chapter-5.json  ✅ Dictionnaires
│   │           ├── chapter-6.json  ✅ Chaînes
│   │           ├── chapter-7.json  ✅ Fonctions
│   │           ├── chapter-8.json  ✅ Comprehensions
│   │           ├── chapter-9.json  ✅ Classes & OOP
│   │           └── chapter-10.json ✅ Exceptions
│   ├── context/
│   │   ├── AuthContext.jsx         ✅ Authentification
│   │   └── ProgressContext.jsx     ✅ Progression + XP
│   ├── config/
│   │   └── firebase.js             ✅ Configuration Firebase
│   ├── constants/
│   │   └── exerciseLayout.js       ✅ 50+ constants + helpers
│   ├── services/
│   │   ├── progressService.js      ✅ Gestion progression
│   │   └── userService.js          ✅ Gestion utilisateurs
│   ├── tests/                      ✅ Tests unitaires (97 tests)
│   │   ├── __mocks__/              ✅ Mocks Firebase
│   │   ├── components/             ✅ Tests composants (42 tests)
│   │   ├── context/                ✅ Tests contexts (24 tests)
│   │   ├── services/               ✅ Tests services (31 tests)
│   │   └── setup.js                ✅ Configuration Vitest
│   ├── styles/                     ✅ 9 fichiers CSS (~2500 lignes)
│   │   ├── Exercise.css            ✅ 466 lignes, 70+ variables
│   │   ├── Home.css                ✅ 230 lignes
│   │   ├── Language.css            ✅ 240 lignes
│   │   ├── Difficulty.css          ✅ 250 lignes
│   │   ├── Auth.css                ✅ 240 lignes
│   │   ├── Layout.css              ✅ 310 lignes
│   │   ├── Contact.css             ✅ 493 lignes terminal macOS
│   │   ├── Lessons.css             ✅ Module leçons
│   │   └── ActivityCalendar.css    ✅ Calendar component
│   ├── App.jsx                     ✅ Router 17 routes
│   ├── App.css                     ✅ Styles de base
│   ├── index.css                   ✅ Reset CSS global
│   └── main.jsx                    ✅ Entry point React
├── index.html                      ✅ Google Fonts
├── .env                            ✅ Variables Firebase (gitignored)
├── .env.example                    ✅ Template variables
├── package.json                    ✅ Dépendances
├── vite.config.js                  ✅ PWA plugin configuré
├── vercel.json                     ✅ Configuration Vercel
├── firebase.json                   ✅ Configuration Firebase
├── firestore.rules                 ✅ Règles sécurité Firestore
├── firestore.indexes.json          ✅ Indexes Firestore
├── eslint.config.js                ✅ Configuration ESLint
├── vitest.config.js                ✅ Configuration Vitest
└── CLAUDE.md                       ✅ Ce fichier
```

---

## 📄 PAGES DÉTAILLÉES (14 pages)

### ✅ Pages Authentification (3 pages)
1. **Welcome.jsx** `/` - Onboarding
   - Logo + 3 boutons (Create Account, Login, Skip)
   - Animations (fadeIn, slideUp, scaleIn)
   - 310 lignes inline CSS
   - Safe area insets iOS

2. **Login.jsx** `/login` - Connexion
   - Form email/password
   - Validation + error messages
   - Loading state
   - Auth.css + Layout.css

3. **Signup.jsx** `/signup` - Inscription
   - Username validation (3-15 chars)
   - Email + password confirmation
   - Avatar color picker (grid)
   - Auth.css + Layout.css

### ✅ Pages Principales (4 pages)
4. **Home.jsx** `/home` - Dashboard
   - 4 menu cards (Leçons, Entraînements, Challenges, AI)
   - AuthButton (login/profile)
   - Contact button + footer
   - Home.css + Layout.css

5. **Profile.jsx** `/profile` - Stats utilisateur
   - Avatar (initial + color ou emoji invité)
   - Level card (XP + progress bar)
   - 4 stats cards (total, correct, incorrect, streak)
   - ActivityCalendar (daily activity heatmap)
   - 375 lignes inline CSS + ActivityCalendar.css
   - Logout/Login button

6. **Language.jsx** `/language` - Training
   - 4 language cards (Python, HTML, Java, C++)
   - Python disponible, autres "coming soon"
   - Language.css + Layout.css

7. **Difficulty.jsx** `/difficulty` - Training
   - 3 difficulty cards (Easy, Medium, Hard)
   - Gradients (green, orange, red)
   - XP rewards (+10, +20, +30)
   - Difficulty.css + Layout.css

### ✅ Pages Exercices (3 pages)
8. **Exercise.jsx** `/exercise` - Interface exercice
   - 3 input types (options, free_input, clickable_lines)
   - 4 exercise types
   - Progress bar dynamique
   - CustomKeyboard + CodeBlock
   - Explanation toggle + highlighting
   - FeedbackGlow + ExitConfirmModal
   - Exercise.css (466 lignes, 70+ variables)
   - Firestore sync automatique

9. **LevelComplete.jsx** `/level-complete` - Fin de niveau
   - Récapitulatif performance
   - Stats niveau
   - Animation célébration
   - Navigation continue

10. **XPCollect.jsx** `/xp-collect` - Collecte XP
    - Animation collecte XP
    - Progression visuelle
    - Feedback rewards

### ✅ Pages Utilitaires (1 page)
11. **Contact.jsx** `/contact` - Contact form
    - Terminal-style design macOS
    - 3 boutons macOS (rouge → /home, jaune/vert décoratifs)
    - Header terminal fixe (sticky)
    - Form progressif (name, email, message, confirmation)
    - Auto-submit + auto-focus
    - Curseur custom horizontal
    - FormSubmit.co integration
    - Contact.css (493 lignes)

### ✅ Module Leçons (3 pages)
12. **LessonLanguage.jsx** `/lessons/language`
    - 4 language cards
    - Python → chapters, autres "coming soon"
    - Lessons.css

13. **LessonChapters.jsx** `/lessons/:language/chapters`
    - 11 chapitres Python disponibles
    - Chapter cards (title, desc, icon, difficulty, progress)
    - Tous chapitres déverrouillés (design choice)
    - Lessons.css

14. **LessonContent.jsx** `/lessons/:language/:chapterId`
    - Chargement dynamique chapter-X.json
    - Progress bar sections
    - Multiple section types (text, code, exercise, tip, warning)
    - Exercise integration (3 input types)
    - XP rewards + Firestore sync
    - Lessons.css + 60 lignes inline

### 🔄 Pages Placeholder (2 routes)
- **Challenges** `/challenges` - Inline div (À implémenter)
- **AI Understanding** `/ai-understanding` - Inline div (À implémenter)

---

## 🎮 WORKFLOW EXERCICE (États)

### 1. État Initial
- Options : background #2C2C2E, texte blanc
- Bouton : "Valider", disabled, gris #3A3A3C
- Aucune sélection

### 2. État Sélection
- Option cliquée : background #3A3A3C, border vert #30D158
- Bouton : "Valider", enabled, vert #30D158
- Autres options : inchangées

### 3. État Correct (après validation)
- FeedbackMessage : "Bravo ! +10 EXP" (orange #FF9500)
- Option correcte : background vert #30D158, texte noir
- Bouton : "Continuer", vert #30D158
- Autres options : opacity 50%

### 4. État Incorrect (après validation)
- FeedbackMessage : "Bien essayé !" (orange #FF9500)
- Option sélectionnée : background rouge #FF453A
- Option correcte : background vert #30D158
- Bouton : "Continuer", rouge #FF453A
- Autres options : opacity 50%

---

## 📝 FORMAT EXERCICE

```json
{
  "id": "py_beg_001",
  "language": "python",
  "difficulty": 1,
  "type": "predict_output",
  "question": "Que renvoie ce programme ?",
  "code": "x = 10\ny = 20\nprint(x + y)",
  "options": ["10", "20", "30", "1020"],
  "correctAnswer": 2,
  "explanation": "L'addition de 10 + 20 donne 30.",
  "xpGain": 10,
  "tags": ["basics", "arithmetic"]
}
```

### Types d'exercices (4 types)
- `predict_output` : Prédire la sortie du programme
- `find_error` : Trouver la ligne avec l'erreur
- `trace_execution` : Tracer la valeur d'une variable
- `concept_understanding` : Comprendre ce que fait le code

### Types d'input (3 modes)
- `options` : Choix multiples
- `free_input` : Saisie libre avec clavier custom
- `clickable_lines` : Cliquer sur une ligne de code

### Niveaux difficulté
- `1` : Easy - Débutant (10 XP) - **30 exercices**
- `2` : Medium - Intermédiaire (20 XP) - **10 exercices**
- `3` : Hard - Avancé (30 XP) - **10 exercices**

---

## 🎯 FEATURES IMPLÉMENTÉES

### ✅ Core Features
1. **50 exercices Python** (30 Easy, 10 Medium, 10 Hard) - 4 types, 3 modes d'input
2. **11 chapitres de leçons Python** avec 58 exercices intégrés
3. **14 pages complètes** + 2 placeholders
4. **17 composants React** réutilisables organisés
5. **3 modes d'input** (options, free_input, clickable_lines)

### ✅ Architecture & Code
6. **Composants modulaires** - 17 composants organisés en 7 dossiers
7. **Système de routing** - React Router avec 17 routes
8. **Context API** - AuthContext + ProgressContext
9. **Performance** - React.memo, lazy loading, optimisations
10. **Tests unitaires** - 97 tests (100% réussite) Vitest + RTL
11. **CSS externalisé** - 9 fichiers CSS (~2500 lignes)
12. **Utilities** - soundEffects.js (Web Audio API), throttle.js

### ✅ Design & UX
13. **Syntax highlighting** - Python custom avec coloration précise
14. **États interactifs** - Initial, sélection, validation, feedback
15. **Design iOS-style** - Interface native mobile
16. **Responsive mobile** - Optimisé iPhone SE à Pro Max
17. **Haptic feedback** - Vibrations natives iOS/Android
18. **Sound effects** - Web Audio API (typing, success, error)
19. **Animations fluides** - Transitions et effets visuels
20. **Système d'explication** - Toggle avec highlighting code
21. **FeedbackGlow** - Effets visuels bordures écran

### ✅ Authentification & Data
22. **Firebase Authentication** - Email/Password + mode invité
23. **Firestore Database** - Sauvegarde progression cloud
24. **localStorage** - Mode invité + fallback
25. **Migration auto** - localStorage → Firestore
26. **Pages auth** - Welcome, Login, Signup (iOS-style)
27. **Système de progression** - Niveaux, XP, stats
28. **Activity calendar** - Heatmap activité quotidienne

### ✅ Production Ready
29. **PWA complet** - Service Worker, manifest, 8 icônes
30. **Firestore Rules** - Règles sécurité déployées
31. **Configuration Vercel** - vercel.json avec optimisations
32. **CI/CD** - Déploiement automatique GitHub → Vercel
33. **Documentation** - 20+ fichiers Markdown

---

## 🔧 CONVENTIONS CODE

### Naming
- Components : PascalCase (ExerciseScreen.jsx)
- Functions : camelCase (handleValidate)
- Constants : UPPER_SNAKE_CASE (TOTAL_EXERCISES)
- CSS classes : kebab-case (option-button)
- Files : PascalCase pour components, camelCase pour utils

### Structure Component
```jsx
// 1. Imports
import React, { useState } from 'react';
import { Component } from './components';

// 2. Component
const MyComponent = () => {
  // 3. State
  const [state, setState] = useState();

  // 4. Handlers
  const handleClick = () => {};

  // 5. Render
  return <div>...</div>;
};

// 6. Export
export default MyComponent;
```

### CSS
- Mobile-first (media queries min-width)
- CSS Variables pour toutes les couleurs
- Éviter les !important
- Classes descriptives
- Transitions sur tous les états interactifs

### Git Commits
- `feat:` Nouvelle feature
- `fix:` Bug fix
- `style:` Changements visuels
- `refactor:` Refactoring code
- `docs:` Documentation

---

## 💡 STATISTIQUES PROJET

### 📊 Métriques Code
- **80+ fichiers** JSX/JS/CSS/JSON/Config
- **17 composants** React réutilisables
- **14 pages** créées (12 complètes, 2 placeholders)
- **17 routes** configurées dans React Router
- **2 contexts** (AuthContext + ProgressContext)
- **2 services** (progressService + userService)
- **3 utilities** (useHaptic, soundEffects, throttle)
- **9 fichiers CSS** externalisés (~2500 lignes)
- **6 fichiers** de tests (97 tests, 100% réussite)
- **20+ fichiers** Markdown documentation

### 📚 Contenu
- **50 exercices** training Python
- **11 chapitres** de leçons Python
- **58 exercices** intégrés dans les leçons
- **108 exercices** Python total

### 🎯 État Technique
- **Plateforme EN PRODUCTION** sur Vercel
- **3 modes d'input** : options, free_input, clickable_lines
- **4 types d'exercices** : predict_output, find_error, trace_execution, concept_understanding
- **Firebase Authentication** : Email/Password + mode invité
- **Firestore Database** : Sauvegarde cloud + Rules déployées
- **PWA complet** : Service Worker, manifest, icônes
- **Tests unitaires** : 97 tests (100% réussite)
- **Performance optimisée** : 60fps mobile, React.memo, lazy loading
- **Mobile-first** : Responsive iPhone SE à Pro Max
- **Accessibility** : Touch targets 44px+, navigation clavier
- **Sécurité** : Firestore Rules, env variables, validation

---

## 🔧 COMMANDES UTILES

```bash
# Développement
npm run dev              # Serveur local Vite
npm run build           # Build production
npm run preview         # Preview build
npm run lint            # ESLint check

# Tests
npm test                 # Lancer tests en mode watch
npm run test:run         # Lancer tests une fois
npm run test:ui          # Interface UI interactive
npm run test:coverage    # Générer rapport couverture

# Firebase
firebase login           # Connexion Firebase CLI
firebase deploy --only firestore:rules  # Déployer règles
firebase deploy --only hosting          # Déployer hosting

# Vercel
vercel                   # Déployer preview
vercel --prod            # Déployer production
vercel env add           # Ajouter variable environnement

# Structure
tree src                # Voir arborescence
find src -name "*.jsx"  # Lister composants
```

---

## 📖 DOCUMENTATION COMPLÈTE

Le projet dispose d'une documentation extensive organisée en plusieurs fichiers :

### Architecture & Setup
- **FIREBASE_SETUP.md** - Guide configuration Firebase
- **PWA_SETUP.md** - Documentation PWA complète
- **TESTING.md** - Guide tests unitaires

### Implémentation & Technique
- **AUTH_IMPLEMENTATION.md** - Documentation technique auth
- **PROGRESS_SYSTEM.md** - Documentation système progression
- **REFACTORING_EXERCISE.md** - Rapport refactoring
- **PERFORMANCE_OPTIMIZATIONS.md** - Optimisations performance

### Sécurité & Backend
- **firestore.rules** - Règles sécurité Firestore
- **RATE_LIMITING.md** - Limitation taux requêtes
- **BACKEND_SECURITY_PERFORMANCE_REPORT.md** - Rapport sécurité backend

### Production & Déploiement
- **vercel.json** - Configuration Vercel
- **firebase.json** - Configuration Firebase
- **vite.config.js** - Configuration PWA

### Guides & Résultats
- **TEST_RESULTS.md** - Résultats tests (97 tests)
- **PORTFOLIO_REPORT.md** - Rapport portfolio complet
- **README.md** - Guide démarrage rapide

---

## 🤝 CONTRIBUTION

**Développement actuel :** Solo dev

**Claude Code aide pour :**
- ✅ Génération composants React
- ✅ Refactoring et optimisations
- ✅ Debugging et résolution bugs
- ✅ Mise à jour documentation
- ✅ Review code et bonnes pratiques

---

## 📋 RÉSUMÉ ÉTAT ACTUEL

### ✅ Fonctionnel (Production)
- **14 pages** (12 complètes + 2 placeholders)
- **17 routes** configurées
- **108 exercices Python** (50 training + 58 leçons)
- **Module Leçons complet** (11 chapitres)
- **Firebase Auth + Firestore** opérationnels
- **PWA complet** (Service Worker, manifest, icônes)
- **Tests unitaires** (97 tests, 100%)
- **Vercel CI/CD** automatisé

### 🔄 Prochaines Features (Optionnel)
1. **Pages placeholder** - Challenges, AI Understanding
2. **Custom domain** - Configuration domaine personnalisé
3. **Graphiques progression** - Chart.js dans Profile
4. **Badges/achievements** - Système de récompenses
5. **OAuth** - Connexion Google/GitHub
6. **Multiple langages** - JavaScript, Java, C++

---

**Dernière mise à jour :** 2 décembre 2025
**Version :** 1.0.0 (Live in Production)
**Status :** ✅ App déployée - GitHub → Vercel CI/CD actif

---

## 🎯 LIENS RAPIDES

**🚀 PRODUCTION**
- App déployée sur Vercel
- Firebase Auth + Firestore actifs
- PWA configuré et fonctionnel
- CI/CD automatique (GitHub → Vercel)

**📝 PROCHAINES ÉTAPES**
1. Implémenter pages Challenges et AI Understanding
2. Configurer domaine custom
3. Ajouter langages (JavaScript, Java, C++)
4. Système de badges et achievements
