import {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '@/lib/firebase';
import {Button} from '@/components/ui/button';

// Initialize Firebase (if not already initialized)
try {
  initializeApp(firebaseConfig);
} catch (e: any) {
  // Ignore error if already initialized
}

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      // Redirect to home page after sign-out
      window.location.href = '/';
    } catch (error: any) {
      console.error('Sign out error:', error);
      alert(`Sign out failed: ${error.message}`);
    }
  };

  if (loading) {
    return <p>Loading account information...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Account Information</h2>

      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>User ID: {user.uid}</p>
          <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
        </div>
      ) : (
        <p>No user logged in.  <a href="/">Go Home and Sign In.</a></p>
      )}
    </div>
  );
};

export default Account;
