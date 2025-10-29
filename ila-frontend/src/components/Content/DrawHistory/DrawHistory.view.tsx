'use client';

import React, { memo } from 'react';
import { Card, Group, Pagination, SimpleGrid, Space, Text } from '@mantine/core';
import { ImageCardsForHistory } from '@/components/Content/DrawHistory/ImageCardsForHistory/ImageCardsForHistory';
import { UsersWorksGetResult } from "@/apis/openapi/users/useUsersWorksGet";

type DrawHistoryViewProps = {
  userWorksData: UsersWorksGetResult | undefined;
  handlePageChange: (page: number) => void;
};

export const DrawHistoryView = memo(function WorkViewComponent({
  userWorksData,
  handlePageChange
}: DrawHistoryViewProps): JSX.Element {

  return (
    <>
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700} mb="xs">
          生成履歴
        </Text>
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
        {userWorksData?.works?.map((work, idx) => (
          <ImageCardsForHistory key={work.workId} data={work} index={idx} />
        ))}
      </SimpleGrid>
    </Card>
    <Space h={20} />
    <Pagination total={Math.ceil((userWorksData?.totalWorksCount ?? 0) / 12)} radius="md" onChange={handlePageChange}/>
    </>
  );
});
DrawHistoryView.displayName = 'DrawHistoryView';