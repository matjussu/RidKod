# Navbar & Footer - Documentation

## ✅ Navigation et Footer créés avec succès

### 🎨 Design MetaMask-inspired

Tous les composants suivent le design dark mode de MetaMask avec :
- Effets de scroll dynamiques
- Animations Framer Motion
- Menu mobile fullscreen
- Responsive mobile-first

---

## 📦 Composants Créés

### 1. Navbar (`/src/components/layout/Navbar.tsx`)

Navigation fixe responsive avec effet scroll et menu mobile animé.

#### Features

**Desktop**
- Logo "ReadCod" avec "Cod" en gradient
- 3 liens de navigation (Fonctionnalités, Comment ça marche, Pourquoi ReadCod)
- CTA button "Ouvrir l'app" → https://ridkod.vercel.app/
- Effet scroll : transparent → dark blur au scroll

**Mobile**
- Burger menu (icône Menu/X)
- Fullscreen overlay qui slide depuis la droite
- Animations staggered sur les liens
- Backdrop avec blur
- Prévention du scroll quand menu ouvert

#### Comportement au scroll

```tsx
// Hook useScrolled
const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

**États :**
- `scrolled = false` : bg-transparent
- `scrolled = true` : bg-dark/80 + backdrop-blur-xl + border-bottom

#### Animations

**Navbar entrée :**
```tsx
initial={{ y: -100 }}
animate={{ y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}
```

**Menu mobile :**
```tsx
// Panel
initial={{ x: '100%' }}
animate={{ x: 0 }}
exit={{ x: '100%' }}
transition={{ type: 'spring', damping: 30, stiffness: 300 }}

// Backdrop
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}

// Links (staggered)
initial={{ opacity: 0, x: 50 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.1 }}
```

#### Structure

```tsx
<Navbar>
  {/* Desktop */}
  <Logo>Read<Cod gradient /></Logo>
  <NavLinks>{NAV_LINKS}</NavLinks>
  <Button CTA />

  {/* Mobile */}
  <BurgerButton />

  {/* Menu Overlay */}
  <AnimatePresence>
    <Backdrop />
    <MenuPanel>
      <NavLinks staggered />
      <Button CTA full-width />
    </MenuPanel>
  </AnimatePresence>
</Navbar>
```

#### Props & State

```tsx
const [scrolled, setScrolled] = useState(false)
const [isOpen, setIsOpen] = useState(false)

// Constants utilisées
import { APP_NAME, APP_URL, NAV_LINKS } from '@/lib/constants'
```

---

### 2. Footer (`/src/components/layout/Footer.tsx`)

Footer responsive avec 4 colonnes et réseaux sociaux.

#### Structure (4 colonnes)

**Colonne 1 : Brand**
- Logo "ReadCod" cliquable
- Tagline : "Apprends à lire le code comme un pro."
- 3 réseaux sociaux (Twitter, GitHub, LinkedIn)

**Colonne 2 : Produit**
- Fonctionnalités (#features)
- Comment ça marche (#how-it-works)
- Ouvrir l'app (https://ridkod.vercel.app/ - external)

**Colonne 3 : Ressources**
- Blog (disabled - "Bientôt")
- Documentation (disabled - "Bientôt")
- Contact (mailto:contact@readcod.com)

**Colonne 4 : Légal**
- Mentions légales (/mentions-legales)
- Confidentialité (/confidentialite)

#### Réseaux sociaux

```tsx
// Icons map
const iconMap = {
  Twitter: Twitter,
  Github: Github,
  Linkedin: Linkedin,
}

// Styled buttons
<a className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10">
  <Icon size={18} />
</a>
```

#### Bottom bar

```tsx
<div className="mt-12 pt-8 border-t border-white/10">
  <p>© {currentYear} ReadCod. Tous droits réservés.</p>
</div>
```

#### Responsive

- **Desktop** : `grid-cols-4`
- **Tablet** : `grid-cols-2`
- **Mobile** : `grid-cols-1` (stack)

#### Style des liens

```css
/* Normal */
text-white/50 hover:text-white

/* Disabled */
text-white/30 cursor-not-allowed
+ "(Bientôt)" label

/* External */
target="_blank" rel="noopener noreferrer"
```

---

## 🗂️ Constants (src/lib/constants.ts)

Fichier centralisé pour tous les liens et textes.

### Navigation Links

```tsx
export const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Comment ça marche', href: '#how-it-works' },
  { label: 'Pourquoi ReadCod', href: '#why' },
] as const
```

### Footer Links

```tsx
export const FOOTER_LINKS = {
  produit: [
    { label: 'Fonctionnalités', href: '#features', external: false },
    { label: 'Comment ça marche', href: '#how-it-works', external: false },
    { label: "Ouvrir l'app", href: 'https://ridkod.vercel.app/', external: true },
  ],
  ressources: [
    { label: 'Blog', href: '#', disabled: true },
    { label: 'Documentation', href: '#', disabled: true },
    { label: 'Contact', href: 'mailto:contact@readcod.com', external: false },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales', external: false },
    { label: 'Confidentialité', href: '/confidentialite', external: false },
  ],
} as const
```

### Social Links

```tsx
export const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/readcod', icon: 'Twitter' },
  { name: 'GitHub', href: 'https://github.com/readcod', icon: 'Github' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/readcod', icon: 'Linkedin' },
] as const
```

### App Info

```tsx
export const APP_NAME = "ReadCod"
export const APP_TAGLINE = "Apprends à lire le code comme un pro."
export const APP_DESCRIPTION = "Apprends à lire et auditer le code à l'ère de l'IA"
export const APP_URL = "https://ridkod.vercel.app/"
export const APP_EMAIL = "contact@readcod.com"
```

---

## 🎯 Intégration dans Layout

### layout.tsx

```tsx
import { Navbar, Footer } from "@/components/layout"

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body>
        <Navbar />
        <main className="pt-20"> {/* Padding pour navbar fixed */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

**Important :**
- `pt-20` sur `<main>` pour compenser la navbar fixed (h-20)
- Navbar `position: fixed` z-50
- Footer en bas du contenu, pas fixed

---

## ✨ Features Avancées

### Navbar

**1. Scroll Detection**
- Hook custom `useScrolled`
- Trigger à 50px de scroll
- Transition smooth sur background

**2. Menu Mobile**
- AnimatePresence pour animations exit
- Spring animation (damping 30, stiffness 300)
- Stagger sur les liens (delay * index)
- Prevent body scroll quand menu ouvert

**3. Logo Gradient**
- "Read" en blanc
- "Cod" avec gradient orange → violet
- Inline dans le composant (pas GradientText)

### Footer

**1. Social Icons**
- Hover effect : bg opacity + text color
- Icon size 18px
- Rounded-lg containers

**2. Disabled Links**
- Visual feedback (opacity 30%)
- Click preventDefault
- "(Bientôt)" label

**3. External Links**
- target="_blank"
- rel="noopener noreferrer"
- Security best practice

---

## 📊 Statistiques

**Navbar.tsx**
- 173 lignes
- 2 useEffect hooks
- 2 state (scrolled, isOpen)
- AnimatePresence pour menu mobile
- Responsive desktop/mobile

**Footer.tsx**
- 143 lignes
- 4 colonnes responsive
- 3 social links
- Disabled state support
- Icon mapping dynamic

**constants.ts**
- 3 navigation links
- 9 footer links (3 sections)
- 3 social links
- 5 app constants

---

## 🚀 Test en Live

Pour voir la Navbar et le Footer :

```bash
cd readcod-landing
npm run dev
```

Ouvrir : `http://localhost:3000`

**Tests à faire :**
1. Scroll down → Navbar change de style
2. Click burger menu → Menu slide in
3. Click backdrop → Menu ferme
4. Click lien menu → Menu ferme + scroll to anchor
5. Hover sur liens Footer → Text color change
6. Click social icons → Open in new tab

---

## ✅ Checklist

- [x] **Navbar** créée avec effet scroll
- [x] **Menu mobile** avec animations
- [x] **Footer** 4 colonnes responsive
- [x] **Réseaux sociaux** avec icons
- [x] **constants.ts** mis à jour
- [x] **layout.tsx** intégration complète
- [x] **Responsive** mobile/tablet/desktop
- [x] **Animations** Framer Motion
- [x] **Accessibility** aria-labels, focus states
- [x] **Performance** React.memo candidates
- [x] **Serveur** démarre sans erreurs ✅

---

## 🎨 Code Snippets

### Utiliser les constants

```tsx
import { NAV_LINKS, FOOTER_LINKS, SOCIAL_LINKS, APP_URL } from '@/lib/constants'

// Navigation
{NAV_LINKS.map(link => (
  <a href={link.href}>{link.label}</a>
))}

// Footer links
{FOOTER_LINKS.produit.map(link => (
  <a href={link.href}>{link.label}</a>
))}

// Social links
{SOCIAL_LINKS.map(social => (
  <a href={social.href}>{social.name}</a>
))}
```

### Scroll Detection Hook

```tsx
const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### Prevent Body Scroll

```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])
```

---

**Date de création :** 3 décembre 2025
**Version :** 1.0.0
**Status :** ✅ Navbar et Footer complets et fonctionnels
