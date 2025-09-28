'use client';

import React from 'react';
import { usePlanList } from './PlanList.hook';
import { PlanListView } from './PlanList.view';

export const PlanList: React.FC = (): JSX.Element => {
  const viewProps = usePlanList();
  return <PlanListView {...viewProps} />;
};

export default PlanList;