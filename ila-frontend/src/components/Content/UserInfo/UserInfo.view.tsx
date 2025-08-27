'use client';

import React from 'react';
import { memo } from 'react';
import { Button, Group, Avatar, Text, Loader } from '@mantine/core';

type UserInfoViewProps = {
  userId: string
};

export const UserInfoView = memo(function WorkViewComponent({
  userId
}: UserInfoViewProps): JSX.Element {
  return (
    <>
      <Text>{userId}</Text>
    </>
  );
});
UserInfoView.displayName = 'UserInfoView';