import { useState, useEffect } from 'react';
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
  getCurrentUser,
} from 'aws-amplify/auth';
import { clearUserTokenFromCookies } from '../../utils/authCookies';

export const useAccessToken = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null | undefined>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          const info = await fetchAuthSession();
          setEmail(info.tokens?.idToken?.payload.email?.toString())
          setAccessToken(info.tokens?.accessToken.toString() ?? null);
        } else {
          setIsAuthenticated(false);
          setEmail(null)
          setAccessToken(null);
          // 未ログイン時はログイン画面へリダイレクトを検討
          // initiateSignIn();
        }
      } catch {
        setIsAuthenticated(false);
        setEmail(null)
        setAccessToken(null);
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
    setEmail(null);
    setAccessToken(null);
    clearUserTokenFromCookies();
  };

  return {
    isAuthenticated,
    email,
    accessToken,
    login,
    logout
  };
};