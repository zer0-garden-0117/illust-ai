import { WorkRegistrationFormView } from "./WorkRegistrationForm.view";
import { CreateWorkRequestBody } from "@/apis/openapi/works/useWorksCreate";
import { WorkData } from "./WorkRegistrationForm.view"
import { getCsrfTokenFromCookies } from "@/utils/authCookies";
import { useUserTokenContext } from "@/providers/auth/userTokenProvider";
import { useWorksCreate } from "@/apis/openapi/works/useWorksCreate";
import { useAuth } from "@/apis/auth/useAuth";

export const useWorkRegistrationForm = (): React.ComponentPropsWithoutRef<
  typeof WorkRegistrationFormView
> => {
  const { trigger } = useWorksCreate();
  const { userToken, isAdmin } = useUserTokenContext();
  const { idToken } = useAuth();

  const headers = {
    Authorization: `Bearer ${idToken}` as `Bearer ${string}`,
    "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
  };

  const utf8ToBase64 = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handleSubmit = async (workData: WorkData): Promise<void> => {
    try {
      // タグ、キャラクター、クリエーターをカンマで区切って配列に変換
      const tagsArray = workData.tags ? workData.tags.split(',') : [];
      const charactersArray = workData.character ? workData.character.split(',') : [];
      const creatorsArray = workData.creator ? workData.creator.split(',') : [];
      const genre = [workData.genre]
      const format = [workData.format]
      const requestBody: CreateWorkRequestBody = {
        apiWork: {
          workId: '',
          mainTitle: workData.mainTitle || '',
          subTitle: workData.subTitle || '',
          description: workData.description || '',
          prompt: "1girl, twintails, blue eyes",
          status: "init",
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
  
      // triggerの結果を明示的に返す
      await trigger({
        headers,
        body: requestBody
      });
    } catch (error) {
      console.error('Failed to register work:', error);
      throw error;
    }
  };

  return { onSubmit: handleSubmit, isAdmin };
};