import { useFollowUsersGet, FollowUsersGetQuery} from "@/apis/openapi/users/useFollowUsersGet";
import { useUsersGet } from "@/apis/openapi/users/useUsersGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useRouter } from "next/navigation";


type UseFollowListProps = {
  customUserId: string;
  page: number;
  followType: string;
};

export const useFollowList = (
  { customUserId, page, followType }: UseFollowListProps
) => {
  const { getIdTokenLatest } = useFirebaseAuthContext();
  const router = useRouter();

  const { data: userData, error, mutate: updateUser } = useUsersGet({
    customUserId,
    getIdTokenLatest,
  }, { revalidateOnFocus: true });

  const { data: followUserData, mutate: updateFollowUser } = useFollowUsersGet({
    customUserId,
    offset: (page - 1) * 10,
    limit: 10,
    followType: followType as FollowUsersGetQuery["followType"],
    getIdTokenLatest,
  });

  const updateUserAndFollowUser = () => {
    updateUser();
    updateFollowUser();
  }

  const handlePageChange = (page: number) => {
    router.push(`/user/${customUserId}/follow?page=${page}`);
  }

  const handleUserCardClick = (customUserId: string | undefined) => {
    if (!customUserId) return;
    router.push(`/user/${customUserId}`);
  }

  const handleArrowLeftClick = () => {
    router.push(`/user/${customUserId}`);
  }

  return {
    page,
    userData,
    followUserData,
    updateUserAndFollowUser,
    handlePageChange,
    handleUserCardClick,
    handleArrowLeftClick
  };
};