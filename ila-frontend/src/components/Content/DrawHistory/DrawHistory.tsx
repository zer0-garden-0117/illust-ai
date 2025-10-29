'use client';

import React from 'react';
import { useDrawHistory } from './DrawHistory.hook';
import { DrawHistoryView } from './DrawHistory.view';
import type { components } from "../../../generated/services/ila-v1";
export type UserWorksFilterTypeQueryParam = components["parameters"]["UserWorksFilterTypeQueryParam"];

type DrawHistoryProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: UserWorksFilterTypeQueryParam;
};

export const DrawHistory: React.FC<DrawHistoryProps> = ({ customUserId, page, userWorksFilterType }): JSX.Element => {
  const viewProps = useDrawHistory({ customUserId, page, userWorksFilterType });
  return <DrawHistoryView {...viewProps} />;
};

export default DrawHistory;