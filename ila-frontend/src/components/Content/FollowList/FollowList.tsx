'use client';

import React from 'react';
import { useFollowList } from './FollowList.hook';
import { FollowListView } from './FollowList.view';

type FollowListProps = {
  customUserId: string;
  page: number;
  followType: string;
};

export const FollowList: React.FC<FollowListProps> = (
  { customUserId, page, followType }
): JSX.Element => {
  const viewProps = useFollowList({ customUserId, page, followType });
  return <FollowListView {...viewProps} />;
};

export default FollowList;