import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.readkode.app',
  appName: 'ReadKode',
  webDir: 'dist',
  server: {
    // HTTPS pour Android et iOS - requis pour Firebase Auth
    // https://localhost est autorisé par défaut dans Firebase
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'localhost'
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
