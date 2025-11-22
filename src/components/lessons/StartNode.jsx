import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import useHaptic from '../../hooks/useHaptic';

/**
 * StartNode - Bouton de départ premium avec interaction "Hold to Start"
 * Style Apple classe avec progress ring, particules et animations fluides
 */
const StartNode = ({ x, y, onComplete }) => {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const requestRef = useRef();
    const startTimeRef = useRef();
    const hapticMidTriggered = useRef(false);
    const { triggerLight, triggerMedium, triggerSuccess } = useHaptic();

    const HOLD_DURATION = 3000; // 3 secondes pour activer

    const startHold = (e) => {
        if (completed) return;
        // preventDefault uniquement pour les événements souris (pas tactiles)
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
        setIsHolding(true);
        triggerLight();
        hapticMidTriggered.current = false;
        startTimeRef.current = Date.now();
        requestRef.current = requestAnimationFrame(animate);
    };

    const endHold = (e) => {
        if (completed) return;
        // preventDefault uniquement pour les événements souris (pas tactiles)
        if (e?.type === 'mouseup') {
            e.preventDefault();
        }
        setIsHolding(false);
        setProgress(0);
        hapticMidTriggered.current = false;
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
    };

    const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min(elapsed / HOLD_DURATION, 1);
        setProgress(newProgress);

        // Haptic feedback à 50%
        if (newProgress >= 0.5 && !hapticMidTriggered.current) {
            triggerMedium();
            hapticMidTriggered.current = true;
        }

        if (newProgress < 1) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            // Completed!
            setCompleted(true);
            setShowParticles(true);
            triggerSuccess();
            onComplete && onComplete();
        }
    };

    // Nettoyage
    useEffect(() => {
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    // Calcul pour le progress ring
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <div
            className="start-node-container"
            style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
            }}
        >
            {/* Progress Ring SVG */}
            {isHolding && !completed && (
                <svg
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-90deg)',
                        width: '100px',
                        height: '100px',
                        pointerEvents: 'none',
                        zIndex: 100
                    }}
                >
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#FF9500"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                            filter: 'drop-shadow(0 0 8px rgba(255, 149, 0, 0.8))'
                        }}
                    />
                </svg>
            )}

            {/* Bouton principal */}
            <button
                className={`start-node-button ${isHolding ? 'holding' : ''} ${completed ? 'completed' : ''}`}
                onMouseDown={startHold}
                onMouseUp={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                onTouchCancel={endHold}
                onContextMenu={(e) => e.preventDefault()}
                disabled={completed}
                style={{ touchAction: 'none' }}
            >
                <span className="start-text">
                    {completed ? '✓' : 'START'}
                </span>
            </button>

            {/* Particules dorées explosion */}
            {showParticles && (
                <div className="particles-container">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                '--angle': `${i * 45}deg`
                            }}
                        />
                    ))}
                </div>
            )}

            <style>{`
                /* Bouton principal - Style Apple Premium */
                .start-node-button {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #30D158 0%, #088201 100%);
                    border: 3px solid rgba(255, 255, 255, 0.15);
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1;

                    /* Multi-layer shadows pour profondeur 3D */
                    box-shadow:
                        0 8px 24px rgba(0, 0, 0, 0.4),
                        0 4px 12px rgba(48, 209, 88, 0.3),
                        inset 0 2px 0 rgba(255, 255, 255, 0.2);

                    /* Animation pulse subtile par défaut */
                    animation: breathe 3s ease-in-out infinite;
                }

                @keyframes breathe {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.03);
                    }
                }

                /* État holding - Scale + glow animé */
                .start-node-button.holding {
                    animation: none !important;
                    transform: scale(1.15) !important;
                    box-shadow:
                        0 12px 32px rgba(0, 0, 0, 0.5),
                        0 0 40px rgba(255, 149, 0, 0.6),
                        inset 0 2px 0 rgba(255, 255, 255, 0.3);
                }

                /* État completed - Spring bounce + particules */
                .start-node-button.completed {
                    background: linear-gradient(135deg, #088201 0%, #30D158 100%);
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    cursor: default;
                    animation: springBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    box-shadow:
                        0 8px 24px rgba(8, 130, 1, 0.4),
                        0 4px 12px rgba(48, 209, 88, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }

                @keyframes springBounce {
                    0% {
                        transform: scale(1.15);
                    }
                    40% {
                        transform: scale(1.25) rotate(10deg);
                    }
                    60% {
                        transform: scale(0.95) rotate(-5deg);
                    }
                    80% {
                        transform: scale(1.05) rotate(2deg);
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                    }
                }

                /* Texte START */
                .start-text {
                    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
                    font-size: 16px;
                    font-weight: 900;
                    font-style: italic;
                    color: #FFFFFF;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
                    transform: skewX(-5deg);
                    user-select: none;
                    transition: all 0.3s ease;
                }

                .start-node-button.completed .start-text {
                    color: #FFFFFF;
                    font-size: 32px;
                    font-style: normal;
                    letter-spacing: 0;
                    transform: skewX(0deg);
                }

                /* Particules explosion */
                .particles-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }

                .particle {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 8px;
                    height: 8px;
                    background: #FFD700;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: particleExplode 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    box-shadow: 0 0 12px #FFD700;
                }

                @keyframes particleExplode {
                    0% {
                        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(80px) scale(0.2);
                        opacity: 0;
                    }
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .start-node-button {
                        width: 72px;
                        height: 72px;
                    }

                    .start-text {
                        font-size: 14px;
                    }

                    .start-node-button.completed .start-text {
                        font-size: 28px;
                    }
                }
            `}</style>
        </div>
    );
};

StartNode.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onComplete: PropTypes.func
};

export default StartNode;
