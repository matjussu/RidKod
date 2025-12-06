/**
 * Application Constants
 * Contains all static text, configuration, and constants
 */

// ===== App Info =====
export const APP_NAME = "ReadKode";
export const APP_TAGLINE = "Trust the process";
export const APP_DESCRIPTION = "Apprends à lire et auditer le code à l'ère de l'IA";
export const APP_URL = "https://ridkod.vercel.app/";
export const APP_EMAIL = "contact@readkode.com";

// ===== Navigation Links =====
export const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Comment ça marche', href: '#how-it-works' },
  { label: 'Pourquoi ReadKode', href: '#why' },
] as const;

// ===== Footer Links =====
export const FOOTER_LINKS = {
  produit: [
    { label: 'Fonctionnalités', href: '#features', external: false },
    { label: 'Comment ça marche', href: '#how-it-works', external: false },
    { label: "Ouvrir l'app", href: 'https://ridkod.vercel.app/', external: true },
  ],
  ressources: [
    { label: 'Blog', href: '#', disabled: true },
    { label: 'Documentation', href: '#', disabled: true },
    { label: 'Contact', href: 'mailto:contact@readkode.com', external: false },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales', external: false },
    { label: 'Confidentialité', href: '/confidentialite', external: false },
  ],
} as const;

// ===== Social Links =====
export const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/readkode', icon: 'Twitter' },
  { name: 'GitHub', href: 'https://github.com/readkode', icon: 'Github' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/readkode', icon: 'Linkedin' },
] as const;

// ===== Features =====
export const FEATURES = [
  {
    title: "108 Exercices Pratiques",
    description: "Python, JavaScript, Java, C++ - Exercices progressifs du débutant à l'expert",
    icon: "code",
  },
  {
    title: "Méthode Scientifique",
    description: "Basée sur les dernières recherches en sciences cognitives",
    icon: "brain",
  },
  {
    title: "100% Gratuit",
    description: "Accès complet et permanent sans frais cachés",
    icon: "heart",
  },
] as const;

// ===== Stats =====
export const STATS = [
  { value: "108", label: "Exercices", suffix: "" },
  { value: "4", label: "Langages", suffix: "" },
  { value: "100", label: "Gratuit", suffix: "%" },
  { value: "10K+", label: "Utilisateurs", suffix: "" },
] as const;

// ===== Pricing Plans =====
export const PRICING_PLANS = [
  {
    name: "Gratuit",
    price: "0€",
    description: "Accès complet à tous les exercices",
    features: [
      "108 exercices Python",
      "Progression sauvegardée",
      "Statistiques détaillées",
      "Communauté Discord",
    ],
    cta: "Commencer gratuitement",
    highlighted: true,
  },
] as const;

// ===== FAQ =====
export const FAQ_ITEMS = [
  {
    question: "Pourquoi apprendre à lire du code ?",
    answer: "Les développeurs passent 70% de leur temps à lire du code. Avec l'IA qui génère 50% du code en 2025, savoir lire et auditer devient crucial.",
  },
  {
    question: "C'est vraiment 100% gratuit ?",
    answer: "Oui ! ReadKode est entièrement gratuit, sans frais cachés. Notre mission est de démocratiser l'apprentissage de la lecture de code.",
  },
  {
    question: "Quels langages sont disponibles ?",
    answer: "Actuellement Python (108 exercices). JavaScript, Java et C++ arrivent bientôt.",
  },
  {
    question: "Ai-je besoin de savoir coder ?",
    answer: "Oui, des bases en programmation sont recommandées. ReadKode vous apprend à LIRE du code, pas à l'écrire.",
  },
] as const;

// ===== Testimonials =====
export const TESTIMONIALS = [
  {
    name: "Marie L.",
    role: "Développeuse Junior",
    avatar: "👩‍💻",
    quote: "ReadKode m'a aidée à mieux comprendre le code de mes collègues. Je fais maintenant des code reviews beaucoup plus pertinentes !",
    rating: 5,
  },
  {
    name: "Thomas D.",
    role: "Étudiant en Informatique",
    avatar: "👨‍🎓",
    quote: "Enfin une app qui m'apprend à lire du code ! Les exercices sont progressifs et très bien conçus.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "Tech Lead",
    avatar: "👩‍💼",
    quote: "Je recommande ReadKode à tous mes juniors. C'est devenu un outil indispensable pour monter en compétences.",
    rating: 5,
  },
] as const;

// ===== Colors ===== (NEW: Green/Orange theme)
export const COLORS = {
  dark: "#0A0A0A",
  darkSecondary: "#141414",
  darkTertiary: "#1F1F1F",
  accentGreen: "#22C55E",
  accentOrange: "#F97316",
  accentBlue: "#3B82F6",
} as const;
