'use client';
import { useUserToken } from '../../apis/auth/useUserToken';
import React, { createContext, useContext } from 'react';

interface UserTokenContextProps {
  isSetup: boolean;
  userToken: string | null;
  userId: number | null;
  role: string | null;
  error: Error | undefined;
}

const UserTokenContext = createContext<UserTokenContextProps | undefined>(undefined);

export const useUserTokenContext = () => {
  const context = useContext(UserTokenContext);
  if (!context) {
    throw new Error('useUserTokenContext must be used within a UserTokenProvider');
  }
  return context;
};

export const UserTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSetup, userToken, userId, role, error } = useUserToken();
  return (
    <UserTokenContext.Provider value={{ isSetup, userToken, userId, role, error }}>
      {children}
    </UserTokenContext.Provider>
  );
};
