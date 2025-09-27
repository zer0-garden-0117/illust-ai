import { ImageDataOfImageCardsForHistory } from "../DrawHistory/ImageCardsForHistory/ImageCardsForHistory";

type UseHistoryWorkProps = {
  workId: string;
};

export const useHistoryWork = (
  { workId }: UseHistoryWorkProps
) => {

  const imageData: ImageDataOfImageCardsForHistory = {
      workId: '1',
      mainTitle: 'Sample Image 1',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
  };

  return {
    workId,
    imageData,
  };
};