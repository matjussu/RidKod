# 🗺️ ROADMAP - ReadCod

**Dernière mise à jour :** 30 octobre 2025
**Version actuelle :** 0.7.0
**Statut :** Plateforme fonctionnelle, prête pour expansion contenu

---

## 📊 ÉTAT ACTUEL DU PROJET

### ✅ Ce qui fonctionne parfaitement

**Contenu**
- 30 exercices Python niveau Easy
- 4 types d'exercices (predict_output, find_error, trace_execution, concept_understanding)
- 3 modes d'input (options, free_input, clickable_lines)

**Architecture technique**
- 39 fichiers (11 composants, 8 pages, 2 contexts)
- React 19.1 + Vite 7.1 + React Router 7.9
- Firebase Authentication + Firestore Database
- 97 tests unitaires (100% de réussite)
- Performance optimisée (React.memo, lazy loading)

**Features utilisateur**
- Authentification complète (email/password + mode invité)
- Système de progression (XP, niveaux, stats)
- Sauvegarde cloud (Firestore) + locale (localStorage)
- Interface iOS-style responsive
- Haptic feedback + animations fluides

### ⚠️ Limitations actuelles

**Contenu**
- Seulement 30 exercices disponibles (utilisateurs finissent en ~20 minutes)
- Pas de niveaux Medium/Hard
- Seulement Python (pas JavaScript, Java, C++)
- Pas de leçons/tutoriels structurés

**Code & Qualité**
- ~1600 lignes de CSS inline à externaliser (4 pages)
- 4 routes affichent "En cours de développement"
- Header component inutilisé (code dupliqué)

**Production**
- Firestore Security Rules non configurées
- Pas de PWA (mode offline)
- Pas déployé (local uniquement)
- Pas de domaine custom

---

## 🎯 PROCHAINES TÂCHES PAR PRIORITÉ

## PRIORITÉ 1 : Contenu - Expansion Exercices 🔥 URGENT

**Objectif :** Passer de 30 à 90 exercices pour garder les utilisateurs engagés

### Tâche 1.1 : Créer 30 exercices Python Medium (difficulté 2)

**Temps estimé :** 4-6h
**Impact :** ⭐⭐⭐⭐⭐ CRITIQUE

**Concepts à couvrir :**
```python
# Niveau Medium (20 XP par exercice)
- Fonctions (définition, return, paramètres)
- Fonctions récursives simples (factorielle, fibonacci)
- Dictionnaires avancés (nested, methods)
- List comprehensions
- Try/except error handling
- String manipulation avancée (split, join, format)
- Tuples et unpacking
- Sets et opérations ensemblistes
- Lambda functions
- Map/filter/reduce basiques
```

**Format JSON à suivre :**
```json
{
  "id": "py_medium_001",
  "language": "python",
  "difficulty": 2,
  "type": "predict_output",
  "inputType": "options",
  "question": "Que renvoie ce programme ?",
  "code": "def multiplier(x):\n    return lambda y: x * y\n\ndouble = multiplier(2)\nresult = double(5)\nprint(result)",
  "options": ["2", "5", "10", "Error"],
  "correctAnswer": 2,
  "explanation": "...",
  "highlightedLines": [2, 4],
  "xpGain": 20,
  "tags": ["functions", "lambda", "closures"]
}
```

**Variété des exercices :**
- 8 exercices `predict_output`
- 6 exercices `find_error`
- 4 exercices `trace_execution`
- 12 exercices `concept_understanding`

**Modes d'input :**
- 15 exercices `options`
- 8 exercices `free_input`
- 7 exercices `clickable_lines`

---

### Tâche 1.2 : Créer 30 exercices Python Hard (difficulté 3)

**Temps estimé :** 6-8h
**Impact :** ⭐⭐⭐⭐⭐ CRITIQUE

**Concepts à couvrir :**
```python
# Niveau Hard (30 XP par exercice)
- Classes et objets (init, methods, attributes)
- Héritage et polymorphisme
- Decorators simples
- Generators (yield)
- Context managers (with statement)
- File operations (read, write, with)
- List/dict comprehensions avancées
- Exception handling avancé
- Modules et imports
- Algorithmes (sorting, searching)
```

**Variété des exercices :**
- 10 exercices `predict_output`
- 8 exercices `find_error`
- 6 exercices `trace_execution`
- 6 exercices `concept_understanding`

**Modes d'input :**
- 12 exercices `options`
- 10 exercices `free_input`
- 8 exercices `clickable_lines`

---

### Tâche 1.3 : Valider et tester les 60 nouveaux exercices

**Temps estimé :** 2-3h
**Impact :** ⭐⭐⭐⭐

**Actions :**
- [ ] Vérifier format JSON de tous les exercices
- [ ] Tester chaque exercice dans l'app
- [ ] Vérifier explications claires et précises
- [ ] Valider `highlightedLines` correctes
- [ ] Tester 3 modes d'input fonctionnent
- [ ] Vérifier progression XP cohérente

---

## PRIORITÉ 2 : Pages Manquantes 📄

**Objectif :** Compléter les 4 routes "En cours de développement"

### Tâche 2.1 : Page Leçons (/lessons)

**Temps estimé :** 3-4h
**Impact :** ⭐⭐⭐⭐

**Contenu à créer :**
```javascript
// Structure de données
const lessons = [
  {
    id: 1,
    title: "Les Variables",
    description: "Comprendre l'affectation et les types de variables",
    duration: "5 min",
    difficulty: 1,
    exercises: [1, 2, 3, 4, 5], // IDs exercices associés
    completed: false
  },
  {
    id: 2,
    title: "Les Boucles For",
    description: "Maîtriser les itérations avec for et range()",
    duration: "8 min",
    difficulty: 1,
    exercises: [6, 7, 8, 9, 10],
    completed: false
  }
  // ... 10-15 leçons totales
]
```

**Design :**
- Cards iOS-style comme Home.jsx
- Progress bar par leçon (% exercices complétés)
- Badge "Complété" vert
- Clic sur card → navigation vers exercices de la leçon
- Filtres par niveau (Easy/Medium/Hard)

---

### Tâche 2.2 : Page Challenges (/challenges)

**Temps estimé :** 2-3h
**Impact :** ⭐⭐⭐

**Contenu à créer :**
```javascript
// Structure de données
const challenges = [
  {
    id: 1,
    title: "Défi Quotidien",
    description: "Complète 5 exercices aujourd'hui",
    type: "daily",
    target: 5,
    current: 2,
    reward: 50, // XP bonus
    deadline: "2025-10-31",
    completed: false
  },
  {
    id: 2,
    title: "Série Parfaite",
    description: "10 réponses correctes d'affilée",
    type: "streak",
    target: 10,
    current: 7,
    reward: 100,
    completed: false
  }
  // ... 5-8 challenges différents
]
```

**Features :**
- Timer pour défis quotidiens
- Progress bar par challenge
- Badges récompenses
- Notifications visuelles completion

---

### Tâche 2.3 : Page AI Understanding (/ai-understanding)

**Temps estimé :** 2h
**Impact :** ⭐⭐

**Contenu éducatif :**
- Introduction : "Comment l'IA génère du code"
- Section 1 : "Les erreurs typiques du code IA"
  - Exemples concrets
  - Comment les détecter
- Section 2 : "Auditer du code généré par IA"
  - Checklist de vérification
  - Bonnes pratiques
- Section 3 : "Exercices spéciaux AI"
  - 5-10 exercices sur du code généré par IA
  - Trouver les bugs typiques

**Design :**
- Format article/tutoriel
- Code snippets avec highlighting
- Icons et illustrations
- Navigation entre sections

---

### Tâche 2.4 : Page Contact (/contact)

**Temps estimé :** 1-2h
**Impact :** ⭐⭐

**Contenu :**
```javascript
// Formulaire simple
- Nom (input)
- Email (input, validation)
- Type (select: Bug report, Feature request, Question, Autre)
- Message (textarea)
- Bouton "Envoyer" (iOS-style)

// Intégration
- Utiliser EmailJS ou Firebase Functions
- Message confirmation envoi
- Validation formulaire côté client

// Informations additionnelles
- Email direct : contact@readcod.app
- GitHub : github.com/username/readcod
- Discord : discord.gg/readcod (optionnel)
```

**Design :**
- Formulaire iOS-style cohérent
- Validation en temps réel
- Messages d'erreur français
- Animation envoi réussi

---

## PRIORITÉ 3 : Refactoring CSS 🎨

**Objectif :** Externaliser ~1600 lignes de CSS inline

### Tâche 3.1 : Externaliser CSS Home.jsx

**Temps estimé :** 2h
**Impact :** ⭐⭐⭐

**Actions :**
- [ ] Créer `src/styles/Home.css`
- [ ] Extraire ~400 lignes CSS de Home.jsx
- [ ] Utiliser CSS variables pour cohérence
- [ ] Tester responsive mobile
- [ ] Vérifier animations fonctionnent

**Résultat attendu :**
- Home.jsx : 493 → ~150 lignes (-70%)
- Home.css : ~350 lignes

---

### Tâche 3.2 : Externaliser CSS Profile.jsx

**Temps estimé :** 2h
**Impact :** ⭐⭐⭐

**Actions :**
- [ ] Créer `src/styles/Profile.css`
- [ ] Extraire ~330 lignes CSS de Profile.jsx
- [ ] Réutiliser variables Exercise.css si possible
- [ ] Tester affichage stats
- [ ] Vérifier cards et progress bars

**Résultat attendu :**
- Profile.jsx : 446 → ~150 lignes (-65%)
- Profile.css : ~300 lignes

---

### Tâche 3.3 : Externaliser CSS Language.jsx

**Temps estimé :** 2h
**Impact :** ⭐⭐⭐

**Actions :**
- [ ] Créer `src/styles/Language.css`
- [ ] Extraire ~400 lignes CSS de Language.jsx
- [ ] Unifier avec Home.css (styles similaires)
- [ ] Tester grille de cards
- [ ] Vérifier hover/active states

**Résultat attendu :**
- Language.jsx : 492 → ~150 lignes (-70%)
- Language.css : ~350 lignes

---

### Tâche 3.4 : Externaliser CSS Difficulty.jsx

**Temps estimé :** 2h
**Impact :** ⭐⭐⭐

**Actions :**
- [ ] Créer `src/styles/Difficulty.css`
- [ ] Extraire ~410 lignes CSS de Difficulty.jsx
- [ ] Unifier avec Language.css (structures similaires)
- [ ] Tester sélection difficulté
- [ ] Vérifier animations

**Résultat attendu :**
- Difficulty.jsx : 509 → ~150 lignes (-70%)
- Difficulty.css : ~360 lignes

---

### Tâche 3.5 : Créer fichier CSS global partagé

**Temps estimé :** 1h
**Impact :** ⭐⭐

**Actions :**
- [ ] Créer `src/styles/shared.css`
- [ ] Extraire styles communs (cards, buttons, animations)
- [ ] Importer dans tous les CSS modules
- [ ] Centraliser CSS variables
- [ ] Documenter classes réutilisables

**Résultat attendu :**
- shared.css : ~200 lignes
- Réduction duplication ~30%

---

## PRIORITÉ 4 : Améliorations UX/UI 🎨

**Objectif :** Améliorer rétention et engagement utilisateur

### Tâche 4.1 : Système de Streaks complet

**Temps estimé :** 3h
**Impact :** ⭐⭐⭐⭐

**À implémenter :**
```javascript
// Dans progressService.js
export const updateStreak = async (userId) => {
  const today = new Date().toDateString();
  const progress = await getUserProgress(userId);
  const lastVisit = progress.lastVisitDate;

  // Si dernière visite = hier → streak++
  // Si dernière visite = aujourd'hui → rien
  // Si dernière visite > 1 jour → streak = 1

  await updateDoc(doc(db, 'progress', userId), {
    lastVisitDate: today,
    currentStreak: newStreak,
    longestStreak: Math.max(longestStreak, newStreak)
  });
}
```

**Features :**
- [ ] Tracker dernière visite quotidienne
- [ ] Incrémenter/reset streak automatique
- [ ] Affichage dans Profile.jsx avec 🔥
- [ ] Notification "Ne perds pas ta série !"
- [ ] Badge "7 jours consécutifs", "30 jours", etc.

---

### Tâche 4.2 : Graphiques de progression

**Temps estimé :** 3-4h
**Impact :** ⭐⭐⭐

**Installer Chart.js :**
```bash
npm install chart.js react-chartjs-2
```

**Graphiques à ajouter dans Profile.jsx :**
1. **Graphique XP au fil du temps** (ligne)
   - X : Derniers 7/30 jours
   - Y : XP gagné par jour

2. **Répartition correct/incorrect** (donut)
   - % réponses correctes (vert)
   - % réponses incorrectes (rouge)

3. **Exercices par type** (barres)
   - predict_output : X exercices
   - find_error : X exercices
   - trace_execution : X exercices
   - concept_understanding : X exercices

**Design :**
- Thème sombre cohérent avec app
- Animations fluides
- Responsive mobile
- Toggle 7j / 30j / Tout

---

### Tâche 4.3 : Système de Badges/Achievements

**Temps estimé :** 4h
**Impact :** ⭐⭐⭐⭐

**Structure de données :**
```javascript
const achievements = [
  {
    id: 'first_exercise',
    title: 'Premier Pas',
    description: 'Complète ton premier exercice',
    icon: '🎯',
    unlocked: true,
    unlockedAt: '2025-10-25'
  },
  {
    id: 'perfect_10',
    title: 'Série Parfaite',
    description: '10 réponses correctes d\'affilée',
    icon: '🔥',
    progress: 7,
    target: 10,
    unlocked: false
  },
  {
    id: 'python_master_easy',
    title: 'Maître Python Easy',
    description: 'Complète tous les exercices Easy',
    icon: '🐍',
    progress: 28,
    target: 30,
    unlocked: false
  }
  // ... 15-20 badges totaux
]
```

**Features :**
- [ ] Vérification automatique après chaque exercice
- [ ] Animation unlock badge
- [ ] Affichage dans Profile (grille badges)
- [ ] Badge non unlock = grisé + progress bar
- [ ] Notification toast unlock badge

**Badges à créer :**
- Premier exercice complété
- 10/50/100 exercices complétés
- 10/50/100 réponses correctes
- Série 5/10/20 correct d'affilée
- Maître niveau Easy/Medium/Hard
- Streak 7/30/100 jours
- Aucune erreur sur un niveau complet
- Vitesse (niveau en <10min)

---

### Tâche 4.4 : Améliorer LevelComplete.jsx

**Temps estimé :** 2h
**Impact :** ⭐⭐⭐

**Améliorations :**
- [ ] Ajouter graphique donut correct/incorrect
- [ ] Animation confetti si >80% correct
- [ ] Afficher XP gagné vs XP possible
- [ ] Montrer badge unlock si applicable
- [ ] Bouton "Refaire le niveau" (optionnel)
- [ ] Comparaison avec meilleure performance précédente

---

## PRIORITÉ 5 : Production Ready 🚀

**Objectif :** Déployer l'app en production

### Tâche 5.1 : Configurer Firestore Security Rules

**Temps estimé :** 1h
**Impact :** ⭐⭐⭐⭐⭐ CRITIQUE SÉCURITÉ

**Actions :**
- [ ] Suivre guide FIRESTORE_SECURITY.md
- [ ] Copier/coller rules dans Firebase Console
- [ ] Tester en mode production
- [ ] Vérifier users peuvent seulement accéder leur data
- [ ] Logger tentatives accès non autorisé

**Rules à configurer :**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### Tâche 5.2 : PWA Setup

**Temps estimé :** 3-4h
**Impact :** ⭐⭐⭐⭐

**Actions :**
- [ ] Installer `vite-plugin-pwa`
```bash
npm install vite-plugin-pwa -D
```

- [ ] Configurer dans `vite.config.js`
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ReadCod',
        short_name: 'ReadCod',
        description: 'Apprends à lire du code comme un pro',
        theme_color: '#1A1919',
        background_color: '#1A1919',
        display: 'standalone',
        icons: [...]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ]
})
```

- [ ] Créer icons PWA (512x512, 192x192, etc.)
- [ ] Tester installation mobile
- [ ] Vérifier mode offline basique
- [ ] Lighthouse audit PWA score >90

---

### Tâche 5.3 : Déployer sur Vercel

**Temps estimé :** 1-2h
**Impact :** ⭐⭐⭐⭐⭐

**Étapes :**
1. [ ] Créer compte Vercel
2. [ ] Connecter repo GitHub
3. [ ] Configurer variables environnement
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
4. [ ] Deploy automatique sur push main
5. [ ] Tester URL preview
6. [ ] Configurer domaine custom (optionnel)

**URL finale :**
- Preview : `readcod.vercel.app`
- Custom : `readcod.app` (optionnel, ~12€/an)

---

### Tâche 5.4 : Tests E2E Cypress

**Temps estimé :** 4-5h
**Impact :** ⭐⭐⭐

**Installer Cypress :**
```bash
npm install cypress -D
```

**Tests E2E à créer :**
- [ ] Login flow complet
- [ ] Mode invité flow
- [ ] Faire un exercice (3 modes d'input)
- [ ] Compléter un niveau
- [ ] Navigation entre pages
- [ ] Vérifier stats Profile
- [ ] Logout

**Configuration :**
```javascript
// cypress.config.js
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false
  }
})
```

---

## PRIORITÉ 6 : Support Multi-Langages 🌍

**Objectif :** Ajouter JavaScript comme 2e langage

### Tâche 6.1 : Infrastructure multi-langages

**Temps estimé :** 2-3h
**Impact :** ⭐⭐⭐⭐

**Actions :**
- [ ] Séparer exercices par langage
```
src/data/
  ├── exercises_python.json (30 Easy + 30 Medium + 30 Hard)
  ├── exercises_javascript.json (à créer)
  └── exercises.js (loader dynamique)
```

- [ ] Adapter CodeBlock pour JavaScript highlighting
- [ ] Tester syntax highlighter JavaScript
- [ ] Mettre à jour Language.jsx (activer JavaScript)

---

### Tâche 6.2 : 30 exercices JavaScript Easy

**Temps estimé :** 5-6h
**Impact :** ⭐⭐⭐⭐

**Concepts JavaScript Easy :**
```javascript
// Niveau Easy (10 XP)
- Variables (let, const, var)
- Types primitifs (string, number, boolean)
- Arrays basiques (push, pop, length)
- Boucles (for, while, for...of)
- Conditions (if/else, switch)
- Fonctions basiques
- String methods (slice, toUpperCase, etc.)
- Template literals
- Arrow functions simples
- Objects basiques
```

**Format JSON :**
```json
{
  "id": "js_easy_001",
  "language": "javascript",
  "difficulty": 1,
  "type": "predict_output",
  "inputType": "options",
  "question": "Que renvoie ce programme ?",
  "code": "const fruits = ['pomme', 'banane', 'orange'];\nfruits.push('kiwi');\nconsole.log(fruits.length);",
  "options": ["3", "4", "5", "undefined"],
  "correctAnswer": 1,
  "explanation": "...",
  "xpGain": 10,
  "tags": ["arrays", "methods", "length"]
}
```

---

## PRIORITÉ 7 : Features Avancées (Post-MVP)

### Tâche 7.1 : OAuth Login (Google/GitHub)

**Temps estimé :** 3-4h
**Impact :** ⭐⭐⭐

**Providers à ajouter :**
- Google Sign-In
- GitHub Sign-In

**Actions :**
- [ ] Activer providers dans Firebase Console
- [ ] Implémenter `signInWithGoogle()` dans AuthContext
- [ ] Implémenter `signInWithGithub()` dans AuthContext
- [ ] Ajouter boutons Login.jsx/Signup.jsx
- [ ] Tester flow complet
- [ ] Gérer erreurs (popup blocked, etc.)

---

### Tâche 7.2 : Reset Password

**Temps estimé :** 2h
**Impact :** ⭐⭐

**Actions :**
- [ ] Créer page ForgotPassword.jsx
- [ ] Fonction `sendPasswordResetEmail()` Firebase
- [ ] Email template Firebase
- [ ] Message confirmation envoi
- [ ] Lien "Mot de passe oublié ?" dans Login.jsx

---

### Tâche 7.3 : Email Verification

**Temps estimé :** 2h
**Impact :** ⭐⭐

**Actions :**
- [ ] Envoyer email vérification après signup
- [ ] Bloquer accès si email non vérifié (optionnel)
- [ ] Bouton "Renvoyer email" si expiré
- [ ] Message "Vérifie ton email" dans Profile

---

### Tâche 7.4 : Leaderboard

**Temps estimé :** 4-5h
**Impact :** ⭐⭐⭐

**Structure Firestore :**
```javascript
// Collection 'leaderboard'
{
  userId: 'abc123',
  username: 'John',
  totalXP: 1250,
  totalExercises: 45,
  rank: 12,
  lastUpdated: Timestamp
}
```

**Features :**
- [ ] Classement global (top 100)
- [ ] Classement hebdomadaire
- [ ] Classement par langage
- [ ] Highlight utilisateur connecté
- [ ] Update automatique après exercices
- [ ] Cache local (refresh toutes les 5min)

---

## 📅 PLANNING RECOMMANDÉ

### Sprint 1 : Contenu (10-14h) - **2 semaines**
- [ ] 30 exercices Medium Python
- [ ] 30 exercices Hard Python
- [ ] Validation et tests

**Objectif :** Passer de 30 à 90 exercices

---

### Sprint 2 : Pages manquantes (8-11h) - **1 semaine**
- [ ] Page Leçons
- [ ] Page Challenges
- [ ] Page AI Understanding
- [ ] Page Contact

**Objectif :** Compléter toutes les routes

---

### Sprint 3 : Refactoring CSS (9h) - **1 semaine**
- [ ] Home.css
- [ ] Profile.css
- [ ] Language.css
- [ ] Difficulty.css
- [ ] shared.css

**Objectif :** Externaliser tout le CSS inline

---

### Sprint 4 : UX/UI (12-15h) - **1-2 semaines**
- [ ] Système Streaks complet
- [ ] Graphiques Chart.js
- [ ] Badges/Achievements
- [ ] Améliorer LevelComplete

**Objectif :** Maximiser engagement utilisateur

---

### Sprint 5 : Production (9-12h) - **1 semaine**
- [ ] Firestore Security Rules
- [ ] PWA Setup
- [ ] Deploy Vercel
- [ ] Tests E2E Cypress

**Objectif :** Déployer en production

---

### Sprint 6 : Multi-langages (7-9h) - **1 semaine**
- [ ] Infrastructure multi-langages
- [ ] 30 exercices JavaScript Easy

**Objectif :** Ajouter JavaScript

---

### Sprint 7 : Features avancées (11-15h) - **2 semaines**
- [ ] OAuth Login
- [ ] Reset Password
- [ ] Email Verification
- [ ] Leaderboard

**Objectif :** Features "nice to have"

---

## 🎯 RÉSUMÉ PRIORISATION

### À faire MAINTENANT (1-2 mois)
1. ✅ **Contenu** - 60 exercices Medium/Hard (CRITIQUE)
2. ✅ **Pages manquantes** - Leçons, Challenges, AI, Contact
3. ✅ **Refactoring CSS** - Externaliser inline
4. ✅ **Production** - Firestore Rules + Deploy Vercel

### À faire ENSUITE (2-3 mois)
5. ✅ **UX/UI** - Streaks, Graphiques, Badges
6. ✅ **Multi-langages** - JavaScript Easy
7. ✅ **PWA** - Mode offline

### À faire PLUS TARD (3-6 mois)
8. ⚠️ **Tests E2E** - Cypress
9. ⚠️ **OAuth** - Google/GitHub
10. ⚠️ **Leaderboard** - Classements
11. ⚠️ **JavaScript Medium/Hard** - 60 exercices

---

## 📊 MÉTRIQUES DE SUCCÈS

### Contenu
- [ ] 90 exercices Python (30 Easy, 30 Medium, 30 Hard)
- [ ] 30 exercices JavaScript Easy
- [ ] 10-15 leçons structurées
- [ ] 5-8 challenges

### Technique
- [ ] 0 ligne CSS inline
- [ ] 100% routes fonctionnelles
- [ ] PWA score Lighthouse >90
- [ ] Tests E2E coverage >80%

### Production
- [ ] Déployé sur Vercel
- [ ] Firestore Rules configurées
- [ ] Mode offline fonctionnel
- [ ] Domaine custom (optionnel)

### Utilisateur
- [ ] Temps moyen session >15min
- [ ] Taux completion niveau >70%
- [ ] Streak moyen >3 jours
- [ ] Taux retour J+7 >40%

---

**Prochaine action recommandée :** Commencer Sprint 1 (Créer 30 exercices Medium Python)

**Question :** Quel sprint veux-tu attaquer en premier ?
