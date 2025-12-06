'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  animation?: 'words' | 'letters' | 'lines';
  delay?: number;
  staggerDelay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  animation = 'words',
  delay = 0,
  staggerDelay = 0.05,
}) => {
  // Split text based on animation type
  const splitText = () => {
    switch (animation) {
      case 'letters':
        return text.split('');
      case 'lines':
        return text.split('\n');
      case 'words':
      default:
        return text.split(' ');
    }
  };

  const elements = splitText();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0, 0, 0.2, 1] as const, // easeOut cubic bezier
      },
    },
  };

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{
            marginRight: animation === 'words' ? '0.25em' : undefined,
            whiteSpace: animation === 'lines' ? 'pre-wrap' : undefined,
          }}
        >
          {element}
          {animation === 'lines' && index < elements.length - 1 && <br />}
        </motion.span>
      ))}
    </motion.div>
  );
};

AnimatedText.displayName = 'AnimatedText';

export default AnimatedText;
