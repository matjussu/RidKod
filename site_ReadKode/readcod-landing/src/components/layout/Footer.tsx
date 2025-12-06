'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const iconMap = {
    Twitter: Twitter,
    Github: Github,
    Linkedin: Linkedin,
  };

  return (
    <footer className="bg-dark-secondary border-t border-white/10">
      <div className="w-full mx-auto px-4 py-16 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold">
                Read
                <span className="bg-gradient-to-r from-accent-green to-accent-orange bg-clip-text text-transparent">
                  Kode
                </span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              {APP_TAGLINE}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = iconMap[social.icon as keyof typeof iconMap];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Produit Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
              Produit
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.produit.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white transition-colors text-sm inline-block"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm inline-block"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
              Ressources
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.ressources.map((link) => {
                const isDisabled = 'disabled' in link && link.disabled;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={
                        isDisabled
                          ? 'text-white/30 cursor-not-allowed text-sm inline-block'
                          : 'text-white/50 hover:text-white transition-colors text-sm inline-block'
                      }
                      onClick={(e) => isDisabled && e.preventDefault()}
                    >
                      {link.label}
                      {isDisabled && (
                        <span className="ml-2 text-xs text-white/20">(Bientôt)</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Légal Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
              Légal
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} {APP_NAME}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
