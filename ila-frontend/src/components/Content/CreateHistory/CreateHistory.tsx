'use client';

import React from 'react';
import { useCreateHistory } from './CreateHistory.hook';
import { CreateHistoryView } from './CreateHistory.view';
import type { components } from "../../../generated/services/ila-v1";
export type UserWorksFilterTypeQueryParam = components["parameters"]["UserWorksFilterTypeQueryParam"];

type CreateHistoryProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: UserWorksFilterTypeQueryParam;
};

export const CreateHistory: React.FC<CreateHistoryProps> = ({ customUserId, page, userWorksFilterType }): JSX.Element => {
  const viewProps = useCreateHistory({ customUserId, page, userWorksFilterType });
  return <CreateHistoryView {...viewProps} />;
};

export default CreateHistory;