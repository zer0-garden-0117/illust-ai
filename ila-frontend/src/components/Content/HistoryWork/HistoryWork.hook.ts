import { useRouter } from "next/navigation";
import { ImageDataOfImageCardsForHistory } from "../DrawHistory/ImageCardsForHistory/ImageCardsForHistory";

type UseHistoryWorkProps = {
  workId: string;
};

export const useHistoryWork = (
  { workId }: UseHistoryWorkProps
) => {
  const router = useRouter();

  const imageData: ImageDataOfImageCardsForHistory = {
      workId: '1',
      mainTitle: 'Sample Image 1',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
  };

  const handlePostClick = (workId: string) => {
    router.push(`/draw/history/form/${workId}`);
  }

  return {
    workId,
    imageData,
    handlePostClick
  };
};