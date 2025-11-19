import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import useHaptic from '../../hooks/useHaptic';

/**
 * StartNode - Bouton de départ avec interaction "Hold to Start"
 */
const StartNode = ({ x, y, onComplete }) => {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const requestRef = useRef();
    const startTimeRef = useRef();
    const { triggerLight, triggerSuccess } = useHaptic();

    const HOLD_DURATION = 1000; // 1 seconde pour activer

    const startHold = () => {
        if (completed) return;
        setIsHolding(true);
        triggerLight();
        startTimeRef.current = Date.now();
        requestRef.current = requestAnimationFrame(animate);
    };

    const endHold = () => {
        if (completed) return;
        setIsHolding(false);
        setProgress(0);
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
    };

    const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min(elapsed / HOLD_DURATION, 1);
        setProgress(newProgress);

        if (newProgress < 1) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            // Completed!
            setCompleted(true);
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
            {/* Bouton principal */}
            <button
                className={`start-node-button ${isHolding ? 'holding' : ''} ${completed ? 'completed' : ''}`}
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: completed ? '#2C2C2E' : '#30D158',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${1 + progress * 0.3})`, // Grossit jusqu'à 1.3x
                    transition: isHolding ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 0 ${20 * progress}px rgba(48, 209, 88, ${0.5 * progress})`,
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent'
                }}
            >
                <span style={{
                    fontSize: '24px',
                    color: completed ? '#30D158' : '#FFFFFF',
                    fontWeight: 'bold'
                }}>
                    {completed ? '✓' : 'GO'}
                </span>
            </button>

            {/* Label "Maintenir" (visible seulement si pas complété) */}
            {!completed && !isHolding && (
                <div style={{
                    position: 'absolute',
                    top: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#30D158',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    pointerEvents: 'none',
                    animation: 'pulse 2s infinite'
                }}>
                    Maintenir
                </div>
            )}
        </div>
    );
};

StartNode.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onComplete: PropTypes.func
};

export default StartNode;
