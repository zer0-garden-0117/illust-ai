import { usePublicWorksGetInfinite } from "@/apis/openapi/works/usePublicWorksGetInfinite";
import type { PublicWorksGetResult } from "@/apis/openapi/works/usePublicWorksGet";

const PAGE_SIZE = 4;

export const useTopCards = () => {
  const worksFilterType = "new";

  const { data, size, setSize, isValidating } = usePublicWorksGetInfinite(
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

  // TopCardsView 向けに PublicWorksGetResult に戻す
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

  return {
    worksData,
    illustNum,
    isSubmitting: isLoadingMore,
    handleMoreClick,
  };
};