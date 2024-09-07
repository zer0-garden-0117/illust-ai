import React from 'react';
import { useImageGrid } from './ImageGrid.hook';
import { ImageGridView } from './ImageGrid.view';

export const ImageGrid: React.FC = (): JSX.Element => {
  const viewProps = useImageGrid();
  return <ImageGridView {...viewProps} />;
};

export default ImageGrid;