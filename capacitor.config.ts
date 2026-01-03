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
    contentInset: 'automatic',
    // Force le chargement depuis le dossier public
    webContentsDebuggingEnabled: true
  }
};

export default config;
