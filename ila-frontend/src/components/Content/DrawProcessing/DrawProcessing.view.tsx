'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Pill, Text, Loader, Notification, Space } from '@mantine/core';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { IconPencil, IconPencilCode } from '@tabler/icons-react';
import { ImageDataOfImageCardsForHistory } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';

type WorkFormViewProps = {
  workId: string;
  imageData: ImageDataOfImageCardsForHistory;
  handleSubmitClick: (workId: string) => void;
  handleLaterClick: () => void;
};

export const WorkFormView = memo(function WorkViewComponent({
  workId,
  imageData,
  handleSubmitClick,
  handleLaterClick
}: WorkFormViewProps): JSX.Element {
  return (
    <>
    <Card withBorder padding="md" radius="md">
      <Group justify="flex-end">
      {/* <Group justify="space-between"> */}
        {/* <Text fz="md" fw={700} mb="xs">
          イラストの生成中
        </Text> */}
        <Button
          radius={"xl"}
          variant="outline"
          size="xs"
          leftSection={
            <IconPencilCode
              size={16}
              style={{ display: 'block' }}
            />
          }
          onClick={handleLaterClick}
        >
          あとで見る
        </Button>
      </Group>

      <Space h="md" />

      {/* 説明 */}
      <Notification
        title="Creating..."
        loading
        withCloseButton={false}
        style={{ boxShadow: 'none' }}
        withBorder
      >
        イラストを生成中です。しばらくお待ちください。
      </Notification>

        <Space h="xl" />

        <Center>
          <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
            <Image
              src={imageData.titleImage}
              alt={imageData.titleImage}
            />
          </AspectRatio>
        </Center>
    </Card>
    </>
  );
});
WorkFormView.displayName = 'WorkFormView';