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
- **JSON local** pour exercices (50 exercices Python - réorganisés)
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
│   │   ├── common/                 ✅ 3 composants communs
│   │   │   ├── FeedbackGlow.jsx    ✅ Effets visuels bordures
│   │   │   ├── ExitConfirmModal.jsx ✅ Modal confirmation sortie
│   │   │   └── SkipButton.jsx      ✅ Bouton skip animation
│   │   ├── welcome/                ✅ 5 composants animation
│   │   │   ├── WelcomeAnimation.jsx    ✅ Animation orchestrateur
│   │   │   ├── AnimatedLogo.jsx        ✅ Logo animé
│   │   │   ├── CyberpunkBackground.jsx ✅ Fond cyberpunk
│   │   │   ├── SkipButton.jsx          ✅ Bouton skip (duplicate?)
│   │   │   └── WelcomeBackground.jsx   ✅ Background wrapper
│   │   ├── auth/                   ✅ 1 composant auth
│   │   │   └── AuthButton.jsx      ✅ Bouton auth header
│   │   ├── language/               ✅ 1 composant langage
│   │   │   └── LanguageCard.jsx    ✅ Card langage réutilisable
│   │   ├── difficulty/             ✅ 1 composant difficulté
│   │   │   └── DifficultyCard.jsx  ✅ Card difficulté réutilisable
│   │   ├── profile/                ✅ 1 composant profil
│   │   │   └── ActivityCalendar.jsx ✅ Calendar heatmap activité
│   │   ├── lessons/                ✅ 13 composants leçons (architecture complète)
│   │   │   ├── LessonSection.jsx       ✅ Section leçon
│   │   │   ├── ProgressCircle.jsx      ✅ Progress circle
│   │   │   ├── ModuleCard.jsx          ✅ Card module
│   │   │   ├── LessonCard.jsx          ✅ Card leçon
│   │   │   ├── PathLesson.jsx          ✅ Noeud leçon sur path
│   │   │   ├── PathXPNode.jsx          ✅ Noeud XP sur path
│   │   │   ├── PathSVG.jsx             ✅ SVG path connectant les noeuds
│   │   │   ├── StartNode.jsx           ✅ Noeud de départ
│   │   │   ├── BossFight.jsx           ✅ Combat de boss
│   │   │   ├── BossSuccessModal.jsx    ✅ Modal victoire boss
│   │   │   ├── BossGameOverModal.jsx   ✅ Modal défaite boss
│   │   │   ├── ChapterCompleteModal.jsx ✅ Modal fin chapitre
│   │   │   └── ModuleCompleteModal.jsx ✅ Modal fin module
│   │   ├── ai/                     ✅ 2 composants AI Understanding 🆕
│   │   │   ├── AITopicCard.jsx     ✅ Card topic IA (427 lignes)
│   │   │   └── AIPromptExample.jsx ✅ Exemple prompt ChatGPT (162 lignes)
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
│   │   ├── XPCollect.jsx           ✅ Page collecte XP (training)
│   │   ├── Contact.jsx             ✅ Terminal-style contact form
│   │   ├── lessons/                ✅ Module Leçons (7 pages) - Architecture complète
│   │   │   ├── LessonLanguage.jsx  ✅ Sélection langage leçons
│   │   │   ├── LessonModules.jsx   ✅ Liste modules d'un langage
│   │   │   ├── LessonList.jsx      ✅ Path de leçons dans un module
│   │   │   ├── LessonContent.jsx   ✅ Contenu leçon + exercices (27.4 KB)
│   │   │   ├── XPCollectLessons.jsx ✅ Collecte XP après leçon
│   │   │   ├── BossFightContent.jsx ✅ Combat de boss fin module
│   │   │   └── BossXPCollect.jsx   ✅ Collecte XP après boss
│   │   └── ai/                     ✅ Module AI Understanding (2 pages) 🆕
│   │       ├── AIHome.jsx          ✅ Page d'accueil AI topics
│   │       └── AIContent.jsx       ✅ Contenu topic IA + exercices (14.6 KB)
│   ├── assets/                     ✅ Logos et icônes langages
│   ├── hooks/
│   │   └── useHaptic.js            ✅ Hook vibration mobile
│   ├── utils/
│   │   ├── soundEffects.js         ✅ Web Audio API sounds
│   │   └── throttle.js             ✅ Throttle utility
│   ├── data/
│   │   ├── exercises-easy.json     ✅ 30 exercices Easy (22 KB) 🆕
│   │   ├── exercises-medium.json   ✅ 10 exercices Medium (10.4 KB) 🆕
│   │   ├── exercises-hard.json     ✅ 10 exercices Hard (13.2 KB) 🆕
│   │   ├── exercises.json          ✅ 50 exercices Python (42.5 KB - legacy)
│   │   ├── ai/                     ✅ Contenu AI Understanding 🆕
│   │   │   ├── topics.json         ✅ Liste 3 topics IA (1.4 KB)
│   │   │   └── ai_topic_001.json   ✅ Script Automatisation (11.8 KB, 7 exercices)
│   │   └── lessons/
│   │       └── python/
│   │           ├── modules.json    ✅ Liste modules Python
│   │           └── module_*/       ✅ 40 fichiers JSON (modules + leçons + boss)
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
│   ├── styles/                     ✅ 10 fichiers CSS (~2800 lignes) 🆕
│   │   ├── Exercise.css            ✅ 466 lignes, 70+ variables
│   │   ├── Home.css                ✅ 230 lignes
│   │   ├── Language.css            ✅ 240 lignes
│   │   ├── Difficulty.css          ✅ 250 lignes
│   │   ├── Auth.css                ✅ 240 lignes
│   │   ├── Layout.css              ✅ 310 lignes
│   │   ├── Contact.css             ✅ 493 lignes terminal macOS
│   │   ├── Lessons.css             ✅ Module leçons
│   │   ├── ActivityCalendar.css    ✅ Calendar component
│   │   └── Welcome.css             ✅ Welcome animation 🆕
│   ├── App.jsx                     ✅ Router 20 routes 🆕
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

## 📄 PAGES DÉTAILLÉES (21 pages)

### ✅ Pages Authentification (3 pages)
1. **Welcome.jsx** `/` - Onboarding
   - Logo + 3 boutons (Create Account, Login, Skip)
   - Animation premium V3
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
    - Animation collecte XP (training)
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

### ✅ Module Leçons (7 pages) - Architecture Complète 🆕
12. **LessonLanguage.jsx** `/lessons/language`
    - 4 language cards
    - Python → modules, autres "coming soon"
    - Lessons.css

13. **LessonModules.jsx** `/lessons/:language/modules` 🆕
    - Liste des modules d'un langage
    - Module cards avec progression
    - Unlock system (modules séquentiels)
    - Lessons.css

14. **LessonList.jsx** `/lessons/:language/:moduleId/lessons` 🆕
    - Path visuel interactif (SVG)
    - Noeuds leçons + noeuds XP
    - Start node + Boss node
    - PathSVG connectant les noeuds
    - Progression visuelle
    - Lessons.css

15. **LessonContent.jsx** `/lessons/:language/:moduleId/:lessonId`
    - Chargement dynamique leçon JSON
    - Progress bar sections
    - Multiple section types (text, code, exercise, tip, warning)
    - Exercise integration (3 input types)
    - XP rewards + Firestore sync
    - Lessons.css + 60 lignes inline
    - 27.4 KB (architecture complète)

16. **XPCollectLessons.jsx** `/lessons/:language/:moduleId/xp-collect/:nodeId` 🆕
    - Animation collecte XP après leçon
    - Progression module
    - Navigation vers leçon suivante
    - Lessons.css

17. **BossFightContent.jsx** `/lessons/:language/:moduleId/boss` 🆕
    - Combat de boss fin module
    - 3 vies, timer, questions difficiles
    - BossSuccessModal (victoire)
    - BossGameOverModal (défaite)
    - Mechanics de combat
    - Lessons.css

18. **BossXPCollect.jsx** `/lessons/:language/:moduleId/boss-xp` 🆕
    - Collecte XP après victoire boss
    - Bonus XP important
    - Progression module complété
    - Navigation modules
    - Lessons.css

### ✅ Module AI Understanding (2 pages) - NOUVEAU 🆕
19. **AIHome.jsx** `/ai-understanding`
    - Liste 3 topics IA
    - AITopicCard avec progression
    - Topic 1 : Script d'Automatisation (disponible)
    - Topics 2-3 : À venir
    - Lessons.css

20. **AIContent.jsx** `/ai-understanding/:topicId`
    - Contenu topic IA (sections)
    - Types : text, prompt_example, code_example, exercise
    - Exercices intégrés (7 dans topic 1)
    - XP rewards (15 XP par exercice)
    - Progression topic
    - 14.6 KB
    - Lessons.css

### 🔄 Pages Placeholder (1 route)
21. **Challenges** `/challenges` - Inline div (À implémenter)

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

## 🤖 MODULE AI UNDERSTANDING (NOUVEAU) 🆕

### 📋 Vue d'ensemble
Module éducatif pour apprendre à **comprendre et auditer le code généré par l'IA** (ChatGPT, Copilot, etc.).

### 🎯 Concept
- L'IA génère 50% du code en 2025
- Personne n'enseigne à lire/auditer le code IA
- ReadCod comble ce gap avec des topics pratiques

### 📚 Topics Disponibles

#### ✅ Topic 1 : Script d'Automatisation Python (Disponible)
- **ID** : `ai_topic_001`
- **Contenu** : 9 sections + 7 exercices
- **Prompt** : "Écris-moi un script Python qui renomme tous les fichiers .jpg d'un dossier en ajoutant la date du jour"
- **XP Total** : 105 XP
- **Difficulté** : 1 (Beginner)
- **Durée estimée** : 20 min
- **Tags** : python, automation, files, beginner

**Structure du topic :**
1. Introduction au prompt
2. Exemple prompt ChatGPT (AIPromptExample component)
3. Code généré par ChatGPT (code_example)
4. Décortiquage ligne par ligne
5. Étape 1 : Imports (os, datetime)
6. Exercice 1 : import os
7. Étape 2 : Variables (folder_path, today)
8. Exercice 2 : datetime.now()
9. Exercice 3 : strftime()
10. Étape 3 : Boucle (os.listdir, for, endswith)
11. Exercice 4 : os.listdir()
12. Exercice 5 : endswith()
13. Étape 4 : Renommage (os.path.join, os.rename)
14. Exercice 6 : os.path.join()
15. Exercice 7 : os.rename()

#### 🔜 Topic 2 : Site Web E-commerce (À venir)
- **ID** : `ai_topic_002`
- **Contenu** : 15 sections + 12 exercices
- **Prompt** : Construction site complet (frontend, backend, DB)
- **XP Total** : 180 XP
- **Difficulté** : 3 (Advanced)
- **Tags** : web, flask, database, advanced

#### 🔜 Topic 3 : Détecter les Erreurs de l'IA (À venir)
- **ID** : `ai_topic_003`
- **Contenu** : 10 sections + 8 exercices
- **Focus** : Bugs, hallucinations, failles sécurité
- **XP Total** : 160 XP
- **Difficulté** : 2 (Intermediate)
- **Tags** : debugging, security, best-practices

### 🏗️ Architecture Composants AI

```
src/components/ai/
├── AITopicCard.jsx       (427 lignes) - Card topic avec progression
└── AIPromptExample.jsx   (162 lignes) - Affichage prompt ChatGPT
```

**AITopicCard :**
- Icon topic (emoji)
- Title + description
- Difficulté (1-3)
- Temps estimé
- XP reward
- Progression (0-100%)
- Status : locked, available, completed

**AIPromptExample :**
- Design simulant interface ChatGPT
- User prompt affiché
- Model badge (ChatGPT 4, Copilot, etc.)
- Tip pédagogique
- Style unique (gradient, glassmorphism)

### 📊 Métriques AI Understanding
- **3 topics** planifiés
- **1 topic** implémenté (33%)
- **7 exercices** disponibles (topic 1)
- **105 XP** disponibles actuellement
- **445 XP** total quand tous topics implémentés

---

## 🎯 FEATURES IMPLÉMENTÉES

### ✅ Core Features
1. **50 exercices Python** (30 Easy, 10 Medium, 10 Hard) - 4 types, 3 modes d'input
2. **Module Leçons complet** - Architecture avec modules, path SVG, boss fights
3. **Module AI Understanding** - 1 topic disponible, 2 à venir 🆕
4. **21 pages complètes** + 1 placeholder
5. **34 composants React** réutilisables organisés
6. **3 modes d'input** (options, free_input, clickable_lines)

### ✅ Architecture & Code
7. **Composants modulaires** - 34 composants organisés en 10 dossiers
8. **Système de routing** - React Router avec 20 routes 🆕
9. **Context API** - AuthContext + ProgressContext
10. **Performance** - React.memo, lazy loading, optimisations
11. **Tests unitaires** - 97 tests (100% réussite) Vitest + RTL
12. **CSS externalisé** - 10 fichiers CSS (~2800 lignes) 🆕
13. **Utilities** - soundEffects.js (Web Audio API), throttle.js

### ✅ Design & UX
14. **Syntax highlighting** - Python custom avec coloration précise
15. **États interactifs** - Initial, sélection, validation, feedback
16. **Design iOS-style** - Interface native mobile
17. **Responsive mobile** - Optimisé iPhone SE à Pro Max
18. **Haptic feedback** - Vibrations natives iOS/Android
19. **Sound effects** - Web Audio API (typing, success, error)
20. **Animations fluides** - Transitions et effets visuels
21. **Système d'explication** - Toggle avec highlighting code
22. **FeedbackGlow** - Effets visuels bordures écran
23. **Path SVG interactif** - Leçons connectées visuellement 🆕
24. **Boss fights** - Combats de boss fin module 🆕

### ✅ Authentification & Data
25. **Firebase Authentication** - Email/Password + mode invité
26. **Firestore Database** - Sauvegarde progression cloud
27. **localStorage** - Mode invité + fallback
28. **Migration auto** - localStorage → Firestore
29. **Pages auth** - Welcome, Login, Signup (iOS-style)
30. **Système de progression** - Niveaux, XP, stats
31. **Activity calendar** - Heatmap activité quotidienne

### ✅ Production Ready
32. **PWA complet** - Service Worker, manifest, 8 icônes
33. **Firestore Rules** - Règles sécurité déployées
34. **Configuration Vercel** - vercel.json avec optimisations
35. **CI/CD** - Déploiement automatique GitHub → Vercel
36. **Documentation** - 20+ fichiers Markdown

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
- **100+ fichiers** JSX/JS/CSS/JSON/Config 🆕
- **34 composants** React réutilisables 🆕
- **21 pages** créées (20 complètes, 1 placeholder) 🆕
- **20 routes** configurées dans React Router 🆕
- **2 contexts** (AuthContext + ProgressContext)
- **2 services** (progressService + userService)
- **3 utilities** (useHaptic, soundEffects, throttle)
- **10 fichiers CSS** externalisés (~2800 lignes) 🆕
- **6 fichiers** de tests (97 tests, 100% réussite)
- **20+ fichiers** Markdown documentation

### 📚 Contenu
- **50 exercices** training Python (réorganisés en 3 fichiers) 🆕
- **40 fichiers JSON** leçons Python (modules + leçons + boss) 🆕
- **7 exercices** AI Understanding (topic 1) 🆕
- **115+ exercices** Python total (estimation) 🆕

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
- **21 pages** (20 complètes + 1 placeholder) 🆕
- **20 routes** configurées 🆕
- **50 exercices Python training** (réorganisés)
- **Module Leçons complet** - Architecture avec modules, path, boss 🆕
- **Module AI Understanding** - 1 topic disponible, 2 à venir 🆕
- **34 composants React** organisés 🆕
- **Firebase Auth + Firestore** opérationnels
- **PWA complet** (Service Worker, manifest, icônes)
- **Tests unitaires** (97 tests, 100%)
- **Vercel CI/CD** automatisé

### 🔄 Prochaines Features (Optionnel)
1. **Page Challenges** - Dernière page placeholder
2. **AI Topics 2 & 3** - E-commerce site + Détecter erreurs IA
3. **Custom domain** - Configuration domaine personnalisé
4. **Graphiques progression** - Chart.js dans Profile
5. **Badges/achievements** - Système de récompenses
6. **OAuth** - Connexion Google/GitHub
7. **Multiple langages** - JavaScript, Java, C++

---

**Dernière mise à jour :** 2 décembre 2025
**Version :** 1.0.0 (Live in Production)
**Status :** ✅ App déployée - GitHub → Vercel CI/CD actif
**Branche** : PC (branche de développement principale)

---

## 🎯 LIENS RAPIDES

**🚀 PRODUCTION**
- App déployée sur Vercel
- Firebase Auth + Firestore actifs
- PWA configuré et fonctionnel
- CI/CD automatique (GitHub → Vercel)

**📝 PROCHAINES ÉTAPES**
1. Implémenter page Challenges (dernière page)
2. Créer AI Topics 2 & 3 (E-commerce + Auditor)
3. Configurer domaine custom
4. Ajouter langages (JavaScript, Java, C++)
5. Système de badges et achievements
