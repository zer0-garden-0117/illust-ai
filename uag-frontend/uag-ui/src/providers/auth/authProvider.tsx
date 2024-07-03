'use client';
import { type ReactNode } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import '../../configs/auth/config';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
};