'use client';

import React, { memo } from 'react';
import { Button, Card, Center, Group, List, SimpleGrid, Space, Text } from '@mantine/core';
import { BoostData } from './BoostList.hook';
import { IconAlarm, IconCoinYen, IconMoneybag, IconPencilCode, IconPhoto, IconRocket, IconSparkles } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

type BoostListViewProps = {
  boostDatas: BoostData[];
  handleAddClick: (product: string) => void
};

export const BoostListView = memo(function WorkViewComponent({
  boostDatas,
  handleAddClick,
}: BoostListViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700}>
          ブーストの追加
        </Text>
      </Group>
      <Space h="md" />
      {/* プランリスト */}
      <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 3, xl: 3 }} spacing={{ base: 10 }}>
        {boostDatas.map((boostData) => (
          <Card key={boostData.id} shadow="sm" padding="lg" radius="md" withBorder>

            {/* プラン名 */}
            <Group mb={"sm"} gap={"3px"}>
              <Text fz="lg" fw={700}>{boostData.name}</Text>
            </Group>

            {/* 料金 */}
            <Group gap={"5px"} mb="5px">
              <IconCoinYen size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                料金
              </Text>
            </Group>
            <Text fz="sm" mb="sm">¥<Text span fz="sm" fw={700}>{boostData.price}</Text></Text>

            {/* 増える数 */}
            <Group gap={"5px"} mb="5px">
              <IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                画像生成
              </Text>
            </Group>
            <Text fz="sm" mb="sm">+<Text span fz="sm" fw={700}>{boostData.increaseNum}</Text>回/日</Text>

            {/* 有効期間 */}
            <Group gap={"5px"} mb="5px">
              <IconAlarm size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                有効期間
              </Text>
            </Group>
            <Text fz="sm" mb="sm"><Text span fz="sm" fw={700}>{boostData.termDays}</Text>日</Text>

            {/* 購入ボタン */}
            <Center>
              {user && (
                <Button 
                  color="blue" 
                  radius="xl"
                  onClick={() => handleAddClick(boostData.id)}
                  style={{ display: 'inline-flex', width: 'fit-content' }}
                >
                  購入
                </Button>
              )}
            </Center>

          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
});

BoostListView.displayName = 'BoostListView';