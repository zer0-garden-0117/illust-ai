'use client';

import React, { memo } from 'react';
import { Button, Group, Avatar, Text, Card, Space, ActionIcon, Stack } from '@mantine/core';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import FollowButton from '@/components/Common/FollowButton/FollowButton';

type FollowListViewProps = {
  userData: UsersGetResult | undefined;
  updateUser: () => void;
};

export const FollowListView = memo(function WorkViewComponent({
  userData,
  updateUser
}: FollowListViewProps): JSX.Element {
  // 実データに合わせて配列に差し替えてね（今はデモで2件）
  const list = [userData, userData].filter(Boolean);

  const items = list.map((item) => (
    <Card key={item!.customUserId} padding="md">
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
          updateUser={updateUser}
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
        {/* ここがTableの代わり */}
        <Stack gap="0px">
          {items}
        </Stack>
        <Space h={20} />
      </Card>
    </>
  );
});
FollowListView.displayName = 'FollowListView';