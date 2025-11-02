'use client';

import React from 'react';
import { useHistoryWork } from './HistoryWork.hook';
import { HistoryWorkView } from './HistoryWork.view';

type HistoryWorkProps = {
  workId: string;
};

export const Work: React.FC<HistoryWorkProps> = (
  { workId }
): JSX.Element => {
  const viewProps = useHistoryWork({ workId });
  return <HistoryWorkView {...viewProps} />;
};

export default Work;