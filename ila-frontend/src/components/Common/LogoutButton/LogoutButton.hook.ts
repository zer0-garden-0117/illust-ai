import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type LogoutButtonProps = {
  onSuccess?: () => void;
};

export const useLogoutButton = (
  { onSuccess }: LogoutButtonProps
) => {
  const { signOut } = useFirebaseAuthContext();

  const onLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    onLogout
  };
};