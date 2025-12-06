'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('py-24 px-6 sm:px-8 lg:px-12 xl:px-16', className)}
      id={id}
    >
      <div className="w-full mx-auto max-w-6xl">{children}</div>
    </motion.section>
  );
};

SectionWrapper.displayName = 'SectionWrapper';

export default SectionWrapper;
