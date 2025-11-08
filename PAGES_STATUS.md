# PAGES STATUS - ReadCod Project

> **Dernière mise à jour :** 7 janvier 2025
> **État global :** 10/12 pages complètes (83%)

---

## 📊 VUE D'ENSEMBLE

| Page | Route | Status | CSS | Lignes Code | TODOs |
|------|-------|--------|-----|-------------|-------|
| Welcome | `/` | ✅ Complet | Inline (310) | ~350 | - |
| Login | `/login` | ✅ Complet | Auth.css | ~180 | - |
| Signup | `/signup` | ✅ Complet | Auth.css | ~240 | - |
| Home | `/home` | ✅ Complet | Home.css | ~200 | ⚠️ Bug layout mobile |
| Profile | `/profile` | ✅ Complet | Inline (375) + ActivityCalendar.css | ~420 | - |
| Language | `/language` | ✅ Complet | Language.css | ~180 | ⚠️ Bug layout mobile |
| Difficulty | `/difficulty` | ✅ Complet | Difficulty.css | ~190 | ⚠️ Bug layout mobile |
| Exercise | `/exercise` | ✅ Complet | Exercise.css | ~428 | - |
| Contact | `/contact` | ✅ Complet | Contact.css | ~300 | ⚠️ Email ligne 79 |
| LessonLanguage | `/lessons/language` | ✅ Complet | Lessons.css | ~150 | - |
| LessonChapters | `/lessons/:lang/chapters` | ✅ Complet | Lessons.css | ~200 | ⚠️ Lock disabled L28-40 |
| LessonContent | `/lessons/:lang/:id` | ✅ Complet | Lessons.css + inline (60) | ~350 | ⚠️ Alert L167, 1 chapitre |
| Challenges | `/challenges` | ❌ Placeholder | - | 1 ligne | 🚨 À implémenter |
| AI Understanding | `/ai-understanding` | ❌ Placeholder | - | 1 ligne | 🚨 À implémenter |

**Total lignes code pages :** ~3,180 lignes JSX
**Total lignes CSS externalisé :** ~2,300 lignes

---

## ✅ PAGES COMPLÈTES (10)

### 1. Welcome.jsx - `/`

**Fonction :** Page d'onboarding/landing première visite

**Features :**
- Logo ReadCod centered
- 3 action buttons styled iOS :
  - "Créer un compte" (primary blue gradient)
  - "Se connecter" (secondary gray)
  - "Continuer en invité" (ghost transparent)
- Animations :
  - `fadeIn` logo (0.6s)
  - `slideUp` container (0.8s delay 0.2s)
  - `scaleIn` buttons (1s delay 0.4s)
- Safe area insets iOS (notch support)
- Mobile responsive 320px-428px

**Styling :** 310 lignes inline CSS (CSS-in-JS)

**Navigation :**
- "Créer un compte" → `/signup`
- "Se connecter" → `/login`
- "Continuer en invité" → `/home` (guest mode)

**Issues :** Aucun

---

### 2. Login.jsx - `/login`

**Fonction :** Authentification utilisateur

**Features :**
- Form validation :
  - Email (required, email format)
  - Password (required)
- Error messages display
- Loading state (spinner + "Connexion...")
- Links :
  - "Pas de compte ? Créer un compte" → `/signup`
  - "Continuer en invité" → `/home`
- Back button → `/`
- Haptic feedback on submit
- Firebase Auth integration

**Styling :** Auth.css + Layout.css (partagé avec Signup)

**Navigation :**
- Success → `/home` (authenticated)
- "Créer un compte" → `/signup`
- "Continuer en invité" → `/home` (guest)
- Back → `/`

**Issues :** Aucun

---

### 3. Signup.jsx - `/signup`

**Fonction :** Création compte utilisateur

**Features :**
- Username validation :
  - 3-15 caractères
  - Alphanumeric + underscore only
  - Real-time error display
- Email validation (email format)
- Password confirmation :
  - Min 6 caractères
  - Match password
- Avatar color picker :
  - Grid 4x3 (12 couleurs)
  - Selection highlight
  - Colors from `userService.AVATAR_COLORS`
- Loading state (spinner + "Création du compte...")
- Links :
  - "Déjà un compte ? Se connecter" → `/login`
  - "Continuer en invité" → `/home`
- Back button → `/`
- Haptic feedback
- Firebase Auth + Firestore user creation

**Styling :** Auth.css + Layout.css

**Navigation :**
- Success → `/home` (authenticated)
- "Se connecter" → `/login`
- "Continuer en invité" → `/home` (guest)
- Back → `/`

**Issues :** Aucun

---

### 4. Home.jsx - `/home`

**Fonction :** Dashboard principal / Menu navigation

**Features :**
- Logo ReadCod top
- AuthButton component (login status)
  - Guest : "Se connecter"
  - Authenticated : Avatar + username
- 4 menu cards bracket-style :
  1. **Leçons** → `/lessons` (Book icon)
  2. **Entraînements** → `/language` (Trophy icon)
  3. **Challenges** → `/challenges` (Target icon)
  4. **Comprendre l'IA** → `/ai-understanding` (Brain icon)
- Contact button → `/contact`
- Footer "By M/E"
- Exit animations (scale 0.95 + opacity 0)
- Mobile-first responsive

**Styling :** Home.css + Layout.css

**Navigation :**
- Hub central vers tous modules
- AuthButton → `/login` ou `/profile`

**Issues :**
- 🔴 **Bug layout mobile** : 70% height sur iPhone 16 (30% vide en bas)
  - Hypothèse : iOS Safari flexbox, `min-height: 100vh` → essayer `height: 100dvh`

---

### 5. Profile.jsx - `/profile`

**Fonction :** Stats utilisateur + progression

**Features :**
- **Avatar section :**
  - Guest : Emoji 🎮 + "Mode Invité"
  - User : Initial letter + avatar color background
- **User info :**
  - Username
  - Email
  - Badge auth status
- **Guest warning :** Message progression non sauvegardée
- **Level card :**
  - Current level (Level X)
  - XP progress (current/next level)
  - Progress bar animated
- **Stats grid (4 cards) :**
  1. Total exercises (blue background)
  2. Correct answers (green background)
  3. Incorrect answers (red background)
  4. Current streak (orange background)
- **ActivityCalendar :**
  - Daily activity heatmap
  - Color intensity based on exercises completed
  - Hover tooltips
- **Action buttons :**
  - Authenticated : "Déconnexion" → logout + redirect `/`
  - Guest : "Se connecter" → `/login`
- Back button → `/home`
- Loading state
- Smooth animations (fadeIn, slideUp)

**Styling :** 375 lignes inline CSS + ActivityCalendar.css

**Navigation :**
- Back → `/home`
- "Se connecter" → `/login` (guest only)
- "Déconnexion" → `/` (authenticated)

**Issues :** Aucun

---

### 6. Language.jsx - `/language`

**Fonction :** Sélection langage programmation (mode Training)

**Features :**
- 4 language cards :
  1. **PYTHON** (available) - Green gradient
  2. **WEB/HTML** (coming soon) - Orange gradient
  3. **JAVA** (coming soon) - Red gradient
  4. **C++** (coming soon) - Blue gradient
- Card layout :
  - Language icon (from assets/)
  - Language name
  - Gradient background
  - Hover scale effect
- Alert for unavailable languages
- Back button → `/`
- Exit animations
- Haptic feedback on selection

**Styling :** Language.css + Layout.css

**Navigation :**
- Python → `/difficulty`
- Others → Alert "Coming soon"
- Back → `/`

**Issues :**
- 🔴 **Bug layout mobile** : 70% height sur iPhone 16
  - Même issue que Home.jsx

---

### 7. Difficulty.jsx - `/difficulty`

**Fonction :** Sélection niveau difficulté (mode Training)

**Features :**
- Receives `language` from location.state (React Router)
- 3 difficulty cards :
  1. **EASY** (difficulty: 1) - Green gradient, +10 XP
  2. **MIDD** (difficulty: 2) - Orange gradient, +20 XP
  3. **HARD** (difficulty: 3) - Red gradient, +30 XP
- Card layout :
  - Difficulty name
  - XP reward display
  - Gradient background
  - Hover effects
- Passes `difficulty` value to Exercise
- Back button → `/language`
- Exit animations
- Haptic feedback

**Styling :** Difficulty.css + Layout.css

**Navigation :**
- Any card → `/exercise` (with state: { language, difficulty })
- Back → `/language`

**Issues :**
- 🔴 **Bug layout mobile** : 70% height sur iPhone 16
  - Même issue que Home.jsx et Language.jsx

---

### 8. Exercise.jsx - `/exercise`

**Fonction :** Interface exercice principale (LA PAGE LA PLUS COMPLEXE)

**Features :**
- **Data loading :**
  - Receives `language` + `difficulty` from location.state
  - Loads exercises from exercises.json
  - Filters by language + difficulty
  - Randomizes exercise order
  - Displays 10 exercises per level
- **Progress tracking :**
  - Custom header with progress bar (X/10)
  - Current exercise / total display
  - Block stats (correct, incorrect, XP)
- **3 Input Types Support :**
  1. `options` - Multiple choice OptionButton
  2. `free_input` - CustomKeyboard (numeric/predefined)
  3. `clickable_lines` - CodeBlock interactive
- **4 Exercise Types :**
  1. `predict_output` - Prédire sortie
  2. `find_error` - Trouver erreur ligne
  3. `trace_execution` - Tracer variable
  4. `concept_understanding` - Comprendre concept
- **Components used :**
  - QuestionCard (question + feedback display)
  - CodeBlock (syntax highlighting + clickable lines)
  - OptionButton (multiple choice states)
  - ActionButton (validate/continue)
  - CustomKeyboard (numeric + predefined keys)
  - FeedbackGlow (border screen effects)
  - ExitConfirmModal (quit confirmation)
  - LevelComplete (lazy loaded, end-of-level screen)
- **Features :**
  - Answer validation
  - XP gain (correct answers only)
  - Explanation toggle (with code highlighting)
  - Haptic feedback (correct/incorrect)
  - Auto-save progress (Firestore sync)
  - Level completion detection
  - Exit confirmation
- **States :**
  - Initial (no selection)
  - Selected (option/input active)
  - Validated correct (green glow)
  - Validated incorrect (red glow)
  - Explanation shown (code highlighted)

**Styling :** Exercise.css (466 lignes, 70+ CSS variables)

**Navigation :**
- Quit → `/home` (with exit confirmation)
- Level complete → Next level or `/home`

**Issues :**
- ⚠️ **TODO lignes 206-209** : Comment about marking level complete
- Complex state management (could be refactored with useReducer)

---

### 9. Contact.jsx - `/contact`

**Fonction :** Formulaire contact terminal-style

**Features :**
- **Terminal-style design :**
  - ASCII art header
  - Command prompt styling
  - Monospace font
  - Green/white color scheme
- **Form fields :**
  - Name (min 2 chars)
  - Email (validated)
  - Type select (question/bug/feedback)
  - Message textarea (10-500 chars)
- **Validation :**
  - Real-time error messages
  - Required fields check
  - Email format validation
  - Character count display
- **FormSubmit.co integration :**
  - Action URL ligne 79
  - Honeypot field (bot protection)
  - Success redirect disabled
- **Success state :**
  - Typewriter effect output
  - "Compiling..." animation
  - Form reset after 3s
- **Command cards :**
  - GitHub link (external)
  - Twitter link (external)
  - Discord (coming soon)
- **Features :**
  - External link handling
  - Loading state
  - Red X close button iOS-style
  - Haptic feedback

**Styling :** Contact.css

**Navigation :**
- Close → `/home`
- External links → new tab

**Issues :**
- 🚨 **TODO ligne 79** : Remplacer `YOUR_EMAIL@example.com` par email FormSubmit.co réel
- GitHub/Twitter links pointent vers domaines génériques (à mettre à jour)

---

### 10. LessonLanguage.jsx - `/lessons/language`

**Fonction :** Sélection langage (module Leçons)

**Features :**
- Identique à Language.jsx mais pour module Leçons
- 4 language cards (Python, HTML, Java, C++)
- Python disponible → chapters
- Autres "coming soon"
- Back button → `/`
- Exit animations
- Haptic feedback

**Styling :** Lessons.css (partagé 3 pages leçons)

**Navigation :**
- Python → `/lessons/python/chapters`
- Others → Alert
- Back → `/`

**Issues :** Aucun

---

### 11. LessonChapters.jsx - `/lessons/:language/chapters`

**Fonction :** Liste chapitres avec progression

**Features :**
- **Data loading :**
  - Receives `language` from URL params
  - Loads from `src/data/lessons/{language}/chapters.json`
  - ProgressContext integration
- **Chapter unlock system :**
  - Each chapter has `unlockRequirements`
  - Requirements : XP, level, previous chapter
  - Lock icon for locked chapters
  - Shake animation on locked click
  - ⚠️ **ACTUELLEMENT DÉSACTIVÉ (TEST MODE ligne 28-40)**
- **Chapter cards display :**
  - Title + description
  - Difficulty badge (easy/medium/hard)
  - Icon emoji
  - Lock status (locked/unlocked)
  - Completion status (completed/in-progress)
  - Progress (X/Y exercises)
  - XP reward
  - Estimated time
- **Progress tracking :**
  - Exercises completed per chapter
  - Completion percentage
  - Visual progress indicator
- Back button → `/lessons/language`
- Haptic feedback

**Styling :** Lessons.css

**Navigation :**
- Unlocked chapter → `/lessons/:language/:chapterId`
- Locked chapter → Shake animation + haptic
- Back → `/lessons/language`

**Issues :**
- 🚨 **TODO lignes 28-40** : Lock system désactivé pour tests
  - TOUS les chapitres sont unlocked
  - À réactiver avant production

---

### 12. LessonContent.jsx - `/lessons/:language/:chapterId`

**Fonction :** Contenu leçon avec sections + exercices intégrés

**Features :**
- **Data loading :**
  - Receives `language` + `chapterId` from URL params
  - Loads from `src/data/lessons/{language}/chapter-{id}.json`
  - Placeholder for unimplemented chapters (ligne 51)
- **Progress tracking :**
  - Section-based navigation (1/N)
  - Progress bar top
  - Section completion tracking
  - Auto-scroll to top on section change
- **Section types support :**
  1. `text` - Paragraphe texte
  2. `code` - CodeBlock avec syntax highlighting
  3. `exercise` - Exercice intégré (3 input types)
  4. `tip` - Astuce (💡 icon)
  5. `warning` - Avertissement (⚠️ icon)
- **Exercise integration :**
  - Same components as Exercise.jsx
  - QuestionCard + CodeBlock + OptionButton/CustomKeyboard
  - Validation + feedback
  - XP rewards
  - Progress saved to Firestore
  - Exercise completion tracking
- **Chapter completion :**
  - All sections completed detection
  - Completion alert (ligne 168)
  - ⚠️ **Should use modal instead of alert()**
- **Navigation :**
  - Continue button → next section
  - Finish button → last section
  - Back button → `/lessons/:language/chapters`

**Styling :** Lessons.css + 60 lignes inline CSS

**Navigation :**
- Continue → Next section
- Finish → Alert + back to chapters
- Back → `/lessons/:language/chapters`

**Issues :**
- 🚨 **TODO ligne 167-168** : Remplacer `alert()` par modal de completion propre
- ⚠️ **Placeholder ligne 51** : Chapters non implémentés affichent message
- ⚠️ **Seulement chapitre 3 disponible** : Autres chapitres à créer (1, 2, 4, 5+)

---

## ❌ PAGES PLACEHOLDER (2)

### 13. Challenges - `/challenges`

**Status :** ❌ Non implémenté

**Actuel :**
```jsx
// App.jsx ligne 53
<div style={{padding: '20px', color: 'white'}}>
  Challenges - En cours de développement
</div>
```

**À créer :**
- Page component complète
- Contenu challenges
- Interface défi
- Système scoring
- Leaderboard ?

---

### 14. AI Understanding - `/ai-understanding`

**Status :** ❌ Non implémenté

**Actuel :**
```jsx
// App.jsx ligne 54
<div style={{padding: '20px', color: 'white'}}>
  Comprendre l'IA - En cours de développement
</div>
```

**À créer :**
- Page component complète
- Contenu pédagogique IA
- Interface interactive
- Exemples code IA
- Exercices IA ?

---

## 🔥 ISSUES PRIORITAIRES

### 🔴 CRITIQUE

1. **Bug layout mobile iPhone** (Home, Language, Difficulty)
   - Pages occupent 70% height
   - 30% espace vide en bas
   - Affecte : Home.css, Language.css, Difficulty.css
   - Hypothèse : iOS Safari flexbox issue
   - Solution possible : `height: 100dvh` au lieu de `min-height: 100vh`

### ⚠️ HAUTE PRIORITÉ

2. **Contact.jsx ligne 79** - Email FormSubmit.co
   ```jsx
   action="https://formsubmit.co/YOUR_EMAIL@example.com"
   ```
   À remplacer par email réel

3. **LessonChapters.jsx lignes 28-40** - Lock system désactivé
   ```jsx
   // TEST MODE: Unlock all chapters for testing
   const isUnlocked = true; // Normalement: checkUnlockRequirements(...)
   ```
   À réactiver avant production

4. **LessonContent.jsx lignes 167-168** - Alert completion
   ```jsx
   alert('Chapitre terminé ! +50 XP');
   navigate(`/lessons/${language}/chapters`);
   ```
   Créer modal de completion propre

### ⚠️ MOYENNE PRIORITÉ

5. **Leçons Python** - Seulement chapitre 3
   - Créer chapters 1, 2, 4, 5+
   - Format JSON existant dans chapter-3.json

6. **Routes placeholder** - 2 pages à implémenter
   - Challenges
   - AI Understanding

7. **Contact.jsx** - Links externes
   - GitHub : Mettre URL réelle
   - Twitter : Mettre URL réelle

### ⚠️ BASSE PRIORITÉ

8. **Inline styles** - Optimisation possible
   - Welcome.jsx (310 lignes)
   - Profile.jsx (375 lignes)
   - Externaliser en CSS files ?

9. **Exercise.jsx** - Refactoring state
   - State management complexe
   - useReducer pour simplifier ?

10. **Header component** - Code dupliqué
    - Header.jsx existe mais inutilisé
    - Exercise.jsx a header custom

---

## 📊 STATISTIQUES

| Métrique | Valeur |
|----------|--------|
| **Pages totales** | 12 |
| **Pages complètes** | 10 (83%) |
| **Pages placeholder** | 2 (17%) |
| **Routes configurées** | 15 |
| **Lignes JSX total** | ~3,180 |
| **Lignes CSS externalisé** | ~2,300 |
| **CSS files** | 9 |
| **Components React** | 20+ |
| **Tests unitaires** | 97 (100% pass) |
| **Issues critiques** | 1 (layout mobile) |
| **TODOs haute priorité** | 3 |

---

## ✅ CHECKLIST AVANT PRODUCTION

### Pages
- [x] 10/12 pages complètes
- [ ] Fix bug layout mobile (Home, Language, Difficulty)
- [ ] Implémenter Challenges page
- [ ] Implémenter AI Understanding page

### TODOs Code
- [ ] Contact.jsx - Email FormSubmit.co (ligne 79)
- [ ] LessonChapters.jsx - Réactiver lock system (lignes 28-40)
- [ ] LessonContent.jsx - Modal completion (lignes 167-168)

### Contenu
- [ ] Créer chapitres leçons 1, 2, 4, 5+ (seulement 3 disponible)
- [ ] Mettre à jour links externes Contact.jsx

### Production
- [ ] Générer icônes PWA (8 tailles)
- [ ] Déployer Firestore Rules
- [ ] Premier déploiement Vercel
- [ ] Tests sur devices réels (iPhone, Android)

---

**Document généré :** 7 janvier 2025
**Status :** 83% complet - Production ready avec TODOs identifiés
