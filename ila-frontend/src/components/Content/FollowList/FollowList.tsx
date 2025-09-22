'use client';

import React from 'react';
import { useFollowList } from './FollowList.hook';
import { FollowListView } from './FollowList.view';

type FollowListProps = {
  customUserId: string;
  page: number;
};

export const FollowList: React.FC<FollowListProps> = (
  { customUserId, page }
): JSX.Element => {
  const viewProps = useFollowList({ customUserId, page });
  return <FollowListView {...viewProps} />;
};

export default FollowList;