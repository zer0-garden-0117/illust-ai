import { useEffect, useState } from "react";
import { ImageGridView } from "./ImageGrid.view";
import { ImageData } from "./ImageGrid.view";
import { useWorksSearchByTags, WorkSearchByTagRequestBody } from "@/apis/openapi/works/useWorksSearchByTags";
import { useUserToken } from "@/apis/auth/useUserToken";
import { getCsrfTokenFromCookies } from "@/utils/authCookies";
import { useUsersLikedRegister } from "@/apis/openapi/users/useUsersLikedRegister";
import { useUsersRatedRegister } from "@/apis/openapi/users/useUsersRatedRegister";
import { useUsersActivitySearch } from "@/apis/openapi/users/useUsersActivitySearch";
import { useUsersLikedDelete } from "@/apis/openapi/users/useUsersLikedDelete";

export const useImageGrid = (): React.ComponentPropsWithoutRef<typeof ImageGridView> => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // ローディング状態
  const { trigger, data } = useWorksSearchByTags();
  const { trigger: triggerActivity, data: activityData } = useUsersActivitySearch();
  const { trigger: triggerRated } = useUsersRatedRegister();
  const { trigger: triggerLiked } = useUsersLikedRegister();
  const { trigger: triggerDeliked } = useUsersLikedDelete();
  const { userToken } = useUserToken();

  const itemsPerPage = 2;  // 1ページあたりに表示するアイテム数

  const headers = {
    Authorization: `Bearer ${userToken}` as `Bearer ${string}`,
    "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
  };

  const fetchImages = async (page: number) => {
    setLoading(true);  // ローディング開始
    const body: WorkSearchByTagRequestBody = {
      tags: ["freeicon"],
      offset: (page - 1) * itemsPerPage,  // ページごとのoffsetを計算
      limit: itemsPerPage  // 1ページに表示する件数
    };
    try {
      // 作品のデータを取得
      await trigger({ headers, body });
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);  // ローディング終了
    }
  };

  // ページ変更時にデータをリセットし、データを再取得
  useEffect(() => {
    setImageData([]);  // データをリセット
    fetchImages(currentPage);
  }, [currentPage]);

  // works データが変更されたときの処理
  useEffect(() => {
    if (data) {
      const workIds = data.works.map(work => work.workId).filter((id): id is number => id !== undefined);
      // アクティビティ情報を取得
      triggerActivity({ headers, body: { workIds } });
    }
  }, [data]);

  // activityData が変更されたときの処理
  useEffect(() => {
    if (data && activityData) {
      // works と activityData を結合して imageData にセット
      const fetchedImages: ImageData[] = data.works.map(work => {
        const activity = activityData?.apiRateds?.find(a => a.workId === work.workId);
        return {
          workId: work.workId || 0,
          mainTitle: work.mainTitle || "No Title",
          titleImage: work.titleImgUrl || "",
          date: work.createdAt || "",
          isLiked: activityData?.apiLikeds?.some(a => a.workId === work.workId),  // liked の確認
          rating: activity?.rating || 0,  // レーティングの確認
        };
      });
      setImageData(fetchedImages);

      // totalCountから総ページ数を計算して更新
      setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
    }
  }, [data, activityData]);

  // ページ変更時にデータを更新する関数
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onRateChange = (workId: number, value: number) => {
    triggerRated({ headers, workId, rating: value });
  };

  const onLikeChange = (workId: number) => {
    const isCurrentlyLiked = imageData.find((image) => image.workId === workId)?.isLiked;

    // 現在の状態に基づいて "いいね" または "取り消し" を実行
    if (isCurrentlyLiked) {
      triggerDeliked({ headers, workId }); // いいねを取り消す場合
    } else {
      triggerLiked({ headers, workId });   // いいねをつける場合
    }
  };

  return {
    imageData,
    currentPage,
    totalPages,
    loading,
    onPageChange,
    onLikeChange,
    onRateChange
  };
};