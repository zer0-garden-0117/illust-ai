'use client';

import React, { memo } from 'react';
import { Group, Card, Image, AspectRatio, Center, Button, Notification, Space, Skeleton } from '@mantine/core';
import { IconCheck, IconPencilCode } from '@tabler/icons-react';
import { ApiWork } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';

type DrawProcessingViewProps = {
  imageData: ApiWork | undefined;
  handleLaterClick: () => void;
  handleHistoryClick: () => void;
};

export const DrawProcessingView = memo(function WorkViewComponent({
  imageData,
  handleLaterClick,
  handleHistoryClick
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
          // imageData?.statusが"created"の時はhandleHistoryClick、それ以外はhandleLaterClick
          onClick={imageData?.status === "created" ? handleHistoryClick : handleLaterClick}
        >
          {/* imageData?.statusが"created"の時は生成履歴、それ以外はあとで見る */}
          {imageData?.status === "created" ? "生成履歴" : "あとで見る"}
        </Button>
      </Group>
      <Space h="md" />

      {/* 説明 */}
      <Notification
        // imageData?.statusが"created"の時はCreated!、それ以外はCreating...
        title={imageData?.status === "created" ? "Created!" : "Creating..."}
        // imageData?.statusが"created"の時だけloadingをfalseにする
        loading={imageData?.status === "created" ? false : true}
        // imageData?.statusが"created"の時だけiconを表示
        icon={imageData?.status === "created" ? <IconCheck size={20} /> : null}
        withCloseButton={false}
        style={{ boxShadow: 'none' }}
        withBorder
      >
        {/* imageData?.statusが"created"の時は生成完了！、それ以外はイラストを生成中です。しばらくお待ちください。 */}
        {imageData?.status === "created" ? "イラストの生成が完了しました。" : "イラストを生成中です。しばらくお待ちください。"}
      </Notification>
      <Space h="xl" />

      {/* 画像プレビュー */}
      <Center>
        <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
        {imageData?.thumbnailImgUrl ? (
          <Image
            src={imageData.thumbnailImgUrl}
          />
        ) : (
          <Skeleton height="100%" />
        )}
        </AspectRatio>
      </Center>
    </Card>
    </>
  );
});
DrawProcessingView.displayName = 'DrawProcessingView';