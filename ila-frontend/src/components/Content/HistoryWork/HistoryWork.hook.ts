import { useRouter } from "next/navigation";
import { ApiWork } from "../DrawHistory/ImageCardsForHistory/ImageCardsForHistory";

type UseHistoryWorkProps = {
  workId: string;
};

export const useHistoryWork = (
  { workId }: UseHistoryWorkProps
) => {
  const router = useRouter();

  const imageData: ApiWork = {
      workId: '1',
      mainTitle: 'Sample Image 1',
      titleImgUrl: '/testimage/test.png',
      thumbnailImgUrl: '/testimage/test.png',
  };

  const handlePostClick = (workId: string) => {
    router.push(`/illust/form/${workId}`);
  }

  return {
    workId,
    imageData,
    handlePostClick
  };
};