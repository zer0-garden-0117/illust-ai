'use client';

import React from 'react';
import { useBoostList } from './BoostList.hook';
import { BoostListView } from './BoostList.view';

export const BoostList: React.FC = (): JSX.Element => {
  const viewProps = useBoostList();
  return <BoostListView {...viewProps} />;
};

export default BoostList;