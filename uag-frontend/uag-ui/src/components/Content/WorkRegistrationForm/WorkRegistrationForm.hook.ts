import { WorkRegistrationFormView } from "./WorkRegistrationForm.view";
import { useWorksRegister } from "@/apis/openapi/works/useWorksRegister";
import { WorkData } from "./WorkRegistrationForm.view"
import { useUserToken } from "@/apis/auth/useUserToken";
import { getCsrfTokenFromCookies } from "@/utils/authCookies";

export const useWorkRegistrationForm = (): React.ComponentPropsWithoutRef<
  typeof WorkRegistrationFormView
> => {
  const { trigger } = useWorksRegister();
  const { userToken } = useUserToken();

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
    const workDetails = {
      apiWork: {
        workId: undefined,
        genre: workData.genre || '',
        format: workData.format || '',
        workSize: undefined,
        description: workData.description || '',
        createdAt: new Date().toISOString(),
        pages: undefined,
        subTitle: workData.subTitle || '',
        downloads: 0,
        mainTitle: workData.mainTitle || '',
        titleImgUrl: '',
        likes: 0,
        updatedAt: new Date().toISOString(),
      },
      apiTags: tagsArray.map((tag) => ({
        tag: tag.trim() || '',
        updatedAt: new Date().toISOString()
      })),
      apiCharacters: charactersArray.map((character) => ({
        character: character.trim() || '',
        updatedAt: new Date().toISOString()
      })),
      apiCreators: creatorsArray.map((creator) => ({
        creator: creator.trim() || '',
        updatedAt: new Date().toISOString()
      }))
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