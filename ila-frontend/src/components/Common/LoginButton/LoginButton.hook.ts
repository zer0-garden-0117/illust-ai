import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type LoginButtonProps = {
  onSuccess?: () => void;
};

export const useLoginButton = (
  { onSuccess }: LoginButtonProps
) => {
  const { twitterSignIn, signOut } = useFirebaseAuthContext();

  const onLogin = async () => {
    try {
      const result = await twitterSignIn();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return {
    onLogin
  };
};