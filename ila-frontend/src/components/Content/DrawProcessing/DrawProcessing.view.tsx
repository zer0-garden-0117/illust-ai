'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Pill, Text, Loader, Notification, Space, Skeleton } from '@mantine/core';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { IconPencil, IconPencilCode } from '@tabler/icons-react';
import { ApiWork } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';

type DrawProcessingViewProps = {
  imageData: ApiWork | undefined;
  handleLaterClick: () => void;
};

export const DrawProcessingView = memo(function WorkViewComponent({
  imageData,
  handleLaterClick
}: DrawProcessingViewProps): JSX.Element {
  return (
    <>
    <Card withBorder padding="md" radius="md">

      {/* あとで見るボタン */}
      <Group justify="flex-end">
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

      {/* 画像プレビュー */}
      <Center>
        <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
          <Image
            src="https://placehold.co/350x495?text=Creating..."
            alt={imageData?.thumbnailImgUrl}
          />
        </AspectRatio>
      </Center>
    </Card>
    </>
  );
});
DrawProcessingView.displayName = 'DrawProcessingView';