'use client';

import React from 'react';
import { useUserInfo } from './UserInfo.hook';
import { UserInfoView } from './UserInfo.view';

type UserInfoProps = {
  userId: string;
  tab: string;
  page: number;
};

export const UserInfo: React.FC<UserInfoProps> = (
  { userId, tab, page }
): JSX.Element => {
  const viewProps = useUserInfo({ userId, tab, page });
  return <UserInfoView {...viewProps} />;
};

export default UserInfo;