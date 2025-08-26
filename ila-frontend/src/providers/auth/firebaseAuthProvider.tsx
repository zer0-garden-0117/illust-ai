'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../../configs/auth/config2';
import { useFirebaseAuth } from '../../apis/auth/useFirebaseAuth';

interface FirebaseAuthContextProps {
  user: FirebaseUser | null;
  loading: boolean;
  idToken: string | null;
  twitterSignIn: () => Promise<{
    user: FirebaseUser;
    idToken: string;
    additionalUserInfo: string | null;
  }>;
  getFreshIdToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<FirebaseAuthContextProps | undefined>(undefined);

export const useFirebaseAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useFirebaseAuthContext must be used within an FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  
  const { twitterSignIn, getFreshIdToken: getFreshIdTokenFromHook, signOut: signOutFromHook } = useFirebaseAuth();

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

  const getFreshIdToken = async (): Promise<string | null> => {
    const token = await getFreshIdTokenFromHook(user);
    if (token) {
      setIdToken(token);
    }
    return token;
  };

  const signOut = async (): Promise<void> => {
    await signOutFromHook();
    setUser(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        idToken,
        twitterSignIn,
        getFreshIdToken,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};