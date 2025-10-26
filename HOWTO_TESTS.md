# 🧪 Comment Fonctionne le Système de Tests

## 🎯 Pourquoi des Tests Unitaires ?

Les tests unitaires vous permettent de :

1. **Détecter les bugs rapidement** : Les tests vérifient automatiquement que votre code fonctionne comme prévu
2. **Éviter les régressions** : Quand vous modifiez du code, les tests s'assurent que rien n'est cassé
3. **Documenter le code** : Les tests montrent comment utiliser vos composants/fonctions
4. **Gagner du temps** : Plus besoin de tester manuellement dans le navigateur à chaque modification
5. **Déployer en confiance** : Vous savez que tout fonctionne avant la mise en production

---

## 🚀 Utilisation Rapide

### Lancer les tests
```bash
npm test
```

Les tests se lancent en **mode watch** : ils se relancent automatiquement quand vous modifiez un fichier. Parfait pour le développement !

### Lancer les tests une fois (pour CI/CD)
```bash
npm run test:run
```

### Interface graphique interactive
```bash
npm run test:ui
```

Ouvre une interface web pour voir vos tests, filtrer, debug, etc.

### Générer un rapport de couverture
```bash
npm run test:coverage
```

Montre quel % de votre code est testé.

---

## 📂 Structure des Tests

Tous les tests sont dans `src/tests/` :

```
src/tests/
├── setup.js                          # Configuration globale
├── __mocks__/
│   └── firebase.js                   # Mocks Firebase
├── services/
│   └── progressService.test.js       # Tests logique XP/niveaux
├── context/
│   └── AuthContext.test.jsx          # Tests authentification
└── components/
    ├── OptionButton.test.jsx         # Tests boutons réponse
    └── ActionButton.test.jsx         # Tests bouton Valider/Continuer
```

Chaque test est à côté du fichier qu'il teste, mais dans le dossier `tests/`.

---

## 🧠 Comment Ça Marche ?

### 1. Framework : Vitest

**Vitest** est comme Jest mais **ultra-rapide** et optimisé pour Vite. Il fournit :
- `describe()` : Grouper des tests
- `it()` ou `test()` : Définir un test
- `expect()` : Faire des assertions

```javascript
describe('OptionButton', () => {
  it('devrait afficher la valeur', () => {
    // Test ici
  });
});
```

### 2. Testing Library : Tester comme un utilisateur

**React Testing Library** permet de tester vos composants comme un utilisateur réel :

```javascript
// Rendre le composant
render(<OptionButton value="Option A" />);

// Trouver un élément comme le ferait l'utilisateur
const button = screen.getByRole('button');

// Vérifier qu'il contient le bon texte
expect(button).toHaveTextContent('Option A');

// Simuler un clic
fireEvent.click(button);
```

**Principe :** On ne teste PAS l'implémentation interne, on teste le comportement visible.

### 3. Mocks : Simuler Firebase

Les tests ne font **jamais d'appels réseau réels**. On simule Firebase :

```javascript
// Mock de signInWithEmailAndPassword
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn()
}));

// Dans le test, on simule une réponse
signInWithEmailAndPassword.mockResolvedValue({
  user: { email: 'test@example.com' }
});
```

---

## 📝 Anatomie d'un Test

Voici un test complet annoté :

```javascript
// 1. Imports
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OptionButton from '../../components/exercise/OptionButton';

// 2. Groupe de tests
describe('OptionButton', () => {

  // 3. Test individuel
  it('devrait afficher la valeur', () => {

    // 4. ARRANGE : Préparer le test
    const value = 'Option A';
    const handleClick = vi.fn(); // Mock de fonction

    // 5. ACT : Exécuter l'action
    render(
      <OptionButton
        value={value}
        isSelected={false}
        isCorrect={false}
        isSubmitted={false}
        onClick={handleClick}
      />
    );

    // 6. ASSERT : Vérifier le résultat
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Option A');

    // 7. Test d'interaction
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Pattern AAA : Arrange, Act, Assert**

---

## 🎯 Matchers Communs

Les matchers sont les fonctions après `expect()` :

### Présence dans le DOM
```javascript
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();
```

### Texte
```javascript
expect(element).toHaveTextContent('Hello');
expect(element).toContainText('World');
```

### Classes CSS
```javascript
expect(element).toHaveClass('active');
expect(element).not.toHaveClass('disabled');
```

### État disabled/enabled
```javascript
expect(button).toBeDisabled();
expect(button).not.toBeDisabled();
```

### Valeur d'input
```javascript
expect(input).toHaveValue('test@example.com');
```

### Appels de fonction
```javascript
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledTimes(3);
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFunction).not.toHaveBeenCalled();
```

### Égalité
```javascript
expect(value).toBe(42);
expect(object).toEqual({ name: 'John' });
expect(array).toContain('item');
```

---

## 🔍 Queries Testing Library

### Par rôle (RECOMMANDÉ)
```javascript
screen.getByRole('button');
screen.getByRole('textbox');
screen.getByRole('heading', { level: 1 });
```

### Par texte
```javascript
screen.getByText('Submit');
screen.getByText(/submit/i); // Insensible à la casse
```

### Par label (formulaires)
```javascript
screen.getByLabelText('Email');
```

### Par test ID (dernier recours)
```javascript
screen.getByTestId('submit-button');
```

### Variantes
- `getBy` : Trouve UN élément (erreur si 0 ou 2+)
- `queryBy` : Trouve UN élément (null si 0)
- `findBy` : Trouve UN élément (async, attend qu'il apparaisse)
- `getAllBy` : Trouve PLUSIEURS éléments

---

## 🧪 Exemples Concrets

### Tester un composant simple
```javascript
it('devrait afficher le nom', () => {
  render(<UserCard name="Alice" />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

### Tester un clic
```javascript
it('devrait appeler onClick', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Tester un formulaire
```javascript
it('devrait soumettre le formulaire', () => {
  const handleSubmit = vi.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  // Remplir les champs
  const emailInput = screen.getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

  const passwordInput = screen.getByLabelText('Password');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Soumettre
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Vérifier
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### Tester un état async
```javascript
it('devrait charger les données', async () => {
  render(<DataList />);

  // Vérifier le loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Attendre que les données apparaissent
  const items = await screen.findByRole('list');
  expect(items).toBeInTheDocument();

  // Vérifier les données
  expect(screen.getByText('Item 1')).toBeInTheDocument();
});
```

### Tester avec Context
```javascript
it('devrait utiliser le contexte', () => {
  render(
    <AuthProvider>
      <ProtectedComponent />
    </AuthProvider>
  );

  expect(screen.getByText('Welcome, user!')).toBeInTheDocument();
});
```

---

## 🐛 Debugging Tests

### Afficher le DOM
```javascript
const { debug } = render(<MyComponent />);
debug(); // Affiche tout le DOM
debug(screen.getByRole('button')); // Affiche un élément spécifique
```

### Lancer un seul test
```bash
npm test -- OptionButton.test.jsx
```

### Lancer un seul describe/it
```javascript
describe.only('Mon groupe', () => { ... });
it.only('Mon test', () => { ... });
```

### Ignorer un test
```javascript
it.skip('Ce test ne marche pas encore', () => { ... });
```

### Mode verbose
```bash
npm test -- --reporter=verbose
```

---

## ✅ Bonnes Pratiques

### À FAIRE ✅
1. **Tester le comportement, pas l'implémentation**
   ```javascript
   // ✅ BON
   expect(button).toHaveTextContent('Valider');

   // ❌ MAUVAIS
   expect(component.state.isSubmitted).toBe(false);
   ```

2. **Utiliser les queries accessibles**
   ```javascript
   // ✅ BON
   screen.getByRole('button', { name: 'Submit' })

   // ❌ MAUVAIS
   document.querySelector('.submit-button')
   ```

3. **Un test = une responsabilité**
   ```javascript
   // ✅ BON : Tests séparés
   it('devrait afficher le texte', () => { ... });
   it('devrait être cliquable', () => { ... });

   // ❌ MAUVAIS : Test qui fait tout
   it('devrait faire plein de trucs', () => {
     // 50 lignes de code...
   });
   ```

4. **Tester les edge cases**
   - Valeurs null/undefined
   - Tableaux vides
   - Chaînes très longues
   - Valeurs négatives

### À ÉVITER ❌
1. **Tester des détails d'implémentation**
2. **Tests flaky (qui échouent aléatoirement)**
3. **Tests trop longs (>50 lignes par test)**
4. **Dépendances entre tests**
5. **Mocks trop complexes**

---

## 📊 Couverture de Code

### Qu'est-ce que c'est ?

La **couverture** mesure quel % de votre code est exécuté par les tests.

### Générer le rapport
```bash
npm run test:coverage
```

### Lire le rapport
```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
progressService.js  |   100   |   100    |   100   |   100
AuthContext.jsx     |    90   |    85    |    95   |    90
OptionButton.jsx    |    85   |    80    |    90   |    85
```

- **% Stmts** : % de lignes exécutées
- **% Branch** : % de conditions (if/else) testées
- **% Funcs** : % de fonctions appelées
- **% Lines** : % de lignes de code exécutées

### Objectif

Visez **80%+ de couverture** pour les parties critiques :
- Services (logique métier)
- Contexts (state management)
- Composants UI principaux

Pas besoin de 100% partout, mais les parties importantes doivent être bien testées.

---

## 🔥 Astuces Avancées

### Tester les erreurs
```javascript
it('devrait gérer les erreurs', async () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

  render(<DataFetcher fetchFn={mockFetch} />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Tester les timers
```javascript
it('devrait afficher après 1 seconde', () => {
  vi.useFakeTimers();

  render(<DelayedMessage />);
  expect(screen.queryByText('Hello')).not.toBeInTheDocument();

  vi.advanceTimersByTime(1000);
  expect(screen.getByText('Hello')).toBeInTheDocument();

  vi.useRealTimers();
});
```

### Tester le localStorage
```javascript
beforeEach(() => {
  localStorage.clear();
});

it('devrait sauvegarder dans localStorage', () => {
  render(<SaveButton />);
  fireEvent.click(screen.getByRole('button'));

  expect(localStorage.getItem('saved')).toBe('true');
});
```

---

## 📚 Ressources

### Documentation officielle
- **Vitest** : https://vitest.dev
- **Testing Library** : https://testing-library.com/react

### Guides
- **Common mistakes** : https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
- **Testing principles** : https://testing-library.com/docs/guiding-principles

### Dans ce projet
- **[TESTING.md](TESTING.md)** - Guide complet des tests ReadCod
- **[TEST_RESULTS.md](TEST_RESULTS.md)** - Résultats des tests actuels

---

## 🎉 Conclusion

Les tests unitaires vous font gagner du temps et vous donnent confiance dans votre code. Avec Vitest + Testing Library :

1. ✅ Tests **ultra-rapides** (2-3 secondes)
2. ✅ Tests **faciles à écrire** (comme un utilisateur)
3. ✅ Tests **fiables** (pas de faux positifs)
4. ✅ Feedback **immédiat** (mode watch)

**Commencez petit** : testez d'abord les composants/fonctions critiques, puis étendez progressivement.

**Happy Testing !** 🧪✨

---

**Dernière mise à jour :** 25 octobre 2025
**Version :** 1.0
