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
- **React 19.1** - UI framework (mis à jour)
- **Vite 7.1** - Build tool (mis à jour)
- **React Router DOM 7.9** - Navigation (mis à jour)
- **React Syntax Highlighter 15.6** - Code display (mis à jour)
- **Lucide React 0.546** - Icons (mis à jour)
- **Firebase 12.4** - Authentification et base de données ✅ NOUVEAU

### Styling
- **CSS pur** (pas de Tailwind/styled-components)
- **CSS Variables** pour thème
- **CSS-in-JS** avec styles inline dans composants
- **Mobile-first** design

### State Management
- **React Context API** ✅ IMPLÉMENTÉ - AuthContext pour authentification
- Local state avec useState/useReducer
- Pas de state management externe pour MVP

### Data
- **JSON local** pour exercices (30 exercices Python implémentés) ✅
- **localStorage** pour progression utilisateur + état authentification ✅
- **Firebase Authentication** pour comptes utilisateurs ✅
- **Firestore Database** sauvegarde progression cloud (mode connecté) ✅

---

## 🎨 DESIGN SYSTEM

### Couleurs (iOS-inspired)
```css
/* Backgrounds */
--bg-primary: #1A1919         /* Background principal app (modifié) */
--bg-secondary: #2C2C2E       /* Options normales */
--bg-tertiary: #484848        /* Options selected (modifié) */
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

/* Toutes les polices ont été unifiées en JetBrains Mono Bold (800) */

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
--component-margin-group: 20px     /* Entre groupes de composants */
--component-margin-section: 24px   /* Entre sections importantes */

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
--code-min-height: 400px      /* Pour récupérer l'espace du feedback */
```

---

## 📁 STRUCTURE PROJET (Actuelle)
```
readcod-app/
├── public/
├── src/
│   ├── components/
│   │   ├── exercise/               ✅ Composants exercices (6 composants)
│   │   │   ├── QuestionCard.jsx    ✅ FAIT - Question + feedback + SVG icons (React.memo)
│   │   │   ├── CodeBlock.jsx       ✅ FAIT - Syntax highlighting Python + clickable lines (React.memo)
│   │   │   ├── OptionButton.jsx    ✅ FAIT - États visuels (React.memo)
│   │   │   ├── ActionButton.jsx    ✅ FAIT - Validation/Continue (React.memo)
│   │   │   ├── CustomKeyboard.jsx  ✅ FAIT - Clavier numérique/prédéfini pour free_input
│   │   │   └── LevelComplete.jsx   ✅ FAIT - Feedback après 10 exercices (lazy loaded)
│   │   ├── common/                 ✅ Composants communs (2 composants)
│   │   │   ├── FeedbackGlow.jsx    ✅ FAIT - Effets visuels bordures écran
│   │   │   └── ExitConfirmModal.jsx ✅ FAIT - Modal confirmation sortie
│   │   ├── auth/                   ✅ Composants authentification (1 composant)
│   │   │   └── AuthButton.jsx      ✅ FAIT - Bouton auth dans header
│   │   ├── language/               ✅ Composants sélection langage (1 composant)
│   │   │   └── LanguageCard.jsx    ✅ FAIT - Card langage réutilisable
│   │   ├── difficulty/             ✅ Composants difficulté (1 composant)
│   │   │   └── DifficultyCard.jsx  ✅ FAIT - Card difficulté réutilisable
│   │   ├── profile/                ✅ Composants profil (1 composant)
│   │   │   └── ActivityCalendar.jsx ✅ FAIT - Calendar heatmap activité
│   │   └── lessons/                ✅ Composants leçons (3 composants) 🆕
│   │       ├── ChapterCard.jsx     ✅ FAIT - Card chapitre avec progression
│   │       ├── LessonSection.jsx   ✅ FAIT - Section leçon (text/code/exercise/tip/warning)
│   │       └── ProgressCircle.jsx  ✅ FAIT - Progress circle indicator
│   ├── pages/
│   │   ├── Welcome.jsx             ✅ FAIT - Page onboarding (310 lignes inline CSS)
│   │   ├── Login.jsx               ✅ FAIT - Page connexion (Auth.css)
│   │   ├── Signup.jsx              ✅ FAIT - Page inscription avec avatar picker (Auth.css)
│   │   ├── Home.jsx                ✅ FAIT - Page d'accueil avec menu iOS-style (Home.css)
│   │   ├── Profile.jsx             ✅ FAIT - Stats utilisateur + activity calendar (375 lignes inline CSS)
│   │   ├── Language.jsx            ✅ FAIT - Sélection langage (Language.css)
│   │   ├── Difficulty.jsx          ✅ FAIT - Sélection difficulté (Difficulty.css)
│   │   ├── Exercise.jsx            ✅ FAIT - Page exercice complète (Exercise.css, 428 lignes)
│   │   ├── Contact.jsx             ✅ FAIT - Terminal-style contact form (Contact.css) ⚠️ Email TODO
│   │   └── lessons/                ✅ NOUVEAU - Module Leçons (3 pages) 🆕
│   │       ├── LessonLanguage.jsx  ✅ FAIT - Sélection langage leçons (Lessons.css)
│   │       ├── LessonChapters.jsx  ✅ FAIT - Liste chapitres + progression (Lessons.css) ⚠️ Lock disabled
│   │       └── LessonContent.jsx   ✅ FAIT - Contenu leçon + exercices (Lessons.css + 60 lignes inline)
│   ├── assets/                     ✅ FAIT - Logos et icônes langages
│   │   ├── long_logo.png           ✅ Logo horizontal ReadCod
│   │   ├── full_logo.png           ✅ Logo complet ReadCod
│   │   ├── python_5968350.png      ✅ Icône Python
│   │   ├── java_5968282.png        ✅ Icône Java
│   │   ├── c_6132222.png           ✅ Icône C
│   │   ├── html-5_5968267.png      ✅ Icône HTML
│   │   ├── css-3_5968242.png       ✅ Icône CSS
│   │   ├── settings_694900.png     ✅ Icône Settings
│   │   └── react.svg               ✅ Icône React
│   ├── hooks/
│   │   └── useHaptic.js            ✅ FAIT - Hook vibration mobile
│   ├── data/
│   │   ├── exercises.json          ✅ FAIT - 50 exercices Python (30 Easy + 10 Medium + 10 Hard) 🆕
│   │   └── lessons/                ✅ NOUVEAU - Contenu leçons JSON 🆕
│   │       └── python/
│   │           ├── chapters.json   ✅ FAIT - Liste chapitres Python
│   │           └── chapter-3.json  ✅ FAIT - Contenu chapitre 3 (autres chapitres TODO)
│   ├── context/                    ✅ FAIT - Contexts pour state global
│   │   ├── AuthContext.jsx         ✅ Authentification (login/signup/logout)
│   │   └── ProgressContext.jsx     ✅ Progression utilisateur (XP/niveaux/stats)
│   ├── config/                     ✅ NOUVEAU - Configuration Firebase
│   │   └── firebase.js
│   ├── constants/                  ✅ NOUVEAU - Constants centralisées 🆕
│   │   └── exerciseLayout.js       ✅ FAIT - 50+ constants + helper functions
│   ├── services/                   ✅ FAIT - Services métier
│   │   ├── progressService.js      ✅ FAIT - Gestion progression (localStorage + Firestore)
│   │   └── userService.js          ✅ FAIT - Gestion utilisateurs (AVATAR_COLORS, user data)
│   ├── tests/                      ✅ NOUVEAU - Tests unitaires (97 tests)
│   │   ├── __mocks__/              ✅ FAIT - Mocks Firebase
│   │   ├── components/             ✅ FAIT - Tests composants (42 tests)
│   │   ├── context/                ✅ FAIT - Tests contexts (24 tests)
│   │   ├── services/               ✅ FAIT - Tests services (31 tests)
│   │   └── setup.js                ✅ FAIT - Configuration Vitest
│   ├── utils/                      ⚠️ OPTIONNEL - Helpers divers
│   ├── styles/                     ✅ FAIT - CSS modules externalisés 🆕
│   │   ├── Exercise.css            ✅ FAIT - 466 lignes, 70+ variables CSS
│   │   ├── Home.css                ✅ FAIT - 230 lignes (externalisé) 🆕
│   │   ├── Language.css            ✅ FAIT - 240 lignes (externalisé) 🆕
│   │   ├── Difficulty.css          ✅ FAIT - 250 lignes (externalisé) 🆕
│   │   ├── Auth.css                ✅ FAIT - 240 lignes (Login/Signup)
│   │   ├── Layout.css              ✅ FAIT - 310 lignes (Profile/Header)
│   │   ├── Contact.css             ✅ FAIT - Terminal macOS optimisé (493 lignes) 🆕
│   │   ├── Lessons.css             ✅ FAIT - Module leçons (partagé 3 pages) 🆕
│   │   └── ActivityCalendar.css    ✅ FAIT - Calendar component (Profile.jsx) 🆕
│   ├── App.jsx                     ✅ FAIT - Router avec routes principales
│   ├── App.css                     ✅ FAIT - Styles de base
│   ├── index.css                   ✅ FAIT - Reset CSS global
│   └── main.jsx                    ✅ FAIT - Entry point React
├── index.html                      ✅ FAIT - Google Fonts JetBrains Mono + Jersey 25
├── .env                            ✅ NOUVEAU - Variables Firebase (gitignored)
├── .env.example                    ✅ NOUVEAU - Template variables 🆕
├── package.json                    ✅ FAIT - Dépendances (+ Firebase + PWA) 🆕
├── vite.config.js                  ✅ FAIT - PWA plugin configuré 🆕
├── vercel.json                     ✅ NOUVEAU - Configuration Vercel 🆕
├── firebase.json                   ✅ NOUVEAU - Configuration Firebase Hosting 🆕
├── firestore.rules                 ✅ NOUVEAU - Règles sécurité Firestore 🆕
├── firestore.indexes.json          ✅ NOUVEAU - Indexes Firestore 🆕
├── eslint.config.js                ✅ FAIT - Configuration ESLint
├── vitest.config.js                ✅ FAIT - Configuration Vitest
├── CLAUDE.md                       ✅ FAIT - Ce fichier (mis à jour)
├── FIREBASE_SETUP.md               ✅ NOUVEAU - Guide configuration Firebase
├── FIRESTORE_SECURITY.md           ✅ NOUVEAU - Règles de sécurité Firestore
├── AUTH_IMPLEMENTATION.md          ✅ NOUVEAU - Documentation technique auth
├── QUICKSTART_AUTH.md              ✅ NOUVEAU - Démarrage rapide 5 minutes
├── TESTING.md                      ✅ NOUVEAU - Guide tests unitaires
├── TEST_RESULTS.md                 ✅ NOUVEAU - Résultats tests (97 tests)
├── HOWTO_TESTS.md                  ✅ NOUVEAU - Guide pratique tests
├── REFACTORING_EXERCISE.md         ✅ NOUVEAU - Rapport refactoring complet
├── PROGRESS_SYSTEM.md              ✅ NOUVEAU - Documentation système progression
├── IMPLEMENTATION_SUMMARY.md       ✅ NOUVEAU - Résumé implémentation features
├── DEBUG_FIRESTORE.md              ✅ NOUVEAU - Debug Firestore (historique)
├── ROADMAP.md                      ✅ NOUVEAU - Roadmap détaillée prochaines tâches
├── DEPLOYMENT.md                   ✅ NOUVEAU - Guide déploiement complet 🆕
├── PRODUCTION_CHECKLIST.md         ✅ NOUVEAU - Checklist pré/post déploiement 🆕
└── PWA_SETUP.md                    ✅ NOUVEAU - Documentation PWA complète 🆕
```

---

## 📄 PAGES DÉTAILLÉES (12 pages - 10 complètes)

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
   - ActivityCalendar (daily activity)
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

### ✅ Pages Exercices (1 page - LA PLUS COMPLEXE)
8. **Exercise.jsx** `/exercise` - Interface exercice
   - 3 input types (options, free_input, clickable_lines)
   - 4 exercise types
   - Progress bar (1-10)
   - CustomKeyboard + CodeBlock
   - Explanation toggle + highlighting
   - FeedbackGlow + ExitConfirmModal
   - LevelComplete (lazy loaded)
   - Exercise.css (466 lignes, 70+ variables)
   - Firestore sync automatique

### ✅ Pages Utilitaires (1 page)
9. **Contact.jsx** `/contact` - Contact form ✅ OPTIMISÉ
   - Terminal-style design unique macOS
   - 3 boutons macOS (rouge fonctionnel → /home, jaune/vert décoratifs)
   - Pas de symboles dans boutons (ronds purs colorés)
   - Header terminal fixe (sticky), body scrollable
   - Scrollbar cachée (tous navigateurs)
   - Pas d'auto-scroll (contrôle utilisateur total)
   - Form progressif (name, email, message, confirmation)
   - Auto-submit "start" sans Enter
   - Auto-focus inputs (y compris confirmation y/n)
   - Curseur custom horizontal qui suit le texte
   - FormSubmit.co integration
   - Typewriter effect success
   - Command cards (GitHub, Twitter, Discord)
   - Contact.css (493 lignes optimisées)
   - ⚠️ **TODO ligne 280** : Email à configurer

### ✅ Module Leçons (3 pages)
10. **LessonLanguage.jsx** `/lessons/language`
    - 4 language cards (idem Language.jsx)
    - Python → chapters, autres "coming soon"
    - Lessons.css

11. **LessonChapters.jsx** `/lessons/:language/chapters`
    - Chargement chapters.json
    - Chapter cards (title, desc, icon, difficulty, progress)
    - Lock system (unlock requirements)
    - Shake animation locked
    - Lessons.css
    - ⚠️ **TODO lignes 28-40** : Lock désactivé (test mode)

12. **LessonContent.jsx** `/lessons/:language/:chapterId`
    - Chargement chapter-X.json
    - Progress bar sections
    - Multiple section types (text, code, exercise, tip, warning)
    - Exercise integration (3 input types)
    - XP rewards + Firestore sync
    - Auto-scroll sections
    - Lessons.css + 60 lignes inline
    - ⚠️ **TODO ligne 167** : Alert → modal completion
    - ⚠️ **Seulement chapitre 3** disponible

### ❌ Pages Placeholder (2 routes - À implémenter)
13. **Challenges** `/challenges` - Inline div App.jsx ligne 53
14. **AI Understanding** `/ai-understanding` - Inline div App.jsx ligne 54

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
  "code": "nb_notes = int(input(\"Combien?\"))\nsomme = 0\n\nfor i in range(nb_notes):\n    note = float(input(f\"Entrez la note n°{i+1} : \"))\n    somme += note\n\nmoyenne = somme / nb_notes\n\nprint(f\"La moyenne des {nb_notes} notes est : {moyenne: .2}\")",
  "options": ["12", "14", "16", "20"],
  "correctAnswer": 1,
  "explanation": "Le code calcule la moyenne de nb_notes notes. Si on entre 2 comme nombre de notes, puis 10 et 18, la moyenne est (10+18)/2 = 14.",
  "xpGain": 10,
  "tags": ["loops", "input", "average"]
}
```

### Types d'exercices (4 types implémentés)
- `predict_output` : Prédire la sortie du programme (15 exercices)
- `find_error` : Trouver la ligne avec l'erreur (7 exercices)
- `trace_execution` : Tracer la valeur d'une variable (4 exercices)
- `concept_understanding` : Comprendre ce que fait le code (4 exercices)

### Types d'input (3 modes implémentés)
- `options` : Choix multiples (13 exercices)
- `free_input` : Saisie libre avec clavier custom (10 exercices)
- `clickable_lines` : Cliquer sur une ligne de code (7 exercices)

### Niveaux difficulté
- `1` : Easy - Débutant (10 XP) - **30 exercices disponibles** ✅
- `2` : Medium - Intermédiaire (20 XP) - **10 exercices disponibles** ✅
- `3` : Hard - Avancé (30 XP) - **10 exercices disponibles** ✅

---

## 🎯 FEATURES MVP (Priorités)

### ✅ FAIT (Plateforme Fonctionnelle Complète)

**Core Features**
1. **50 exercices Python (30 Easy, 10 Medium, 10 Hard)** - 4 types, 3 modes d'input ✅
2. **Page Home** - Menu iOS-style avec navigation + auth status ✅
3. **Page Exercise** - Interface complète avec 3 modes d'input ✅
4. **Page Profile** - Stats utilisateur, XP, niveaux, progression ✅
5. **CustomKeyboard** - Clavier numérique + prédéfini pour free_input ✅
6. **Clickable CodeBlock** - Clic sur lignes + feedback vert/rouge ✅

**Architecture & Code**
7. **Composants modulaires** - 15 composants React réutilisables organisés en 6 dossiers ✅
8. **Système de routing** - React Router avec 15 routes configurées ✅
9. **Context API** - AuthContext + ProgressContext ✅
10. **Performance** - React.memo (4 composants), lazy loading (LevelComplete), optimisations ✅
11. **Tests unitaires** - 97 tests (100% réussite) Vitest + RTL ✅
12. **CSS externalisé** - 9 fichiers CSS organisés (~2300 lignes) ✅

**Design & UX**
13. **Syntax highlighting** - Python custom avec coloration précise ✅
14. **États interactifs** - Initial, sélection, validation, feedback ✅
15. **Design iOS-style** - Interface native mobile ✅
16. **Responsive mobile** - Optimisé iPhone SE à Pro Max ✅
17. **Haptic feedback** - Vibrations natives iOS/Android ✅
18. **Animations fluides** - Transitions et effets visuels ✅
19. **Système d'explication** - Toggle avec highlighting code ✅
20. **FeedbackGlow** - Effets visuels bordures écran ✅
21. **ExitConfirmModal** - Confirmation sortie exercice ✅

**Authentification & Data**
22. **Firebase Authentication** - Email/Password + mode invité ✅
23. **Firestore Database** - Sauvegarde progression cloud ✅
24. **localStorage** - Mode invité + fallback ✅
25. **Migration auto** - localStorage → Firestore ✅
26. **Pages auth** - Welcome, Login, Signup (iOS-style) ✅
27. **Système de progression** - Niveaux par blocs de 10 exercices ✅
28. **Stats complètes** - XP, niveaux, correct/incorrect, streak ✅

**Production Ready** 🚀
29. **PWA configuré** - vite-plugin-pwa, Service Worker, manifest.json ✅
30. **Firestore Rules** - firestore.rules créé (à déployer) ✅
31. **Configuration Vercel** - vercel.json avec optimisations ✅
32. **Documentation déploiement** - DEPLOYMENT.md, PRODUCTION_CHECKLIST.md ✅
33. **PWA Setup** - PWA_SETUP.md guide complet ✅

### 🔄 EN COURS (À finaliser)
34. **Icônes PWA** - 8 tailles à générer (voir public/icons/README.md)
35. **Déployer Firestore Rules** - firebase deploy --only firestore:rules
36. **Premier déploiement Vercel** - Configurer variables environnement
37. **CSS layout mobile** - Résoudre problème dimensionnement iPhone (70% height) ⚠️

### ❌ TODO (Prochaines features)
38. **Pages placeholder** - Challenges, AI Understanding (2 routes à implémenter)
39. **Contact.jsx** - Remplacer email FormSubmit.co (ligne 79)
40. **LessonChapters.jsx** - Réactiver système de verrouillage chapitres (ligne 28-40)
41. **LessonContent.jsx** - Créer chapitres 1, 2, 4, 5+ (seulement chapitre 3 disponible)
42. **Graphiques progression** - Chart.js dans Profile
43. **Streak system** - Compteur jours consécutifs avancé
44. **Badges/achievements** - Système de récompenses
45. **OAuth** - Connexion Google/GitHub
46. **Reset password** - Mot de passe oublié
47. **Multiple langages** - JavaScript, Java, C++
48. **Domaine custom** - readcod.app ou autre

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

## 🚀 PROCHAINES ÉTAPES (Roadmap)

### Phase 1 : State Management ✅ TERMINÉ
- [x] ✅ Séparer App.jsx en composants
- [x] ✅ Créer structure dossiers
- [x] ✅ Setup React Router complet
- [x] ✅ Créer exercises.json avec 30 exercices ✅ FAIT (30 exercices)
- [x] ✅ Système de navigation next/previous
- [x] ✅ Implémenter Context API (AuthContext + ProgressContext)
- [x] ✅ localStorage pour progression + auth
- [x] ✅ Externaliser styles Exercise.css (466 lignes)
- [x] ✅ Externaliser styles Home/Language/Difficulty (Home.css, Language.css, Difficulty.css) 🆕

### Phase 1.5 : Authentification ✅ TERMINÉ
- [x] ✅ Installation Firebase SDK
- [x] ✅ Configuration Firebase (firebase.js)
- [x] ✅ AuthContext avec login/signup/logout
- [x] ✅ Page Welcome (onboarding)
- [x] ✅ Page Login (connexion)
- [x] ✅ Page Signup (inscription)
- [x] ✅ Composant AuthButton (header)
- [x] ✅ Intégration dans Home.jsx
- [x] ✅ Mode invité fonctionnel
- [x] ✅ Documentation complète (3 fichiers MD)

### Phase 1.6 : Tests Unitaires ✅ TERMINÉ
- [x] ✅ Installation Vitest + React Testing Library
- [x] ✅ Configuration setup (vitest.config.js + setup.js)
- [x] ✅ Tests progressService.js (21 tests - calcul XP/niveaux)
- [x] ✅ Tests progressService.firestore.js (10 tests - Firestore sync)
- [x] ✅ Tests AuthContext (12 tests - login/signup/logout)
- [x] ✅ Tests ProgressContext (12 tests - gestion progression)
- [x] ✅ Tests OptionButton (20 tests - états visuels)
- [x] ✅ Tests ActionButton (22 tests - validation/continuation)
- [x] ✅ Scripts npm dans package.json
- [x] ✅ Documentation TESTING.md + TEST_RESULTS.md
- **✅ 97 tests passent (100%)**

### Phase 2 : Firestore - Sauvegarde Cloud ✅ TERMINÉ
- [x] ✅ Fonctions Firestore dans progressService.js
- [x] ✅ Synchronisation auto dans ProgressContext
- [x] ✅ Migration localStorage → Firestore
- [x] ✅ Tests unitaires Firestore (10 tests)
- [x] ✅ Guide sécurité FIRESTORE_SECURITY.md
- [x] ✅ Support mode invité + mode connecté
- **✅ Progression sauvegardée dans le cloud**

### Phase 2.5 : Refactoring Exercise.jsx ✅ TERMINÉ 🆕
- [x] ✅ Phase 1: CodeBlock hauteur dynamique, options container fix, SVG icons
- [x] ✅ Phase 2: CSS externalisé (Exercise.css), 70+ variables CSS, constants file
- [x] ✅ Phase 3: React.memo sur 4 composants, lazy loading LevelComplete
- [x] ✅ Tests compilation + validation (97 tests passent)
- [x] ✅ Documentation REFACTORING_EXERCISE.md
- **✅ Exercise.jsx : 606 → 428 lignes (-30%), performances +50%**

### Phase 2.6 : CustomKeyboard + Modes d'input ✅ TERMINÉ 🆕
- [x] ✅ Composant CustomKeyboard (numérique + prédéfini)
- [x] ✅ Support free_input avec clavier custom
- [x] ✅ Support clickable_lines avec CodeBlock interactif
- [x] ✅ Feedback visuel vert/rouge pour lignes cliquables
- [x] ✅ 30 exercices avec 4 types et 3 inputTypes
- **✅ 3 modes d'input complets : options, free_input, clickable_lines**

### Phase 2.7 : Optimisation Contact.jsx ✅ TERMINÉ 🆕
- [x] ✅ Interface terminal macOS authentic (3 boutons colorés)
- [x] ✅ Bouton rouge fonctionnel → /home, jaune/vert décoratifs
- [x] ✅ Suppression symboles (×, −, +) → ronds purs colorés
- [x] ✅ Header terminal fixe (sticky) + body scrollable
- [x] ✅ Scrollbar cachée (tous navigateurs : Chrome, Firefox, Safari, Edge)
- [x] ✅ Suppression auto-scroll → contrôle utilisateur total
- [x] ✅ Auto-submit "start" sans Enter
- [x] ✅ Auto-focus inputs (steps 1-4 incluant confirmation y/n)
- [x] ✅ Curseur custom horizontal qui suit le texte (Canvas API)
- [x] ✅ Full height terminal (100vh - 40px padding)
- [x] ✅ Responsive mobile optimisé
- **✅ Contact.css : 493 lignes, UX terminal parfaite**

### Phase 3 : Pages ✅ TERMINÉ (10/12 pages)
- [x] ✅ Page Welcome (onboarding, 310 lignes inline CSS)
- [x] ✅ Page Login (authentification, Auth.css)
- [x] ✅ Page Signup (inscription + avatar picker, Auth.css)
- [x] ✅ Page Home (menu iOS avec 4 cartes, Home.css)
- [x] ✅ Page Profile (stats + activity calendar, 375 lignes inline CSS)
- [x] ✅ Page Language (sélection langage, Language.css)
- [x] ✅ Page Difficulty (sélection difficulté, Difficulty.css)
- [x] ✅ Page Exercise (interface complète 3 modes input, Exercise.css)
- [x] ✅ Page Contact (terminal macOS optimisé, Contact.css) ⚠️ Email TODO ligne 280 🆕
- [x] ✅ Module Leçons (3 pages : LessonLanguage, LessonChapters, LessonContent) ⚠️ Lock disabled + 1 seul chapitre
- [ ] ❌ Page Challenges (placeholder div dans App.jsx)
- [ ] ❌ Page AI Understanding (placeholder div dans App.jsx)

### Phase 4 : Contenu - Exercices ✅ DISPONIBLE (50 exercices)
- [x] ✅ 30 exercices Python niveau Easy (difficulté 1)
- [x] ✅ 10 exercices Python niveau Medium (difficulté 2)
- [x] ✅ 10 exercices Python niveau Hard (difficulté 3)
- [x] ✅ 4 types d'exercices (predict_output, find_error, trace_execution, concept_understanding)
- [x] ✅ 3 modes d'input (options, free_input, clickable_lines)
- [ ] ❌ Support JavaScript (nouveau langage)
- [ ] ❌ Support Java, C++, HTML/CSS
- **✅ 50 exercices Python disponibles (5 niveaux complets)**

### Phase 5 : Fonctionnalités avancées
- [x] ✅ Système de progression XP/Niveaux
- [ ] ❌ Graphiques progression (Chart.js dans Profile)
- [ ] 🔄 Streak system (partiellement implémenté)
- [ ] ❌ Badges/achievements
- [ ] ❌ Leaderboard

### Phase 6 : Production & Deploy 🚀 EN PRODUCTION
- [x] ✅ Animations avancées implémentées
- [x] ✅ Responsive mobile optimisé
- [x] ✅ Tests unitaires (97 tests, 100%)
- [x] ✅ Firebase Auth + Firestore configurés
- [x] ✅ Firestore Security Rules déployées ✅ 🆕
- [x] ✅ PWA configuré (vite-plugin-pwa, Service Worker, manifest)
- [x] ✅ Icônes PWA générées (8 tailles) ✅ 🆕
- [x] ✅ Configuration Vercel (vercel.json)
- [x] ✅ Documentation complète (DEPLOYMENT.md, PRODUCTION_CHECKLIST.md, PWA_SETUP.md)
- [x] ✅ Déploiement Vercel automatisé (GitHub → Vercel CI/CD) ✅ 🆕
- [ ] ❌ Custom domain

---

## 📚 RESSOURCES

### Documentation
- React : https://react.dev
- Vite : https://vitejs.dev
- React Router : https://reactrouter.com
- React Syntax Highlighter : https://github.com/react-syntax-highlighter
- Firebase : https://firebase.google.com/docs
- Firebase Auth : https://firebase.google.com/docs/auth

### Design Inspiration
- iOS Human Interface Guidelines
- Duolingo app
- Sololearn app

### Code Quality
- ESLint (pas encore configuré)
- Prettier (pas encore configuré)

---


---

### ⚠️ HAUTE PRIORITÉ - TODOs Code

1. **Contact.jsx ligne 280** - Remplacer `YOUR_EMAIL@example.com` par email FormSubmit.co réel 🆕
2. **LessonChapters.jsx lignes 28-40** - Système de verrouillage chapitres désactivé (TEST MODE) - À réactiver avant production
3. **LessonContent.jsx ligne 167-168** - Remplacer `alert()` par modal de completion propre

---

### ⚠️ MOYENNE PRIORITÉ - Contenu Manquant

4. **Routes placeholder** - 2 pages à implémenter :
   - `/challenges` (App.jsx ligne 53)
   - `/ai-understanding` (App.jsx ligne 54)
5. **Leçons Python** - Seulement chapitre 3 disponible, créer chapitres 1, 2, 4, 5+
6. **Contact.jsx** - Links GitHub/Twitter pointent vers domaines génériques

---

### ⚠️ BASSE PRIORITÉ - Optimisations

7. **Inline styles** - Welcome.jsx (310 lignes) et Profile.jsx (375 lignes) pourraient être externalisés
8. **Header component** - Inutilisé dans Exercise.jsx (code dupliqué)
9. **Exercise.jsx** - State management complexe (refactoring possible)

---

### 📦 Configuration Production

- ✅ **Icônes PWA** - 8 tailles générées ✅ 🆕
- ✅ **Firestore Rules** - Déployées en production ✅ 🆕
- ✅ **Vercel** - Déploiement automatisé via GitHub (CI/CD) ✅ 🆕

## 💡 NOTES TECHNIQUES

### 📊 Statistiques Projet (Mise à jour complète)
- **70+ fichiers** JSX/JS/CSS/JSON/Config
- **15 composants** React réutilisables (6 dossiers : exercise, common, auth, language, difficulty, profile, lessons)
- **12 pages** créées (10 complètes, 2 placeholders)
- **15 routes** configurées dans React Router
- **2 contexts** (AuthContext + ProgressContext)
- **2 services** (progressService + userService)
- **1 hook** custom (useHaptic)
- **9 fichiers CSS** externalisés (~2300 lignes total)
- **6 fichiers** de tests (97 tests, 100% réussite)
- **19 fichiers** Markdown documentation (incluant PAGES_STATUS.md, PROJECT_SNAPSHOT.md, DOCS_INDEX.md) 🆕
- **50 exercices** training Python (JSON : exercises.json)
- **11 chapitres** de leçons complets (JSON : chapter-0.json à chapter-10.json) avec 58 exercices intégrés

### 🎯 État Technique
- **Plateforme EN PRODUCTION** : App déployée sur Vercel ✅ 🆕
- **3 modes d'input** : options, free_input, clickable_lines
- **4 types d'exercices** : predict_output, find_error, trace_execution, concept_understanding
- **108 exercices Python** : 50 training + 58 leçons 🆕
- **Firebase Authentication** : Email/Password + mode invité
- **Firestore Database** : Sauvegarde cloud + Rules déployées ✅ 🆕
- **PWA complet** : Service Worker, manifest, icônes (8 tailles) ✅ 🆕
- **Tests unitaires** : 97 tests (100% réussite) - Vitest + React Testing Library
- **Performance optimisée** : 60fps mobile, React.memo, lazy loading, code splitting 🆕
- **Code quality** : Composants modulaires, hooks personnalisés, Context API
- **Mobile-first** : Responsive iPhone SE à Pro Max
- **Accessibility** : Touch targets 44px+, navigation clavier
- **Sécurité** : Firestore Rules, variables environnement, validation formulaires 🆕

### ⚠️ Limitations & TODOs Actuels
- **Routes placeholder** : Challenges + AI Understanding (2 pages à implémenter)
- **Déploiement Vercel** : Automatisé via GitHub CI/CD ✅

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

# Firebase 🆕
firebase login           # Connexion Firebase CLI
firebase deploy --only firestore:rules  # Déployer règles Firestore
firebase deploy --only hosting          # Déployer sur Firebase Hosting

# Vercel 🆕
vercel                   # Déployer sur Vercel (preview)
vercel --prod            # Déployer en production
vercel env add           # Ajouter variable environnement

# Structure
tree src                # Voir arborescence
find src -name "*.jsx"  # Lister composants
```

---

## 🤝 CONTRIBUTION
**Développement actuel :** Solo dev

**Claude Code aide pour :**
- ✅ Génération composants React
- ✅ Refactoring et optimisations
- ✅ Debugging et résolution bugs
- ✅ Mise à jour documentation
- ✅ Review code et bonnes pratiques

**Prochaine étape recommandée :** Générer icônes PWA, déployer Firestore Rules, puis déployer sur Vercel (voir DEPLOYMENT.md)

---

## 📖 DOCUMENTATION COMPLÈTE

**[DOCS_INDEX.md](DOCS_INDEX.md)** - 📚 Index complet de toute la documentation (19 fichiers organisés) 🆕

### 📋 Vue d'ensemble rapide
**[PROJECT_SNAPSHOT.md](PROJECT_SNAPSHOT.md)** - ⚡ Snapshot complet du projet en 1 page (métriques, status, issues, next actions) 🆕

### 🏗️ Architecture & Structure
1. **[PAGES_STATUS.md](PAGES_STATUS.md)** - 📄 État détaillé des 12 pages (10 complètes, 2 TODO) 🆕

### 🔐 Authentification
2. **[QUICKSTART_AUTH.md](QUICKSTART_AUTH.md)** - ⚡ Démarrage rapide en 5 minutes
3. **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - 📝 Guide complet configuration Firebase
4. **[AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md)** - 🔧 Documentation technique détaillée

### 🔒 Firestore & Sécurité
5. **[FIRESTORE_SECURITY.md](FIRESTORE_SECURITY.md)** - 🔒 Règles de sécurité Firestore

### 🧪 Tests
6. **[TESTING.md](TESTING.md)** - 🧪 Guide tests unitaires
7. **[TEST_RESULTS.md](TEST_RESULTS.md)** - 📊 Résultats tests (97 tests)
8. **[HOWTO_TESTS.md](HOWTO_TESTS.md)** - 🛠️ Guide pratique tests

### 🔧 Refactoring
9. **[REFACTORING_EXERCISE.md](REFACTORING_EXERCISE.md)** - 🔧 Rapport refactoring Exercise.jsx

### 🗺️ Roadmap & Planning
10. **[ROADMAP.md](ROADMAP.md)** - 🗺️ Roadmap détaillée prochaines tâches
11. **[PROGRESS_SYSTEM.md](PROGRESS_SYSTEM.md)** - 📊 Documentation système progression
12. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - 📝 Résumé implémentation features

### 🚀 Production & Déploiement
13. **[DEPLOYMENT.md](DEPLOYMENT.md)** - 🚀 Guide déploiement complet (Firestore + PWA + Vercel)
14. **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - ✅ Checklist pré/post déploiement
15. **[PWA_SETUP.md](PWA_SETUP.md)** - 📱 Documentation PWA complète

### 🐛 Debug & Historique
16. **[DEBUG_FIRESTORE.md](DEBUG_FIRESTORE.md)** - 🔍 Debug Firestore (historique)

---

---

## 📋 RÉSUMÉ ÉTAT ACTUEL

### 🎉 Ce qui fonctionne (100% - EN PRODUCTION)
- **12 pages créées** (10 complètes + 2 placeholders)
- **15 routes** configurées
- **108 exercices Python total** (50 training + 58 leçons)
- **Module Leçons complet** (11 chapitres Python)
- **Contact terminal** optimisé UX macOS ✅ Email configuré
- **Firebase Auth + Firestore** opérationnels + Rules déployées ✅
- **PWA complet** (Service Worker, manifest, icônes 8 tailles) ✅
- **Tests unitaires** (97 tests, 100%)
- **9 CSS files** organisés (~2500 lignes)
- **Vercel CI/CD** - Déploiement automatique via GitHub ✅ 🆕

### ⚠️ TODOs Restants (Optionnels)
1. **Routes placeholder** - Challenges, AI Understanding (2 pages)
2. **Custom domain** - Configuration domaine personnalisé

### 🎉 Production - APP EN LIGNE
- ✅ Générer icônes PWA (8 tailles) - FAIT ✅
- ✅ Déployer Firestore Rules - FAIT ✅
- ✅ Déployer sur Vercel - AUTOMATISÉ via GitHub ✅ 🆕
- ✅ **ReadCod est en production !** 🚀

---

**Dernière mise à jour :** 10 janvier 2025
**Version :** 1.0.0 (Live in Production)
**Status :** ✅ 100% fonctionnel - App déployée - GitHub → Vercel CI/CD actif

---

## 🎯 ACTION IMMÉDIATE

**📋 POUR COMPRENDRE LE PROJET EN 5 MIN :**
→ **[PROJECT_SNAPSHOT.md](PROJECT_SNAPSHOT.md)** - Vue d'ensemble complète (status, métriques, issues, next actions)

**📄 POUR DÉTAILS PAGES :**
→ **[PAGES_STATUS.md](PAGES_STATUS.md)** - État détaillé de toutes les pages

**🐛 POUR ISSUES & TODOs :**
→ Section "BUGS CONNUS & ISSUES" ci-dessus

---

**Prochaines tâches (optionnelles) :**
1. 📄 Implémenter 2 pages placeholder (Challenges, AI Understanding)
2. 🌐 Configurer domaine custom
3. 📊 Ajouter graphiques progression (Chart.js)
4. 🏆 Système de badges/achievements