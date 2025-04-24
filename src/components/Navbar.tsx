'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import {useEffect, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '@/lib/firebase';

// Initialize Firebase (if not already initialized)
try {
  initializeApp(firebaseConfig);
} catch (e: any) {
  // Ignore error if already initialized
}

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  return (
    <nav className="bg-secondary text-white p-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold">NostalDamus</Link>

      <div className="flex items-center space-x-4">
        <Link href="/property-library">Property Library</Link>
        <Link href="/analysis-tools">Analysis Tools</Link>
        <Link href="/remix-lab">Remix Lab</Link>
        <Link href="/market-intelligence">Market Intelligence</Link>

        {user ? (
          <>
            <Link href="/account">Account</Link>
          </>
        ) : (
          <Button asChild><Link href="/">Sign In</Link></Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
