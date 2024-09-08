import { useEffect, useState } from "react";
import { ImageGridView } from "./ImageGrid.view";
import { ImageData } from "./ImageGrid.view";
import { useWorksSearchByTags, WorkSearchByTagRequestBody } from "@/apis/openapi/works/useWorksSearchByTags";
import { useUserToken } from "@/apis/auth/useUserToken";
import { getCsrfTokenFromCookies } from "@/utils/authCookies";

export const useImageGrid = (): React.ComponentPropsWithoutRef<typeof ImageGridView> => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // ローディング状態
  const { trigger, data } = useWorksSearchByTags();
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

  // データが変更されたときの処理
  useEffect(() => {
    if (data) {
      // worksから作品データを取得
      const fetchedImages: ImageData[] = data.works.map(work => ({
        workId: work.workId || 0,
        mainTitle: work.mainTitle || "No Title",
        titleImage: work.titleImgUrl || "",
        date: work.createdAt || "",
      }));
      setImageData(fetchedImages);

      // totalCountから総ページ数を計算して更新
      setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
    }
  }, [data]);

  // ページ変更時にデータを更新する関数
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return { imageData, currentPage, totalPages, onPageChange, loading };
};