import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const menuItems = [
    {
      title: '📚 Leçons',
      description: 'Apprends les bases du code',
      color: '#1871BE',
      onPress: () => console.log('Leçons - À implémenter')
    },
    {
      title: '🎯 Entraînements',
      description: 'Pratique avec des exercices',
      color: '#088201',
      onPress: () => navigation.navigate('Exercise', { difficulty: 1 })
    },
    {
      title: '🏆 Challenges',
      description: 'Défis quotidiens et hebdomadaires',
      color: '#FF9500',
      onPress: () => console.log('Challenges - À implémenter')
    },
    {
      title: '🤖 AI Understanding',
      description: 'Comprends le code généré par IA',
      color: '#FF383C',
      onPress: () => console.log('AI - À implémenter')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1919" />

      <View style={styles.header}>
        <Text style={styles.logo}>ReadKode</Text>
        <Text style={styles.subtitle}>Apprends à lire du code</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuCard, { borderLeftColor: item.color }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.profileButtonText}>👤 Profil</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1919',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  menuDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  profileButton: {
    margin: 20,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
