'use client';

import React from 'react';
import { useDrawProcessing } from './DrawProcessing.hook';
import { DrawProcessingView } from './DrawProcessing.view';

type DrawProcessingrops = {
  workId: string;
};

export const DrawProcessing: React.FC<DrawProcessingrops> = (
  { workId }
): JSX.Element => {
  const viewProps = useDrawProcessing({ workId });
  return <DrawProcessingView {...viewProps} />;
};

export default DrawProcessing;