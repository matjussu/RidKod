import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveOnboardingData } from '../services/userService';
import useHaptic from '../hooks/useHaptic';

import OnboardingProgress from '../components/onboarding/OnboardingProgress';
import OnboardingHeader from '../components/onboarding/OnboardingHeader';
import OnboardingCard from '../components/onboarding/OnboardingCard';
import CelebrationScreen from '../components/onboarding/CelebrationScreen';

// Import des icônes langages
import pythonIcon from '../assets/python_5968350.png';
import htmlIcon from '../assets/html-5_5968267.png';
import javaIcon from '../assets/java_5968282.png';
import cppIcon from '../assets/c_6132222.png';
import rIcon from '../assets/R_logo.svg.png';

import '../styles/Onboarding.css';

/**
 * Onboarding - Flow d'onboarding en 5 étapes obligatoires
 *
 * Étapes:
 * 1. Niveau d'expérience
 * 2. Objectif principal
 * 3. Langages préférés (multi-select)
 * 4. Temps quotidien
 * 5. Célébration
 */

// Données des étapes
const EXPERIENCE_OPTIONS = [
  {
    id: 'beginner',
    icon: '</>',
    title: 'Débutant',
    description: 'Je débute en programmation'
  },
  {
    id: 'junior',
    icon: '{ }',
    title: 'Junior',
    description: "Je code depuis moins d'1 an"
  },
  {
    id: 'intermediate',
    icon: '[ ]',
    title: 'Confirmé',
    description: "1-3 ans d'expérience"
  },
  {
    id: 'expert',
    icon: '< >',
    title: 'Expert',
    description: '3+ ans de pratique'
  }
];

const GOAL_OPTIONS = [
  {
    id: 'learn_language',
    icon: '💻',
    title: 'Apprendre un langage',
    description: 'Maîtriser les bases d\'un langage de programmation'
  },
  {
    id: 'read_code',
    icon: '📖',
    title: 'Mieux lire le code',
    description: 'Comprendre le code plus rapidement'
  },
  {
    id: 'code_reviews',
    icon: '✓',
    title: 'Code reviews',
    description: 'Améliorer mes revues de code'
  },
  {
    id: 'audit_ai',
    icon: '🤖',
    title: "Comprendre l'IA",
    description: 'Auditer le code généré par ChatGPT & co'
  },
  {
    id: 'curiosity',
    icon: '🧭',
    title: 'Curiosité',
    description: 'Je veux explorer et apprendre'
  }
];

const LANGUAGE_OPTIONS = [
  {
    id: 'python',
    icon: pythonIcon,
    title: 'Python',
    description: 'Le langage le plus populaire',
    badge: 'Disponible',
    badgeType: 'available',
    disabled: false
  },
  {
    id: 'web',
    icon: htmlIcon,
    title: 'Web',
    description: 'HTML, CSS, JavaScript',
    badge: 'Bientôt',
    badgeType: 'coming',
    disabled: true
  },
  {
    id: 'java',
    icon: javaIcon,
    title: 'Java',
    description: 'Robuste et polyvalent',
    badge: 'Bientôt',
    badgeType: 'coming',
    disabled: true
  },
  {
    id: 'cpp',
    icon: cppIcon,
    title: 'C++',
    description: 'Performance maximale',
    badge: 'Bientôt',
    badgeType: 'coming',
    disabled: true
  },
  {
    id: 'stats',
    icon: rIcon,
    title: 'Stats',
    description: 'R et analyse de données',
    badge: 'Bientôt',
    badgeType: 'coming',
    disabled: true
  }
];

const TIME_OPTIONS = [
  {
    id: 5,
    icon: '⏱️',
    title: '5 min/jour',
    description: 'Quelques exercices rapides'
  },
  {
    id: 10,
    icon: '⏰',
    title: '10 min/jour',
    description: 'Une leçon complète'
  },
  {
    id: 15,
    icon: '🔥',
    title: '15+ min/jour',
    description: 'Apprentissage intensif'
  },
  {
    id: 0,
    icon: '🧭',
    title: 'Je découvre',
    description: 'Je suis là pour découvrir, je verrai plus tard'
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerSuccess, triggerLight } = useHaptic();

  // État
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sélections
  const [selections, setSelections] = useState({
    experienceLevel: null,
    primaryGoal: null,
    preferredLanguages: [],
    dailyGoalMinutes: null
  });

  // Vérifier si l'étape actuelle est valide pour continuer
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return selections.experienceLevel !== null;
      case 2:
        return selections.primaryGoal !== null;
      case 3:
        return selections.preferredLanguages.length > 0;
      case 4:
        return selections.dailyGoalMinutes !== null;
      case 5:
        return true;
      default:
        return false;
    }
  }, [currentStep, selections]);

  // Handlers de sélection
  const handleSelectExperience = useCallback((id) => {
    setSelections(prev => ({ ...prev, experienceLevel: id }));
  }, []);

  const handleSelectGoal = useCallback((id) => {
    setSelections(prev => ({ ...prev, primaryGoal: id }));
  }, []);

  const handleToggleLanguage = useCallback((id) => {
    setSelections(prev => {
      const current = prev.preferredLanguages;
      const isSelected = current.includes(id);

      return {
        ...prev,
        preferredLanguages: isSelected
          ? current.filter(lang => lang !== id)
          : [...current, id]
      };
    });
  }, []);

  const handleSelectTime = useCallback((id) => {
    setSelections(prev => ({ ...prev, dailyGoalMinutes: id }));
  }, []);

  // Navigation
  const handleNext = useCallback(() => {
    if (!canProceed()) return;

    triggerLight();
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  }, [canProceed, triggerLight]);

  const handleBack = useCallback(() => {
    if (currentStep <= 1) return;

    triggerLight();
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsTransitioning(false);
    }, 300);
  }, [currentStep, triggerLight]);

  // Compléter l'onboarding
  const handleComplete = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Sauvegarder dans Firebase
      if (user?.uid) {
        await saveOnboardingData(user.uid, selections);
      }

      triggerSuccess();
      navigate('/home');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Continuer quand même vers home en cas d'erreur
      navigate('/home');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, user, selections, triggerSuccess, navigate]);

  // Render étape courante
  const renderStep = () => {
    const stepClass = isTransitioning ? 'onboarding-step exiting' : 'onboarding-step';

    switch (currentStep) {
      case 1:
        return (
          <div className={stepClass}>
            <OnboardingHeader
              title="TON NIVEAU"
              subtitle="Ça nous aide à personnaliser ton expérience"
            />
            <div className="onboarding-cards">
              {EXPERIENCE_OPTIONS.map(option => (
                <OnboardingCard
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  selected={selections.experienceLevel === option.id}
                  onClick={() => handleSelectExperience(option.id)}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className={stepClass}>
            <OnboardingHeader
              title="TON OBJECTIF"
              subtitle="Qu'est-ce qui t'a amené ici ?"
            />
            <div className="onboarding-cards">
              {GOAL_OPTIONS.map(option => (
                <OnboardingCard
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  selected={selections.primaryGoal === option.id}
                  onClick={() => handleSelectGoal(option.id)}
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className={stepClass}>
            <OnboardingHeader
              title="TES LANGAGES"
              subtitle="Sélectionne ceux qui t'intéressent"
            />
            <div className="onboarding-cards">
              {LANGUAGE_OPTIONS.map(option => (
                <OnboardingCard
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  badge={option.badge}
                  badgeType={option.badgeType}
                  disabled={option.disabled}
                  selected={selections.preferredLanguages.includes(option.id)}
                  onClick={() => handleToggleLanguage(option.id)}
                />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className={stepClass}>
            <OnboardingHeader
              title="TON RYTHME"
              subtitle="Combien de temps par jour ?"
            />
            <div className="onboarding-cards">
              {TIME_OPTIONS.map(option => (
                <OnboardingCard
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  selected={selections.dailyGoalMinutes === option.id}
                  onClick={() => handleSelectTime(option.id)}
                />
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <CelebrationScreen
            username={user?.username || 'Ami'}
            experienceLevel={selections.experienceLevel}
            primaryGoal={selections.primaryGoal}
            preferredLanguages={selections.preferredLanguages}
            dailyGoalMinutes={selections.dailyGoalMinutes}
            onStart={handleComplete}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-container">
        {/* Progress indicator */}
        <OnboardingProgress currentStep={currentStep} totalSteps={5} />

        {/* Step content */}
        {renderStep()}

        {/* Navigation (hidden on step 5) */}
        {currentStep < 5 && (
          <div className="onboarding-navigation">
            <button
              type="button"
              className="onboarding-nav-back"
              onClick={handleBack}
              disabled={currentStep <= 1}
              aria-label="Retour"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="onboarding-nav-next"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              CONTINUER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
