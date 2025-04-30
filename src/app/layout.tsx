import type {Metadata} from 'next';
import './globals.css';
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'NostalDamus',
  description: 'Unlock the Nostalgia Goldmine',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<html lang="en">
      <body className={`antialiased font-sans`}>
      <Navbar/>
        {children}<Toaster/></body>
    </html>
  );
}
