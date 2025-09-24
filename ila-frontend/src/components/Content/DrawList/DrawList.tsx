'use client';

import React from 'react';
import { useDrawList } from './DrawList.hook';
import { DrawListView } from './DrawList.view';

export const DrawList: React.FC = (): JSX.Element => {
  const viewProps = useDrawList();
  return <DrawListView {...viewProps} />;
};

export default DrawList;