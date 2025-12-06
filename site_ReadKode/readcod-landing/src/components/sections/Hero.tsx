'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { APP_URL } from '@/lib/constants';

const Hero = () => {
  const titleWords = ['Maîtrise', 'la', 'lecture', 'de', 'code'];

  const stats = [
    { value: '108', label: 'Exercices' },
    { value: '11', label: 'Chapitres' },
    { value: '100%', label: 'Gratuit' },
  ];

  const handleScrollToDemo = () => {
    const demoSection = document.getElementById('how-it-works');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background Effect - Grid + Glow */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Central Glow - GREEN */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Secondary Glow (Orange) */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto text-center space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Badge variant="outline" className="text-base px-4 py-2">
            🚀 100% Gratuit • Open Source
          </Badge>
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              className={i >= 2 ? 'gradient-text inline-block' : 'inline-block'}
              style={{ marginRight: i < titleWords.length - 1 ? '0.25em' : '0' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <div className="flex justify-center w-full">
          <motion.p
            className="text-lg sm:text-xl text-white/70 max-w-4xl leading-relaxed text-center px-6 sm:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            L&apos;IA écrit le code. Toi, tu dois le comprendre, le valider, le debugger. ReadKode
            t&apos;entraîne à devenir un expert en lecture de code.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            href={APP_URL}
            icon={<ArrowRight size={20} />}
            onClick={(e) => {
              e.preventDefault();
              window.open(APP_URL, '_blank');
            }}
          >
            Commencer gratuitement
          </Button>
          <Button variant="secondary" size="lg" onClick={handleScrollToDemo}>
            <Play size={20} />
            Voir une démo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap gap-8 sm:gap-12 justify-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        onClick={handleScrollToDemo}
      >
        <span className="text-xs text-white/50 uppercase tracking-wider">
          Scroll pour découvrir
        </span>
        <ChevronDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
};

export default Hero;
