# Hero Section - Documentation

## ✅ Hero Section créée avec succès

### 🎨 Design Premium

Hero section avec :
- ✅ **Background effect** (grid animée + glow radial)
- ✅ **Animations séquencées** Framer Motion
- ✅ **Responsive** mobile/tablet/desktop
- ✅ **Scroll indicator** animé
- ✅ **Stats** en gradient

---

## 📦 Composant Hero

### Fichier : `/src/components/sections/Hero.tsx`

**Lines de code :** 160+

**Features :**
- Badge "🚀 100% Gratuit • Open Source"
- Titre animé mot par mot avec gradient
- Sous-titre descriptif
- 2 CTA buttons (Commencer + Voir démo)
- 3 stats (108 Exercices, 11 Chapitres, 100% Gratuit)
- Scroll indicator avec bounce animation
- Background grid + 2 glows radiaux

---

## 🎬 Séquence d'Animations

### Timeline complète

```
T+0ms    : Background glow fade-in (1s)
T+200ms  : Badge slide-down + fade-in (0.6s)
T+400ms  : Titre "Maîtrise" (0.5s)
T+480ms  : Titre "la" (0.5s)
T+560ms  : Titre "lecture" + gradient (0.5s)
T+640ms  : Titre "de" + gradient (0.5s)
T+720ms  : Titre "code" + gradient (0.5s)
T+1000ms : Sous-titre fade-in (0.6s)
T+1200ms : CTA Buttons slide-up (0.5s)
T+1400ms : Stat 1 "108" (0.5s)
T+1500ms : Stat 2 "11" (0.5s)
T+1600ms : Stat 3 "100%" (0.5s)
T+∞      : Scroll indicator bounce (loop)
```

**Durée totale :** ~2 secondes avant affichage complet

---

## 🎨 Background Effect

### Grid Animée

```tsx
<motion.div
  className="absolute inset-0 opacity-20"
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.2 }}
  transition={{ duration: 1 }}
  style={{
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
  }}
/>
```

**Caractéristiques :**
- Grille 50x50px
- Lignes blanches à 3% opacity
- Fade-in sur 1s

### Glow Central (Violet)

```tsx
<motion.div
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             w-[600px] h-[600px] sm:w-[800px] sm:h-[800px]
             rounded-full blur-3xl"
  style={{
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
  }}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.5, ease: 'easeOut' }}
/>
```

**Caractéristiques :**
- Couleur violet (#8B5CF6)
- Opacity 15%
- Blur 3xl
- Animation scale 0.8 → 1
- Responsive size (600px → 800px)

### Glow Secondaire (Orange)

```tsx
<motion.div
  className="absolute top-1/3 right-1/4
             w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]
             rounded-full blur-3xl"
  style={{
    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
  }}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
/>
```

**Caractéristiques :**
- Couleur orange (#F97316)
- Opacity 10%
- Position top-right
- Delay 0.3s

---

## 📝 Contenu

### Badge

```tsx
<Badge variant="outline" className="text-base px-4 py-2">
  🚀 100% Gratuit • Open Source
</Badge>
```

**Animation :**
```tsx
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.2 }}
```

### Titre

```tsx
const titleWords = ['Maîtrise', 'la', 'lecture', 'de', 'code']

<h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl
                font-bold tracking-tight leading-tight">
  {titleWords.map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
      className={i >= 2 ? 'gradient-text' : ''}
    >
      {word}
    </motion.span>
  ))}
</h1>
```

**Responsive sizes :**
- Mobile : `text-5xl` (48px)
- Small : `text-6xl` (60px)
- Large : `text-7xl` (72px)
- XL : `text-8xl` (96px)

**Gradient :** Appliqué sur "lecture de code" (mots 3-4-5)

### Sous-titre

```tsx
<motion.p
  className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 0.6 }}
>
  L'IA écrit le code. Toi, tu dois le comprendre, le valider, le debugger.
  ReadCod t'entraîne à devenir un expert en lecture de code.
</motion.p>
```

**Caractéristiques :**
- Max-width : 2xl (672px)
- Color : white/70 (70% opacity)
- Centered

### CTA Buttons

```tsx
<motion.div
  className="flex flex-col sm:flex-row gap-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.2, duration: 0.5 }}
>
  {/* Button 1 : Primary */}
  <Button
    variant="primary"
    size="lg"
    href={APP_URL}
    icon={<ArrowRight size={20} />}
  >
    Commencer gratuitement
  </Button>

  {/* Button 2 : Secondary */}
  <Button
    variant="secondary"
    size="lg"
    onClick={handleScrollToDemo}
  >
    <Play size={20} />
    Voir une démo
  </Button>
</motion.div>
```

**Responsive :**
- Mobile : Stack vertical (`flex-col`)
- Desktop : Horizontal (`flex-row`)

**Actions :**
- Button 1 : Open app in new tab
- Button 2 : Smooth scroll to `#how-it-works`

### Stats

```tsx
const stats = [
  { value: '108', label: 'Exercices' },
  { value: '11', label: 'Chapitres' },
  { value: '100%', label: 'Gratuit' },
]

{stats.map((stat, index) => (
  <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
  >
    <div className="text-3xl sm:text-4xl font-bold gradient-text">
      {stat.value}
    </div>
    <div className="text-sm text-white/50 mt-1">
      {stat.label}
    </div>
  </motion.div>
))}
```

**Animation :** Stagger 0.1s entre chaque stat

---

## 🖱️ Scroll Indicator

```tsx
<motion.div
  className="absolute bottom-8 left-1/2 -translate-x-1/2
             flex flex-col items-center gap-2 cursor-pointer"
  animate={{ y: [0, 8, 0] }}
  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
  onClick={handleScrollToDemo}
>
  <span className="text-xs text-white/50 uppercase tracking-wider">
    Scroll pour découvrir
  </span>
  <ChevronDown className="w-6 h-6 text-white/50" />
</motion.div>
```

**Animation :**
- Bounce : translateY 0 → 8px → 0
- Duration : 2s
- Loop : infinite

**Action :** Smooth scroll vers `#how-it-works`

---

## 📱 Responsive Design

### Breakpoints

**Badge :**
- Mobile : `text-base px-4 py-2`

**Titre :**
- Mobile : `text-5xl` (48px)
- sm (640px+) : `text-6xl` (60px)
- lg (1024px+) : `text-7xl` (72px)
- xl (1280px+) : `text-8xl` (96px)

**Sous-titre :**
- Mobile : `text-lg` (18px)
- sm (640px+) : `text-xl` (20px)

**Buttons :**
- Mobile : Stack vertical
- sm (640px+) : Horizontal

**Stats :**
- Mobile : Wrap avec gap-8
- Desktop : gap-12

**Glows :**
- Mobile : 600x600px
- sm (640px+) : 800x800px

---

## 🎯 Intégration

### page.tsx

```tsx
import { Hero } from '@/components/sections'

export default function Home() {
  return (
    <>
      <Hero />
      {/* Autres sections à venir */}
    </>
  )
}
```

### sections/index.ts

```tsx
export { default as Hero } from './Hero'
```

---

## ✨ Features Avancées

### 1. Smooth Scroll

```tsx
const handleScrollToDemo = () => {
  const demoSection = document.getElementById('how-it-works')
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth' })
  }
}
```

### 2. External Link

```tsx
<Button
  href={APP_URL}
  onClick={(e) => {
    e.preventDefault()
    window.open(APP_URL, '_blank')
  }}
>
```

### 3. Staggered Title Animation

```tsx
titleWords.map((word, i) => (
  <motion.span
    transition={{ delay: 0.4 + i * 0.08 }}
  >
    {word}
  </motion.span>
))
```

**Timing :**
- Word 0 : delay 0.4s
- Word 1 : delay 0.48s
- Word 2 : delay 0.56s
- Word 3 : delay 0.64s
- Word 4 : delay 0.72s

---

## 📊 Statistiques

**Hero.tsx**
- 160+ lignes
- 10 animations Framer Motion
- 3 glows (grid + 2 radiaux)
- 2 CTA buttons
- 3 stats
- 1 scroll indicator
- Responsive 4 breakpoints

**Performance :**
- Aucun asset lourd
- CSS pur pour background
- Animations GPU (transform, opacity)
- Pas d'images

---

## 🧪 Test

Pour voir le Hero en action :

```bash
cd readcod-landing
npm run dev
```

Ouvrir : `http://localhost:3000`

**Tests à faire :**
1. ✅ Animations séquencées au chargement
2. ✅ Titre en gradient visible
3. ✅ Stats animées avec stagger
4. ✅ Scroll indicator bounce
5. ✅ Click "Commencer" → Open app
6. ✅ Click "Voir démo" → Scroll smooth
7. ✅ Click scroll indicator → Scroll smooth
8. ✅ Responsive mobile/desktop

---

## ✅ Checklist

- [x] **Hero.tsx** créé avec animations
- [x] **Background** grid + 2 glows
- [x] **Badge** "100% Gratuit"
- [x] **Titre** animé mot par mot
- [x] **Gradient** sur "lecture de code"
- [x] **Sous-titre** descriptif
- [x] **2 CTA buttons** fonctionnels
- [x] **3 stats** avec gradient
- [x] **Scroll indicator** bounce animation
- [x] **Responsive** mobile/tablet/desktop
- [x] **page.tsx** intégré
- [x] **sections/index.ts** créé
- [x] **Serveur** démarre sans erreurs ✅

---

**Date de création :** 3 décembre 2025
**Version :** 1.0.0
**Status :** ✅ Hero Section complète et fonctionnelle
