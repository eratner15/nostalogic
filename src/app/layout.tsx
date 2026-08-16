import type {Metadata} from 'next';
import './globals.css';
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'NostalDamus | Revival Intelligence for Dormant IP',
  description: 'Pressure-test dormant intellectual property before development spend. Explore the live model or order a 99 Revival Opportunity Brief.',
  openGraph: {
    title: 'NostalDamus | Which dormant IP is worth reviving?',
    description: 'A transparent decision model and human-reviewed 99 opportunity brief for producers, rights holders, and investors.',
    type: 'website',
    url: 'https://nostalogic.cafecito-ai.com',
    images: [{ url: 'https://nostalogic.cafecito-ai.com/og.png', width: 1680, height: 945, alt: 'NostalDamus revival opportunity brief' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NostalDamus | Which dormant IP is worth reviving?',
    description: 'A transparent decision model and human-reviewed 99 opportunity brief.',
    images: ['https://nostalogic.cafecito-ai.com/og.png'],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
