'use client';

import React, { memo } from 'react';
import { Group, Avatar, Text, Card, Space, ActionIcon, Stack, Pagination, Divider, Skeleton, Flex } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import { FollowUsersGetResult } from '@/apis/openapi/users/useFollowUsersGet';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { SkeltonIcon } from '../SkeltonIcon/SkeltonIcon';

type FollowListViewProps = {
  page: number;
  userData: UsersGetResult | undefined
  followUserData: FollowUsersGetResult | undefined;
  updateUserAndFollowUser: () => void;
  handlePageChange: (page: number) => void;
  handleUserCardClick: (customUserId: string | undefined) => void;
  handleArrowLeftClick: () => void;
};

export const FollowListView = memo(function WorkViewComponent({
  page,
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
    >
      <Card.Section withBorder />
        <Space h={10} />
        <Group align="center" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
            <SkeltonIcon
              profileImageUrl={item!.profileImageUrl}
              width={40}
              height={40}
              marginTop={0}
              isClickable={!!item.customUserId}
              onClick={() => handleUserCardClick(item.customUserId)}
            />
            <Flex direction="column" align="flex-start">
              <Text
                fz="sm"
                fw={500}
                style={{ cursor: 'pointer' }}
                onClick={() => handleUserCardClick(item.customUserId)}
              >
                {(() => {
                  if (!item!.userName) return ' ';
                  const noNewline = item!.userName.replace(/\r?\n/g, '');
                  return noNewline.length > 10 ? noNewline.slice(0, 10) + '...' : noNewline;
                })()}
              </Text>
              <Text
                fz="xs"
                c="dimmed"
                style={{ cursor: 'pointer' }}
                onClick={() => handleUserCardClick(item.customUserId)}
              >
                @{item!.customUserId}
              </Text>
              <Text
                fz="xs"
                style={{ cursor: 'pointer' }}
                onClick={() => handleUserCardClick(item.customUserId)}
              >
                {(() => {
                  if (!item!.userProfile) return ' ';
                  const noNewline = item!.userProfile.replace(/\r?\n/g, '');
                  return noNewline.length > 10 ? noNewline.slice(0, 10) + '...' : noNewline;
                })()}
              </Text>
            </Flex>
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
  const isLoading = !followUserData?.follows;

  return (
    <>
      <Card withBorder padding="md" radius="md">
        <Group gap={10} wrap="nowrap" style={{ position: 'relative', width: 'fit-content' }}>
          <ActionIcon variant="subtle" color="gray" onClick={handleArrowLeftClick}>
            <IconArrowNarrowLeft color="black" />
          </ActionIcon>
          <Flex direction="column">
          <Skeleton visible={!userData} radius="xl" height={30} width={100}>
          <Text ta="left" fz="xl" fw={500}>
            {(() => {
              const name = userData?.userName ?? '';
              const noNewline = name.replace(/\r?\n/g, '');
              return noNewline.length > 20 ? noNewline.slice(0, 20) + '...' : (noNewline || ' ');
            })()}
            </Text>
          </Skeleton>
          <Skeleton visible={!userData} radius="xl" width={80}>
            <Text ta="left" fz="xs" c="dimmed">
              @{userData?.customUserId}
            </Text>
          </Skeleton>
          </Flex>
        </Group>
        <Space h={15} />
        <Stack gap="0px">
          {isLoading ? (
            // Skeleton 表示
              <Card padding="md">
                <Card.Section withBorder />
                <Group align="center" justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <SkeltonIcon
                      profileImageUrl={undefined}
                      width={30}
                      height={30}
                      marginTop={20}
                      isClickable={false}
                      onClick={() => {}}
                    />
                    <div style={{ flex: 1 }}>
                      <Skeleton height={12} width="100" mt={12} />
                      <Skeleton height={10} width="80" mt={10} />
                      <Skeleton height={10} width="80" mt={10} />
                    </div>
                  </Group>
                  <Skeleton height={30} width={70} radius="xl" />
                </Group>
              </Card>
            ) : (
            items
          )}
        </Stack>
        <Space h={20} />
        <Pagination value={page} total={Math.ceil((followUserData?.totalFollowCount ?? 0) / 10)} radius="md" onChange={handlePageChange}/>
      </Card>
    </>
  );
});
FollowListView.displayName = 'FollowListView';