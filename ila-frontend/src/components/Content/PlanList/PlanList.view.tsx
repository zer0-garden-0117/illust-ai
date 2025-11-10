'use client';

import React, { memo } from 'react';
import { Button, Card, Center, Group, List, SimpleGrid, Space, Text } from '@mantine/core';
import { PlanData } from './PlanList.hook';
import { IconAlarm, IconCoinYen, IconMoneybag, IconPencilCode, IconPhoto, IconSparkles } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

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
  const { user } = useFirebaseAuthContext();

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700}>
          プランの変更
        </Text>
      </Group>
      <Space h="md" />
      {/* プランリスト */}
      <SimpleGrid cols={{ base: 2, sm: 2, md: 2, lg: 2, xl: 2 }} spacing={{ base: 10 }}>
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
            <Text fz="sm" mb="sm">¥<Text span fz="sm" fw={700}>{plan.price}</Text></Text>

            {/* 生成回数 */}
            <Group gap={"5px"} mb="5px">
              <IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                画像生成
              </Text>
            </Group>
            <Text fz="sm" mb="sm"><Text span fz="sm" fw={700}>{plan.illustNum}</Text>回/日</Text>

            {/* 生成履歴 */}
            <Group gap={"5px"} mb="5px">
              <IconAlarm size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                生成履歴
              </Text>
            </Group>
            <Text fz="sm" mb="sm"><Text span fz="sm" fw={700}>{plan.illustHistoryDays}</Text>日保存</Text>
            {/* 購入ボタン */}
            <Center>
            {/* plan.idがfreeの場合はボタンを表示しない */}
            {plan.id !== 'free' && user && (
            <Button 
              color="blue" 
              radius="xl"
              onClick={
                // user.planがFreeの場合は、購入。Free以外の場合はプラン変更。
                user?.plan === 'Free'
                  ? () => handleSubscriptionClick(plan.id)
                  : () => handleSubscriptionChangeClick()
              }
              style={{ display: 'inline-flex', width: 'fit-content' }}
            >
              {/* user.planがFreeの場合は、購入。 */}
              {user?.plan === 'Free' ? '購入' : '解約'}
            </Button>
            )}
            </Center>

          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
});

PlanListView.displayName = 'PlanListView';