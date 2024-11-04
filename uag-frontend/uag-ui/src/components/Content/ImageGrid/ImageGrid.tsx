import React from 'react';
import { useImageGrid } from './ImageGrid.hook';
import { ImageGridView } from './ImageGrid.view';

type ImageGridProps = {
  title: string;
  isViewCount: boolean;
  isViewPagination: boolean;
  imageCount: number;
  type: string;
  words: string[];
};

export const ImageGrid: React.FC<ImageGridProps> = (
  { title, isViewCount, isViewPagination, imageCount, type, words }
): JSX.Element => {
  const viewProps = useImageGrid({ title, isViewCount, isViewPagination, imageCount, type, words });
  return <ImageGridView {...viewProps} />;
};

export default ImageGrid;