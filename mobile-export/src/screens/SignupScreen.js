import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const SignupScreen = ({ navigation }) => {
  const { signup, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#088201');

  const avatarColors = [
    '#088201', '#1871BE', '#FF9500', '#FF383C',
    '#30D158', '#5E5CE6', '#FF375F', '#FFD60A'
  ];

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    const result = await signup(email, password, username, selectedColor);
    setLoading(false);

    if (result.success) {
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>
              Crée ton compte pour sauvegarder ta progression
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="#8E8E93"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8E8E93"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmer mot de passe"
                placeholderTextColor="#8E8E93"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />

              {/* Avatar Color Picker */}
              <Text style={styles.colorLabel}>Couleur de ton avatar</Text>
              <View style={styles.colorGrid}>
                {avatarColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              {password !== confirmPassword && confirmPassword.length > 0 && (
                <Text style={styles.errorText}>
                  Les mots de passe ne correspondent pas
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  (loading || !username || !email || !password || password !== confirmPassword) &&
                    styles.signupButtonDisabled
                ]}
                onPress={handleSignup}
                disabled={loading || !username || !email || !password || password !== confirmPassword}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signupButtonText}>Créer mon compte</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1919',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 40,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#FFFFFF',
  },
  errorText: {
    color: '#FF383C',
    fontSize: 14,
    marginBottom: 16,
  },
  signupButton: {
    backgroundColor: '#088201',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  signupButtonDisabled: {
    backgroundColor: '#3A3A3C',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
    marginRight: 8,
  },
  loginLink: {
    color: '#088201',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignupScreen;
