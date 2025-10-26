# 🧪 TESTING.md - Guide des Tests Unitaires

## 📖 Vue d'ensemble

ReadCod utilise **Vitest** + **React Testing Library** pour les tests unitaires. Ce document explique comment fonctionne le système de tests et comment les utiliser.

---

## 🚀 Démarrage Rapide

### Lancer tous les tests
```bash
npm test
```

### Lancer les tests en mode watch (développement)
```bash
npm test
```

### Lancer les tests une fois (CI/CD)
```bash
npm run test:run
```

### Lancer les tests avec interface UI
```bash
npm run test:ui
```

### Générer un rapport de couverture
```bash
npm run test:coverage
```

---

## 📁 Structure des Tests

```
src/tests/
├── setup.js                          # Configuration globale Vitest
├── __mocks__/
│   └── firebase.js                   # Mocks Firebase pour tests
├── services/
│   └── progressService.test.js       # Tests logique progression (XP, niveaux)
├── context/
│   └── AuthContext.test.jsx          # Tests authentification
└── components/
    ├── OptionButton.test.jsx         # Tests boutons réponse
    └── ActionButton.test.jsx         # Tests bouton Valider/Continuer
```

---

## 🎯 Tests Implémentés

### ✅ Tests Services (progressService.test.js)

**48 tests** couvrant :

#### Calcul de niveau (`calculateLevel`)
- ✅ Niveau 1 : 0-99 XP
- ✅ Niveau 2 : 100-249 XP
- ✅ Niveau 3 : 250-499 XP
- ✅ ... jusqu'au niveau 10 (11000+ XP)
- ✅ Gestion valeurs négatives et infinies

#### XP pour niveau suivant (`getXPForNextLevel`)
- ✅ Retourne XP requis pour chaque niveau
- ✅ Gère les niveaux au-delà de 10

#### LocalStorage (`saveProgressLocally`, `getLocalProgress`)
- ✅ Sauvegarde progression dans localStorage
- ✅ Fusion avec progression existante
- ✅ Retour valeurs par défaut si vide
- ✅ Gestion données corrompues (JSON invalide)

**Résultat :** Logique de progression 100% testée et fiable

---

### ✅ Tests AuthContext (AuthContext.test.jsx)

**15 tests** couvrant :

#### État initial
- ✅ Contexte fournit valeurs par défaut (user: null, loading: false)
- ✅ Hook `useAuth()` lance une erreur si hors provider

#### skipAuth()
- ✅ Marque `hasSkipped` dans localStorage
- ✅ `hasSeenWelcome()` retourne true après skip

#### hasSeenWelcome()
- ✅ Retourne false si ni hasSkipped ni hasAccount
- ✅ Retourne true si hasSkipped défini
- ✅ Retourne true si hasAccount défini

#### signup()
- ✅ Crée un compte avec succès
- ✅ Gère erreur "email-already-in-use"
- ✅ Gère erreur "weak-password"
- ✅ Messages d'erreur en français

#### login()
- ✅ Se connecte avec succès
- ✅ Gère erreur "invalid-credential"
- ✅ Messages d'erreur en français

#### logout()
- ✅ Se déconnecte avec succès
- ✅ Nettoie localStorage (userEmail)
- ✅ Gère les erreurs de déconnexion

**Résultat :** Authentification testée de bout en bout

---

### ✅ Tests OptionButton (OptionButton.test.jsx)

**28 tests** couvrant :

#### Rendering
- ✅ Affiche la valeur (string, number, null, empty)
- ✅ Gère les très longues valeurs (200+ caractères)

#### États avant validation
- ✅ Classe "default" si non sélectionné
- ✅ Classe "selected" si sélectionné
- ✅ Non disabled avant validation

#### États après validation
- ✅ Classe "correct" si bonne réponse
- ✅ Classe "incorrect" si sélectionné mais incorrect
- ✅ Classe "faded" si ni sélectionné ni correct
- ✅ Disabled après validation

#### Interactions
- ✅ onClick appelé avant validation
- ✅ onClick PAS appelé après validation (disabled)

#### Combinaisons complexes
- ✅ Bonne réponse sélectionnée → "correct" + disabled
- ✅ Bonne réponse non sélectionnée → "correct" + disabled
- ✅ Mauvaise réponse sélectionnée → "incorrect" + disabled
- ✅ Option neutre → "faded" + disabled

#### Accessibilité
- ✅ Role button
- ✅ Keyboard accessible

**Résultat :** Tous les états visuels validés (default, selected, correct, incorrect, faded)

---

### ✅ Tests ActionButton (ActionButton.test.jsx)

**25 tests** couvrant :

#### Texte du bouton
- ✅ "Valider" avant validation
- ✅ "Continuer" après validation

#### États avant validation
- ✅ Classe "disabled" si isDisabled=true
- ✅ Classe "enabled" si isDisabled=false
- ✅ Non cliquable si disabled
- ✅ Cliquable si enabled

#### États après validation
- ✅ Classe "enabled" (vert) si bonne réponse
- ✅ Classe "incorrect-state" (rouge) si mauvaise réponse
- ✅ Non disabled après validation (pour cliquer "Continuer")

#### Workflow complet
- ✅ Valider (disabled) → Valider (enabled) → Continuer (vert)
- ✅ Valider (enabled) → Continuer (rouge)

#### Interactions multiples
- ✅ onClick appelé à chaque clic si enabled
- ✅ onClick jamais appelé si disabled

#### Edge cases
- ✅ Gère onClick undefined
- ✅ Gère combinaisons illogiques (submitted+disabled)

#### Accessibilité
- ✅ Role button
- ✅ Keyboard accessible

**Résultat :** Logique de validation/continuation 100% testée

---

## 🔧 Configuration Vitest

### vitest.config.js
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // describe, it, expect globaux
    environment: 'jsdom',       // Environnement DOM simulé
    setupFiles: './src/tests/setup.js',
    css: true,                  // Supporter les imports CSS
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/tests/', 'dist/']
    }
  }
});
```

### setup.js
- Cleanup automatique après chaque test
- Clear localStorage/sessionStorage
- Mock de `navigator.vibrate` (haptic feedback)
- Mock de `window.matchMedia` (media queries)

---

## 📝 Écrire un Test - Exemple

### Test simple d'un composant
```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('devrait afficher le texte', () => {
    render(<MyComponent text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('devrait appeler onClick', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test avec Context
```jsx
import { AuthProvider } from '../context/AuthContext';

it('devrait utiliser le contexte', () => {
  render(
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
  // ... assertions
});
```

### Test avec mocks Firebase
```jsx
import { vi } from 'vitest';
import * as firebaseAuth from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

// Dans le test
firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
  user: { email: 'test@example.com' }
});
```

---

## 🎨 Matchers Testing Library

### Queries
```jsx
// Par texte
screen.getByText('Submit')

// Par role
screen.getByRole('button')

// Par test ID
screen.getByTestId('username-input')

// Par label
screen.getByLabelText('Email')
```

### Assertions
```jsx
// Dans le DOM
expect(element).toBeInTheDocument()

// Texte
expect(element).toHaveTextContent('Hello')

// Classe CSS
expect(element).toHaveClass('active')

// Disabled
expect(button).toBeDisabled()
expect(button).not.toBeDisabled()

// Valeur
expect(input).toHaveValue('test@example.com')
```

### Attendre des changements
```jsx
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

---

## 📊 Couverture de Code

### Générer le rapport
```bash
npm run test:coverage
```

### Lire le rapport
- **Terminal :** Résumé avec % couverture
- **HTML :** `coverage/index.html` (ouvrir dans navigateur)

### Objectifs de couverture
- ✅ **Services :** 100% (progressService.js)
- ✅ **Contexts :** ~90% (AuthContext.jsx)
- ✅ **Composants :** ~85% (OptionButton, ActionButton)
- ⚠️ **Pages :** 0% (à implémenter)

---

## 🚧 Tests Manquants (TODO)

### Priorité HAUTE
- [ ] **ProgressContext.test.jsx** - Gestion progression complète
  - completeExercise()
  - isExerciseCompleted()
  - getStats()
  - Synchronisation Firestore

### Priorité MOYENNE
- [ ] **QuestionCard.test.jsx** - Affichage question + feedback
- [ ] **CodeBlock.test.jsx** - Syntax highlighting + line highlight
- [ ] **Home.test.jsx** - Menu principal + navigation
- [ ] **Login.test.jsx** - Formulaire connexion + validation
- [ ] **Signup.test.jsx** - Formulaire inscription + validation

### Priorité BASSE
- [ ] **Exercise.test.jsx** - Page exercice complète
- [ ] **FeedbackGlow.test.jsx** - Effets visuels
- [ ] **useHaptic.test.js** - Hook vibrations

---

## 🐛 Debugging Tests

### Afficher le DOM rendu
```jsx
import { render, screen } from '@testing-library/react';

const { debug } = render(<MyComponent />);
debug(); // Affiche le DOM dans la console
```

### Afficher un élément spécifique
```jsx
const element = screen.getByText('Hello');
console.log(element.outerHTML);
```

### Mode verbose
```bash
npm test -- --reporter=verbose
```

### Lancer un seul test
```bash
npm test -- OptionButton.test.jsx
```

### Lancer un seul describe/it
```javascript
describe.only('MyComponent', () => { ... })
it.only('devrait faire X', () => { ... })
```

---

## 🔥 Bonnes Pratiques

### ✅ À FAIRE
1. **Tester le comportement, pas l'implémentation**
   ```jsx
   // ✅ BON
   expect(button).toHaveTextContent('Valider');

   // ❌ MAUVAIS
   expect(button.props.isSubmitted).toBe(false);
   ```

2. **Utiliser les queries accessibles**
   ```jsx
   // ✅ BON
   screen.getByRole('button', { name: 'Submit' })

   // ❌ MAUVAIS
   document.querySelector('.submit-button')
   ```

3. **Cleanup automatique**
   - Ne PAS appeler `cleanup()` manuellement
   - `setup.js` le fait automatiquement

4. **Mock Firebase pour éviter les appels réels**
   - Toujours mocker `firebase/auth` et `firebase/firestore`

5. **Tester les edge cases**
   - Valeurs null/undefined
   - Tableaux vides
   - Chaînes très longues
   - Valeurs négatives

### ❌ À ÉVITER
1. **Tester des détails d'implémentation**
2. **Tests flaky (qui échouent aléatoirement)**
3. **Tests trop longs (>50 lignes par test)**
4. **Dépendances entre tests**
5. **Mocks trop complexes**

---

## 📚 Ressources

### Documentation officielle
- **Vitest :** https://vitest.dev
- **Testing Library :** https://testing-library.com/react
- **Testing Library Queries :** https://testing-library.com/docs/queries/about

### Guides
- **Common mistakes :** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
- **Testing principles :** https://testing-library.com/docs/guiding-principles

---

## ✅ Résumé

### Tests actuels
- ✅ **progressService.js** : 48 tests (100% couverture)
- ✅ **AuthContext.jsx** : 15 tests (~90% couverture)
- ✅ **OptionButton.jsx** : 28 tests (~85% couverture)
- ✅ **ActionButton.jsx** : 25 tests (~85% couverture)

**Total :** **116 tests** implémentés

### Prochaines étapes
1. ⏳ Implémenter tests ProgressContext
2. ⏳ Implémenter tests pages (Home, Login, Signup)
3. ⏳ Implémenter tests QuestionCard + CodeBlock
4. ⏳ Atteindre 80%+ de couverture globale

### Commandes essentielles
```bash
npm test              # Lancer tests en watch mode
npm run test:run      # Lancer une fois
npm run test:ui       # Interface graphique
npm run test:coverage # Rapport couverture
```

---

**Dernière mise à jour :** 25 octobre 2025
**Version :** 1.0
**Status :** 🟢 Tests opérationnels - 116 tests passent
