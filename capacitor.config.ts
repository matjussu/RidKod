import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.readkode.app',
  appName: 'ReadKode',
  webDir: 'dist',
  server: {
    // Utilisation du schéma ionic pour iOS (plus stable)
    androidScheme: 'https',
    iosScheme: 'ionic'
  },
  ios: {
    // Edge-to-edge fullscreen (pas d'ajustement safe area automatique)
    contentInset: 'never',
    // Fond WebView = fond app (évite le gris au bounce scroll)
    backgroundColor: '#1A1919',
    // Désactive le scroll/bounce natif WebView (scroll géré par CSS)
    scrollEnabled: false,
    // Debug
    webContentsDebuggingEnabled: true
  }
};

export default config;
