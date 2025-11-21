
import React, { FC } from 'react';
import { FinalLayout } from './layouts/NewsLayouts';

export const BackgroundRenderer: FC = () => {
    return (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            {/* The Permanent Dark Layout */}
            <FinalLayout />
            
            {/* Vignette Overlay for focus */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 pointer-events-none" />
        </div>
    );
};
