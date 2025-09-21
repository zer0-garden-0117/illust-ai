import { useUsersGet } from "@/apis/openapi/users/useUsersGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UseFollowListProps = {
  userId: string;
};

export const useFollowList = (
  { userId }: UseFollowListProps
) => {
  const { idToken } = useFirebaseAuthContext();
  console.log(idToken)

  const { data: userData, mutate: updateUser } = useUsersGet(
    { headers: { Authorization: `Bearer ${idToken}` },
      customUserId: userId },
    { revalidateOnFocus: false }
  );

  return {
    userData,
    updateUser,
  };
};