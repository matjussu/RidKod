import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAudioSystem } from './utils/audioService'

// Debug iOS Capacitor
console.log('=== ReadKode iOS Debug ===');
console.log('main.jsx loaded at:', new Date().toISOString());
console.log('window.location:', window.location.href);

// === Initialisation Audio au premier touch (requis iOS) ===
const handleFirstInteraction = () => {
  initAudioSystem();
  // Retirer les listeners après première interaction
  document.removeEventListener('touchstart', handleFirstInteraction);
  document.removeEventListener('click', handleFirstInteraction);
  document.removeEventListener('keydown', handleFirstInteraction);
  console.log('Audio system initialized on first interaction');
};

// Écouter les premières interactions utilisateur
document.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
document.addEventListener('click', handleFirstInteraction, { once: true });
document.addEventListener('keydown', handleFirstInteraction, { once: true });

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('CRITICAL: Root element not found!');
  document.body.innerHTML = '<div style="color:white;background:#0F0F12;padding:20px;height:100vh;">Erreur: Element root non trouvé</div>';
} else {
  try {
    console.log('Creating React root...');
    const root = createRoot(rootElement);

    console.log('Rendering App...');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('React render called successfully');
  } catch (error) {
    console.error('React render error:', error);
    document.body.innerHTML = `<div style="color:white;background:#0F0F12;padding:20px;height:100vh;font-family:monospace;">
      <h2>Erreur de chargement</h2>
      <p>${error.message}</p>
      <pre style="overflow:auto;font-size:12px;">${error.stack}</pre>
    </div>`;
  }
}
