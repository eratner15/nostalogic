import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/brand";
import { Toaster } from "@/components/ui/toaster";

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', axes: ['opsz'], display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'NostalDamus | Revival Intelligence for Dormant IP',
  description: 'Pressure-test dormant intellectual property before development spend. Ask the research agent, explore the live model, or order a $199 Revival Opportunity Brief.',
  openGraph: {
    title: 'NostalDamus | Which dormant IP is worth reviving?',
    description: 'A transparent decision model, a research agent over 120 scored properties, and a human-reviewed $199 opportunity brief.',
    type: 'website',
    url: 'https://nostalogic.cafecito-ai.com',
    images: [{ url: 'https://nostalogic.cafecito-ai.com/og.png', width: 1680, height: 945, alt: 'NostalDamus revival opportunity brief' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NostalDamus | Which dormant IP is worth reviving?',
    description: 'A transparent decision model and human-reviewed $199 opportunity brief.',
    images: ['https://nostalogic.cafecito-ai.com/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
