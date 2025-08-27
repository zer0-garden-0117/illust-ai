'use client';

import React from 'react';
import { useUserInfo } from './UserInfo.hook';
import { UserInfoView } from './UserInfo.view';

type UserInfoProps = {
  userId: string;
};

export const Work: React.FC<UserInfoProps> = (
  { userId }
): JSX.Element => {
  const viewProps = useUserInfo({ userId });
  return <UserInfoView {...viewProps} />;
};

export default Work;