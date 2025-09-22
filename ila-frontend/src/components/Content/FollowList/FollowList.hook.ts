import { useFollowUsersGet } from "@/apis/openapi/users/useFollowUsersGet";
import { useUsersGet } from "@/apis/openapi/users/useUsersGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useRouter } from "next/navigation";

type UseFollowListProps = {
  customUserId: string;
  page: number;
};

export const useFollowList = (
  { customUserId, page }: UseFollowListProps
) => {
  const { getIdTokenLatest } = useFirebaseAuthContext();
  const router = useRouter();

  const { data: userData, error } = useUsersGet({
    customUserId,
    getIdTokenLatest,
  }, { revalidateOnFocus: true });

  const { data: followUserData, mutate: updateUser } = useFollowUsersGet({
    customUserId,
    offset: (page - 1) * 10,
    limit: 10,
    getIdTokenLatest,
  });

  const handlePageChange = (page: number) => {
    router.push(`/user/${customUserId}/follow?page=${page}`);
  }

  return {
    userData,
    followUserData,
    updateUser,
    handlePageChange
  };
};