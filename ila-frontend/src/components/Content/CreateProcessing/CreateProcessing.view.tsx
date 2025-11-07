'use client';

import React, { memo } from 'react';
import { Group, Card, Image, AspectRatio, Center, Button, Notification, Space, Skeleton } from '@mantine/core';
import { IconCheck, IconPencilCode } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../ImageCard/ImageCard';

type CreateProcessingViewProps = {
  imageData: ApiWorkWithTag | undefined;
  handleLaterClick: () => void;
  handleHistoryClick: () => void;
  handlePostClick: (workId: string | undefined) => void;
  handleWorkClick: (workId: string | undefined) => void;
};

export const CreateProcessingView = memo(function WorkViewComponent({
  imageData,
  handleLaterClick,
  handleHistoryClick,
  handlePostClick,
  handleWorkClick,
}: CreateProcessingViewProps): JSX.Element {
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
          onClick={imageData?.apiWork?.status === "created" ? handleHistoryClick : handleLaterClick}
        >
          {/* imageData?.statusが"created"の時は生成履歴、それ以外はあとで見る */}
          {imageData?.apiWork?.status === "created" ? "生成履歴" : "あとで見る"}
        </Button>
      </Group>
      <Space h="md" />

      {/* 説明 */}
      <Notification
        // imageData?.statusが"created"の時はCreated!、それ以外はCreating...
        title={imageData?.apiWork?.status === "created" ? "Created!" : "Creating..."}
        // imageData?.statusが"created"の時だけloadingをfalseにする
        loading={imageData?.apiWork?.status === "created" ? false : true}
        // imageData?.statusが"created"の時だけiconを表示
        icon={imageData?.apiWork?.status === "created" ? <IconCheck size={20} /> : null}
        withCloseButton={false}
        style={{ boxShadow: 'none' }}
        withBorder
      >
        {/* imageData?.statusが"created"の時は生成完了！、それ以外はイラストを生成中です。しばらくお待ちください。 */}
        {imageData?.apiWork?.status === "created" ? "イラストの生成が完了しました。" : "イラストを生成中です。しばらくお待ちください。"}
      </Notification>
      <Space h="xl" />

      {/* 画像プレビュー */}
      <Center>
        <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
        {imageData?.apiWork?.thumbnailImgUrl ? (
          <Image
            src={imageData.apiWork.thumbnailImgUrl}
            onClick={() => handleWorkClick(imageData?.apiWork?.workId)}
            style={{ cursor: 'pointer' }}
            alt=""
          />
        ) : (
          <Skeleton height="100%" />
        )}
        </AspectRatio>
      </Center>
      <Space h="md" />

      {/* 画像の投稿ボタン */}
      {/* imageData?.statusが"created"の時だけ投稿するを表示 */}
      {imageData?.apiWork?.status === "created" && (
        <Center>
          <Button
            radius={"xl"}
            w="fit-content"
            onClick={() => handlePostClick(imageData?.apiWork?.workId)}
          >
            {"投稿する"}
          </Button>
        </Center>
      )}
    </Card>
    </>
  );
});
CreateProcessingView.displayName = 'CreateProcessingView';