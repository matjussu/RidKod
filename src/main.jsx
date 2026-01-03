import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debug iOS Capacitor
console.log('=== ReadKode iOS Debug ===');
console.log('main.jsx loaded at:', new Date().toISOString());
console.log('window.location:', window.location.href);

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('CRITICAL: Root element not found!');
  document.body.innerHTML = '<div style="color:white;background:#1A1919;padding:20px;height:100vh;">Erreur: Element root non trouvé</div>';
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
    document.body.innerHTML = `<div style="color:white;background:#1A1919;padding:20px;height:100vh;font-family:monospace;">
      <h2>Erreur de chargement</h2>
      <p>${error.message}</p>
      <pre style="overflow:auto;font-size:12px;">${error.stack}</pre>
    </div>`;
  }
}
