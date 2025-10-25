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
- **JSON local** pour exercices (10 exercices Python implémentés)
- **localStorage** pour progression utilisateur + état authentification ✅ IMPLÉMENTÉ
- **Firebase Authentication** pour comptes utilisateurs ✅ NOUVEAU
- **Firestore Database** prêt pour stockage progression (à implémenter)

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
│   │   │   ├── QuestionCard.jsx    ✅ FAIT - Question + feedback + explication expandable
│   │   │   ├── CodeBlock.jsx       ✅ FAIT - Syntax highlighting Python + ligne highlighting
│   │   │   ├── OptionButton.jsx    ✅ FAIT - États default/selected/correct/incorrect
│   │   │   └── ActionButton.jsx    ✅ FAIT - Bouton Valider/Continuer avec états
│   │   ├── common/
│   │   │   └── FeedbackGlow.jsx    ✅ FAIT - Effets visuels bordures écran
│   │   └── auth/                   ✅ NOUVEAU - Composants authentification
│   │       └── AuthButton.jsx      ✅ FAIT - Bouton auth dans header
│   ├── pages/
│   │   ├── Welcome.jsx             ✅ NOUVEAU - Page onboarding
│   │   ├── Login.jsx               ✅ NOUVEAU - Page connexion
│   │   ├── Signup.jsx              ✅ NOUVEAU - Page inscription
│   │   ├── Home.jsx                ✅ FAIT - Page d'accueil avec menu iOS-style + auth
│   │   ├── Language.jsx            ✅ FAIT - Sélection langage
│   │   ├── Difficulty.jsx          ✅ FAIT - Sélection difficulté
│   │   └── Exercise.jsx            ✅ FAIT - Page exercice complète avec navigation
│   ├── assets/                     ✅ FAIT - Logos et images
│   │   ├── long_logo.png
│   │   ├── full_logo.png
│   │   └── react.svg
│   ├── hooks/
│   │   └── useHaptic.js            ✅ FAIT - Hook vibration mobile
│   ├── data/
│   │   └── exercises.json          ✅ FAIT - 10 exercices Python avec explications
│   ├── context/                    ✅ FAIT - AuthContext pour authentification
│   │   └── AuthContext.jsx
│   ├── config/                     ✅ NOUVEAU - Configuration Firebase
│   │   └── firebase.js
│   ├── utils/                      ❌ TODO - Storage et scoring
│   ├── styles/                     ❌ TODO - CSS modules (actuellement inline)
│   ├── App.jsx                     ✅ FAIT - Router avec routes principales
│   ├── App.css                     ✅ FAIT - Styles de base
│   ├── index.css                   ✅ FAIT - Reset CSS global
│   └── main.jsx                    ✅ FAIT - Entry point React
├── index.html                      ✅ FAIT - Google Fonts JetBrains Mono + Jersey 25
├── .env                            ✅ NOUVEAU - Variables Firebase (gitignored)
├── .env.example                    ✅ NOUVEAU - Template variables
├── package.json                    ✅ FAIT - Dépendances à jour (+ Firebase)
├── vite.config.js                  ✅ FAIT
├── eslint.config.js                ✅ FAIT - Configuration ESLint
├── CLAUDE.md                       ✅ FAIT - Ce fichier (mis à jour)
├── FIREBASE_SETUP.md               ✅ NOUVEAU - Guide configuration Firebase
├── AUTH_IMPLEMENTATION.md          ✅ NOUVEAU - Documentation technique auth
└── QUICKSTART_AUTH.md              ✅ NOUVEAU - Démarrage rapide 5 minutes
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

### ✅ FAIT (MVP Fonctionnel)
1. **Page Home** - Menu iOS-style avec navigation + auth status
2. **Page Exercise** - Interface complète d'exercice
3. **Composants modulaires** - 11 composants React réutilisables
4. **Système de routing** - React Router avec 9 routes (+ auth)
5. **10 exercices Python** - Chargés depuis JSON avec explications
6. **Syntax highlighting** - Python custom avec coloration précise
7. **États interactifs** - Initial, sélection, validation, feedback
8. **Progress bar** - Suivi progression en temps réel
9. **Design iOS-style** - Interface native mobile
10. **Responsive mobile** - Optimisé iPhone SE à Pro Max
11. **Haptic feedback** - Vibrations natives iOS/Android
12. **Animations fluides** - Transitions et effets visuels
13. **Système d'explication** - Bouton toggle avec highlighting code
14. **Navigation exercices** - Suivant/Précédent avec reset auto
15. **🔥 Authentification Firebase** - Email/Password + mode invité ✅ NOUVEAU
16. **Context API** - AuthContext pour state global auth ✅ NOUVEAU
17. **localStorage** - Sauvegarde état auth + progression ✅ NOUVEAU
18. **Pages auth** - Welcome, Login, Signup (iOS-style) ✅ NOUVEAU

### 🔄 EN COURS (Prochaines priorités)
19. **Firestore sync** - Sauvegarder progression utilisateur dans DB
20. **Pages manquantes** - Leçons, Challenges, AI Understanding, Contact
21. **Système de scoring** - Points, niveaux, statistiques
22. **CSS modules** - Externalisation styles inline

### ❌ TODO (Post-MVP)
23. **OAuth** - Connexion Google/GitHub
24. **Reset password** - Mot de passe oublié
25. **Email verification** - Validation email obligatoire
26. **Multiple langages** - JavaScript, Java, C++
27. **PWA** - Mode offline, installation
28. **Mode sombre/clair** - Toggle thème
29. **Streak system** - Séries quotidiennes
30. **Badges/achievements** - Système de récompenses
31. **Sound effects** - Feedback audio
32. **Leaderboard** - Classement utilisateurs
33. **Tests unitaires** - Jest + Testing Library
34. **2FA** - Authentification à deux facteurs

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
- [x] ✅ Créer exercises.json avec 10 exercices
- [x] ✅ Système de navigation next/previous
- [x] ✅ Implémenter Context API (AuthContext)
- [x] ✅ localStorage pour progression + auth
- [ ] 🔄 Externaliser styles en CSS modules

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

### Phase 2 : Pages manquantes
- [x] ✅ Page Home avec menu iOS
- [x] ✅ Page Exercise complète
- [ ] ❌ Page Leçons (route existe, contenu à créer)
- [ ] ❌ Page Challenges (route existe, contenu à créer)
- [ ] ❌ Page AI Understanding (route existe, contenu à créer)
- [ ] ❌ Page Contact (route existe, contenu à créer)

### Phase 3 : Fonctionnalités avancées
- [ ] 🔄 Firestore - Sauvegarder progression dans DB
- [ ] ❌ Système de scoring/niveaux
- [ ] ❌ Profil utilisateur avec stats
- [ ] ❌ 20 exercices supplémentaires Python
- [ ] ❌ Support JavaScript (nouveau langage)

### Phase 4 : Production & Deploy ✅ PRÊT
- [x] ✅ Animations avancées implémentées
- [x] ✅ Responsive mobile optimisé
- [ ] ❌ PWA setup (offline, installation)
- [ ] ❌ Tests unitaires (Jest + Testing Library)
- [ ] ❌ Deploy Vercel/Netlify

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

## 🐛 BUGS CONNUS
- ⚠️ **Header component** inutilisé dans Exercise.jsx (code dupliqué inline)
- ⚠️ **CSS répétitif** dans tous les composants (styles inline)
- ⚠️ **Routes manquantes** affichent "En cours de développement"
- ⚠️ **Firebase non configuré** : Il faut configurer les clés dans `.env` (voir FIREBASE_SETUP.md)

## 💡 NOTES TECHNIQUES
- **MVP fonctionnel avec auth** : App prête pour testing utilisateur
- **Firebase Authentication** : Email/Password + mode invité implémenté
- **Performance optimisée** : 60fps sur mobile, animations fluides
- **Code quality** : Composants modulaires, hooks personnalisés, Context API
- **Mobile-first** : Responsive iPhone SE à Pro Max
- **Accessibility** : Touch targets 44px+, navigation clavier
- **10 exercices Python** : Suffisant pour validation concept
- **Sécurité** : Variables d'environnement, validation formulaires, messages erreur français

## 🔧 COMMANDES UTILES
```bash
# Développement
npm run dev              # Serveur local Vite
npm run build           # Build production
npm run preview         # Preview build
npm run lint            # ESLint check

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

**Prochaine étape recommandée :** Configurer Firebase (voir QUICKSTART_AUTH.md) puis implémenter sauvegarde progression dans Firestore

---

## 📖 DOCUMENTATION AUTHENTIFICATION

Pour l'authentification Firebase, consulter :

1. **[QUICKSTART_AUTH.md](QUICKSTART_AUTH.md)** - ⚡ Démarrage rapide en 5 minutes
2. **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - 📝 Guide complet configuration Firebase
3. **[AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md)** - 🔧 Documentation technique détaillée

---

**Dernière mise à jour :** 25 octobre 2025
**Version :** 0.3.0 (MVP + Authentification Firebase)
**Status :** 🟢 MVP avec auth terminé - Prêt pour testing