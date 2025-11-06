import { useState } from "react";
import { usePublicWorksGetInfinite } from "@/apis/openapi/works/usePublicWorksGetInfinite";
import type { PublicWorksGetResult } from "@/apis/openapi/works/usePublicWorksGet";

const PAGE_SIZE = 4;

export const useTopCards = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const worksFilterType = "new";

  const { data, size, setSize } = usePublicWorksGetInfinite(
    {
      initialOffset: 0,
      limit: PAGE_SIZE,
      worksFilterType,
    },
    {
      revalidateOnFocus: false,
    }
  );

  // data は「ページごとの配列」なので flatten する
  const flatWorks = data ? data.flatMap((page) => page.works ?? []) : [];

  // TopCardsView が今まで通り PublicWorksGetResult を受け取れるように
  // 最後のページをベースにして works だけ全ページ分に差し替える
  const worksData: PublicWorksGetResult | undefined = data
    ? {
        ...data[data.length - 1],
        works: flatWorks,
      }
    : undefined;

  // 現在表示できる件数（初回ロード中は PAGE_SIZE を使う）
  const illustNum = flatWorks.length || PAGE_SIZE;

  const handleMoreClick = async () => {
    setIsSubmitting(true);
    await setSize(size + 1);
    setIsSubmitting(false);
  };

  return {
    worksData,
    illustNum,
    isSubmitting,
    handleMoreClick,
  };
};