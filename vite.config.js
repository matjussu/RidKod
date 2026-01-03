import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2015', // Compatibilité maximale iOS WebView
    modulePreload: false, // CRITIQUE: Désactive modulepreload qui échoue sur iOS
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Garder les console.log pour debug iOS
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        format: 'es',
        // Un seul bundle pour éviter les problèmes de chargement de modules sur iOS
        manualChunks: undefined
      }
    }
  }
})
