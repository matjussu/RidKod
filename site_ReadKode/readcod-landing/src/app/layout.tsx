import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar, Footer } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReadKode - Maîtrise la lecture de code",
  description: "Apprends à lire et auditer le code à l'ère de l'IA. 108 exercices, méthode scientifique, 100% gratuit.",
  keywords: ["code", "lecture", "programmation", "apprentissage", "IA", "audit", "développement"],
  authors: [{ name: "ReadKode Team" }],
  creator: "ReadKode",
  publisher: "ReadKode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://readcod.com'),
  openGraph: {
    title: "ReadKode - Maîtrise la lecture de code",
    description: "Apprends à lire et auditer le code à l'ère de l'IA. 108 exercices, méthode scientifique, 100% gratuit.",
    url: "https://readcod.com",
    siteName: "ReadKode",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReadKode - Apprends à lire du code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadKode - Maîtrise la lecture de code",
    description: "Apprends à lire et auditer le code à l'ère de l'IA. 108 exercices, méthode scientifique, 100% gratuit.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
