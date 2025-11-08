'use client';

import { 
  signInWithPopup, 
  signOut, 
  TwitterAuthProvider,
  UserCredential,
  User as FirebaseUser,
  getAdditionalUserInfo
} from 'firebase/auth';
import { auth } from '../../configs/auth/config2'
import { useMyUserGet, MyUserGetResult } from '../openapi/myusers/useMyUserGet';

interface AuthResult {
  user: MyUserGetResult;
  idToken: string;
  additionalUserInfo: string | null;
}

export function useFirebaseAuth() {
  const { trigger: fetchUser, data: user, error, isMutating } = useMyUserGet();
  const twitterSignIn = async (): Promise<AuthResult> => {
    const provider = new TwitterAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const info = getAdditionalUserInfo(result);
      const userData = await fetchUser({
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });

      return {
        user: userData,
        idToken,
        additionalUserInfo: info ? JSON.stringify(info) : null
      };
    } catch (error) {
      console.error('Twitter sign in error:', error);
      throw error;
    }
  };

  const getFreshIdToken = async (user: FirebaseUser | null): Promise<string | null> => {
    if (!user) {
      return null;
    }
    try {
      const freshToken = await user.getIdToken(true);
      return freshToken;
    } catch (error) {
      console.error('Failed to get fresh ID token:', error);
      return null;
    }
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  return {
    twitterSignIn,
    getFreshIdToken,
    signOut: signOutUser
  };
}