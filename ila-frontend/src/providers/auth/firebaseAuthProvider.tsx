'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onIdTokenChanged,
} from 'firebase/auth';
import { auth } from '../../configs/auth/config2';
import { useFirebaseAuth } from '../../apis/auth/useFirebaseAuth';
import { MyUserGetResult, useMyUserGet } from '@/apis/openapi/myusers/useMyUserGet';

interface AuthResult {
  user: MyUserGetResult;
  idToken: string;
  additionalUserInfo: string | null;
}

interface FirebaseAuthContextProps {
  user: MyUserGetResult | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;

  /** 互換のため残す（UI表示用など）。APIでは使わないこと */
  idToken: string | null;

  twitterSignIn: () => Promise<AuthResult>;
  getFreshIdToken: () => Promise<string | null>;

  /** ★追加: 毎回最新のIDトークンを取得する */
  getIdTokenLatest: () => Promise<string | null>;

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

  // 互換用に保持はするが、実利用は getIdTokenLatest() を使う
  const [idToken, setIdToken] = useState<string | null>(null);

  const {
    twitterSignIn: twitterSignInFromHook,
    getFreshIdToken: getFreshIdTokenFromHook,
    signOut: signOutFromHook,
  } = useFirebaseAuth();

  const { trigger: fetchMyUser } = useMyUserGet();

  const getIdTokenLatest = async (): Promise<string | null> => {
    console.log('getIdTokenLatest called');
    console.log("aaaaa")
    const cur = auth.currentUser;
    if (!cur) return null;
    try {
      return await cur.getIdToken(false);
    } catch {
      try {
        return await cur.getIdToken(true);
      } catch {
        return null;
      }
    }
  };

  const fetchUserData = async () => {
    const token = await getIdTokenLatest();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const userData = await fetchMyUser({
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userData);
      setIdToken(token);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (fbuser) => {
      console.log('onIdTokenChanged fired. User:', fbuser);
      setFirebaseUser(fbuser);

      if (fbuser) {
        await fetchUserData();
      } else {
        setIdToken(null);
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const twitterSignIn = async (): Promise<AuthResult> => {
    try {
      const result = await twitterSignInFromHook();
      // サインイン直後の状態反映
      setFirebaseUser(auth.currentUser);
      setUser(result.user);
      setIdToken(result.idToken); // 互換用表示値
      // 念のためサーバーデータを最新化（内部で最新トークン取得）
      await fetchUserData();
      return result;
    } catch (error) {
      console.error('Twitter sign in error:', error);
      throw error;
    }
  };

  // 強制的にフレッシュなIDトークンを取得（401時のリトライ等で使用）
  const getFreshIdToken = async (): Promise<string | null> => {
    const token = await getFreshIdTokenFromHook(auth.currentUser);
    if (token) {
      setIdToken(token); // 互換用表示値
      await fetchUserData(); // 内部で最新トークン取得して再取得
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
        getIdTokenLatest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};