import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'outline';
  className?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium',
          'transition-all duration-200',

          // Variants
          {
            'bg-white/10 text-white/80 hover:bg-white/15':
              variant === 'default',
            'bg-gradient-to-r from-accent-green to-accent-orange text-white shadow-lg':
              variant === 'gradient',
            'border border-white/20 text-white/60 hover:border-white/40 hover:text-white/80':
              variant === 'outline',
          },

          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
