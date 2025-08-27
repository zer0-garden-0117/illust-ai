type UseUserInfoProps = {
  userId: string;
};

export const useUserInfo = (
  { userId }: UseUserInfoProps
) => {

  return {
    userId
  };
};