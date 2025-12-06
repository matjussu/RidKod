'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge, SectionWrapper } from '@/components/ui';

interface Stat {
  value: string;
  label: string;
  color: 'orange' | 'green';
}

const STATS: Stat[] = [
  {
    value: '108',
    label: 'Exercices disponibles',
    color: 'orange',
  },
  {
    value: '11',
    label: 'Chapitres de progression',
    color: 'green',
  },
  {
    value: '500+',
    label: 'Lignes de code à analyser',
    color: 'orange',
  },
  {
    value: '100%',
    label: 'Gratuit pour toujours',
    color: 'green',
  },
];

interface StatCardProps {
  stat: Stat;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* Value */}
      <motion.div
        className="text-6xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-accent-green to-accent-orange bg-clip-text text-transparent"
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
      >
        {stat.value}
      </motion.div>

      {/* Label */}
      <p className="text-white/60 text-base md:text-lg max-w-[200px]">{stat.label}</p>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <SectionWrapper id="stats" className="bg-dark-secondary">
      {/* Header */}
      <div className="text-center space-y-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline">📊 En chiffres</Badge>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Une plateforme <br />
          <span className="gradient-text">complète et accessible</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Des chiffres qui parlent d&apos;eux-mêmes.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
        {STATS.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default StatsSection;
