'use client';

import React from 'react';
import {
  Button,
  Card,
  Badge,
  GradientText,
  SectionWrapper,
  AnimatedText,
} from '@/components/ui';
import { ArrowRight, Sparkles, Code2 } from 'lucide-react';

export default function TestPage() {
  return (
    <main className="min-h-screen bg-dark text-white">
      {/* Hero Section */}
      <SectionWrapper className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <Badge variant="gradient">✨ Composants UI</Badge>

          <AnimatedText
            text="ReadCod Landing"
            className="text-6xl md:text-8xl font-bold"
            animation="letters"
            staggerDelay={0.03}
          />

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Design system complet avec animations Framer Motion
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="primary" size="lg" icon={<ArrowRight size={20} />}>
              Commencer
            </Button>
            <Button variant="secondary" size="lg">
              En savoir plus
            </Button>
            <Button variant="ghost" size="lg">
              Documentation
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* Buttons Section */}
      <SectionWrapper id="buttons">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <GradientText as="span">Buttons</GradientText>
        </h2>

        <div className="space-y-8">
          {/* Variants */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">Variants</h3>
            <div className="flex gap-4 flex-wrap">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </Card>

          {/* Sizes */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">Sizes</h3>
            <div className="flex gap-4 items-center flex-wrap">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </Card>

          {/* With Icons */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">With Icons</h3>
            <div className="flex gap-4 flex-wrap">
              <Button variant="primary" icon={<ArrowRight size={20} />}>
                Get Started
              </Button>
              <Button variant="secondary" icon={<Sparkles size={20} />}>
                Features
              </Button>
              <Button variant="ghost" icon={<Code2 size={20} />}>
                Documentation
              </Button>
            </div>
          </Card>

          {/* With href */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">As Links</h3>
            <div className="flex gap-4 flex-wrap">
              <Button variant="primary" href="/">
                Home
              </Button>
              <Button variant="secondary" href="/test">
                Test Page
              </Button>
            </div>
          </Card>
        </div>
      </SectionWrapper>

      {/* Cards Section */}
      <SectionWrapper id="cards">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <GradientText as="span">Cards</GradientText>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover glow="orange">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <Code2 className="text-accent-orange" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Card avec Glow Orange</h3>
              <p className="text-gray-400">
                Effet hover avec glow orange subtil
              </p>
            </div>
          </Card>

          <Card hover glow="purple">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                <Sparkles className="text-accent-purple" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Card avec Glow Violet</h3>
              <p className="text-gray-400">
                Effet hover avec glow violet subtil
              </p>
            </div>
          </Card>

          <Card hover glow="none">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <ArrowRight className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Card sans Glow</h3>
              <p className="text-gray-400">
                Effet hover sans glow, juste élévation
              </p>
            </div>
          </Card>
        </div>
      </SectionWrapper>

      {/* Badges Section */}
      <SectionWrapper id="badges">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <GradientText as="span">Badges</GradientText>
        </h2>

        <Card className="text-center">
          <div className="flex gap-4 justify-center flex-wrap">
            <Badge variant="default">Default</Badge>
            <Badge variant="gradient">Gradient</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Card>
      </SectionWrapper>

      {/* AnimatedText Section */}
      <SectionWrapper id="animated-text">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <GradientText as="span">Animated Text</GradientText>
        </h2>

        <div className="space-y-12">
          <Card>
            <h3 className="text-xl font-semibold mb-4">Animation par mots</h3>
            <AnimatedText
              text="Apprends à lire et auditer le code à l'ère de l'IA"
              className="text-2xl"
              animation="words"
              staggerDelay={0.08}
            />
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4">Animation par lettres</h3>
            <AnimatedText
              text="ReadCod"
              className="text-4xl font-bold gradient-text"
              animation="letters"
              staggerDelay={0.05}
            />
          </Card>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <div className="py-12 text-center text-gray-400 border-t border-white/10">
        <p>ReadCod Design System - Tous les composants UI</p>
      </div>
    </main>
  );
}
