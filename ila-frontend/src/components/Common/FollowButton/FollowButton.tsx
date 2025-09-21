'use client';

import React from 'react';
import { useFollowButton } from './FollowButton.hook';
import FollowButtonView from './FollowButton.view';

type FollowButtonProps = {
  userId?: string;
  updateUser?: () => void;
};

export const FollowButton: React.FC<FollowButtonProps> = (
  { userId, updateUser }
): JSX.Element => {
  const viewProps = useFollowButton({ userId, updateUser });
  return <FollowButtonView {...viewProps} />;
};

export default FollowButton;