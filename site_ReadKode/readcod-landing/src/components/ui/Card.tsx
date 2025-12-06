'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  glow?: 'orange' | 'green' | 'none';
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = false, glow = 'none' }, ref) => {
    const glowColors = {
      orange: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
      green: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]',
      none: '',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-2xl p-8 bg-dark-secondary border border-white/10 transition-all duration-300',

          // Hover effect
          hover && 'cursor-pointer hover:border-white/20',
          hover && glowColors[glow],

          className
        )}
        whileHover={
          hover
            ? {
                y: -4,
                transition: { duration: 0.3, ease: [0, 0, 0.2, 1] as const },
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
