'use client';

import React from 'react';
import { useFollowButton } from './FollowButton.hook';
import FollowButtonView from './FollowButton.view';

type FollowButtonProps = {
  customUserId?: string;
  updateUser?: () => void;
};

export const FollowButton: React.FC<FollowButtonProps> = (
  { customUserId, updateUser }
): JSX.Element => {
  const viewProps = useFollowButton({ customUserId, updateUser });
  return <FollowButtonView {...viewProps} />;
};

export default FollowButton;