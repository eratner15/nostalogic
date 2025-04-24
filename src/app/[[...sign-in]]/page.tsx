'use client';

import {useState} from 'react';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '@/lib/firebase';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

// Initialize Firebase (if not already initialized)
try {
  initializeApp(firebaseConfig);
} catch (e: any) {
  // Ignore error if already initialized
}

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Track if it's sign-up or sign-in
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      if (isSignUp) {
        // Sign-up logic
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Sign-up successful! You are now signed in.');
      } else {
        // Sign-in logic
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sign-in successful!');
      }
      // Redirect to account page after sign-up or sign-in
      window.location.href = '/account';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="bg-card p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-muted-foreground text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-muted-foreground text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <Button className="w-full" type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
        </form>
        <p className="text-center mt-4 text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <Button variant="link" onClick={() => setIsSignUp(false)}>
                Sign In
              </Button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <Button variant="link" onClick={() => setIsSignUp(true)}>
                Sign Up
              </Button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default SignIn;
