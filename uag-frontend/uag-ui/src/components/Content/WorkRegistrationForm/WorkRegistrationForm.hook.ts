import { WorkRegistrationFormView } from "./WorkRegistrationForm.view";
import { useWorksRegister } from "@/apis/openapi/works/useWorksRegister";
import { WorkData } from "./WorkRegistrationForm.view"
import { getCsrfTokenFromCookies } from "@/utils/authCookies";
import { useUserTokenContext } from "@/providers/auth/userTokenProvider";

export const useWorkRegistrationForm = (): React.ComponentPropsWithoutRef<
  typeof WorkRegistrationFormView
> => {
  const { trigger } = useWorksRegister();
  const { userToken } = useUserTokenContext();

  const headers = {
    Authorization: `Bearer ${userToken}` as `Bearer ${string}`,
    "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
  };

  const utf8ToBase64 = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handleSubmit = async (workData: WorkData) => {

    // タグ、キャラクター、クリエーターをカンマで区切って配列に変換
    const tagsArray = workData.tags ? workData.tags.split(',') : [];
    const charactersArray = workData.character ? workData.character.split(',') : [];
    const creatorsArray = workData.creator ? workData.creator.split(',') : [];
    const genre = [workData.genre]
    const format = [workData.format]
    const workDetails = {
      apiWork: {
        workId: '',
        mainTitle: workData.mainTitle || '',
        subTitle: workData.subTitle || '',
        description: workData.description || '',
        titleImgUrl: '',
        thumbnailImgUrl: '',
        watermaskImgUrl: '',
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      apiTags: {
        characters: charactersArray,
        creators: creatorsArray,
        genres: genre,
        formats: format,
        others: tagsArray
      }
    };

    // リクエストボディの作成
    const requestBody = {
      titleImage: workData.titleImage,
      images: [
        workData.titleImage
      ],
      worksDetailsBase64: utf8ToBase64(JSON.stringify(workDetails))
    };

    try {
      console.log(workData)
      await trigger({
        headers,
        body: requestBody
      });
    } catch (error) {
      console.error('Failed to register work:', error);
    }
  };

  return { onSubmit: handleSubmit };
};