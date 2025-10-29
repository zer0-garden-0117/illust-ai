import { useUsersWorksGet } from "@/apis/openapi/users/useUsersWorksGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import type { components } from "../../../generated/services/ila-v1";
export type UserWorksFilterTypeQueryParam = components["parameters"]["UserWorksFilterTypeQueryParam"];

type UseDrawHistoryProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: UserWorksFilterTypeQueryParam;
};

export const useDrawHistory = (
    { customUserId, page, userWorksFilterType }: UseDrawHistoryProps
) => {
  const { getIdTokenLatest } = useFirebaseAuthContext();

  const { data: userWorksData, mutate: updateUserWorks } = useUsersWorksGet({
      customUserId: customUserId,
      offset: (page - 1) * 10,
      limit: 10,
      userWorksFilterType,
      getIdTokenLatest,
    });

  return {
    userWorksData
  };
};