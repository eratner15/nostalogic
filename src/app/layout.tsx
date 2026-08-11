import type {Metadata} from 'next';
import './globals.css';
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'NostalDamus | Predictive Nostalgia Analytics',
  description: 'Predict which dormant 1994-1996 IP is ready for revival and how to modernize it.',
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
