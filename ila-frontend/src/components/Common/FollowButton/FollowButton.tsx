'use client';

import React from 'react';
import { useFollowButton } from './FollowButton.hook';
import FollowButtonView from './FollowButton.view';

type FollowButtonProps = {
  customUserId?: string;
};

export const FollowButton: React.FC<FollowButtonProps> = (
  { customUserId }
): JSX.Element => {
  const viewProps = useFollowButton({ customUserId });
  return <FollowButtonView {...viewProps} />;
};

export default FollowButton;