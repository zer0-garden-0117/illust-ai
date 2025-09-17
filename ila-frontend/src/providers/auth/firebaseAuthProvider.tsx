'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  User as FirebaseUser,
  onIdTokenChanged
} from 'firebase/auth';
import { auth } from '../../configs/auth/config2';
import { useFirebaseAuth } from '../../apis/auth/useFirebaseAuth';
import { MyUserGetResult, useMyUserGet } from '@/apis/openapi/users/useMyUserGet';

interface AuthResult {
  user: MyUserGetResult;
  idToken: string;
  additionalUserInfo: string | null;
}

interface FirebaseAuthContextProps {
  user: MyUserGetResult | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  idToken: string | null;
  twitterSignIn: () => Promise<AuthResult>;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<MyUserGetResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const { twitterSignIn: twitterSignInFromHook, getFreshIdToken: getFreshIdTokenFromHook, signOut: signOutFromHook } = useFirebaseAuth();
  const { trigger: fetchUser } = useMyUserGet();

  // ユーザーデータを取得する関数
  const fetchUserData = async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }

    try {
      const token = await firebaseUser.getIdToken();
      setIdToken(token);
      const userData = await fetchUser({
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(firebaseUser)
      setFirebaseUser(firebaseUser);
      await fetchUserData(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (fbuser) => {
      if (fbuser) {
        const freshToken = await fbuser.getIdToken();
        setIdToken(freshToken);
        await fetchUserData(fbuser);
      } else {
        setIdToken(null);
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const twitterSignIn = async (): Promise<AuthResult> => {
    try {
      const result = await twitterSignInFromHook();
      setFirebaseUser(auth.currentUser);
      setUser(result.user);
      setIdToken(result.idToken);
      return result;
    } catch (error) {
      console.error('Twitter sign in error:', error);
      throw error;
    }
  };

  const getFreshIdToken = async (): Promise<string | null> => {
    const token = await getFreshIdTokenFromHook(firebaseUser);
    if (token) {
      setIdToken(token);
      // トークン更新後にユーザーデータも再取得
      await fetchUserData(firebaseUser);
    }
    return token;
  };

  const signOut = async (): Promise<void> => {
    await signOutFromHook();
    setFirebaseUser(null);
    setUser(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
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