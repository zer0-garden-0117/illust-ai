import { Image, Skeleton } from '@mantine/core';
import React from 'react';

export const SkeltonIcon: React.FC<
{
  profileImageUrl?: string
  width?: number
  height?: number
  marginTop?: number
  isUserDataLoading?: boolean
}
> = ({ profileImageUrl, width, height, marginTop, isUserDataLoading = false }) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: '50%',
        overflow: 'hidden',
        marginTop: marginTop,
      }}
    >
      <Skeleton visible={!profileImageUrl || isUserDataLoading} height={height} width={width} radius="50%">
        <Image
          key={profileImageUrl}
          src={profileImageUrl || '/default-profile.png'}
          alt="profile"
          fit="cover"
        />
      </Skeleton>
    </div>
  );
};