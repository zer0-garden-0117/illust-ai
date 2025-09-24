'use client';

import React from 'react';
import { useDrawHistory } from './DrawHistory.hook';
import { DrawHistoryView } from './DrawHistory.view';

export const DrawHistory: React.FC = (): JSX.Element => {
  const viewProps = useDrawHistory();
  return <DrawHistoryView {...viewProps} />;
};

export default DrawHistory;