import { useUsersGet } from "@/apis/openapi/users/useUsersGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useRouter } from "next/navigation";

type UseFollowListProps = {
  userId: string;
};

export const useFollowList = (
  { userId }: UseFollowListProps
) => {
  const { idToken } = useFirebaseAuthContext();
  const router = useRouter();
  const { data: userData, mutate: updateUser } = useUsersGet(
    { headers: { Authorization: `Bearer ${idToken}` },
      customUserId: userId },
    { revalidateOnFocus: false }
  );

  const handlePageChange = (page: number) => {
    router.push(`/user/${userData?.customUserId}/follow?page=${page}`);
  }

  const userDataCount = userData ? 10 : 10;

  return {
    userDataList: userData,
    userDataCount,
    updateUser,
    handlePageChange
  };
};