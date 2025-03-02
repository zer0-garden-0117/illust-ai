import React from 'react';
import { useImageList } from './ImageList.hook';
import { ImageListView } from './ImageList.view';

type ImageListProps = {
  title: string;
  isViewCount: boolean;
  isViewPagination: boolean;
  imageCount: number;
  type: string;
  words: string[];
};

export const ImageList: React.FC<ImageListProps> = (
  { title, isViewCount, isViewPagination, imageCount, type, words }
): JSX.Element => {
  const viewProps = useImageList({ title, isViewCount, isViewPagination, imageCount, type, words });
  return <ImageListView {...viewProps} />;
};

export default ImageList;