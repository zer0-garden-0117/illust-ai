'use client';

import React from 'react';
import { useBillCompleted } from './BillCompleted.hook';
import { BillCompletedView } from './BillCompleted.view';

type BillCompletedrops = {
  priceId: string;
};

export const BillCompleted: React.FC<BillCompletedrops> = (
  { priceId }
): JSX.Element => {
  const viewProps = useBillCompleted({ priceId });
  return <BillCompletedView {...viewProps} />;
};

export default BillCompleted;