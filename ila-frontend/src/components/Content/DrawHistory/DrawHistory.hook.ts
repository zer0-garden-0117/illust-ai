import { ImageDataOfImageCardsForHistory } from "@/components/Content/DrawHistory/ImageCardsForHistory/ImageCardsForHistory";

export const useDrawHistory = () => {
  const imageData: ImageDataOfImageCardsForHistory[] = [
    {
      workId: '1',
      mainTitle: 'Sample Image 1',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
    },
    {
      workId: '2',
      mainTitle: 'Sample Image 2',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
    },
    {
      workId: '3',
      mainTitle: 'Sample Image 3',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
    },
    {
      workId: '4',
      mainTitle: 'Sample Image 4',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
    },
    {
      workId: '5',
      mainTitle: 'Sample Image 5',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
    },
    {
      workId: '6',
      mainTitle: 'Sample Image 6',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
    },
    {
      workId: '7',
      mainTitle: 'Samplxe Image 7',
      titleImage: '/testimage/test.png',
      thumbnailImage: '/testimage/test.png',
    },
  ];

  return {
    imageData
  };
};