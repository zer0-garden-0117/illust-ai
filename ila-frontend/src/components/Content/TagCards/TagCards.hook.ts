import { useRouter } from "next/navigation";

import { usePublicWorksTagsGetInfinite, PublicWorksTagsGetResult } from "@/apis/openapi/publicworks/usePublicWorksTagsGetInfinite";
import { useUsersTagGet, UsersTagGetResult } from "@/apis/openapi/myusers/useUsersTagGet";
import { useUsersTagRegister } from "@/apis/openapi/myusers/useUsersTagRegister";
import { useUsersTagDelete } from "@/apis/openapi/myusers/useUsersTagDelete";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

const PAGE_SIZE = 4;

type UseTagCardsProps = {
  tag: string;
};

export const useTagCards = (
  { tag }: UseTagCardsProps
) => {
  const { getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: triggerTagRegister } = useUsersTagRegister();
  const { trigger: triggerTagDelete } = useUsersTagDelete();

  const { data, size, setSize, isValidating } = usePublicWorksTagsGetInfinite(
    {
      initialOffset: 0,
      tag: tag,
      limit: PAGE_SIZE,
    },
    { revalidateOnFocus: false }
  );

  const { data: favoriteTagsData, mutate: updateFavoriteTags } = useUsersTagGet(
    { tag: tag, getIdTokenLatest: getIdTokenLatest },
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

  const handleFavoriteClick = async (tag: string) => {
    if (favoriteTagsData?.isLiked) {
      await triggerTagDelete({
        headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
        tag: tag
      });
    } else {
      await triggerTagRegister({
        headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
        tag: tag
      });
    }
    await updateFavoriteTags();
  };

  return {
    tag,
    worksData,
    favoriteTagsData,
    illustNum,
    isSubmitting: isLoadingMore,
    handleMoreClick,
    handleFavoriteClick,
  };
};