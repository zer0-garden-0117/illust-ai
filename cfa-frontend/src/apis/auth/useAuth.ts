'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  TwitterAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth } from '../../configs/auth/config2'

interface AuthResult {
  user: FirebaseUser;
  idToken: string;
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const twitterSignIn = async (): Promise<AuthResult> => {
    const provider = new TwitterAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      setIdToken(idToken);

      return {
        user: result.user,
        idToken
      };
    } catch (error) {
      console.error('Twitter sign in error:', error);
      throw error;
    }
  };

  const getFreshIdToken = async (): Promise<string | null> => {
    if (!user) {
      return null;
    }
    try {
      const freshToken = await user.getIdToken(true);
      setIdToken(freshToken);
      return freshToken;
    } catch (error) {
      console.error('Failed to get fresh ID token:', error);
      return null;
    }
  };

  const signOutUser = () => {
    setIdToken(null);
    return signOut(auth);
  };

  return {
    user,
    loading,
    idToken,
    twitterSignIn,
    getFreshIdToken,
    signOut: signOutUser
  };
}