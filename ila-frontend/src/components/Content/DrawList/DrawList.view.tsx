'use client';

import React, { memo } from 'react';
import { Card, Group, SimpleGrid, Text } from '@mantine/core';
import { ImageCardsForHistory, ImageDataOfImageCardsForHistory } from '@/components/Common/ImageCardsForHistory/ImageCardsForHistory';

type DrawListViewProps = {
  imageData: ImageDataOfImageCardsForHistory[];
};

export const DrawListView = memo(function WorkViewComponent({
  imageData,
}: DrawListViewProps): JSX.Element {

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700} mb="xs">
          生成履歴
        </Text>
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
        {imageData.map((img, idx) => (
          <ImageCardsForHistory key={img.workId} data={img} index={idx} />
        ))}
      </SimpleGrid>
    </Card>
  );
});
DrawListView.displayName = 'DrawListView';