import { useUsersWorksGet } from "@/apis/openapi/users/useUsersWorksGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import type { components } from "../../../generated/services/ila-v1";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: userWorksData, mutate: updateUserWorks } = useUsersWorksGet({
      customUserId: customUserId,
      offset: (page - 1) * 12,
      limit: 12,
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
    userWorksData,
    handlePageChange
  };
};