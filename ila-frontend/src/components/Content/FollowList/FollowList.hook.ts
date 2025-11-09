import { usePublicFollowUsersGet } from "@/apis/openapi/publicusers/usePublicFollowUsersGet";
import { usePublicUsersGet } from "@/apis/openapi/publicusers/usePublicUsersGet";
import { useFollowUsersGet, FollowUsersGetQuery } from "@/apis/openapi/users/useFollowUsersGet";
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
  const { user: loginUser, getIdTokenLatest } = useFirebaseAuthContext(); // ★ loginUser を取得
  const router = useRouter();

  const offset = (page - 1) * 10;
  const limit = 10;
  const followTypeValue = followType as FollowUsersGetQuery["followType"];

  const {
    data: privateUserData,
    mutate: updatePrivateUser,
  } = useUsersGet(
    loginUser
      ? {
          customUserId,
          getIdTokenLatest,
        }
      : undefined,
    { revalidateOnFocus: true }
  );

  const {
    data: publicUserData,
    mutate: updatePublicUser,
  } = usePublicUsersGet(
    !loginUser
      ? {
          customUserId,
        }
      : undefined,
    { revalidateOnFocus: true }
  );

  const {
    data: privateFollowUserData,
    mutate: updatePrivateFollowUser,
  } = useFollowUsersGet(
    loginUser
      ? {
          customUserId,
          offset,
          limit,
          followType: followTypeValue,
          getIdTokenLatest,
        }
      : undefined
  );

  const {
    data: publicFollowUserData,
    mutate: updatePublicFollowUser,
  } = usePublicFollowUsersGet(
    !loginUser
      ? {
          customUserId,
          offset,
          limit,
          followType: followTypeValue,
        }
      : undefined
  );

  const userData = loginUser ? privateUserData : publicUserData;
  const followUserData = loginUser ? privateFollowUserData : publicFollowUserData;

  const updateUserAndFollowUser = () => {
    if (loginUser) {
      updatePrivateUser && updatePrivateUser();
      updatePrivateFollowUser && updatePrivateFollowUser();
    } else {
      updatePublicUser && updatePublicUser();
      updatePublicFollowUser && updatePublicFollowUser();
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/user/${customUserId}/follow?page=${page}`);
  };

  const handleUserCardClick = (customUserId: string | undefined) => {
    if (customUserId) {
      router.push(`/user/${customUserId}`);
    }
  };

  const handleArrowLeftClick = () => {
    router.push(`/user/${customUserId}`);
  };

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