'use client';

import React, { memo } from 'react';
import { Button, Card, Group, List, SimpleGrid, Space, Text } from '@mantine/core';
import { PlanData } from './PlanList.hook';
import { IconAlarm, IconCoinYen, IconMoneybag, IconPencilCode, IconPhoto } from '@tabler/icons-react';

type PlanListViewProps = {
  planData: PlanData[];
  handleSubscriptionClick: () => void
};

export const PlanListView = memo(function WorkViewComponent({
  planData,
  handleSubscriptionClick
}: PlanListViewProps): JSX.Element {

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700}>
          プランの変更
        </Text>
      </Group>
      <Space h="md" />
      {/* プランリスト */}
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 10 }}>
        {planData.map((plan) => (
          <Card key={plan.id} shadow="sm" padding="lg" radius="md" withBorder>

            {/* プラン名 */}
            <Text fz="lg" fw={700} mb="sm">{plan.name}</Text>

            {/* 月額 */}
            <Group gap={"5px"} mb="5px">
              <IconCoinYen size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                月額
              </Text>
            </Group>
            <Text fz="sm" mb="sm">¥{plan.price}</Text>

            {/* 生成回数 */}
            <Group gap={"5px"} mb="5px">
              <IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                画像生成
              </Text>
            </Group>
            <Text fz="sm" mb="sm">{plan.illustNum}回/日</Text>

            {/* 生成履歴 */}
            <Group gap={"5px"} mb="5px">
              <IconAlarm size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                生成履歴
              </Text>
            </Group>
            <Text fz="sm" mb="sm">{plan.illustHistoryDays}日保存</Text>

            {/* 購入ボタン */}
            <Button 
              color="blue" 
              radius="md"
              onClick={handleSubscriptionClick}
            >
              このプランに変更
            </Button>

          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
});

PlanListView.displayName = 'PlanListView';