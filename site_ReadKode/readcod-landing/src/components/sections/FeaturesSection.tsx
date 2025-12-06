'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  BookOpen,
  Target,
  Smartphone,
  Trophy,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { Badge, Card, SectionWrapper } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'orange' | 'green';
}

const FEATURES: Feature[] = [
  {
    icon: Code2,
    title: '108 Exercices',
    description:
      'Des exercices progressifs du niveau débutant à expert, tous basés sur du vrai code Python.',
    color: 'orange',
  },
  {
    icon: BookOpen,
    title: '11 Chapitres',
    description:
      'Un parcours structuré qui couvre tous les aspects de la lecture de code.',
    color: 'green',
  },
  {
    icon: Target,
    title: 'Méthode Scientifique',
    description:
      'La méthode "Code Annotation Active" basée sur la recherche en pédagogie.',
    color: 'orange',
  },
  {
    icon: Smartphone,
    title: '100% Mobile',
    description:
      'Une PWA optimisée pour apprendre partout, même hors connexion.',
    color: 'green',
  },
  {
    icon: Trophy,
    title: 'Gamification',
    description:
      'XP, streaks, badges... Reste motivé avec un système de progression fun.',
    color: 'orange',
  },
  {
    icon: Zap,
    title: 'Gratuit & Open Source',
    description:
      'Accès complet sans payer. Le code source est disponible sur GitHub.',
    color: 'green',
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card hover glow={feature.color} className="h-full">
        {/* Icon Container */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            'bg-gradient-to-br',
            feature.color === 'orange'
              ? 'from-accent-orange/20 to-accent-orange/5'
              : 'from-accent-green/20 to-accent-green/5'
          )}
        >
          <Icon
            className={cn(
              'w-6 h-6',
              feature.color === 'orange' ? 'text-accent-orange' : 'text-accent-green'
            )}
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>

        {/* Description */}
        <p className="text-white/60 leading-relaxed">{feature.description}</p>
      </Card>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <SectionWrapper id="features" className="bg-dark">
      <div className="text-center space-y-6 mb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline">✨ Fonctionnalités</Badge>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tout ce qu'il faut pour <br />
          <span className="gradient-text">maîtriser la lecture</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-white/60 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Une méthode complète, progressive et ludique.
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default FeaturesSection;
