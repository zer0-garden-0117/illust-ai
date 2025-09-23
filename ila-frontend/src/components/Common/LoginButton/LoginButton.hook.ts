import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useState } from "react";

type LoginButtonProps = {
  onSuccess?: () => void;
};

export const useLoginButton = (
  { onSuccess }: LoginButtonProps
) => {
  const { twitterSignIn } = useFirebaseAuthContext();
  const [isLogining, setIsLogining] = useState(false);

  const onLogin = async () => {
    try {
      setIsLogining(true);
      const result = await twitterSignIn();
      if (onSuccess) {
        onSuccess();
      }
      setIsLogining(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return {
    isLogining,
    onLogin
  };
};