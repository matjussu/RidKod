# Guide Migration Web → Mobile 🔄

Guide complet pour migrer ReadCod (React Web) vers ReadKode-Mobile (React Native + Expo).

---

## 📊 Vue d'ensemble

### Stratégie adoptée : **Réécriture complète**

Plutôt qu'un monorepo, nous avons choisi 2 repos indépendants :

- **RidKod** (repo existant) → App Web React
- **ReadKode-Mobile** (nouveau repo) → App Mobile React Native

**Avantages** :
- Indépendance totale (pas de risque pour la prod web)
- Historique Git séparé
- Déploiements distincts (Vercel vs App Store)
- Évolution à son propre rythme

---

## 🔄 Répartition du Code

### Code Réutilisé (40-50%)

| Fichier | Status | Notes |
|---------|--------|-------|
| `exercises.json` | ✅ 100% réutilisé | Copié tel quel |
| `lessons/*.json` | ✅ 100% réutilisé | Copié tel quel |
| `progressService.js` | ⚠️ Adapté | localStorage → AsyncStorage |
| `userService.js` | ✅ Réutilisé | Logique identique |
| Logique XP/niveaux | ✅ Réutilisé | Calculs mathématiques purs |

### Code Adapté (30%)

| Fichier | Changements | Effort |
|---------|-------------|--------|
| `AuthContext.jsx` | localStorage → AsyncStorage | 1h |
| `firebase.js` | Web SDK → Native SDK | 2h |
| `ProgressContext.jsx` | Storage adapté | 1h |
| Navigation | React Router → React Navigation | 3h |

### Code Réécrit (50-60%)

| Composant Web | Composant RN | Effort |
|---------------|--------------|--------|
| `Exercise.jsx` | `ExerciseScreen.js` | 6h |
| `Home.jsx` | `HomeScreen.js` | 2h |
| `Profile.jsx` | `ProfileScreen.js` | 3h |
| `Login.jsx` | `LoginScreen.js` | 1h |
| `Signup.jsx` | `SignupScreen.js` | 2h |
| Tous les CSS | StyleSheet RN | 8h |

---

## 🛠️ Mappings Techniques

### 1. HTML → React Native Components

```jsx
// WEB (React)
<div className="container">
  <h1>Title</h1>
  <p>Text</p>
  <button onClick={handleClick}>Click</button>
  <input type="text" value={text} onChange={e => setText(e.target.value)} />
</div>

// MOBILE (React Native)
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
  <Text style={styles.text}>Text</Text>
  <TouchableOpacity onPress={handleClick}>
    <Text>Click</Text>
  </TouchableOpacity>
  <TextInput value={text} onChangeText={setText} />
</View>
```

### 2. CSS → StyleSheet

```javascript
// WEB (CSS)
.container {
  display: flex;
  flex-direction: column;
  background-color: #1A1919;
  padding: 20px;
  border-radius: 12px;
}

// MOBILE (StyleSheet)
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',     // display: flex implicite
    backgroundColor: '#1A1919',
    padding: 20,
    borderRadius: 12
  }
});
```

**Différences clés** :
- Pas de `px` en RN (nombres directement)
- `flexDirection` au lieu de `flex-direction`
- Pas de `display` (View = flex par défaut)
- `backgroundColor` au lieu de `background-color`

### 3. localStorage → AsyncStorage

```javascript
// WEB
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');
localStorage.removeItem('key');

// MOBILE (AsyncStorage est async!)
await AsyncStorage.setItem('key', 'value');
const value = await AsyncStorage.getItem('key');
await AsyncStorage.removeItem('key');
```

**⚠️ Important** : AsyncStorage est **asynchrone**, il faut utiliser `await`.

### 4. Firebase Web SDK → Native SDK

```javascript
// WEB
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// MOBILE (React Native Firebase)
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Configuration dans fichiers natifs :
// - ios/GoogleService-Info.plist
// - android/app/google-services.json

export { auth, firestore };
export default {
  auth: auth(),
  db: firestore()
};
```

**Configuration Native requise** :
- iOS : Télécharger `GoogleService-Info.plist` depuis Firebase Console
- Android : Télécharger `google-services.json` depuis Firebase Console

### 5. React Router → React Navigation

```jsx
// WEB (React Router)
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

// Dans un composant
const navigate = useNavigate();
navigate('/exercise');

// MOBILE (React Navigation)
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Dans un composant
navigation.navigate('Exercise', { difficulty: 1 });
```

### 6. Vibration API → Expo Haptics

```javascript
// WEB
if (navigator.vibrate) {
  navigator.vibrate(50);
}

// MOBILE (Expo Haptics)
import * as Haptics from 'expo-haptics';

// Léger
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Moyen
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Fort
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## 📋 Checklist Migration

### Phase 1 : Setup Initial

- [x] Créer projet Expo
- [x] Installer dépendances RN
- [x] Configurer React Navigation
- [x] Setup Firebase RN
- [ ] Ajouter GoogleService-Info.plist (iOS)
- [ ] Ajouter google-services.json (Android)

### Phase 2 : Data & Services

- [x] Copier exercises.json
- [x] Copier lessons/*.json
- [x] Adapter AuthContext (AsyncStorage)
- [x] Copier progressService.js
- [x] Copier userService.js
- [ ] Tester Firestore sync

### Phase 3 : Screens (5 écrans)

- [x] HomeScreen (dashboard)
- [x] ExerciseScreen (POC predict_output)
- [x] ProfileScreen (stats placeholder)
- [x] LoginScreen (formulaire)
- [x] SignupScreen (formulaire + avatar)

### Phase 4 : Composants

- [ ] CustomKeyboard (free_input)
- [ ] CodeBlock clickable (clickable_lines)
- [ ] LevelComplete modal
- [ ] ActivityCalendar
- [ ] FeedbackGlow

### Phase 5 : Features Avancées

- [ ] Types exercices (4/4)
- [ ] Système progression complet
- [ ] Stats utilisateur
- [ ] Streak tracking
- [ ] Leçons (3 écrans)

### Phase 6 : Production

- [ ] Tests unitaires
- [ ] Configuration EAS Build
- [ ] Icônes et splash screens
- [ ] TestFlight (iOS)
- [ ] Google Play Beta (Android)

---

## 🚧 Défis Spécifiques

### 1. Syntax Highlighting

**Problème** : `react-syntax-highlighter` ne fonctionne pas bien sur mobile.

**Solutions** :
```jsx
// Option A : react-native-syntax-highlighter (utilisé actuellement)
import SyntaxHighlighter from 'react-native-syntax-highlighter';

<SyntaxHighlighter language="python" style={dark}>
  {code}
</SyntaxHighlighter>

// Option B : Custom avec Text + couleurs (plus performant)
const renderCode = (code) => {
  // Parser le code ligne par ligne
  // Appliquer couleurs manuellement
  return lines.map(line => (
    <Text style={styles.codeLine}>{line}</Text>
  ));
};
```

### 2. Code Clickable

**Problème** : Cliquer sur des lignes de code précises.

**Solution** :
```jsx
<View style={styles.codeBlock}>
  {code.split('\n').map((line, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.codeLine,
        selectedLine === index && styles.codeLineSelected
      ]}
      onPress={() => handleLineClick(index)}
    >
      <Text style={styles.lineNumber}>{index + 1}</Text>
      <Text style={styles.lineText}>{line}</Text>
    </TouchableOpacity>
  ))}
</View>
```

### 3. CustomKeyboard

**Problème** : Clavier personnalisé pour `free_input`.

**Solution** :
```jsx
const CustomKeyboard = ({ onInput }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['⌫', '0', '✓']
  ];

  return (
    <View style={styles.keyboard}>
      {keys.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map(key => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => onInput(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};
```

### 4. ScrollView Performance

**Problème** : Listes longues lentes.

**Solution** : Utiliser `FlatList` au lieu de `ScrollView` :
```jsx
// Au lieu de :
<ScrollView>
  {exercises.map(ex => <ExerciseCard key={ex.id} {...ex} />)}
</ScrollView>

// Utiliser :
<FlatList
  data={exercises}
  renderItem={({ item }) => <ExerciseCard {...item} />}
  keyExtractor={item => item.id}
  initialNumToRender={5}
  maxToRenderPerBatch={5}
  windowSize={10}
/>
```

---

## 📊 Timeline Réaliste

### POC (1 semaine) ✅ FAIT
- [x] Setup projet Expo
- [x] 1 écran Exercise fonctionnel
- [x] Navigation basique
- [x] AuthContext adapté

### MVP (4-6 semaines)
- [ ] 5 écrans complets
- [ ] 3 types d'input (options, free_input, clickable_lines)
- [ ] Firebase Firestore fonctionnel
- [ ] Système progression
- [ ] Tests manuels iOS/Android

### Production (8-10 semaines)
- [ ] Tous les composants
- [ ] 108 exercices supportés
- [ ] Tests unitaires
- [ ] Beta TestFlight + Play Store
- [ ] Feedback utilisateurs
- [ ] Bug fixes

---

## 🎯 Priorités

### Must Have (MVP)
1. ExerciseScreen complet (3 input types)
2. Firebase Auth + Firestore
3. Progression XP/niveaux
4. HomeScreen + ProfileScreen

### Should Have
5. Leçons (3 écrans)
6. ActivityCalendar
7. Stats avancées
8. Challenges

### Nice to Have
9. AI Understanding
10. Graphiques Chart.js
11. Badges/achievements
12. Social features

---

## 📚 Ressources

### Documentation
- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Firebase](https://rnfirebase.io)

### Tutoriels Migration
- [React to React Native](https://reactnative.dev/docs/getting-started)
- [Web to Mobile](https://reactnavigation.org/docs/web-support/)

### Outils
- [Expo Snack](https://snack.expo.dev) - Tester du code RN en ligne
- [React Native Directory](https://reactnative.directory) - Packages RN

---

## 💡 Tips & Best Practices

### 1. Développement

```bash
# Toujours tester sur device réel (pas que simulateur)
expo start --tunnel  # Accessible depuis n'importe où

# Hot reload plus rapide
expo start --dev-client
```

### 2. Styles

```javascript
// Utiliser Dimensions pour responsive
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,  // 90% largeur écran
    height: height * 0.5  // 50% hauteur écran
  }
});
```

### 3. Performance

```jsx
// Memoize composants lourds
const ExerciseCard = React.memo(({ exercise }) => {
  return <View>...</View>;
});

// Utiliser useMemo pour calculs lourds
const sortedExercises = useMemo(
  () => exercises.sort((a, b) => a.difficulty - b.difficulty),
  [exercises]
);
```

### 4. Debugging

```javascript
// Console logs
console.log('Debug:', value);

// React Native Debugger
// Cmd+D (iOS) / Cmd+M (Android) → Debug

// Expo DevTools
expo start --devtools
```

---

**Dernière mise à jour** : 20 novembre 2025
**Version** : 1.0.0

---

Des questions sur la migration ? Ouvre une issue sur GitHub ! 🚀
