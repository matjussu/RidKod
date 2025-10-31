# 📱 Configuration PWA - ReadCod

Ce document explique la configuration Progressive Web App (PWA) de ReadCod.

---

## 🎯 Qu'est-ce qu'une PWA ?

Une Progressive Web App (PWA) est une application web qui se comporte comme une app native :
- **Installable** : Ajout à l'écran d'accueil mobile/bureau
- **Offline** : Fonctionne sans connexion internet
- **Rapide** : Cache intelligent des ressources
- **Native-like** : Plein écran, splash screen, icônes
- **Mise à jour automatique** : Pas de stores (App Store, Play Store)

---

## 📦 Stack PWA

- **vite-plugin-pwa** : Plugin Vite pour générer PWA automatiquement
- **Workbox** : Bibliothèque Google pour Service Workers
- **workbox-window** : API pour gérer Service Worker côté client

```bash
npm install -D vite-plugin-pwa workbox-window
```

---

## 🔧 Configuration

### 1. vite.config.js

```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Demande à l'utilisateur de mettre à jour
      includeAssets: ['long_logo.png', 'full_logo.png', ...], // Assets à cacher
      manifest: {
        name: 'ReadCod - Learn to Read Code',
        short_name: 'ReadCod',
        description: 'La première application mobile pour apprendre à LIRE du code',
        theme_color: '#1A1919',
        background_color: '#1A1919',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [/* ... */]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        runtimeCaching: [
          // Google Fonts (Cache-First)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              }
            }
          },
          // Firestore API (Network-First)
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              networkTimeoutSeconds: 10
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: false // Attend validation utilisateur pour mettre à jour
      }
    })
  ]
})
```

---

## 📄 Manifest PWA

### Fichier : `public/manifest.json`

```json
{
  "name": "ReadCod - Learn to Read Code",
  "short_name": "ReadCod",
  "description": "La première application mobile pour apprendre à LIRE du code",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1A1919",
  "theme_color": "#1A1919",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["education", "productivity"],
  "lang": "fr-FR"
}
```

### Champs importants

- **`name`** : Nom complet (affiché au splash screen)
- **`short_name`** : Nom court (affiché sous l'icône)
- **`start_url`** : URL de démarrage (`/` = page d'accueil)
- **`display: standalone`** : Plein écran sans barre browser
- **`theme_color`** : Couleur de la barre de statut mobile
- **`background_color`** : Couleur du splash screen
- **`orientation`** : Orientation forcée (portrait pour ReadCod)
- **`icons`** : Icônes de l'app (minimum 192x192 et 512x512)
- **`purpose: maskable any`** : Support icônes adaptatives Android

---

## 🎨 Icônes PWA

### Tailles requises

| Taille | Usage |
|--------|-------|
| 72x72 | Android Chrome |
| 96x96 | Android Chrome |
| 128x128 | Android Chrome |
| 144x144 | Android Chrome, Windows |
| 152x152 | iOS Safari (non-Retina iPad) |
| 192x192 | Android Chrome (standard) |
| 384x384 | Android Chrome |
| 512x512 | Android Chrome, Splash Screen |

### Générer les icônes

**Option 1 : Outil en ligne**
- https://realfavicongenerator.net/
- Uploader logo ReadCod (long_logo.png ou full_logo.png)
- Télécharger le package d'icônes
- Placer dans `/public/icons/`

**Option 2 : ImageMagick (CLI)**

```bash
# Installer ImageMagick
sudo apt install imagemagick  # Linux
brew install imagemagick      # macOS

# Créer toutes les tailles
mkdir -p public/icons
convert public/long_logo.png -resize 72x72 public/icons/icon-72x72.png
convert public/long_logo.png -resize 96x96 public/icons/icon-96x96.png
convert public/long_logo.png -resize 128x128 public/icons/icon-128x128.png
convert public/long_logo.png -resize 144x144 public/icons/icon-144x144.png
convert public/long_logo.png -resize 152x152 public/icons/icon-152x152.png
convert public/long_logo.png -resize 192x192 public/icons/icon-192x192.png
convert public/long_logo.png -resize 384x384 public/icons/icon-384x384.png
convert public/long_logo.png -resize 512x512 public/icons/icon-512x512.png
```

**Option 3 : Photoshop/Figma**
- Ouvrir long_logo.png
- Exporter en 8 tailles différentes
- Format PNG avec transparence

---

## 🌐 Meta Tags HTML

### Fichier : `index.html`

```html
<!-- PWA & Mobile Meta Tags -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
<meta name="theme-color" content="#1A1919" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="ReadCod" />
<meta name="mobile-web-app-capable" content="yes" />

<!-- Favicon & Icons -->
<link rel="icon" type="image/png" href="/icons/icon-192x192.png" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
<link rel="manifest" href="/manifest.json" />
```

### Explication des meta tags

- **`viewport`** : Responsive design + empêche zoom sur mobile
- **`theme-color`** : Couleur barre de statut Android
- **`apple-mobile-web-app-capable`** : Active mode standalone iOS
- **`apple-mobile-web-app-status-bar-style`** : Style barre statut iOS
- **`apple-mobile-web-app-title`** : Nom court iOS home screen
- **`mobile-web-app-capable`** : Active mode standalone Android

---

## 🔄 Service Worker

### Génération automatique

Le Service Worker est généré automatiquement par `vite-plugin-pwa` lors du build :

```bash
npm run build

# Fichiers générés :
# dist/sw.js                    - Service Worker principal
# dist/workbox-*.js             - Bibliothèque Workbox
# dist/manifest.webmanifest     - Manifest PWA
# dist/registerSW.js            - Script d'enregistrement
```

### Stratégies de cache

**1. Precache (Build time)**
- Tous les fichiers statiques (JS, CSS, HTML, images)
- Mis en cache lors de l'installation du Service Worker
- Fichiers : `dist/index.html`, `dist/assets/*.js`, etc.

**2. Runtime Cache (Dynamique)**

**a) Google Fonts - Cache-First**
```javascript
{
  urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
  handler: 'CacheFirst',
  expiration: { maxAgeSeconds: 31536000 } // 1 an
}
```
- Priorité au cache
- Si absent, fetch réseau puis cache
- Idéal pour ressources statiques qui changent rarement

**b) Firestore API - Network-First**
```javascript
{
  urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
  handler: 'NetworkFirst',
  networkTimeoutSeconds: 10,
  expiration: { maxAgeSeconds: 300 } // 5 min
}
```
- Priorité au réseau
- Si offline/timeout, fallback au cache
- Idéal pour données dynamiques (progression utilisateur)

### Mise à jour Service Worker

**Stratégie : `registerType: 'prompt'`**

1. Utilisateur ouvre l'app
2. SW détecte nouvelle version disponible
3. Prompt : "Nouvelle version disponible. Recharger ?"
4. User clique "Recharger" → nouvelle version s'installe
5. Si user ignore → ancienne version continue de fonctionner

**Alternative : `registerType: 'autoUpdate'`**
- Mise à jour automatique silencieuse
- User voit nouvelle version au prochain rechargement

---

## 🧪 Tester PWA

### Développement local

```bash
# 1. Build production
npm run build

# 2. Preview (simule serveur HTTPS)
npm run preview

# 3. Ouvrir http://localhost:4173
```

### Chrome DevTools

1. Ouvrir DevTools (F12)
2. **Application tab** :
   - **Manifest** : Vérifier métadonnées, icônes
   - **Service Workers** : Statut actif, cache storage
   - **Cache Storage** : Fichiers en cache (precache + runtime)
   - **Offline** : Cocher pour simuler mode hors ligne

### Lighthouse Audit

```bash
# 1. Build production
npm run build
npm run preview

# 2. Chrome DevTools > Lighthouse tab
# 3. Catégories : ✓ Performance, ✓ PWA, ✓ Best practices
# 4. Run audit

# Objectifs :
# - Performance : 90+
# - PWA : 100
# - Accessibility : 90+
# - Best Practices : 90+
```

### Test Installation Mobile

**Android Chrome** :
1. Ouvrir l'app en production (HTTPS requis)
2. Bannière "Ajouter à l'écran d'accueil" s'affiche
3. Ou : Menu ⋮ > "Installer l'application"
4. App installée sur home screen

**iOS Safari** :
1. Ouvrir l'app en production
2. Cliquer sur icône "Partager" (carré avec flèche)
3. Scroller > "Sur l'écran d'accueil"
4. Confirmer
5. App installée sur home screen

---

## 📊 Monitoring PWA

### Métriques à suivre

1. **Taux d'installation** : % users qui installent la PWA
2. **Utilisation offline** : % sessions en mode offline
3. **Cache hit rate** : % requêtes servies depuis cache
4. **Temps de chargement** : FCP, LCP avec/sans cache
5. **Erreurs Service Worker** : Échecs d'installation, cache

### Outils

- **Google Analytics** : Événements custom pour install prompts
- **Workbox Analytics** : Stats cache automatiques
- **Firebase Performance Monitoring** : Temps de chargement
- **Browser DevTools** : Logs Service Worker

---

## 🐛 Troubleshooting

### Problème : PWA ne se met pas à jour

**Symptômes** : Ancienne version reste en cache après déploiement

**Solution 1** : Forcer mise à jour
```javascript
// Dans vite.config.js
workbox: {
  skipWaiting: true,    // Force nouvelle version
  clientsClaim: true    // Active immédiatement
}
```

**Solution 2** : Clear cache manuel
```javascript
// Dans main.jsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
}
```

### Problème : Manifest non détecté

**Symptômes** : DevTools > Application > Manifest = erreur

**Solution** : Vérifier chemin
```html
<!-- index.html : chemin absolu depuis /public -->
<link rel="manifest" href="/manifest.json" />
```

### Problème : Icônes ne s'affichent pas

**Solution** : Vérifier chemins dans manifest.json
```json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png", // ✓ Chemin absolu depuis /public
      "sizes": "192x192"
    }
  ]
}
```

### Problème : Service Worker bloqué par HTTPS

**Symptômes** : PWA fonctionne en local (localhost) mais pas en production

**Solution** : Serveur HTTPS requis
- Vercel/Netlify : HTTPS automatique ✓
- Custom server : Configurer certificat SSL (Let's Encrypt)

---

## 📚 Ressources

- **Vite PWA Plugin** : https://vite-pwa-org.netlify.app/
- **Workbox Docs** : https://developers.google.com/web/tools/workbox
- **PWA Builder** : https://www.pwabuilder.com/
- **Web.dev PWA** : https://web.dev/progressive-web-apps/
- **Manifest Generator** : https://app-manifest.firebaseapp.com/

---

## ✅ Checklist PWA Complète

- [ ] `vite-plugin-pwa` installé
- [ ] `vite.config.js` configuré (plugin + workbox)
- [ ] `manifest.json` créé dans `/public/`
- [ ] Icônes 8 tailles générées dans `/public/icons/`
- [ ] Meta tags PWA dans `index.html`
- [ ] Build réussit : `npm run build`
- [ ] Service Worker généré (`dist/sw.js`)
- [ ] Test local : `npm run preview`
- [ ] Test installation (Chrome + Safari)
- [ ] Test offline (DevTools > Application > Offline)
- [ ] Lighthouse PWA score = 100
- [ ] Déployé sur Vercel avec HTTPS

---

**Dernière mise à jour** : 31 octobre 2025
**Version PWA** : 1.0.0
**Status** : ✅ Configuré et testé
