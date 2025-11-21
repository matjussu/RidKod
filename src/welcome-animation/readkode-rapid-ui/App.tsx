
import React, { useState, useEffect, useCallback, useRef, FC } from 'react';
import { Logo } from './components/Logo';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { initAudio, playTypeSound, playSwellSound, playFinishSound } from './utils/audio';

const App: FC = () => {
    // Stage 4 is the "Finished" state so it looks complete on initial load
    const [animationStage, setAnimationStage] = useState<number>(4);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const timeoutRefs = useRef<number[]>([]);

    const clearAllTimeouts = () => {
        timeoutRefs.current.forEach(id => window.clearTimeout(id));
        timeoutRefs.current = [];
    };

    const startAnimation = useCallback(() => {
        if (isAnimating) return;
        
        // Initialize audio context immediately on user interaction
        initAudio();
        
        setIsAnimating(true);
        clearAllTimeouts();

        // Timeline Sequence (Slower Version + Sound):
        // 0ms: Blank
        // 1000ms: Slash typed (Sound: Click)
        // 1800ms: Bracket typed (Sound: Click)
        // 2800ms: "read" and "ode" appear (Sound: Swell)
        // 4000ms: Subtitle appears (Sound: Chime)

        // Step 0: Reset to blank
        setAnimationStage(0);

        // Step 1: Type "/"
        const t1 = window.setTimeout(() => {
            setAnimationStage(1);
            playTypeSound();
        }, 1000);
        
        // Step 2: Type "<"
        const t2 = window.setTimeout(() => {
            setAnimationStage(2);
            playTypeSound();
        }, 1800);

        // Step 3: Show "read ... ode"
        const t3 = window.setTimeout(() => {
            setAnimationStage(3);
            playSwellSound();
        }, 2800);

        // Step 4: Show Subtitle & Finish
        const t4 = window.setTimeout(() => {
            setAnimationStage(4);
            playFinishSound();
            setIsAnimating(false);
        }, 4000);

        timeoutRefs.current.push(t1, t2, t3, t4);
    }, [isAnimating]);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearAllTimeouts();
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
            
            {/* Background Layer */}
            <BackgroundRenderer />

            {/* Fixed Center Layer */}
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <Logo stage={animationStage} />
            </div>

            {/* Controls Layer (Bottom) */}
            <div className="absolute bottom-10 w-full flex justify-center z-[60]">
                <button
                    onClick={startAnimation}
                    disabled={isAnimating}
                    className={`
                        group relative px-8 py-3 bg-transparent overflow-hidden
                        transition-all duration-300 ease-out
                        ${isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}
                    `}
                >
                    <div className="absolute inset-0 w-full h-full bg-zinc-900 border border-zinc-700 transform skew-x-12 transition-transform group-hover:bg-zinc-800" />
                    <div className="absolute inset-0 w-full h-full border border-green-500/30 transform skew-x-12 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                    
                    <span className="relative flex items-center gap-3 text-zinc-300 font-mono text-sm tracking-widest uppercase group-hover:text-white">
                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                         Run Sequence
                    </span>
                </button>
            </div>

            {/* Static Noise Overlay */}
            <div className="absolute inset-0 z-40 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} 
            />
        </div>
    );
};

export default App;
