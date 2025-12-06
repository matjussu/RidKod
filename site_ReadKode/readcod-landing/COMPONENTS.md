# Composants UI - Documentation

## ✅ Tous les composants créés avec succès

### 🎨 Design System

Tous les composants suivent le design dark mode inspiré de MetaMask avec :
- Animations fluides Framer Motion
- Effets hover élégants
- Gradients orange → violet
- Effects glow subtils

---

## 📦 Composants Disponibles

### 1. Button (`/src/components/ui/Button.tsx`)

Bouton avec animations spring et support des liens Next.js.

#### Variants
- **`primary`** : Background gradient orange→violet, glow au hover
- **`secondary`** : Border gradient, background transparent
- **`ghost`** : Transparent, texte gris → blanc au hover

#### Sizes
- **`sm`** : px-4 py-2 text-sm
- **`md`** : px-6 py-3 text-base (default)
- **`lg`** : px-8 py-4 text-lg

#### Props
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  href?: string           // Si présent, rend un Link Next.js
  icon?: React.ReactNode  // Icône à droite avec translation au hover
  onClick?: () => void
  className?: string
}
```

#### Animations
- **whileHover**: scale 1.02
- **whileTap**: scale 0.98
- **Transition**: spring (stiffness 400, damping 17)
- **Icon**: translateX au hover

#### Exemples
```tsx
// Bouton primary simple
<Button variant="primary">Commencer</Button>

// Avec icône
<Button variant="secondary" icon={<ArrowRight />}>
  En savoir plus
</Button>

// Comme lien
<Button variant="primary" href="/login">
  Se connecter
</Button>

// Ghost button
<Button variant="ghost" size="sm">
  Documentation
</Button>
```

---

### 2. Card (`/src/components/ui/Card.tsx`)

Card avec effet d'élévation et glow coloré au hover.

#### Props
```tsx
interface CardProps {
  children: React.ReactNode
  hover?: boolean           // Active l'effet hover
  glow?: 'orange' | 'purple' | 'none'  // Couleur du glow
  className?: string
}
```

#### Style
- Background: `#141414` (dark-secondary)
- Border: `1px solid rgba(255,255,255,0.1)`
- Border-radius: `16px`
- Padding: `32px` (p-8)

#### Animations
Si `hover=true` :
- **whileHover**: translateY -4px
- **Glow**: box-shadow coloré selon prop `glow`
- **Border**: devient plus visible (opacity 0.2)

#### Exemples
```tsx
// Card simple
<Card>
  <h3>Titre</h3>
  <p>Contenu</p>
</Card>

// Card avec hover et glow orange
<Card hover glow="orange">
  <h3>Feature</h3>
  <p>Description</p>
</Card>

// Card interactive sans glow
<Card hover glow="none">
  <h3>Click me</h3>
</Card>
```

---

### 3. GradientText (`/src/components/ui/GradientText.tsx`)

Texte avec gradient orange → violet.

#### Props
```tsx
interface GradientTextProps {
  children: React.ReactNode
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  className?: string
}
```

#### Style CSS
```css
background: linear-gradient(135deg, #F97316 0%, #8B5CF6 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

#### Exemples
```tsx
// Span (default)
<GradientText>ReadCod</GradientText>

// Heading
<GradientText as="h1" className="text-6xl font-bold">
  ReadCod
</GradientText>

// Paragraph
<GradientText as="p">
  Apprends à lire du code
</GradientText>
```

---

### 4. Badge (`/src/components/ui/Badge.tsx`)

Petit badge/tag pour labels.

#### Variants
- **`default`** : bg-white/10, texte blanc/80
- **`gradient`** : gradient orange→violet, texte blanc
- **`outline`** : border blanc/20, texte blanc/60

#### Props
```tsx
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'gradient' | 'outline'
  className?: string
}
```

#### Style
- Padding: `px-3 py-1`
- Font: `text-xs font-medium`
- Border-radius: `rounded-full`
- Transition: `all 0.2s`

#### Exemples
```tsx
<Badge variant="default">Python</Badge>
<Badge variant="gradient">✨ Nouveau</Badge>
<Badge variant="outline">100% Gratuit</Badge>
```

---

### 5. SectionWrapper (`/src/components/ui/SectionWrapper.tsx`)

Wrapper pour sections avec animation au scroll.

#### Props
```tsx
interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string  // Pour navigation anchor (#features)
}
```

#### Animations
- **initial**: opacity 0, translateY 40px
- **whileInView**: opacity 1, translateY 0
- **viewport**: once true, margin -100px
- **transition**: duration 0.6s, ease easeOut

#### Structure
```tsx
<SectionWrapper id="features">
  <h2>Features</h2>
  <div>Content</div>
</SectionWrapper>
```

#### Style
- Padding vertical: `py-24`
- Container: `max-w-7xl mx-auto`
- Padding horizontal: `px-4`

#### Exemples
```tsx
// Section simple
<SectionWrapper id="about">
  <h2>À propos</h2>
  <p>Description</p>
</SectionWrapper>

// Section avec classes custom
<SectionWrapper id="hero" className="min-h-screen">
  <div>Hero content</div>
</SectionWrapper>
```

---

### 6. AnimatedText (`/src/components/ui/AnimatedText.tsx`)

Texte qui apparaît avec animation progressive.

#### Props
```tsx
interface AnimatedTextProps {
  text: string
  className?: string
  animation?: 'words' | 'letters' | 'lines'
  delay?: number          // Délai initial (default: 0)
  staggerDelay?: number   // Délai entre éléments (default: 0.05)
}
```

#### Types d'animation
- **`words`** : Apparaît mot par mot (default)
- **`letters`** : Apparaît lettre par lettre
- **`lines`** : Apparaît ligne par ligne

#### Animations
- **Chaque élément**: opacity 0 → 1, translateY 20px → 0
- **Duration**: 0.5s
- **Stagger**: délai entre chaque élément

#### Exemples
```tsx
// Animation par mots (default)
<AnimatedText
  text="Apprends à lire du code"
  className="text-2xl"
/>

// Animation par lettres
<AnimatedText
  text="ReadCod"
  className="text-6xl font-bold"
  animation="letters"
  staggerDelay={0.03}
/>

// Animation par lignes avec délai
<AnimatedText
  text="Line 1\nLine 2\nLine 3"
  animation="lines"
  delay={0.5}
  staggerDelay={0.2}
/>
```

---

## 🎯 Import & Export

Tous les composants sont exportés depuis `/src/components/ui/index.ts` :

```tsx
import {
  Button,
  Card,
  Badge,
  GradientText,
  SectionWrapper,
  AnimatedText,
} from '@/components/ui'
```

---

## 🧪 Page de Test

Une page de démo complète est disponible : **`/test`**

Route: `http://localhost:3000/test`

Cette page montre :
- Tous les variants de Button
- Cards avec différents glows
- Badges
- AnimatedText
- Animations au scroll
- Exemples d'utilisation

---

## 🎨 Tailwind Classes Custom

Les composants utilisent les couleurs définies dans `globals.css` :

```css
--color-dark: #0A0A0A
--color-dark-secondary: #141414
--color-dark-tertiary: #1F1F1F
--color-accent-orange: #F97316
--color-accent-purple: #8B5CF6
--color-accent-blue: #3B82F6
```

Classes Tailwind :
- `bg-dark` → #0A0A0A
- `bg-dark-secondary` → #141414
- `bg-dark-tertiary` → #1F1F1F
- `text-accent-orange` → #F97316
- `text-accent-purple` → #8B5CF6

---

## ✅ Checklist Composants

- [x] **Button** - 3 variants, 3 sizes, animations spring
- [x] **Card** - Hover effect, glow coloré
- [x] **Badge** - 3 variants, styles iOS
- [x] **GradientText** - Gradient orange→violet
- [x] **SectionWrapper** - Animation au scroll
- [x] **AnimatedText** - 3 types d'animation
- [x] Tous typés TypeScript
- [x] Exports centralisés
- [x] Page de test complète
- [x] Documentation complète

---

## 🚀 Utilisation dans les Pages

### Hero Section Exemple

```tsx
import { Button, GradientText, AnimatedText, SectionWrapper } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <SectionWrapper id="hero" className="min-h-screen flex items-center">
      <div className="text-center space-y-8">
        <AnimatedText
          text="ReadCod"
          className="text-7xl font-bold gradient-text"
          animation="letters"
        />

        <p className="text-xl text-gray-400">
          Apprends à lire et auditer le code à l'ère de l'IA
        </p>

        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg" icon={<ArrowRight />}>
            Commencer gratuitement
          </Button>
          <Button variant="secondary" size="lg">
            En savoir plus
          </Button>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

### Features Section Exemple

```tsx
import { Card, Badge, SectionWrapper, GradientText } from '@/components/ui'
import { Code2, Brain, Heart } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: '108 Exercices',
    description: 'Python, JavaScript, Java, C++',
    badge: 'Progressif',
  },
  // ...
]

export default function FeaturesSection() {
  return (
    <SectionWrapper id="features">
      <h2 className="text-5xl font-bold text-center mb-16">
        <GradientText as="span">Fonctionnalités</GradientText>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} hover glow="orange">
            <div className="space-y-4">
              <feature.icon className="text-accent-orange" size={32} />
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
              <Badge variant="gradient">{feature.badge}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

---

**Date de création :** 3 décembre 2025
**Version :** 1.0.0
**Status :** ✅ Tous les composants créés et fonctionnels
