import { useEffect, useState } from "react";
import { ImageGridView } from "./ImageGrid.view";
import { ImageData } from "./ImageGrid.view";
import { useWorksSearchByTags, WorkSearchByTagRequestBody } from "@/apis/openapi/works/useWorksSearchByTags";
import { useWorksSearch, WorkSearchRequestBody, WorkSearchResult } from "@/apis/openapi/works/useWorksSearch";
import { useUserToken } from "@/apis/auth/useUserToken";
import { getCsrfTokenFromCookies } from "@/utils/authCookies";
import { useUsersLikedRegister } from "@/apis/openapi/users/useUsersLikedRegister";
import { useUsersRatedRegister } from "@/apis/openapi/users/useUsersRatedRegister";
import { useUsersActivitySearch, UsersActivitySearchResult } from "@/apis/openapi/users/useUsersActivitySearch";
import { useUsersLikedDelete } from "@/apis/openapi/users/useUsersLikedDelete";
import { useAccessToken } from "@/apis/auth/useAccessToken";

type UseImageGridProps = {
  words: string[];
  isTag: boolean;
};

export const useImageGrid = (
  { words, isTag }: UseImageGridProps
): React.ComponentPropsWithoutRef<typeof ImageGridView> => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // ローディング状態
  const [worksData, setWorksData] = useState<WorkSearchResult>();
  const [activitiesData, setActivitiesData] = useState<UsersActivitySearchResult>();
  const { trigger: triggerSearchWithTags, data: dataByTags } = useWorksSearchByTags();
  const { trigger: triggerSearch, data: dataByFreewords } = useWorksSearch();
  const { trigger: triggerActivity, data: activityData } = useUsersActivitySearch();
  const { trigger: triggerRated } = useUsersRatedRegister();
  const { trigger: triggerLiked } = useUsersLikedRegister();
  const { trigger: triggerDeliked } = useUsersLikedDelete();
  const { isAuthenticated } = useAccessToken();
  const { userToken } = useUserToken();

  const itemsPerPage = 12;  // 1ページあたりに表示するアイテム数

  const [headers, setHeaders] = useState({
    Authorization: `Bearer ${userToken}` as `Bearer ${string}`,
    "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
  });

  useEffect(() => {
    if (userToken != null) {
      setHeaders({
        Authorization: `Bearer ${userToken}` as `Bearer ${string}`,
        "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
      });
    }
  }, [userToken]);

  const fetchImagesWithTags = async (page: number) => {
    setLoading(true);  // ローディング開始
    const body: WorkSearchByTagRequestBody = {
      tags: words,
      offset: (page - 1) * itemsPerPage,  // ページごとのoffsetを計算
      limit: itemsPerPage  // 1ページに表示する件数
    };
    try {
      // 作品のデータを取得
      await triggerSearchWithTags({ body });
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  const fetchImagesWithFreewords = async (page: number) => {
    setLoading(true);  // ローディング開始
    const body: WorkSearchRequestBody = {
      words: words,
      offset: (page - 1) * itemsPerPage,  // ページごとのoffsetを計算
      limit: itemsPerPage  // 1ページに表示する件数
    };
    try {
      // 作品のデータを取得
      await triggerSearch({ body });
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  // ページ変更時にデータをリセットし、データを再取得
  useEffect(() => {
    console.log("xxxxxxxxxxxxxx")
    console.log(userToken)
    console.log(isAuthenticated)
    setImageData([]);  // データをリセット
    if (isTag) {
      fetchImagesWithTags(currentPage);
    } else {
      fetchImagesWithFreewords(currentPage);
    }
  }, [currentPage, isAuthenticated]);

  useEffect(() => {
    console.log("userToken updated:", userToken);  // userTokenの更新を確認
  }, [userToken]);

  // dataが変更された時の処理
  useEffect(() => {
    if (isTag && dataByTags) {
      setWorksData(dataByTags);
    } else if (!isTag && dataByFreewords) {
      setWorksData(dataByFreewords);
    }
  }, [dataByTags, dataByFreewords, isTag]);

  // works データが変更されたときの処理
  useEffect(() => {
    console.log("worksData:", worksData);
    console.log("headers:", headers)
    if (worksData) {
      if (isAuthenticated && userToken != null) {
        const workIds = worksData.works.map(work => work.workId).filter((id): id is number => id !== undefined);
        // アクティビティ情報を取得
        triggerActivity({ headers, body: { workIds } });
      } else {
        setActivitiesData({})
      }
    }
  }, [worksData, headers]);

  // activityDataが変更されたときの処理
  useEffect(() => {
    if (worksData && activityData) {
      setActivitiesData(activityData)
    }
  }, [activityData]);

  // activityData が変更されたときの処理
  useEffect(() => {
    if (worksData && activitiesData) {
      // works と activityData を結合して imageData にセット
      const fetchedImages: ImageData[] = worksData.works.map(work => {
        const activity = activitiesData?.apiRateds?.find(a => a.workId === work.workId);
        return {
          workId: work.workId || 0,
          mainTitle: work.mainTitle || "No Title",
          titleImage: work.titleImgUrl || "",
          date: work.createdAt || "",
          isLiked: activitiesData?.apiLikeds?.some(a => a.workId === work.workId),  // liked の確認
          rating: activity?.rating || 0,  // レーティングの確認
        };
      });
      setImageData(fetchedImages);

      // totalCountから総ページ数を計算して更新
      setTotalPages(Math.ceil(worksData.totalCount / itemsPerPage));
      setLoading(false);
    }
  }, [worksData, activitiesData]);

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
    onRateChange,
    isAuthenticated
  };
};
