# ✅ Checklist Production - ReadCod

Ce document liste toutes les vérifications à effectuer avant et après le déploiement en production.

---

## 📋 Pré-Déploiement

### Configuration Firebase

- [ ] Firebase project créé dans Firebase Console
- [ ] Authentication activé (Email/Password provider)
- [ ] Firestore Database créé (mode production)
- [ ] Variables d'environnement Firebase configurées dans `.env`
- [ ] Fichier `.env` dans `.gitignore` (ne JAMAIS commit)
- [ ] `.env.example` créé avec variables template
- [ ] `firestore.rules` créé avec règles de sécurité
- [ ] `firebase.json` configuré pour Firestore + Hosting

### Sécurité Firestore

- [ ] Règles Firestore permettent uniquement l'accès aux propres données utilisateur
- [ ] Validation des champs obligatoires (totalXP, level, completedExercises)
- [ ] Suppression des données interdite (historique préservé)
- [ ] Accès aux autres collections bloqué par défaut
- [ ] Test manuel : Tentative lecture données autre utilisateur → refusée
- [ ] Test manuel : Tentative écriture sans auth → refusée

### Configuration PWA

- [ ] `vite-plugin-pwa` installé (`npm install -D vite-plugin-pwa`)
- [ ] `workbox-window` installé
- [ ] `manifest.json` créé dans `/public/`
- [ ] Meta tags PWA ajoutés dans `index.html`
- [ ] Icônes PWA créées (8 tailles : 72, 96, 128, 144, 152, 192, 384, 512px)
- [ ] Icônes placées dans `/public/icons/`
- [ ] Theme color configuré (#1A1919)
- [ ] Service Worker configuré dans `vite.config.js`
- [ ] Cache strategy définie (CacheFirst pour fonts, NetworkFirst pour Firestore)

### Configuration Vercel

- [ ] Compte Vercel créé
- [ ] Repository Git connecté à Vercel
- [ ] `vercel.json` créé avec configuration optimale
- [ ] Build command : `npm run build`
- [ ] Output directory : `dist`
- [ ] SPA rewrites configurés (toutes routes → index.html)
- [ ] Headers sécurité configurés (X-Frame-Options, CSP, etc.)
- [ ] Variables d'environnement préparées (7 variables Firebase)

### Code & Build

- [ ] `npm install` sans erreurs
- [ ] `npm run build` réussit localement
- [ ] `npm run preview` fonctionne (test build local)
- [ ] Aucune erreur console dans browser
- [ ] Tous les assets chargent correctement
- [ ] Tests unitaires passent : `npm run test:run` (97 tests)
- [ ] ESLint pass (si configuré) : `npm run lint`

### Contenu

- [ ] 50 exercices Python (30 Easy, 10 Medium, 10 Hard)
- [ ] Exercices testés manuellement (échantillon)
- [ ] Toutes les explications complètes et claires
- [ ] Feedback correct/incorrect fonctionne
- [ ] XP rewards corrects (Easy: 10, Medium: 20, Hard: 30)

### Navigation & Routing

- [ ] Page Welcome accessible
- [ ] Page Login/Signup fonctionnelles
- [ ] Page Home affiche menu correctement
- [ ] Page Language avec icônes langages
- [ ] Page Difficulty avec 3 niveaux
- [ ] Page Exercise avec 3 modes d'input (options, free_input, clickable_lines)
- [ ] Page Profile affiche stats utilisateur
- [ ] Navigation entre exercices (next/previous)
- [ ] Retour à Home depuis exercice (avec confirmation)

---

## 🚀 Déploiement

### Déployer Firestore Rules

```bash
# Connexion Firebase
firebase login

# Déployer règles
firebase deploy --only firestore:rules

# Vérifier dans Console
```

- [ ] Règles déployées sans erreur
- [ ] Règles visibles dans Firebase Console > Firestore Database > Règles
- [ ] Mode production activé (test mode désactivé)

### Déployer sur Vercel

**Via Dashboard** :
- [ ] Projet importé depuis Git
- [ ] Framework preset : Vite
- [ ] Build command : `npm run build`
- [ ] Output directory : `dist`
- [ ] Variables env ajoutées (toutes les 7)
- [ ] Premier déploiement lancé
- [ ] Build réussit (statut vert)
- [ ] URL production générée

**Via CLI** :
```bash
vercel login
vercel --prod
```

- [ ] CLI configuré
- [ ] Déploiement réussi
- [ ] URL production affichée

---

## 🧪 Post-Déploiement

### Tests Authentification

- [ ] **Inscription** :
  - [ ] Formulaire signup accessible
  - [ ] Email validation fonctionne
  - [ ] Password minimum 6 caractères
  - [ ] Compte créé dans Firebase Authentication
  - [ ] Redirect vers Home après signup
- [ ] **Connexion** :
  - [ ] Login avec email/password fonctionne
  - [ ] Erreur si credentials invalides
  - [ ] Redirect vers Home après login
  - [ ] User info affichée dans header
- [ ] **Déconnexion** :
  - [ ] Bouton logout visible
  - [ ] Logout réussit
  - [ ] Redirect vers Welcome
  - [ ] User info disparaît
- [ ] **Mode invité** :
  - [ ] Bouton "Continuer sans compte" fonctionne
  - [ ] Progression sauvegardée en localStorage
  - [ ] Message "Connectez-vous pour sauvegarder" affiché

### Tests Exercices

- [ ] **Navigation** :
  - [ ] Sélection langage fonctionne (Python)
  - [ ] Sélection difficulté fonctionne (Easy/Medium/Hard)
  - [ ] Exercices correspondant à la difficulté s'affichent
  - [ ] Compteur exercices correct (1/10, 2/10, etc.)
- [ ] **Modes d'input** :
  - [ ] **Options** : Choix multiples cliquables
  - [ ] **Free input** : CustomKeyboard numérique/prédéfini
  - [ ] **Clickable lines** : Clic sur lignes de code + feedback visuel
- [ ] **Validation** :
  - [ ] Réponse correcte → feedback vert + XP gagné
  - [ ] Réponse incorrecte → feedback rouge + bonne réponse affichée
  - [ ] Bouton "Continuer" après validation
  - [ ] Passage à exercice suivant
- [ ] **Feedback** :
  - [ ] FeedbackGlow affichée (bordures écran)
  - [ ] Message feedback correct/incorrect
  - [ ] Explication détaillée visible
  - [ ] Highlighting lignes importantes dans code

### Tests Progression

- [ ] **XP & Niveaux** :
  - [ ] XP incrémente après exercice correct
  - [ ] XP reste identique après exercice incorrect
  - [ ] Niveau 1 après 10 exercices (100 XP Easy)
  - [ ] Niveau 2 après 20 exercices (200 XP)
  - [ ] LevelComplete modal s'affiche après 10 exercices
- [ ] **Stats Profile** :
  - [ ] Total XP affiché correctement
  - [ ] Niveau actuel correct
  - [ ] Nombre exercices complétés correct
  - [ ] Taux de réussite correct
  - [ ] Streak affiché (si implémenté)

### Tests Firestore

- [ ] **Sauvegarde cloud (mode connecté)** :
  - [ ] User connecté → données dans Firestore
  - [ ] Document `/progress/{userId}` créé
  - [ ] Champs obligatoires présents (totalXP, level, completedExercises)
  - [ ] Timestamps createdAt/updatedAt corrects
- [ ] **Synchronisation** :
  - [ ] Connexion sur autre appareil → données synchronisées
  - [ ] Déconnexion/reconnexion → progression restaurée
- [ ] **Migration localStorage → Firestore** :
  - [ ] Jouer en mode invité (5+ exercices)
  - [ ] Se connecter
  - [ ] Données localStorage migrées vers Firestore ✓
  - [ ] Progression préservée

### Tests PWA

- [ ] **Installation** :
  - [ ] Chrome/Edge : Bouton "Installer" visible dans omnibox
  - [ ] Clic sur installer → prompt installation
  - [ ] App installée sur home screen/bureau
  - [ ] Icône correcte affichée
  - [ ] Nom "ReadCod" affiché
- [ ] **Standalone Mode** :
  - [ ] App s'ouvre en plein écran (sans barre navigation browser)
  - [ ] Splash screen visible au lancement
  - [ ] Theme color correct (#1A1919)
- [ ] **Offline** :
  - [ ] DevTools > Application > Service Workers → actif
  - [ ] Désactiver réseau (Offline mode)
  - [ ] App continue de fonctionner
  - [ ] Exercices chargent depuis cache
  - [ ] Assets (images, fonts) chargent depuis cache
  - [ ] Message si besoin connexion Firestore
- [ ] **Mise à jour** :
  - [ ] Nouveau déploiement → service worker détecte update
  - [ ] Prompt "Nouvelle version disponible" (si registerType: 'prompt')
  - [ ] Rechargement → nouvelle version chargée

### Tests Performance

- [ ] **Lighthouse** (Chrome DevTools) :
  - [ ] Performance : 90+
  - [ ] Accessibility : 90+
  - [ ] Best Practices : 90+
  - [ ] SEO : 90+
  - [ ] PWA : 100
- [ ] **Temps de chargement** :
  - [ ] First Contentful Paint < 1.5s
  - [ ] Largest Contentful Paint < 2.5s
  - [ ] Time to Interactive < 3.5s
- [ ] **Bundle size** :
  - [ ] index.js < 2MB (actuellement ~1.5MB)
  - [ ] CSS < 10KB
  - [ ] Code splitting fonctionnel (3 chunks : react, firebase, syntax-highlighter)

### Tests Sécurité

- [ ] **Firestore Rules** :
  - [ ] User A ne peut PAS lire données user B
  - [ ] User A ne peut PAS modifier données user B
  - [ ] User non-auth ne peut PAS accéder à /progress
  - [ ] Tentative modification userId → refusée
  - [ ] Tentative suppression document → refusée
- [ ] **Headers HTTP** :
  - [ ] X-Frame-Options: DENY
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Referrer-Policy: strict-origin-when-cross-origin
  - [ ] Cache-Control sur assets (max-age=31536000)
- [ ] **Variables d'environnement** :
  - [ ] `.env` dans `.gitignore`
  - [ ] Pas de credentials hardcodés dans code
  - [ ] Variables Vercel configurées (mode production)

### Tests Mobiles

- [ ] **iOS Safari** :
  - [ ] Layout responsive
  - [ ] Touch interactions fonctionnent
  - [ ] Haptic feedback (vibrations)
  - [ ] Meta tags Apple Web App corrects
  - [ ] Installation Add to Home Screen
- [ ] **Android Chrome** :
  - [ ] Layout responsive
  - [ ] Touch interactions fonctionnent
  - [ ] PWA install prompt
  - [ ] Standalone mode fonctionne

---

## 🐛 Tests Edge Cases

- [ ] Pas d'exercices disponibles pour difficulté → message erreur
- [ ] Firestore offline → fallback localStorage
- [ ] Network timeout → retry ou message erreur
- [ ] Token Firebase expiré → refresh automatique
- [ ] User supprime compte → données Firestore supprimées (ou anonymisées)
- [ ] Exercice sans explication → pas de crash
- [ ] Code exercice très long → scroll fonctionne
- [ ] Réponse très longue → text wrapping

---

## 📊 Monitoring Post-Production

### Analytics (1ère semaine)

- [ ] Vérifier Firebase Analytics → utilisateurs actifs
- [ ] Vercel Analytics → trafic, erreurs 404
- [ ] Temps de chargement moyen < 3s
- [ ] Taux de rebond < 50%
- [ ] Taux de conversion signup > 30%

### Erreurs

- [ ] Firebase Console > Firestore > Logs → pas d'erreurs permissions
- [ ] Vercel Dashboard > Deployments > Logs → pas d'erreurs 500
- [ ] Browser console → pas d'erreurs JavaScript
- [ ] Sentry (si configuré) → pas d'erreurs critiques

### Performance Continue

- [ ] Lighthouse hebdomadaire → scores maintenus
- [ ] Firestore quota usage < 50% (gratuit : 50K reads/day)
- [ ] Vercel bandwidth usage < 100GB/mois (gratuit)

---

## 🚨 Rollback Procedure

Si problème critique en production :

```bash
# Option 1 : Rollback Vercel (Dashboard)
# Vercel > Deployments > Previous deployment > Promote to Production

# Option 2 : Rollback Vercel (CLI)
vercel rollback <deployment-url>

# Option 3 : Rollback Firestore Rules
firebase deploy --only firestore:rules
# (après avoir restauré l'ancienne version de firestore.rules)
```

### Quand rollback ?

- [ ] Erreur critique bloquant l'app
- [ ] Faille de sécurité Firestore découverte
- [ ] Build cassé (500 errors)
- [ ] PWA ne fonctionne plus
- [ ] Perte de données utilisateur

---

## ✅ Validation Finale

Toutes les cases cochées ? **Félicitations, ReadCod est en production ! 🎉**

- [ ] ✅ Firestore Rules déployées et testées
- [ ] ✅ App accessible via URL Vercel
- [ ] ✅ Authentification fonctionnelle
- [ ] ✅ Exercices jouables
- [ ] ✅ Progression sauvegardée
- [ ] ✅ PWA installable
- [ ] ✅ Tests sécurité passés
- [ ] ✅ Lighthouse 90+
- [ ] ✅ Mobile testé (iOS + Android)
- [ ] ✅ Monitoring activé

**URL Production** : _________________
**Date déploiement** : _________________
**Version** : 1.0.0

---

## 📚 Prochaines Étapes

Après déploiement réussi :

1. **Domaine custom** : Configurer readcod.app (ou autre)
2. **Monitoring avancé** : Sentry, LogRocket, etc.
3. **A/B Testing** : Optimiser taux de conversion
4. **SEO** : Soumettre à Google Search Console
5. **Marketing** : Partager sur réseaux sociaux
6. **Feedback users** : Formulaire de contact, support

---

**Dernière mise à jour** : 31 octobre 2025
**Mainteneur** : ReadCod Team
