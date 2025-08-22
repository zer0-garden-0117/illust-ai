'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  TwitterAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../../configs/auth/config2'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const twitterSignIn = async () => {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Twitter sign in error:', error);
      throw error;
    }
  };

  const signOutUser = () => signOut(auth);

  return {
    user,
    loading,
    twitterSignIn,
    signOut: signOutUser
  };
}