import { useState, useEffect } from 'react';
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchUserAttributes
} from 'aws-amplify/auth';
import { AuthSession } from '@aws-amplify/core';

// ユーザーの認証状態の管理や副作用の処理のカプセル化
// useAuthenticatorでは実現できなかったuserInfoの取得等も行う
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null | undefined>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          const info = await fetchAuthSession();
          setEmail(info.tokens?.idToken?.payload.email?.toString())
        } else {
          setIsAuthenticated(false);
          setEmail(null)
          // 未ログイン時はログイン画面へリダイレクトを検討
          // initiateSignIn();
        }
      } catch {
        setIsAuthenticated(false);
        setEmail(null)
        // 未ログイン時はログイン画面へリダイレクトを検討
        // initiateSignIn();
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Failed to redirect to sign in:', error);
    }
  };

  const logout = () => {
    signOut();
    setIsAuthenticated(false);
    setEmail(null)
  };

  return {
    isAuthenticated,
    email,
    login,
    logout
  };
};