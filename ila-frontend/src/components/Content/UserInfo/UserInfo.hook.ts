import { useUsersGet } from "@/apis/openapi/users/useUsersGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UseUserInfoProps = {
  userId: string;
};

export const useUserInfo = (
  { userId }: UseUserInfoProps
) => {
  const { getIdTokenLatest } = useFirebaseAuthContext();

  const { data: userData, mutate: updateUser } = useUsersGet({
    customUserId: userId,
    getIdTokenLatest,
  }, { revalidateOnFocus: true });

  return {
    userData,
    updateUser,
  };
};