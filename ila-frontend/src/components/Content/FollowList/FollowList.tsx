'use client';

import React from 'react';
import { useFollowList } from './FollowList.hook';
import { FollowListView } from './FollowList.view';

type FollowListProps = {
  userId: string;
};

export const FollowList: React.FC<FollowListProps> = (
  { userId }
): JSX.Element => {
  const viewProps = useFollowList({ userId });
  return <FollowListView {...viewProps} />;
};

export default FollowList;