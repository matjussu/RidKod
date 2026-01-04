import React from 'react';

/**
 * OnboardingProgress - Indicateur de progression 5 dots
 * Affiche l'étape actuelle avec états: completed, active, pending
 */
const OnboardingProgress = ({ currentStep, totalSteps = 5 }) => {
  return (
    <div className="onboarding-progress">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        let status = 'pending';

        if (step < currentStep) {
          status = 'completed';
        } else if (step === currentStep) {
          status = 'active';
        }

        return (
          <div
            key={step}
            className={`onboarding-dot ${status}`}
            aria-label={`Étape ${step} sur ${totalSteps}`}
            aria-current={step === currentStep ? 'step' : undefined}
          />
        );
      })}
    </div>
  );
};

export default React.memo(OnboardingProgress);
