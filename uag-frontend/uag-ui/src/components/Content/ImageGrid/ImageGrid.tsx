import React from 'react';
import { useImageGrid } from './ImageGrid.hook';
import { ImageGridView } from './ImageGrid.view';

type ImageGridProps = {
  type: string;
  words: string[];
};

export const ImageGrid: React.FC<ImageGridProps> = (
  { type, words }
): JSX.Element => {
  const viewProps = useImageGrid({ type, words });
  return <ImageGridView {...viewProps} />;
};

export default ImageGrid;