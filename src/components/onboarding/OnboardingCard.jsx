import React from 'react';
import useHaptic from '../../hooks/useHaptic';

/**
 * OnboardingCard - Card sélectionnable avec glassmorphism
 * Props:
 * - icon: string (ex: "</>" ou emoji)
 * - title: string
 * - description: string
 * - selected: boolean
 * - disabled: boolean
 * - badge: string (optional, ex: "Disponible" ou "Bientôt")
 * - badgeType: 'available' | 'coming' (optional)
 * - onClick: function
 */
const OnboardingCard = ({
  icon,
  title,
  description,
  selected = false,
  disabled = false,
  badge,
  badgeType = 'available',
  onClick
}) => {
  const { triggerLight } = useHaptic();

  const handleClick = () => {
    if (disabled) return;
    triggerLight();
    onClick?.();
  };

  return (
    <button
      type="button"
      className={`onboarding-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <div className="onboarding-card-icon">
        {typeof icon === 'string' && icon.startsWith('/') || (typeof icon === 'string' && icon.includes('.png')) || (typeof icon === 'object') ? (
          <img src={icon} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        ) : (
          icon
        )}
      </div>
      <div className="onboarding-card-content">
        <div className="onboarding-card-title-row">
          <span className="onboarding-card-title">{title}</span>
          {badge && (
            <span className={`onboarding-card-badge ${badgeType}`}>
              {badge}
            </span>
          )}
        </div>
        <span className="onboarding-card-description">{description}</span>
      </div>
      {selected && (
        <div className="onboarding-card-check">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10L8 14L16 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

export default React.memo(OnboardingCard);
