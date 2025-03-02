import { useEffect, useState } from "react";
import { ImageListView } from "./ImageList.view";
import { ImageData } from "./ImageList.view";
import { useWorksSearchByTags, WorkSearchByTagRequestBody, WorkSearchByTagResult } from "@/apis/openapi/works/useWorksSearchByTags";
import { getCsrfTokenFromCookies } from "@/utils/authCookies";
import { useUsersLikedRegister } from "@/apis/openapi/users/useUsersLikedRegister";
import { useUsersRatedRegister } from "@/apis/openapi/users/useUsersRatedRegister";
import { useUsersActivitySearch, UsersActivitySearchResult } from "@/apis/openapi/users/useUsersActivitySearch";
import { useUsersLikedDelete } from "@/apis/openapi/users/useUsersLikedDelete";
import { UsersLikedGetHeader, UsersLikedGetQuery, useUsersLikedGet } from "@/apis/openapi/users/useUsersLikedGet";
import { UsersRatedGetHeader, UsersRatedGetQuery, useUsersRatedGet } from "@/apis/openapi/users/useUsersRatedGet";
import { useRouter } from "next/navigation";
import { useNavigate } from "@/utils/navigate";
import { useUserTokenContext } from "@/providers/auth/userTokenProvider";
import { useAccessTokenContext } from "@/providers/auth/accessTokenProvider";

type UseImageGridProps = {
  title: string;
  isViewCount: boolean;
  isViewPagination: boolean;
  imageCount: number;
  type: string;
  words: string[];
};

export const useImageList= (
  { title, isViewCount, isViewPagination, imageCount, type, words }: UseImageGridProps
): React.ComponentPropsWithoutRef<typeof ImageListView> => {
  const router = useRouter();  // useRouter フックを使ってルーターを取得
  const searchParams = new URLSearchParams(window.location.search);
  const initialPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loading, setLoading] = useState(true); // ローディング状態
  const [worksData, setWorksData] = useState<WorkSearchByTagResult>();
  const [activitiesData, setActivitiesData] = useState<UsersActivitySearchResult>();
  const { trigger: triggerSearchWithTags, data: dataByTags } = useWorksSearchByTags();
  const { trigger: triggerSearchWithLiked, data: dataByLiked } = useUsersLikedGet();
  const { trigger: triggerSearchWithRated, data: dataByRated } = useUsersRatedGet();
  const { trigger: triggerActivity, data: activityData } = useUsersActivitySearch();
  const { trigger: triggerRated } = useUsersRatedRegister();
  const { trigger: triggerLiked } = useUsersLikedRegister();
  const { trigger: triggerDeliked } = useUsersLikedDelete();
  const { isAuthenticated } = useAccessTokenContext();
  const { userToken } = useUserTokenContext();
  const itemsPerPage = imageCount;
  const navigate = useNavigate();

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

  const fetchImagesWithLiked = async (page: number) => {
    setLoading(true);  // ローディング開始
    const headers: UsersLikedGetHeader = {
      Authorization: `Bearer ${userToken}` as `Bearer ${string}`
    }
    const query: UsersLikedGetQuery = {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage
    }
    try {
      await triggerSearchWithLiked({ headers, query });
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  const fetchImagesWithRated = async (page: number) => {
    setLoading(true);  // ローディング開始
    const headers: UsersRatedGetHeader = {
      Authorization: `Bearer ${userToken}` as `Bearer ${string}`
    }
    const query: UsersRatedGetQuery = {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage
    }
    try {
      await triggerSearchWithRated({ headers, query });
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  // ページ変更時にデータをリセットし、データを再取得
  useEffect(() => {
    setImageData([]);  // データをリセット
    if (type == "tag") {
      fetchImagesWithTags(currentPage);
    } else if (type == "free") {
      fetchImagesWithTags(currentPage);
    } else if (type == "liked") {
      fetchImagesWithLiked(currentPage);
    } else if (type === "rated") {
      fetchImagesWithRated(currentPage);
    }
  }, [currentPage]);
  // }, [currentPage, userToken]);

  // dataが変更された時の処理
  useEffect(() => {
    if (type == "tag" && dataByTags) {
      setWorksData(dataByTags);
    } else if (type == "free" && dataByTags) {
      setWorksData(dataByTags);
    } else if (type == "liked" && dataByLiked) {
      setWorksData(dataByLiked)
    } else if (type == "rated" && dataByRated) {
      setWorksData(dataByRated)
    }
  }, [dataByTags, dataByLiked, dataByRated, type]);

  // works データが変更されたときの処理
  useEffect(() => {
    console.log("worksData:", worksData);
    console.log("headers:", headers)
    if (worksData) {
      if (isAuthenticated && userToken != null) {
        const workIds = worksData.works
        .map((work) => work.workId)
        .filter((id): id is string => id !== undefined);
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
      const fetchedImages: ImageData[] = worksData.works.map((work) => {
        const activity = activitiesData?.apiRateds?.find((a) => a.workId === work.workId);
        
        // 型安全を確保しつつプロパティを処理
        return {
          workId: work.workId ?? "",
          mainTitle: work.mainTitle || "No Title",
          titleImage: work.titleImgUrl || "",
          thumbnailImage: work.thumbnailImgUrl || "",
          watermaskImage: work.watermaskImgUrl || "",
          date: work.createdAt || "",
          isLiked: activitiesData?.apiLikeds?.some((a) => a.workId === work.workId) || false, // Liked の確認
          rating: activity?.rating || 0, // レーティングの確認
        };
      });

      setImageData(fetchedImages);

      // totalCount から総ページ数を計算して更新
      setTotalPages(Math.ceil((worksData.totalCount || 0) / itemsPerPage));
      setTotalCount(worksData.totalCount || 0);
      setLoading(false);
    }
  }, [worksData, activitiesData]);

  // ページ変更時にデータを更新する関数
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    const currentPath = window.location.pathname.replace(/^\/(ja|en)/, '');
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    navigate(`${currentPath}?${params.toString()}`);
  };

  useEffect(() => {
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    setCurrentPage(page);
  }, [searchParams.get('page')]);

  const onRateChange = (workId: string, value: number) => {
    triggerRated({ headers, workId, rating: value });
  };

  const onLikeChange = (workId: string) => {
    const isCurrentlyLiked = imageData.find((image) => image.workId === workId)?.isLiked;

    // 現在の状態に基づいて "いいね" または "取り消し" を実行
    if (isCurrentlyLiked) {
      triggerDeliked({ headers, workId }); // いいねを取り消す場合
    } else {
      triggerLiked({ headers, workId });   // いいねをつける場合
    }
  };

  return {
    title,
    isViewCount,
    isViewPagination,
    imageData,
    currentPage,
    totalPages,
    totalCount,
    loading,
    onPageChange,
    onLikeChange,
    onRateChange,
    isAuthenticated
  };
};
