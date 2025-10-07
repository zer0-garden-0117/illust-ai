'use client';

import React, { memo } from 'react';
import { Button, Card, Center, Group, List, SimpleGrid, Space, Text } from '@mantine/core';
import { PlanData } from './PlanList.hook';
import { IconAlarm, IconCoinYen, IconMoneybag, IconPencilCode, IconPhoto, IconSparkles } from '@tabler/icons-react';

type PlanListViewProps = {
  planData: PlanData[];
  handleSubscriptionClick: (plan: string) => void
  handleSubscriptionChangeClick: () => void
};

export const PlanListView = memo(function WorkViewComponent({
  planData,
  handleSubscriptionClick,
  handleSubscriptionChangeClick
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
      <SimpleGrid cols={{ base: 2, sm: 3, md: 3, lg: 3, xl: 3 }} spacing={{ base: 10 }}>
        {planData.map((plan) => (
          <Card key={plan.id} shadow="sm" padding="lg" radius="md" withBorder>

            {/* プラン名 */}
            <Group mb={"sm"} gap={"3px"}>
              <Text fz="lg" fw={700}>{plan.name}</Text>
              {plan.isRecommended && (
                <Group gap={"1px"}>
                <Text fz="10px" c="orange" fw={700}>オススメ</Text>
                <IconSparkles size={"14px"} color='orange'/>
                </Group>
              )}
            </Group>

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
            <Center>
            <Button 
              color="blue" 
              radius="md"
              // onClick={() => handleSubscriptionClick(plan.id)}
              onClick={() => handleSubscriptionChangeClick()}
              style={{ display: 'inline-flex', width: 'fit-content' }}
            >
              変更
            </Button>
            </Center>

          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
});

PlanListView.displayName = 'PlanListView';