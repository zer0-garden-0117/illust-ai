import { useRouter } from "next/navigation";
import { ApiWork } from "../DrawHistory/ImageCardsForHistory/ImageCardsForHistory";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UsePostFormProps = {
  workId: string;
};

export const usePostForm = (
  { workId }: UsePostFormProps
) => {
  const { user } = useFirebaseAuthContext();
  const router = useRouter();

  const imageData: ApiWork = {
      workId: '1',
      mainTitle: 'Sample Image 1',
      titleImgUrl: '/testimage/test.png',
      thumbnailImgUrl: '/testimage/test.png',
  };

  const handleSubmitClick = (workId: string) => {
    // ここにサブミット処理を実装
    router.push(`/user/${user?.customUserId}`);
  }

  return {
    workId,
    imageData,
    handleSubmitClick
  };
};