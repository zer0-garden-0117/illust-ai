import { Image, Skeleton } from '@mantine/core';
import React from 'react';

export const SkeltonIcon: React.FC<
{
  profileImageUrl?: string
  width?: number
  height?: number
  marginTop?: number
  isUserDataLoading?: boolean
  isClickable?: boolean
  onClick: () => void
}
> = ({ profileImageUrl, width, height, marginTop, isUserDataLoading = false, isClickable = true, onClick }) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: '50%',
        overflow: 'hidden',
        marginTop: marginTop,
        cursor: isClickable ? 'pointer' : 'default',
      }}
      // onClickはisClickableがtrueかつ!profileImageUrl || isUserDataLoadingがfalseの場合のみ有効化
      onClick={isClickable ? onClick : undefined}
    >
      <Skeleton visible={!profileImageUrl || isUserDataLoading} height={height} width={width} radius="50%">
        <Image
          key={profileImageUrl}
          src={profileImageUrl}
          alt="profile"
          fit="cover"
        />
      </Skeleton>
    </div>
  );
};