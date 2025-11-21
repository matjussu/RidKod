
import React, { FC } from 'react';

interface LogoProps {
    stage: number; // 0: Blank, 1: Slash, 2: Slash+Bracket, 3: Full Text, 4: Subtitle
}

export const Logo: FC<LogoProps> = ({ stage }) => {
    return (
        <div className="z-50 flex flex-col items-center justify-center select-none pointer-events-none text-white">
            <h1 className="flex items-center text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter relative">
                {/* "read" part - Appears at stage 3 */}
                <span className={`font-serif tracking-tight transition-opacity duration-700 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    read
                </span>
                
                {/* The Slash and Bracket Design */}
                <div className="flex items-center mx-1 md:mx-2 relative">
                    {/* Green Slash - Appears at stage 1 */}
                    <div className="relative">
                        <span 
                            style={{ color: '#088201' }} 
                            className={`block transform -skew-x-12 font-normal text-6xl md:text-8xl lg:text-[10rem] leading-none -mt-2 md:-mt-4 transition-opacity duration-100 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}
                        >
                            /
                        </span>
                        {/* Retro Blinking Cursor for Stage 1 */}
                        {stage === 1 && (
                            <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-green-500 text-4xl md:text-6xl animate-pulse font-mono">_</span>
                        )}
                    </div>

                    {/* Orange Bracket - Appears at stage 2 */}
                    <div className="relative">
                        <span 
                            className={`block text-orange-600 font-bold text-6xl md:text-8xl lg:text-[10rem] leading-none -ml-2 md:-ml-4 -mt-2 md:-mt-4 transition-opacity duration-100 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}
                        >
                            &lt;
                        </span>
                        {/* Retro Blinking Cursor for Stage 2 */}
                        {stage === 2 && (
                            <span className="absolute top-1/2 -right-8 -translate-y-1/2 text-orange-600 text-4xl md:text-6xl animate-pulse font-mono">_</span>
                        )}
                    </div>
                </div>

                {/* "ode" part - Appears at stage 3 */}
                <span className={`font-serif tracking-tight -ml-2 md:-ml-3 transition-opacity duration-700 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    ode
                </span>
            </h1>

            {/* Subtitle - Fades in at stage 4 */}
            <div 
                className={`mt-4 md:mt-8 transition-all duration-1000 overflow-hidden ${
                    stage >= 4 ? 'opacity-100 max-h-20 translate-y-0' : 'opacity-0 max-h-0 translate-y-4'
                }`}
            >
                <p className="text-zinc-400 font-mono text-sm md:text-xl tracking-widest">
                    &lt;Trust the process&gt;
                </p>
            </div>
        </div>
    );
};
