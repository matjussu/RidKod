import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold gradient-text">404</h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-accent-green to-accent-orange rounded-full" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Page introuvable
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* CTA */}
        <Button href="/" variant="primary" size="lg">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
