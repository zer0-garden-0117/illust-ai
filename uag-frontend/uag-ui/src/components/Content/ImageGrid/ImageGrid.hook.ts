import { useEffect, useState } from "react";
import { ImageGridView } from "./ImageGrid.view";
import { ImageData } from "./ImageGrid.view";
import { useWorksSearchByTags, WorkSearchByTagRequestBody, WorkSearchByTagHeaders } from "@/apis/openapi/works/useWorksSearchByTags";
import { useUserToken } from "@/apis/auth/useUserToken";
import { getCsrfTokenFromCookies } from "@/utils/authCookies";

export const useImageGrid = (): React.ComponentPropsWithoutRef<typeof ImageGridView> => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const { trigger, data, error } = useWorksSearchByTags();
  const { userToken } = useUserToken();

  const headers = {
    Authorization: `Bearer ${userToken}` as `Bearer ${string}`,
    "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
  };

  const fetchImages = async () => {
    const body: WorkSearchByTagRequestBody = ["freeicon"];
    try {
      await trigger({ headers, body });
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (data) {
      const fetchedImages: ImageData[] = data.map(work => ({
        workId: work.workId || 0,
        mainTitle: work.mainTitle || "No Title",
        titleImage: work.titleImgUrl || "",
        date: work.createdAt || "",
      }));
      setImageData(fetchedImages);
    }
  }, [data]);

  return { imageData };
};