'use client';

import React from 'react';
import { useFollowButton } from './FollowButton.hook';
import FollowButtonView from './FollowButton.view';

type FollowButtonProps = {
  isFollowState?: boolean;
  userId?: string;
  updateUser?: () => void;
};

export const FollowButton: React.FC<FollowButtonProps> = (
  { isFollowState, userId, updateUser }
): JSX.Element => {
  const viewProps = useFollowButton({ isFollowState, userId, updateUser });
  return <FollowButtonView {...viewProps} />;
};

export default FollowButton;