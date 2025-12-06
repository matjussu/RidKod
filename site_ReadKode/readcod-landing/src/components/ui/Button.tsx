'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      href,
      icon,
      onClick,
      disabled,
      type = 'button',
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-green focus:ring-offset-dark',
      'disabled:opacity-50 disabled:cursor-not-allowed',

      // Variants
      {
        'bg-gradient-to-r from-accent-green to-accent-orange text-white shadow-lg hover:shadow-accent-green/50':
          variant === 'primary',
        'border-2 border-transparent bg-clip-padding text-white relative overflow-hidden':
          variant === 'secondary',
        'text-gray-400 hover:text-white hover:bg-white/5':
          variant === 'ghost',
      },

      // Sizes
      {
        'px-4 py-2 text-sm': size === 'sm',
        'px-6 py-3 text-base': size === 'md',
        'px-8 py-4 text-lg': size === 'lg',
      },

      className
    );

    const content = (
      <>
        {children}
        {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
      </>
    );

    const animationProps = {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
    };

    if (href) {
      // If onClick is provided with href, render as a clickable div instead of Link
      if (onClick) {
        return (
          <motion.div
            className={cn(baseClasses, 'group cursor-pointer')}
            onClick={onClick}
            {...animationProps}
          >
            {variant === 'secondary' && (
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-green to-accent-orange opacity-100" />
            )}
            {variant === 'secondary' && (
              <span className="absolute inset-[2px] rounded-[10px] bg-dark" />
            )}
            <span className="relative z-10 flex items-center gap-2">{content}</span>
          </motion.div>
        );
      }

      return (
        <Link href={href} className="group">
          <motion.div className={baseClasses} {...animationProps}>
            {variant === 'secondary' && (
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-green to-accent-orange opacity-100" />
            )}
            {variant === 'secondary' && (
              <span className="absolute inset-[2px] rounded-[10px] bg-dark" />
            )}
            <span className="relative z-10 flex items-center gap-2">{content}</span>
          </motion.div>
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, 'group')}
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...animationProps}
      >
        {variant === 'secondary' && (
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-green to-accent-orange opacity-100" />
        )}
        {variant === 'secondary' && (
          <span className="absolute inset-[2px] rounded-[10px] bg-dark" />
        )}
        <span className="relative z-10 flex items-center gap-2">{content}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
