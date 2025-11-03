'use client';

import React, { memo } from 'react';
import { Card, Group, Pagination, SimpleGrid, Skeleton, Space, Text } from '@mantine/core';
import { ImageCardsForHistory } from '@/components/Content/CreateHistory/ImageCardsForHistory/ImageCardsForHistory';
import { UsersWorksGetResult } from "@/apis/openapi/users/useUsersWorksGet";

type CreateHistoryViewProps = {
  page: number;
  userWorksData: UsersWorksGetResult | undefined;
  handlePageChange: (page: number) => void;
};

export const CreateHistoryView = memo(function WorkViewComponent({
  page,
  userWorksData,
  handlePageChange
}: CreateHistoryViewProps): JSX.Element {

  return (
    <>
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700} mb="xs">
          生成履歴
        </Text>
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
        {!userWorksData &&
          Array.from({ length: 12 }).map((_, idx) => (
            <ImageCardsForHistory key={idx} data={{}} index={idx} />
          ))
        }
        {userWorksData?.works?.map((work, idx) => (
          <ImageCardsForHistory key={work.apiWork?.workId} data={work} index={idx} />
        ))}
      </SimpleGrid>
    </Card>
    <Space h={20} />
    <Pagination value={page} total={Math.ceil((userWorksData?.totalWorksCount ?? 0) / 12)} radius="md" onChange={handlePageChange}/>
    </>
  );
});
CreateHistoryView.displayName = 'CreateHistoryView';