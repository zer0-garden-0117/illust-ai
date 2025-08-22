'use client';
import React, { createContext, useContext } from 'react';
import { useAccessToken } from '../../apis/auth/useAccessToken';

interface AccessTokenContextProps {
  isAuthenticated: boolean;
  email: string | null | undefined;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<any>;
  loginWithHosted: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithLine: () => Promise<void>;
  register: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  confirmSignup: (username: string, confirmCode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetPass: (username: string) => Promise<{ success: boolean; message?: string }>;
  confirmResetPass: (email: string, confirmCode: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const AccessTokenContext = createContext<AccessTokenContextProps | undefined>(undefined);

export const useAccessTokenContext = () => {
  const context = useContext(AccessTokenContext);
  if (!context) {
    throw new Error('useAccessTokenContext must be used within an AccessTokenProvider');
  }
  return context;
};

export const AccessTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
  } = useAccessToken();

  return (
    <AccessTokenContext.Provider
      value={{
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
      }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};