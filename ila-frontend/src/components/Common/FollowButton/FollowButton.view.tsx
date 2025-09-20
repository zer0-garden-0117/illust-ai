'use client';

import { Button } from '@mantine/core';
import { useState } from 'react';

type FollowButtonViewProps = {
  onFollow: () => void;
};

export default function FollowButtonView({ onFollow }: FollowButtonViewProps) {
  const [isFollow, setIsFollow] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [justFollowed, setJustFollowed] = useState(false);

  const onHandleFollow = () => {
    const nextFollow = !isFollow;
    setIsFollow(nextFollow);
    if (nextFollow) {
      setJustFollowed(true);
    }
    onFollow();
  };

  const handleMouseLeave = () => {
    setIsHover(false);
    setJustFollowed(false);
  };

  return (
    <Button
      onClick={onHandleFollow}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={handleMouseLeave}
      variant="outline"
      size="sm"
      color={
        isFollow
          ? (isHover && !justFollowed ? 'red' : 'gray')
          : 'blue'
      }
      radius="xl"
    >
      {isFollow
        ? (isHover && !justFollowed ? 'フォロー解除' : 'フォロー中')
        : 'フォロー'}
    </Button>
  );
}