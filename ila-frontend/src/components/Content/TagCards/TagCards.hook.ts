import { useRouter } from "next/navigation";
import { usePublicWorksTagsGetInfinite, PublicWorksTagsGetResult } from "@/apis/openapi/publicworks/usePublicWorksTagsGetInfinite";

const PAGE_SIZE = 4;

type UseTagCardsProps = {
  tag: string;
};

export const useTagCards = (
  { tag }: UseTagCardsProps
) => {
  const router = useRouter();

  const { data, size, setSize, isValidating } = usePublicWorksTagsGetInfinite(
    {
      initialOffset: 0,
      tag: tag,
      limit: PAGE_SIZE,
    },
    { revalidateOnFocus: false }
  );

  // data は「ページごとの配列」なので flatten する
  const flatWorks = data ? data.flatMap(
    (page) => page.works ?? []
  ) : [];

  const worksData: PublicWorksTagsGetResult | undefined = data
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
    tag,
    worksData,
    illustNum,
    isSubmitting: isLoadingMore,
    handleMoreClick,
    handleFollowClick,
  };
};