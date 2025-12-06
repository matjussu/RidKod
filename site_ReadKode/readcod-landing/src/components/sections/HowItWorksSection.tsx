'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, PenTool, CheckCircle, LucideIcon } from 'lucide-react';
import { Badge, SectionWrapper } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Step {
  number: string;
  title: string;
  description: string;
  visual: 'code' | 'annotate' | 'check';
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Lis le code',
    description:
      'On te présente un extrait de code Python. Prends le temps de le lire attentivement, ligne par ligne.',
    visual: 'code',
  },
  {
    number: '02',
    title: 'Annote & Analyse',
    description:
      'Identifie les éléments clés : variables, fonctions, flux de contrôle. Annote mentalement ce que fait chaque partie.',
    visual: 'annotate',
  },
  {
    number: '03',
    title: 'Vérifie ta compréhension',
    description:
      'Réponds aux questions sur le code. Découvre les explications détaillées et progresse vers le niveau suivant.',
    visual: 'check',
  },
];

const getStepIcon = (visual: Step['visual']): LucideIcon => {
  const iconMap: Record<Step['visual'], LucideIcon> = {
    code: FileCode,
    annotate: PenTool,
    check: CheckCircle,
  };
  return iconMap[visual];
};

interface StepCardProps {
  step: Step;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const Icon = getStepIcon(step.visual);

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
    >
      {/* Number with Overlaid Icon */}
      <div className="relative mb-6 w-32 h-32 flex items-center justify-center">
        {/* Large Number Background */}
        <span className="absolute text-8xl font-bold text-white/5 select-none">
          {step.number}
        </span>

        {/* Icon Container */}
        <div
          className={cn(
            'relative w-16 h-16 rounded-2xl flex items-center justify-center z-10',
            'bg-gradient-to-br from-accent-green to-accent-orange',
            'shadow-lg shadow-accent-green/30'
          )}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>

      {/* Description */}
      <p className="text-white/60 max-w-xs leading-relaxed">{step.description}</p>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  return (
    <SectionWrapper id="how-it-works" className="bg-dark">
      {/* Header */}
      <div className="text-center space-y-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline">🎯 Méthode</Badge>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Apprends en <br />
          <span className="gradient-text">3 étapes simples</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          La méthode Code Annotation Active en action.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-0">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Card */}
            <div className="flex-1 flex justify-center">
              <StepCard step={step} index={index} />
            </div>

            {/* Connector Line (Desktop Only) */}
            {index < STEPS.length - 1 && (
              <motion.div
                className="hidden lg:flex items-center flex-shrink-0 w-24 mt-16"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                style={{ transformOrigin: 'left' }}
              >
                <div className="w-full h-px bg-gradient-to-r from-accent-green/30 to-accent-orange/30" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Phone Mockup */}
      <motion.div
        className="mt-24 flex justify-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-[280px] h-[580px] bg-dark-secondary rounded-[3rem] border-4 border-white/10 p-3 shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-dark-secondary rounded-b-2xl z-10" />

            {/* Screen */}
            <div className="relative w-full h-full bg-dark rounded-[2.5rem] overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-secondary to-dark">
                {/* Code Snippet Preview */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
                  {/* Code Lines */}
                  <div className="w-full space-y-2 font-mono text-xs">
                    <div className="flex gap-2">
                      <span className="text-white/30">1</span>
                      <span className="text-green-400">def</span>
                      <span className="text-orange-400">process</span>
                      <span className="text-white/70">(data):</span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span className="text-white/30">2</span>
                      <span className="text-green-400">return</span>
                      <span className="text-white/70">data * 2</span>
                    </div>
                  </div>

                  {/* Question Preview */}
                  <div className="w-full bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/80 text-xs">Que fait cette fonction ?</p>
                  </div>

                  {/* CTA Badge */}
                  <div className="mt-4">
                    <Badge variant="gradient" className="text-xs">
                      108 Exercices disponibles
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-10 bg-gradient-radial from-accent-green/20 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />
        </div>
      </motion.div>
    </SectionWrapper>
  );
};

export default HowItWorksSection;
