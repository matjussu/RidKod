import React from 'react';

/**
 * OnboardingHeader - Header animé avec titre stylé
 * Format: // TITRE avec couleur orange pour les slashes
 */
const OnboardingHeader = ({ title, subtitle }) => {
  return (
    <div className="onboarding-header">
      <h1 className="onboarding-title">
        <span className="onboarding-title-slashes">//</span>
        {' '}{title}
      </h1>
      {subtitle && (
        <p className="onboarding-subtitle">{subtitle}</p>
      )}
    </div>
  );
};

export default React.memo(OnboardingHeader);
