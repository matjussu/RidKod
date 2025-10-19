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
- **React 18.3** - UI framework
- **Vite 5.2** - Build tool
- **React Router DOM 6.22** - Navigation
- **React Syntax Highlighter 15.5** - Code display
- **Lucide React 0.344** - Icons

### Styling
- **CSS pur** (pas de Tailwind/styled-components)
- **CSS Variables** pour thème
- **CSS-in-JS** avec styles inline dans composants
- **Mobile-first** design

### State Management
- **React Context API** (pas de Redux)
- Local state avec useState/useReducer
- Pas de state management externe pour MVP

### Data
- **JSON local** pour exercices (pas de backend pour MVP)
- localStorage pour progression utilisateur
- Pas de base de données externe

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
│   │   ├── layout/
│   │   │   ├── Header.jsx          ✅ FAIT - Header avec close button et ProgressBar
│   │   │   └── ProgressBar.jsx     ✅ FAIT - Barre de progression avec current/total
│   │   ├── exercise/
│   │   │   ├── QuestionCard.jsx    ✅ FAIT - Question + feedback intégré
│   │   │   ├── CodeBlock.jsx       ✅ FAIT - Syntax highlighting Python custom
│   │   │   ├── OptionButton.jsx    ✅ FAIT - États default/selected/correct/incorrect
│   │   │   └── ActionButton.jsx    ✅ FAIT - Bouton Valider/Continuer
│   │   └── common/                 ❌ TODO - Composants réutilisables
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   ├── pages/                      ❌ TODO - À créer
│   │   ├── Home.jsx
│   │   ├── Exercise.jsx
│   │   ├── Profile.jsx
│   │   └── Leaderboard.jsx
│   ├── context/                    ❌ TODO - À créer
│   │   └── AppContext.jsx
│   ├── hooks/                      ❌ TODO - À créer
│   │   ├── useExercise.js
│   │   └── useProgress.js
│   ├── data/                       ❌ TODO - À créer
│   │   └── exercises.json
│   ├── utils/                      ❌ TODO - À créer
│   │   ├── storage.js
│   │   └── scoring.js
│   ├── styles/                     ❌ TODO - À créer
│   │   ├── variables.css
│   │   └── components/
│   ├── App.jsx                     ✅ FAIT - Orchestrateur principal
│   └── main.jsx                    ✅ FAIT - Entry point
├── index.html                      ✅ FAIT - Google Fonts JetBrains Mono importé
├── package.json                    ✅ FAIT
├── vite.config.js                  ✅ FAIT
└── CLAUDE.md                       ✅ FAIT - Ce fichier
```

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

### Types d'exercices
- `predict_output` : Prédire la sortie
- `find_bug` : Trouver le bug
- `identify_line` : Quelle ligne pose problème

### Niveaux difficulté
- `1` : Débutant (10 XP)
- `2` : Intermédiaire (20 XP)
- `3` : Avancé (30 XP)

---

## 🎯 FEATURES MVP (Priorités)

### ✅ FAIT
1. ExerciseScreen component complet
2. États : initial, selected, correct, incorrect
3. Progress bar fonctionnelle
4. Syntax highlighting Python
5. Design iOS-style exact
6. Responsive mobile

### 🔄 EN COURS (Prochaines étapes)
7. Modularisation en composants réutilisables
8. Système de routing (React Router)
9. Chargement exercices depuis JSON
10. Context API pour state global

### ❌ TODO (Post-MVP)
11. Page Home avec menu
12. Page Profile avec stats
13. Leaderboard quotidien
14. Multiple langages (Python + JavaScript)
15. PWA (offline, installable)
16. Animations avancées
17. Sound effects
18. Streak system
19. Badges/achievements
20. Mode sombre/clair toggle

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

### Phase 1 : Modularisation 
- [ ] Séparer App.jsx en composants
- [ ] Créer structure dossiers
- [ ] Externaliser styles en CSS modules
- [ ] Setup React Router

### Phase 2 : Data & State 
- [ ] Créer exercises.json avec 30 exercices
- [ ] Implémenter Context API
- [ ] Système de navigation next/previous
- [ ] localStorage pour progression

### Phase 3 : Pages supplémentaires 
- [ ] Page Home
- [ ] Page Profile
- [ ] Page Leaderboard
- [ ] Navigation entre pages

### Phase 4 : Polish & Deploy 
- [ ] Animations avancées
- [ ] PWA setup
- [ ] Tests sur iPhone réel
- [ ] Deploy Vercel/Netlify

---

## 📚 RESSOURCES

### Documentation
- React : https://react.dev
- Vite : https://vitejs.dev
- React Router : https://reactrouter.com
- React Syntax Highlighter : https://github.com/react-syntax-highlighter

### Design Inspiration
- iOS Human Interface Guidelines
- Duolingo app
- Sololearn app

### Code Quality
- ESLint (pas encore configuré)
- Prettier (pas encore configuré)

---

## 🐛 BUGS CONNUS
- Aucun pour l'instant

## 💡 NOTES
- Garder le MVP simple : 30 exercices Python suffisent
- Focus qualité > quantité d'exercices
- Mobile-first : 90% des users sur mobile
- Performance : app doit être fluide (60fps)
- Accessibility : à implémenter post-MVP

---

## 🤝 CONTRIBUTION
Solo dev pour l'instant : toi !

Claude Code aide pour :
- Génération composants
- Refactoring
- Debugging
- Optimisations

---

**Dernière mise à jour :** [Date du jour]
**Version :** 0.1.0 (MVP en cours)
**Status :** 🟡 En développement actif