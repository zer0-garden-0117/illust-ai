'use client';

import React, { memo } from 'react';
import { Button, Card, Center, Group, List, SimpleGrid, Space, Text } from '@mantine/core';
import { BoostData } from './BoostList.hook';
import { IconAlarm, IconCoinYen, IconMoneybag, IconPencilCode, IconPhoto, IconRocket, IconSparkles } from '@tabler/icons-react';

type BoostListViewProps = {
  boostData: BoostData[];
  handleSubscriptionClick: (plan: string) => void
  handleSubscriptionChangeClick: () => void
};

export const BoostListView = memo(function WorkViewComponent({
  boostData,
  handleSubscriptionClick,
  handleSubscriptionChangeClick
}: BoostListViewProps): JSX.Element {

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700}>
          ブーストを追加
        </Text>
      </Group>
      <Space h="md" />
      {/* プランリスト */}
      <SimpleGrid cols={{ base: 2, sm: 2, md: 2, lg: 2, xl: 2 }} spacing={{ base: 10 }}>
        {boostData.map((plan) => (
          <Card key={plan.id} shadow="sm" padding="lg" radius="md" withBorder>

            {/* プラン名 */}
            <Group mb={"sm"} gap={"3px"}>
              <Text fz="lg" fw={700}>{plan.name}</Text>
            </Group>

            {/* 料金 */}
            <Group gap={"5px"} mb="5px">
              <IconCoinYen size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                料金
              </Text>
            </Group>
            <Text fz="sm" mb="sm">¥<Text span fz="sm" fw={700}>{plan.price}</Text></Text>

            {/* 増える数 */}
            <Group gap={"5px"} mb="5px">
              <IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                画像生成
              </Text>
            </Group>
            <Text fz="sm" mb="sm">+<Text span fz="sm" fw={700}>{plan.increaseNum}</Text>回/日</Text>

            {/* 有効期間 */}
            <Group gap={"5px"} mb="5px">
              <IconAlarm size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                有効期間
              </Text>
            </Group>
            <Text fz="sm" mb="sm"><Text span fz="sm" fw={700}>{plan.termDays}</Text>日</Text>

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

BoostListView.displayName = 'BoostListView';