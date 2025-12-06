'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge, Card, SectionWrapper } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

const WhySection = () => {
  const handleScrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const codeExample = `def process_data(items):
    result = []
    for item in items:
        if item.get('status') == 'active':
            result.append(item['value'])
    return sum(result)`;

  return (
    <SectionWrapper id="why" className="bg-dark">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text Content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline">💡 Le problème</Badge>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Les devs passent 80% de leur temps à{' '}
            <span className="gradient-text">lire du code</span>
          </h2>

          <div className="space-y-4 text-lg text-white/70">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Avec l'explosion de l'IA générative, les développeurs écrivent de moins en moins
              de code eux-mêmes. ChatGPT, Copilot, Claude... ils génèrent du code à ta place.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Mais qui valide ce code ? Qui le debug ? Qui s'assure qu'il est sécurisé ?
            </motion.p>

            <motion.p
              className="text-white font-semibold text-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Toi.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Et pourtant, personne ne t'a jamais appris à LIRE du code efficacement. Jusqu'à
              maintenant.
            </motion.p>
          </div>

          <motion.button
            className="inline-flex items-center gap-2 text-accent-orange hover:text-accent-orange/80 transition-colors font-medium group"
            onClick={handleScrollToHowItWorks}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            Découvrir la méthode
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </motion.button>
        </motion.div>

        {/* Right Column - Code Block Visualization */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-dark-secondary border-white/10 p-0 overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-dark-tertiary">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white/50 text-sm ml-2 font-mono">analyse.py</span>
            </div>

            {/* Code Content */}
            <pre className="p-6 text-sm font-mono overflow-x-auto">
              <code className="text-white/80">{codeExample}</code>
            </pre>
          </Card>

          {/* Floating Annotations */}
          <motion.div
            className="absolute top-8 -right-4 sm:-right-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            <div className="bg-accent-orange/10 border border-accent-orange/30 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm text-accent-orange font-medium">
                Que fait cette fonction ?
              </p>
            </div>
            <div className="w-0.5 h-8 bg-accent-orange/30 mx-auto mt-1"></div>
          </motion.div>

          <motion.div
            className="absolute bottom-24 -left-4 sm:-left-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <div className="bg-accent-green/10 border border-accent-green/30 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm text-accent-green font-medium">
                Bug potentiel ici ?
              </p>
            </div>
            <div className="w-0.5 h-8 bg-accent-green/30 mx-auto mt-1"></div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default WhySection;
