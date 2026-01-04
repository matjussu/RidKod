import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.readkode.app',
  appName: 'ReadKode',
  webDir: 'dist',
  server: {
    // Schéma capacitor pour iOS - requis pour Firebase Auth
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },
  ios: {
    // Edge-to-edge fullscreen (pas d'ajustement safe area automatique)
    contentInset: 'never',
    // Fond WebView = fond app (évite le gris au bounce scroll)
    backgroundColor: '#0F0F12',
    // Activer le scroll natif (CSS gère l'overscroll)
    scrollEnabled: true,
    // Debug
    webContentsDebuggingEnabled: true
  }
};

export default config;
