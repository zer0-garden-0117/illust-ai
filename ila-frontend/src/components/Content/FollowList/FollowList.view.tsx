'use client';

import React, { memo } from 'react';
import { Group, Avatar, Text, Card, Space, ActionIcon, Stack, Pagination } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import { FollowUsersGetResult } from '@/apis/openapi/users/useFollowUsersGet';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';

type FollowListViewProps = {
  userData: UsersGetResult | undefined
  followUserData: FollowUsersGetResult | undefined;
  updateUserAndFollowUser: () => void;
  handlePageChange: (page: number) => void;
};

export const FollowListView = memo(function WorkViewComponent({
  userData,
  followUserData,
  updateUserAndFollowUser,
  handlePageChange,
}: FollowListViewProps): JSX.Element {

  const items = followUserData?.follows?.map((item) => (
    <Card key={item.customUserId} padding="md">
      <Group align="flex-start" justify="space-between" wrap="nowrap">
        <Group gap="sm">
          <Avatar size={40} src={item!.profileImageUrl} radius={40} />
          <div>
            <Text fz="sm" fw={500}>{item!.userName}</Text>
            <Text fz="xs" c="dimmed">@{item!.customUserId}</Text>
            <Text fz="xs">
              {item!.userProfile &&
                (() => {
                  const noNewline = item!.userProfile.replace(/\r?\n/g, '');
                  return noNewline.length > 5 ? noNewline.slice(0, 5) + '...' : noNewline;
                })()}
            </Text>
          </div>
        </Group>

        <FollowButton
          isFollowState={item!.isFollowing}
          userId={item!.userId}
          updateUser={updateUserAndFollowUser}
        />
      </Group>
    </Card>
  ));

  return (
    <>
      <Card withBorder padding="md" radius="md">
        <Group gap={10} style={{ position: 'relative', width: 'fit-content' }}>
          <ActionIcon variant="subtle" color="gray" onClick={() => {}}>
            <IconArrowNarrowLeft color="black" />
          </ActionIcon>
          <Text>@{userData?.customUserId}</Text>
        </Group>
        <Space h={15} />
        <Stack gap="0px">
          {items}
        </Stack>
        <Space h={20} />
        <Pagination total={Math.ceil((followUserData?.totalFollowCount ?? 0) / 10)} radius="md" onChange={handlePageChange}/>
      </Card>
    </>
  );
});
FollowListView.displayName = 'FollowListView';