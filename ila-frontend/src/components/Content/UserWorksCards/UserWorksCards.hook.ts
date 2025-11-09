import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { usePublicWorksByUserIdAndFilterGet } from "@/apis/openapi/publicworks/usePublicWorksByUserIdAndFilterGet";
import type { components } from "../../../generated/services/ila-v1";
export type PublicWorksUserFilterTypeQueryParam = components["parameters"]["PublicWorksUserFilterTypeQueryParam"];

type UseUserWorkCardsProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: PublicWorksUserFilterTypeQueryParam;
};

export const useUserWorkCards = (
    { customUserId, page, userWorksFilterType }: UseUserWorkCardsProps
) => {
  const { getIdTokenLatest, user } = useFirebaseAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // userWorksFilterTypeがpostedかつ、customUserIdが自分のcustomUserIdと等しい場合は11を設定、
  // それ以外の場合は12を設定する
  const illustNum =
    userWorksFilterType === 'posted' && customUserId === user?.customUserId ? 11 : 12;

  const { data: userWorksData, mutate: updateUserWorks } = usePublicWorksByUserIdAndFilterGet({
      customUserId: customUserId,
      offset: (page - 1) * illustNum,
      limit: illustNum,
      userWorksFilterType,
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
    customUserId,
    userWorksFilterType,
    userWorksData,
    handlePageChange
  };
};