'use client';

import React, { memo } from 'react';
import { Group, Card, Button, Notification, Space } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

type BillCompletedViewProps = {
  productName: string;
  handleDrawClick: () => void;
};

export const BillCompletedView = memo(function WorkViewComponent({
  productName,
  handleDrawClick,
}: BillCompletedViewProps): JSX.Element {
  return (
    <>
    <Card withBorder padding="md" radius="md">
      <Notification
        title="購入完了"
        withCloseButton={false}
        style={{ boxShadow: 'none' }}
        withBorder
        icon={<IconCheck size={20} />}
      >
        {productName}の購入が完了しました
      </Notification>
      <Space h="md" />
      
      {/* 早速イラストを生成する */}
      <Group justify="flex-end" mt="md">
        <Button
          onClick={handleDrawClick}
          radius={"xl"}
        >
          早速イラストを生成
        </Button>
      </Group>
      <Space h="md" />
    </Card>
    </>
  );
});
BillCompletedView.displayName = 'BillCompletedView';