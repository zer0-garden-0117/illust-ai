import { useRouter } from "next/navigation";
import { ImageDataOfImageCardsForHistory } from "../DrawHistory/ImageCardsForHistory/ImageCardsForHistory";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UseWorkFormProps = {
  workId: string;
};

export const useWorkForm = (
  { workId }: UseWorkFormProps
) => {
  const { user } = useFirebaseAuthContext();
  const router = useRouter();

  const imageData: ImageDataOfImageCardsForHistory = {
      workId: '1',
      mainTitle: 'Sample Image 1',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
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