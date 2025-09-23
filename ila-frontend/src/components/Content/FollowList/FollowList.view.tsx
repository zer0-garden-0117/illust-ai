'use client';

import React, { memo } from 'react';
import { Group, Avatar, Text, Card, Space, ActionIcon, Stack, Pagination, Divider } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import { FollowUsersGetResult } from '@/apis/openapi/users/useFollowUsersGet';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

type FollowListViewProps = {
  userData: UsersGetResult | undefined
  followUserData: FollowUsersGetResult | undefined;
  updateUserAndFollowUser: () => void;
  handlePageChange: (page: number) => void;
  handleUserCardClick: (customUserId: string | undefined) => void;
  handleArrowLeftClick: () => void;
};

export const FollowListView = memo(function WorkViewComponent({
  userData,
  followUserData,
  updateUserAndFollowUser,
  handlePageChange,
  handleUserCardClick,
  handleArrowLeftClick
}: FollowListViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();

  const items = followUserData?.follows?.map((item) => (
    <Card
      key={item.customUserId}
      padding="md"
      onClick={() => handleUserCardClick(item.customUserId)}
      style={{ cursor: 'pointer' }}
    >
      <Card.Section withBorder />
        <Space h={10} />
        <Group align="center" justify="space-between" wrap="nowrap">
          <Group gap="sm">
            <Avatar size={40} src={item!.profileImageUrl} radius={40} />
            <div>
              <Text fz="sm" fw={500}>{item!.userName}</Text>
              <Text fz="xs" c="dimmed">@{item!.customUserId}</Text>
              <Text fz="xs">
                {(() => {
                  if (!item!.userProfile) return ' ';
                  const noNewline = item!.userProfile.replace(/\r?\n/g, '');
                  return noNewline.length > 5 ? noNewline.slice(0, 5) + '...' : noNewline;
                })()}
              </Text>
            </div>
          </Group>
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* user.userIdとitem.userIdが一致する場合にフォローボタンを非表示 */}
            {user?.userId === item?.userId ? null : (
              <FollowButton
                isFollowState={item!.isFollowing}
                userId={item!.userId}
                updateUser={updateUserAndFollowUser}
              />
            )}
        </div>
      </Group>
    </Card>
  ));

  return (
    <>
      <Card withBorder padding="md" radius="md">
        <Group gap={10} style={{ position: 'relative', width: 'fit-content' }}>
          <ActionIcon variant="subtle" color="gray" onClick={handleArrowLeftClick}>
            <IconArrowNarrowLeft color="black" />
          </ActionIcon>
          <div>
            <Text ta="left" fz="xl" fw={500}>
              {userData?.userName}
            </Text>
            <Text ta="left" fz="xs" c="dimmed">
              @{userData?.customUserId}
            </Text>
          </div>
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