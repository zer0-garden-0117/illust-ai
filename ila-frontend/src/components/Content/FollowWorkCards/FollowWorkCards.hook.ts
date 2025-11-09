import { UsersWorksGetResult } from "@/apis/openapi/publicworks/usePublicWorksByUserIdAndFilterGet";
import { useWorksGetByFilterInfinite } from "@/apis/openapi/works/useWorksGetByFilterInfinite";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 4;

export const useFollowWorkCards = () => {
  const router = useRouter();
  const { getIdTokenLatest } = useFirebaseAuthContext();
  const { data, size, setSize, isValidating } = useWorksGetByFilterInfinite(
    {
      initialOffset: 0,
      limit: PAGE_SIZE,
      worksFilterType: 'followUserPosted',
      getIdTokenLatest,
    },
    { revalidateOnFocus: false }
  );

  // data は「ページごとの配列」なので flatten する
  const flatWorks = data ? data.flatMap(
    (page) => page.works ?? []
  ) : [];

  const worksData: UsersWorksGetResult | undefined = data
    ? {
        ...data[data.length - 1],
        works: flatWorks,
      }
    : undefined;

  // 現在表示できる件数
  const illustNum = flatWorks.length || PAGE_SIZE;

  // 初期ロード中かどうか
  const isLoadingInitialData = !data && isValidating;

  // 追加ロード中かどうか
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && !!data && typeof data[size - 1] === "undefined");

  const handleMoreClick = () => {
    setSize(size + 1);
  };

  const handleNewClick = () => {
    router.push('/');
  };

  return {
    worksData,
    illustNum,
    isSubmitting: isLoadingMore,
    handleMoreClick,
    handleNewClick,
  };
};