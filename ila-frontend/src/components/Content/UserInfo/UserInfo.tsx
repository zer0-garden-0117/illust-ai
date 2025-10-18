'use client';

import React from 'react';
import { useUserInfo } from './UserInfo.hook';
import { UserInfoView } from './UserInfo.view';

type UserInfoProps = {
  userId: string;
  tab: string;
};

export const UserInfo: React.FC<UserInfoProps> = (
  { userId, tab }
): JSX.Element => {
  const viewProps = useUserInfo({ userId, tab });
  return <UserInfoView {...viewProps} />;
};

export default UserInfo;