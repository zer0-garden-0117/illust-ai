import { PublicWorksGetResult, usePublicWorksGetByFilterInfinite } from "@/apis/openapi/publicworks/usePublicWorksGetByFilterInfinite";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 4;

export const useTopCards = () => {
  const router = useRouter();
  const worksFilterType = "new";

  const { data, size, setSize, isValidating } = usePublicWorksGetByFilterInfinite(
    {
      initialOffset: 0,
      limit: PAGE_SIZE,
      worksFilterType,
    },
    { revalidateOnFocus: false }
  );

  // data は「ページごとの配列」なので flatten する
  const flatWorks = data ? data.flatMap(
    (page) => page.works ?? []
  ) : [];

  const worksData: PublicWorksGetResult | undefined = data
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

  const handleFollowClick = () => {
    router.push('/follow');
  };

  return {
    worksData,
    illustNum,
    isSubmitting: isLoadingMore,
    handleMoreClick,
    handleFollowClick,
  };
};