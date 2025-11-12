import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type LogoutButtonProps = {
  onSuccess?: () => void;
  isDisable?: boolean;
};

export const useLogoutButton = (
  { onSuccess, isDisable = false }: LogoutButtonProps
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
    onLogout,
    isDisable
  };
};