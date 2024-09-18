import React from 'react';
import { useImageGrid } from './ImageGrid.hook';
import { ImageGridView } from './ImageGrid.view';

type ImageGridProps = {
  words: string[];
  isTag: boolean;
};

export const ImageGrid: React.FC<ImageGridProps> = (
  { words, isTag }
): JSX.Element => {
  const viewProps = useImageGrid({ words, isTag });
  return <ImageGridView {...viewProps} />;
};

export default ImageGrid;