import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigation.navigate('Home');
    }
  };

  const statsCards = [
    { label: 'Total XP', value: '0', color: '#1871BE' },
    { label: 'Niveau', value: '1', color: '#088201' },
    { label: 'Exercices', value: '0', color: '#FF9500' },
    { label: 'Streak', value: '0 🔥', color: '#FF383C' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {isAuthenticated && user?.username
              ? user.username.charAt(0).toUpperCase()
              : '?'}
          </Text>
        </View>
        <Text style={styles.username}>
          {isAuthenticated && user?.username ? user.username : 'Invité'}
        </Text>
        {isAuthenticated && user?.email && (
          <Text style={styles.email}>{user.email}</Text>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statsCards.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Info Message */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 Les stats sont synchronisées avec Firestore
        </Text>
        <Text style={styles.infoSubtext}>
          Implémentation complète à venir
        </Text>
      </View>

      {/* Action Buttons */}
      {isAuthenticated ? (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupButtonText}>Inscription</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1919',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#088201',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    color: '#8E8E93',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#FF383C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  authButtons: {
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signupButton: {
    backgroundColor: '#088201',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreen;
