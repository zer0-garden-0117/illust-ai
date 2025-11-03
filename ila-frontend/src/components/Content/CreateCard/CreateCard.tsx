'use client';

import React, { memo } from 'react';
import { Card, Flex, Group, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export const CreateCard = memo(function CreateCard(): JSX.Element {
  const router = useRouter();

  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      style={{ backgroundColor: 'var(--mantine-color-gray-0)', cursor: 'pointer' }}
      onClick={() => {router.push('/illust/create');}}
      data-testid="create-card"
    >
      <Group style={{ height: '100%' }} justify="center">
        <Flex direction="column" align="center" justify="center">
          <IconPlus color="var(--mantine-color-blue-6)" size={30} />
          <Text fz="xs" mt="xs">
            イラストの
          </Text>
          <Text fz="xs">
            生成
          </Text>
        </Flex>
      </Group>
    </Card>
  );
});

CreateCard.displayName = 'CreateCard';
