import { UsersGetResult, useUsersGet } from "@/apis/openapi/users/useUsersGet";

type UseUserInfoProps = {
  userId: string;
};

export const useUserInfo = (
  { userId }: UseUserInfoProps
) => {
  const { data: userData, error, isLoading } = useUsersGet(
    { customUserId: userId },
    { revalidateOnFocus: false }
  );

  return {
    userData
  };
};