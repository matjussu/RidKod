import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  className?: string;
}

const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(
  ({ className, children, as: Component = 'span', ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          'bg-gradient-to-r from-accent-green to-accent-orange',
          'bg-clip-text text-transparent',
          'inline-block',
          className
        )}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GradientText.displayName = 'GradientText';

export default GradientText;
