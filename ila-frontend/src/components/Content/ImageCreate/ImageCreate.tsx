'use client';

import React from 'react';
import { useImageCreate } from './ImageCreate.hook';
import { ImageCreateView } from './ImageCreate.view';

type ImageCreateProps = {
};

export const ImageCreate: React.FC<ImageCreateProps> = (): JSX.Element => {
  const viewProps = useImageCreate();
  return <ImageCreateView {...viewProps} />;
};

export default ImageCreate;