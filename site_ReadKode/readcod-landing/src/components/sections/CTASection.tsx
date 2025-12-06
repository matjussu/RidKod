'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { APP_URL } from '@/lib/constants';

const CTASection = () => {
  const handleScrollToFeatures = () => {
    const section = document.getElementById('features');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    '100% gratuit',
    'Pas de compte requis',
    'Disponible hors ligne',
  ];

  return (
    <section className="py-24 px-4 bg-dark">
      <div className="w-full mx-auto max-w-7xl">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background gradient layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green/20 via-accent-orange/20 to-accent-green/20" />

            {/* Animated glow effects */}
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-accent-orange/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-12 md:p-16 text-center space-y-8">
              {/* Title */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Prêt à devenir un <br />
                  <span className="gradient-text">expert en lecture de code ?</span>
                </h2>

                <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                  Rejoins des centaines de développeurs qui améliorent leurs compétences chaque
                  jour. C&apos;est gratuit, c&apos;est maintenant.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  href={APP_URL}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(APP_URL, '_blank');
                  }}
                  icon={<ArrowRight size={20} />}
                  className="min-w-[240px]"
                >
                  Commencer maintenant
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleScrollToFeatures}
                  className="min-w-[240px]"
                >
                  En savoir plus
                </Button>
              </motion.div>

              {/* Features list */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 pt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-2 text-white/50 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Check size={16} className="text-accent-orange" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Border overlay */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
