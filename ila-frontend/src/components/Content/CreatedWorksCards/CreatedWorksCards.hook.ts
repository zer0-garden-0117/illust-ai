import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useUsersWorksGet } from "@/apis/openapi/works/useWorksByUserIdAndFilterGet";
import type { components } from "../../../generated/services/ila-v1";
export type WorksUserFilterTypeQueryParam = components["parameters"]["WorksUserFilterTypeQueryParam"];

type UseCreatedWorksCardsProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: WorksUserFilterTypeQueryParam;
};

export const useCreatedWorksCards = (
    { customUserId, page, userWorksFilterType }: UseCreatedWorksCardsProps
) => {
  const { getIdTokenLatest, user } = useFirebaseAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const illustNum = 12;

  const { data: userWorksData, mutate: updateUserWorks } = useUsersWorksGet({
      customUserId: customUserId,
      offset: (page - 1) * illustNum,
      limit: illustNum,
      userWorksFilterType,
      getIdTokenLatest,
  },
    { revalidateOnFocus: false }
  );
  
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