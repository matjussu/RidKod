import React from 'react';
import PropTypes from 'prop-types';
import useHaptic from '../../hooks/useHaptic';

const PathXPNode = ({ x, y, nodeId, xpAmount, isLocked, isCollected, onClick }) => {
    const { triggerLight, triggerMedium } = useHaptic();

    // Si collecté, ne pas afficher (disparition complète)
    if (isCollected) {
        return null;
    }

    const handleClick = () => {
        if (!isLocked) {
            triggerMedium();
            onClick();
        } else {
            triggerLight();
        }
    };

    // Styles inline pour injection
    const styles = `
        @keyframes xpPulse {
            0%, 100% {
                transform: translate(-50%, -50%) scale(1);
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.15);
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
            }
        }

        @keyframes xpGlow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        .xp-node {
            cursor: pointer;
            padding: 0;
            overflow: visible;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 100;
        }

        .xp-node.locked {
            cursor: not-allowed;
        }

        .xp-node-circle {
            position: absolute;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 900;
            transition: all 0.3s ease;
        }

        /* État Locked (gris) */
        .xp-node.locked .xp-node-circle {
            background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%);
            border: 2px solid rgba(255, 255, 255, 0.1);
            color: #6E6E73;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* État Unlocked (doré + pulse) */
        .xp-node.unlocked .xp-node-circle {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            border: 3px solid #FFFFFF;
            color: #0F0F12;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
            animation: xpPulse 2s ease-in-out infinite;
        }

        /* Glow ring pour unlocked */
        .xp-node.unlocked::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #FFD700;
            animation: xpGlow 2s ease-in-out infinite;
            pointer-events: none;
        }


        /* Hover effect (seulement si unlocked) */
        .xp-node.unlocked:hover .xp-node-circle {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
        }

        /* Active state */
        .xp-node.unlocked:active .xp-node-circle {
            transform: scale(0.95);
        }
    `;

    // Injecter les styles
    React.useEffect(() => {
        if (typeof document !== 'undefined' && !document.getElementById('xp-node-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'xp-node-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }, []);

    return (
        <div
            className={`xp-node ${isLocked ? 'locked' : 'unlocked'}`}
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: 0,
                height: 0
            }}
            onClick={handleClick}
            role="button"
            aria-label={isLocked ? `${xpAmount} XP verrouillé` : `Collecter ${xpAmount} XP`}
            aria-disabled={isLocked}
        >
            <div className="xp-node-circle">
                {/* Icône étoile dorée */}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
            </div>
        </div>
    );
};

PathXPNode.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    nodeId: PropTypes.string.isRequired,
    xpAmount: PropTypes.number.isRequired,
    isLocked: PropTypes.bool.isRequired,
    isCollected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default PathXPNode;
