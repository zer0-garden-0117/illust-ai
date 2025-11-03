import { useUsersWorksGet } from "@/apis/openapi/users/useUsersWorksGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import type { components } from "../../../generated/services/ila-v1";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
export type UserWorksFilterTypeQueryParam = components["parameters"]["UserWorksFilterTypeQueryParam"];

type UseCreateHistoryProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: UserWorksFilterTypeQueryParam;
};

export const useCreateHistory = (
    { customUserId, page, userWorksFilterType }: UseCreateHistoryProps
) => {
  const { getIdTokenLatest, user } = useFirebaseAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // userWorksFilterTypeがpostedかつ、customUserIdが自分のcustomUserIdと等しい場合は11を設定、
  // それ以外の場合は12を設定する
  const illustNum =
    userWorksFilterType === 'posted' && customUserId === user?.customUserId ? 11 : 12;

  const { data: userWorksData, mutate: updateUserWorks } = useUsersWorksGet({
      customUserId: customUserId,
      offset: (page - 1) * illustNum,
      limit: illustNum,
      userWorksFilterType,
      getIdTokenLatest,
  });
  
  const handlePageChange = (page: number): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    const url = `${pathname}?${params.toString()}`;
    router.push(url, { scroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return {
    page,
    customUserId,
    userWorksFilterType,
    userWorksData,
    handlePageChange
  };
};