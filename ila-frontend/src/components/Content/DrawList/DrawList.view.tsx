'use client';

import React, { memo } from 'react';
import { Card, Group, Text } from '@mantine/core';

type DrawListViewProps = {
};

export const DrawListView = memo(function WorkViewComponent({
}: DrawListViewProps): JSX.Element {

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700} mb="xs">
          生成履歴
        </Text>
      </Group>
    </Card>
  );
});
DrawListView.displayName = 'DrawListView';