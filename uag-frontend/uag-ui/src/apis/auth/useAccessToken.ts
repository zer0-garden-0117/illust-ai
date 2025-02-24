import { useState, useEffect, useCallback } from 'react';
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
  getCurrentUser,
  signIn,
  signUp,
  SignUpInput,
  confirmSignUp,
  ConfirmSignUpInput,
  resetPassword,
  ResetPasswordInput,
  confirmResetPassword,
  ConfirmResetPasswordInput
} from 'aws-amplify/auth';
import { clearUserTokenFromCookies } from '../../utils/authCookies';

export const useAccessToken = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null | undefined>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        const info = await fetchAuthSession();
        setEmail(info.tokens?.idToken?.payload.email?.toString());
        setAccessToken(info.tokens?.accessToken.toString() ?? null);
      } else {
        setIsAuthenticated(false);
        setEmail(null);
        setAccessToken(null);
      }
    } catch {
      setIsAuthenticated(false);
      setEmail(null);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginWithHosted = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Failed to redirect to sign in:', error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithRedirect({
        provider: 'Google'
      });
    } catch (error) {
      console.error('Failed to redirect to sign in:', error);
    }
  };

  const loginWithLine = async () => {
    try {
      await signInWithRedirect({
        provider: { custom: 'LINE' }
      });
    } catch (error) {
      console.error('Failed to redirect to sign in:', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const signInInput = {
        username,
        password,
      };

      const user = await signIn(signInInput);
      console.log(user);

      if (user.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        console.log("CONFIRM_SIGN_UP")
        return { success: false, message: "CONFIRM_SIGN_UP" };
      } else if (user) {
        checkAuth();
        return { success: true, user };
      }
    } catch (error) {
      console.log("Failed to login")
      console.error('Failed to login:', error);
      return { success: false, message: error || 'Failed to login' };
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const signUpInput: SignUpInput = {
        username,
        password,
      };
      await signUp(signUpInput);
      // await login(username, password);
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };

  const confirmSignup = async (username: string, confirmCode: string) => {
    try {
      const confirmSignUpInput: ConfirmSignUpInput = {
        username,
        confirmationCode: confirmCode,
      };
      await confirmSignUp(confirmSignUpInput);
      return { success: true };
    } catch (error) {
      console.error('Failed to confirm sign up:', error);
      return { success: false, message: (error as Error)?.message || 'Failed to confirm sign up' };
    }
  };

  const resetPass = async (username: string) => {
    try {
      const resetPasswordInput: ResetPasswordInput = {
        username
      };
      await resetPassword(resetPasswordInput);
      return { success: true };
    } catch (error) {
      console.error('Failed to reset password:', error);
      return {
        success: false,
        message: (error instanceof Error && error.message) ? error.message : 'Failed to reset password'
      };
    }
  };

  const confirmResetPass = async (email: string, confirmCode: string, password: string) => {
    try {
      const confirmResetPasswordInput: ConfirmResetPasswordInput = {
        username: email,
        newPassword: password,
        confirmationCode: confirmCode
      };
      await confirmResetPassword(confirmResetPasswordInput);
      return { success: true };
    } catch (error) {
      console.error('Failed to confirm reset password:', error);
      return {
        success: false,
        message: (error instanceof Error && error.message) ? error.message : 'Failed to confirm reset password'
      };
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
    loginWithHosted,
    loginWithGoogle,
    loginWithLine,
    register,
    confirmSignup,
    logout,
    resetPass,
    confirmResetPass
  };
};