# PWA Icons

Ce dossier doit contenir les icônes PWA aux tailles suivantes :

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Génération des icônes

### Option 1 : ImageMagick (CLI)

```bash
# Depuis la racine du projet
convert public/long_logo.png -resize 72x72 public/icons/icon-72x72.png
convert public/long_logo.png -resize 96x96 public/icons/icon-96x96.png
convert public/long_logo.png -resize 128x128 public/icons/icon-128x128.png
convert public/long_logo.png -resize 144x144 public/icons/icon-144x144.png
convert public/long_logo.png -resize 152x152 public/icons/icon-152x152.png
convert public/long_logo.png -resize 192x192 public/icons/icon-192x192.png
convert public/long_logo.png -resize 384x384 public/icons/icon-384x384.png
convert public/long_logo.png -resize 512x512 public/icons/icon-512x512.png
```

### Option 2 : Outil en ligne

Utiliser https://realfavicongenerator.net/ avec le logo ReadCod.

## Important

Ces icônes sont requises pour que la PWA fonctionne correctement.
Sans elles, l'installation de l'app échouera.
