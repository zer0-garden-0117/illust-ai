'use client';

import React, { memo } from 'react';
import { Card, Group, Pagination, SimpleGrid, Space, Text } from '@mantine/core';
import { ImageCard } from '@/components/Content/ImageCard/ImageCard';
import { UsersWorksGetResult } from "@/apis/openapi/users/useUsersWorksGet";
import { UserWorksFilterTypeQueryParam } from './UserWorksCards.hook';
import { CreateCard } from '../CreateCard/CreateCard';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

type UserWorkCardsViewProps = {
  page: number;
  customUserId: string;
  userWorksFilterType: UserWorksFilterTypeQueryParam;
  userWorksData: UsersWorksGetResult | undefined;
  handlePageChange: (page: number) => void;
};

export const UserWorkCardsView = memo(function WorkViewComponent({
  page,
  customUserId,
  userWorksFilterType,
  userWorksData,
  handlePageChange
}: UserWorkCardsViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();

  return (
    <>
    <Card withBorder padding="md" radius="md">
      {/* userWorksFilterTypeがcreatedの場合のみ表示 */}
      {userWorksFilterType === 'created' && (
      <Group justify="space-between">
        <Text fz="md" fw={700} mb="xs">
          生成履歴
        </Text>
      </Group>
      )}
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
        {!userWorksData &&
          Array.from({ length: 12 }).map((_, idx) => (
            <ImageCard key={idx} data={{}} index={idx} />
          ))
        }
        {/* userWorksFilterTypeがpostedかつ、customUserIdがuser.customUserIdと等しい場合はCreateCardを表示 */}
        {userWorksData?.works && userWorksFilterType === 'posted' && customUserId === user?.customUserId && (
          <CreateCard />
        )}
        {userWorksData?.works?.map((work, idx) => (
          <ImageCard key={work.apiWork?.workId} data={work} index={idx} />
        ))}
      </SimpleGrid>
    </Card>
    <Space h={20} />
    <Group justify='flex-end'>
      <Pagination value={page} total={Math.ceil((userWorksData?.totalWorksCount ?? 0) / 12)} radius="md" onChange={handlePageChange}/>
    </Group>
    </>
  );
});
UserWorkCardsView.displayName = 'UserWorkCardsView';