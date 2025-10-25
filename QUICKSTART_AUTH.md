# ⚡ Démarrage Rapide - Authentification Firebase

## 🎯 En 5 minutes

### 1️⃣ Configurer Firebase (OBLIGATOIRE)

```bash
# 1. Aller sur https://console.firebase.google.com
# 2. Créer un projet "readcod-app"
# 3. Activer Authentication > Email/Password
# 4. Copier les clés de configuration
```

### 2️⃣ Modifier le fichier `.env`

```bash
# Ouvrir .env et remplacer les valeurs :
VITE_FIREBASE_API_KEY=ta_vraie_api_key
VITE_FIREBASE_AUTH_DOMAIN=ton-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ton-project-id
VITE_FIREBASE_STORAGE_BUCKET=ton-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
```

### 3️⃣ Lancer l'app

```bash
npm run dev
# Ouvrir http://localhost:5173 dans le navigateur
```

### 4️⃣ Tester

1. **Premier lancement** → Page Welcome s'affiche
2. Cliquer sur **"Créer un compte"**
3. Remplir email + mot de passe → Créer
4. ✅ Tu es redirigé vers Home en mode connecté !

---

## 📚 Guide détaillé complet

Pour plus de détails, voir :
- `FIREBASE_SETUP.md` - Configuration Firebase étape par étape
- `AUTH_IMPLEMENTATION.md` - Documentation technique complète

---

## 🔧 Commandes utiles

```bash
# Démarrer le serveur
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

---

## 🎮 Tester tous les scénarios

### Scénario 1 : Nouveau utilisateur (inscription)
1. Ouvrir l'app
2. Welcome → "Créer un compte"
3. Email : `test@exemple.com`
4. Mot de passe : `test123`
5. Confirmer mot de passe : `test123`
6. ✅ Créer → Redirigé vers Home (connecté)

### Scénario 2 : Utilisateur existant (connexion)
1. Ouvrir l'app
2. Welcome → "Se connecter"
3. Email : `test@exemple.com`
4. Mot de passe : `test123`
5. ✅ Se connecter → Redirigé vers Home (connecté)

### Scénario 3 : Mode invité
1. Ouvrir l'app
2. Welcome → "Continuer sans compte"
3. ✅ Redirigé vers Home (mode invité)
4. Bouton "Se connecter" visible dans Home

### Scénario 4 : Déconnexion
1. Dans Home (connecté)
2. Cliquer sur "Déconnexion"
3. ✅ Page rechargée → Welcome affiché

---

## ❌ Dépannage rapide

### Erreur : "Firebase: Error (auth/invalid-api-key)"
➡️ Tu n'as pas remplacé les clés dans `.env`

### Erreur : "Firebase: Error (auth/operation-not-allowed)"
➡️ Tu n'as pas activé Email/Password dans Firebase Console

### Le serveur ne démarre pas
➡️ `npm install` puis `npm run dev`

### Les changements dans `.env` ne sont pas pris en compte
➡️ Redémarrer le serveur (`Ctrl+C` puis `npm run dev`)

---

## 🚀 C'est tout !

L'authentification est maintenant configurée et fonctionnelle.

**Tu peux utiliser l'app normalement, avec ou sans compte.**
