# 🚀 Setup GitHub pour ReadKode-Mobile

Guide rapide pour créer le repo GitHub et pusher le code.

---

## 📋 Étape 1 : Créer le repo sur GitHub

### Option A : Via le site web (Recommandé)

1. Aller sur [github.com/new](https://github.com/new)
2. Remplir les informations :
   - **Repository name** : `ReadKode-Mobile`
   - **Description** : `📱 Application mobile React Native pour apprendre à lire du code - Version native de ReadCod`
   - **Visibility** : Public (ou Private si tu préfères)
   - **❌ Ne pas** cocher "Initialize with README" (on en a déjà un)
   - **❌ Ne pas** ajouter .gitignore (on en a déjà un)
   - **❌ Ne pas** choisir de license pour l'instant
3. Cliquer **"Create repository"**

### Option B : Via GitHub CLI

```bash
# Installer GitHub CLI (si pas déjà fait)
brew install gh  # macOS
# ou
sudo apt install gh  # Linux

# Login
gh auth login

# Créer le repo
gh repo create ReadKode-Mobile --public --description "📱 Application mobile React Native pour apprendre à lire du code"
```

---

## 📤 Étape 2 : Pusher le code

Une fois le repo créé sur GitHub, copier l'URL du repo (ex: `https://github.com/TON_USERNAME/ReadKode-Mobile.git`)

```bash
# Aller dans le dossier du projet
cd /home/user/ReadKode-Mobile

# Ajouter le remote GitHub
git remote add origin https://github.com/TON_USERNAME/ReadKode-Mobile.git

# Vérifier que le remote a été ajouté
git remote -v

# Pusher le code (branche main)
git push -u origin main
```

---

## ✅ Étape 3 : Vérifier sur GitHub

1. Rafraîchir la page du repo sur GitHub
2. Tu devrais voir :
   - ✅ 61 fichiers
   - ✅ README.md affiché en bas de page
   - ✅ Commit initial visible

---

## 📝 Étape 4 : Compléter le repo

### Ajouter Topics (Tags)

Sur la page du repo GitHub, cliquer sur ⚙️ (à droite) et ajouter des topics :
- `react-native`
- `expo`
- `mobile-app`
- `learning-platform`
- `code-reading`
- `ios`
- `android`
- `firebase`
- `education`

### Ajouter une License

```bash
# Dans le dossier ReadKode-Mobile
cd /home/user/ReadKode-Mobile

# Créer LICENSE (MIT par exemple)
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 [TON NOM]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Commit et push
git add LICENSE
git commit -m "docs: Add MIT License"
git push
```

---

## 🔗 Étape 5 : Lier avec RidKod (Web)

Dans le README du repo **RidKod** (web), ajouter un lien vers **ReadKode-Mobile** :

```markdown
## 📱 Version Mobile

Une version mobile native est disponible : [ReadKode-Mobile](https://github.com/TON_USERNAME/ReadKode-Mobile)

- iOS & Android
- React Native + Expo
- Firebase sync
- Haptic feedback natif
```

---

## 🎨 Bonus : Ajouter des badges

Dans le README.md de ReadKode-Mobile, ajouter en haut :

```markdown
# ReadKode Mobile 📱

![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)
![Expo](https://img.shields.io/badge/Expo-52.0-black)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
```

---

## 🚨 Troubleshooting

### Erreur : "remote origin already exists"

```bash
# Supprimer le remote existant
git remote remove origin

# Ajouter le nouveau
git remote add origin https://github.com/TON_USERNAME/ReadKode-Mobile.git
```

### Erreur : "Permission denied (publickey)"

```bash
# Vérifier tes clés SSH
ls -la ~/.ssh

# Générer une nouvelle clé SSH
ssh-keygen -t ed25519 -C "ton.email@example.com"

# Ajouter à GitHub : Settings → SSH Keys → New SSH key
cat ~/.ssh/id_ed25519.pub
```

### Erreur : "Authentication failed"

```bash
# Utiliser un Personal Access Token au lieu du mot de passe
# Aller sur : GitHub → Settings → Developer settings → Personal access tokens
# Générer un token avec scope "repo"
# Utiliser ce token comme mot de passe
```

---

## 📊 Commandes Git utiles

```bash
# Voir l'état du repo
git status

# Voir les commits
git log --oneline

# Voir les remotes
git remote -v

# Créer une nouvelle branche
git checkout -b feature/nom-feature

# Pusher une branche
git push -u origin feature/nom-feature

# Pull les changements
git pull origin main
```

---

## 🎯 Next Steps

Une fois le repo créé et pushé :

1. ✅ Cloner sur ta machine locale
   ```bash
   git clone https://github.com/TON_USERNAME/ReadKode-Mobile.git
   cd ReadKode-Mobile
   npm install
   npm start
   ```

2. ✅ Configurer Firebase Native
   - Ajouter `GoogleService-Info.plist` (iOS)
   - Ajouter `google-services.json` (Android)

3. ✅ Tester l'app
   - Expo Go sur téléphone
   - Simulateur iOS/Android

4. ✅ Développer les features manquantes
   - Voir [docs/MIGRATION.md](./docs/MIGRATION.md)
   - Checklist dans README.md

---

**Félicitations ! 🎉**

Ton repo GitHub est prêt et le code est en ligne. Tu peux maintenant travailler dessus indépendamment de RidKod (web).

**Repos parallèles** :
- 🌐 **RidKod** → App Web (React + Vite)
- 📱 **ReadKode-Mobile** → App Mobile (React Native + Expo)

Bon développement ! 🚀
