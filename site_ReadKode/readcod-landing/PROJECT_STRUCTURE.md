# ReadCod Landing Page - Structure du Projet

## ✅ Projet Initialisé avec Succès

### 🛠️ Stack Technique

- **Next.js 16** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS v4** (nouvelle syntaxe avec `@theme inline`)
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes
- **Geist Font** (Google Fonts)

---

## 📁 Structure des Dossiers

```
readcod-landing/
├── src/
│   ├── app/
│   │   ├── globals.css       ✅ Styles globaux + Tailwind v4 config
│   │   ├── layout.tsx         ✅ Layout principal + SEO meta tags
│   │   └── page.tsx           ✅ Page d'accueil (placeholder)
│   ├── components/
│   │   ├── ui/                ✅ Composants UI réutilisables
│   │   │   ├── Button.tsx     ✅ 4 variants (primary, secondary, outline, ghost)
│   │   │   ├── Card.tsx       ✅ 3 variants (default, glass, gradient)
│   │   │   ├── Badge.tsx      ✅ 4 variants (default, orange, purple, blue)
│   │   │   ├── GradientText.tsx ✅ Texte avec gradient animé
│   │   │   └── index.ts       ✅ Exports centralisés
│   │   ├── layout/            ✅ Composants layout
│   │   │   ├── Navbar.tsx     ✅ Navigation avec glass effect
│   │   │   ├── Footer.tsx     ✅ Footer avec sections
│   │   │   └── index.ts       ✅ Exports centralisés
│   │   └── sections/          📂 (vide - prêt pour les sections)
│   └── lib/
│       ├── utils.ts           ✅ Fonction cn() pour Tailwind
│       └── constants.ts       ✅ Toutes les constantes (textes, liens, etc.)
├── public/                    📂 Assets statiques
├── package.json               ✅ Dépendances installées
├── tsconfig.json              ✅ Configuration TypeScript
├── postcss.config.mjs         ✅ PostCSS + Tailwind v4
├── next.config.ts             ✅ Configuration Next.js
└── PROJECT_STRUCTURE.md       ✅ Ce fichier
```

---

## 🎨 Design System Configuré

### Couleurs (globals.css)

```css
--bg-dark: #0A0A0A           /* Background principal */
--bg-dark-secondary: #141414  /* Background secondaire */
--bg-dark-tertiary: #1F1F1F   /* Background tertiaire */

--accent-orange: #F97316      /* Accent orange */
--accent-purple: #8B5CF6      /* Accent violet */
--accent-blue: #3B82F6        /* Accent bleu */

--gradient-primary: linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)
```

### Animations

```css
@keyframes fade-in          /* Fade in + slide up (20px) */
@keyframes slide-up         /* Slide up (40px) */
@keyframes glow             /* Glow effect pulsant */
```

### Classes Utilitaires Custom

- `.gradient-text` - Texte avec gradient orange → violet
- `.glass` - Effet glassmorphism (backdrop-blur)
- `.glow` - Effet de glow animé
- Scrollbar custom dark

---

## 🧩 Composants Disponibles

### UI Components

#### Button
```tsx
<Button variant="primary" size="md">
  Commencer
</Button>
```
**Variants:** `primary`, `secondary`, `outline`, `ghost`
**Sizes:** `sm`, `md`, `lg`

#### Card
```tsx
<Card variant="glass" hover>
  Contenu
</Card>
```
**Variants:** `default`, `glass`, `gradient`
**Props:** `hover` (boolean)

#### Badge
```tsx
<Badge variant="orange">Nouveau</Badge>
```
**Variants:** `default`, `orange`, `purple`, `blue`

#### GradientText
```tsx
<GradientText as="h1">ReadCod</GradientText>
```
**Props:** `as` (span | h1 | h2 | h3 | h4 | h5 | h6 | p)

### Layout Components

#### Navbar
Navigation responsive avec glass effect (sticky)

#### Footer
Footer avec grille 4 colonnes (responsive)

---

## 📦 Dépendances Installées

```json
{
  "dependencies": {
    "next": "16.0.7",
    "react": "^19.x",
    "react-dom": "^19.x",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.555.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.x",
    "geist": "^1.5.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.x",
    "typescript": "^5.x",
    "eslint": "^9.x",
    "eslint-config-next": "^16.x"
  }
}
```

---

## 🚀 Commandes

```bash
# Développement
npm run dev          # Démarre serveur dev (localhost:3000)
npm run build        # Build production
npm run start        # Démarre serveur production
npm run lint         # Linting ESLint

# TypeScript
npx tsc --noEmit     # Vérifier erreurs TypeScript
```

---

## ✅ Checklist d'Initialisation

- [x] Projet Next.js 16 créé avec App Router
- [x] TypeScript configuré
- [x] Tailwind CSS v4 configuré
- [x] Dépendances installées (framer-motion, lucide-react, etc.)
- [x] Font Geist configurée
- [x] Structure de dossiers créée
- [x] globals.css configuré (couleurs, animations, scrollbar)
- [x] layout.tsx configuré (SEO meta tags)
- [x] page.tsx placeholder créé
- [x] 4 composants UI créés (Button, Card, Badge, GradientText)
- [x] 2 composants layout créés (Navbar, Footer)
- [x] lib/utils.ts créé (fonction cn)
- [x] lib/constants.ts créé (constantes app)
- [x] Exports centralisés (index.ts)
- [x] Serveur dev démarre sans erreurs ✅
- [x] Pas d'erreurs TypeScript ✅

---

## 📝 Notes Importantes

### Tailwind CSS v4

Ce projet utilise **Tailwind CSS v4** qui a une syntaxe différente :

- **Pas de `tailwind.config.ts`** - Configuration via CSS
- **`@theme inline`** dans globals.css pour les couleurs custom
- **`@import "tailwindcss"`** au lieu de directives
- **`@tailwindcss/postcss`** plugin

### Meta Tags SEO

Le layout.tsx contient déjà :
- Open Graph tags
- Twitter Card tags
- Meta description et keywords
- Robots configuration
- Verification tags

### Imports

Utiliser les imports centralisés :
```tsx
import { Button, Card, Badge, GradientText } from '@/components/ui'
import { Navbar, Footer } from '@/components/layout'
```

---

## 🎯 Prochaines Étapes

1. **Créer les sections** dans `src/components/sections/` :
   - Hero
   - Features
   - HowItWorks
   - Testimonials
   - Pricing
   - FAQ
   - Contact

2. **Ajouter les assets** dans `public/` :
   - Logo ReadCod
   - Icônes
   - Images OG (og-image.png)
   - Screenshots app

3. **Compléter Navbar et Footer** :
   - Liens navigation
   - Menu mobile
   - Social links

4. **Animations Framer Motion** :
   - Scroll animations
   - Hover effects
   - Page transitions

5. **Optimisations** :
   - Image optimization
   - Lazy loading
   - Performance metrics

---

**Date de création :** 3 décembre 2025
**Version :** 1.0.0
**Status :** ✅ Structure de base complète et fonctionnelle
