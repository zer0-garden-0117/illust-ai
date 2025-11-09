'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Text, Pill, Skeleton, ActionIcon, Space, Menu, Flex, Loader } from '@mantine/core';
import { IconCube, IconEdit, IconHeart, IconHeartFilled, IconLoader, IconMenu, IconMenu2, IconPencilCode, IconShare, IconTrash } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../ImageCard/ImageCard';
import { useDisclosure } from '@mantine/hooks';
import { WorkModal } from '../WorkModal/WorkModal';
import { SkeltonIcon } from '../SkeltonIcon/SkeltonIcon';
import { WorkActionGroup } from './WorkActionGroup';

type PostedWorkViewProps = {
  workId: string;
  imageData: ApiWorkWithTag | undefined;
  isSubmitting: boolean;
  handleEditClick: (workId: string) => void;
  handleDeleteClick: (workId: string) => void;
  handleUserClick: (customUserId: string | undefined) => void;
  handleLikeClick: (workId: string) => void;
  handleTagClick: (tag: string) => void;
};

export const PostedWorkView = memo(function PostedWorkViewComponent({
  workId,
  imageData,
  isSubmitting,
  handleEditClick,
  handleDeleteClick,
  handleUserClick,
  handleLikeClick,
  handleTagClick
}: PostedWorkViewProps): JSX.Element {
  const [opened, { open, close }] = useDisclosure(false);

  const renderDescription = (description: string | undefined) => {
    if (!description) return null;
    const tokens = description.split(/(\s+)/);

    return tokens.map((token, index) => {
      if (/^\s+$/.test(token)) {
        return token;
      }
      if (token.startsWith('#') && token.length > 1) {
        const tag = token.slice(1);
        return (
          <Text
            key={index}
            span
            c="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => handleTagClick(tag)}
          >
            {token}
          </Text>
        );
      }
      return <React.Fragment key={index}>{token}</React.Fragment>;
    });
  };

  return (
    <>
      <Card withBorder>
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {/* 画像表示 */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
            <Center>
              <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
              {imageData?.apiWork?.thumbnailImgUrl ? (
                <div>
                  {/* いいね、シェア、メニュー */}
                  <WorkActionGroup
                    workId={workId}
                    workCustomUserId={imageData?.apiWork?.customUserId}
                    thumbnailImgUrl={imageData?.apiWork?.thumbnailImgUrl}
                    isLiked={imageData?.apiWork?.isLiked}
                    isSubmitting={isSubmitting}
                    onOpen={open}
                    onLikeClick={handleLikeClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                  />
                  {/* キャプションを表示 */}
                  <Text mt="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {renderDescription(imageData?.apiWork?.description)}
                  </Text>
                  {/* 画像のいいね数 */}
                  <Space h="xs" />
                  <Group gap={"5px"}>
                    <IconHeartFilled size={16} color='var(--mantine-color-gray-6)'/>
                    <Text fz="sm" c="dimmed">{imageData?.apiWork?.likes}</Text>
                  </Group>
                  {/* 投稿日時 */}
                  {imageData?.apiWork?.postedAt ? (
                    <Text fz="sm" color="dimmed">
                    <span>
                      {new Date(imageData?.apiWork?.postedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        weekday: 'short',
                      })}
                    </span>
                    </Text>
                  ) : (
                    <Skeleton width={90} height={10} radius="sm" />
                  )}
                </div>
              ) : (
                <>
                {/* 画像がまだ読み込まれていない場合のスケルトン表示 */}
                <Skeleton height="100%" />
                </>
              )}
              </AspectRatio>
            </Center>
          </Grid.Col>

          {/* 画像のメタデータ */}
          <Grid.Col
            span={{ base: 12, sm: 6, lg: 6 }}
          >
            {/* ユーザー */}
            <Group gap="sm" mb="md">
              <SkeltonIcon
                profileImageUrl={imageData?.apiWork?.profileImageUrl}
                width={40}
                height={40}
                marginTop={0}
                isClickable={!!imageData?.apiWork?.customUserId}
                onClick={() => handleUserClick(imageData?.apiWork?.customUserId)}
              />
              <Flex direction="column" align="flex-start">
                <Text
                  fz="sm"
                  fw={500}
                  style={{ cursor: 'pointer', display: 'inline' }}
                  onClick={() => handleUserClick(imageData?.apiWork?.customUserId)}
                >
                  {(() => {
                    if (!imageData?.apiWork?.userName) return ' ';
                    const noNewline = imageData.apiWork.userName.replace(/\r?\n/g, '');
                    return noNewline.length > 10 ? noNewline.slice(0, 10) + '...' : noNewline;
                  })()}
                </Text>
                <Text
                  fz="xs"
                  c="dimmed"
                  style={{ cursor: 'pointer', lineHeight: 1 }}
                  onClick={() => handleUserClick(imageData?.apiWork?.customUserId)}
                >
                  @{imageData?.apiWork?.customUserId}
                </Text>
              </Flex>
            </Group>

            {/* モデルの選択 */}
            <Group gap={"5px"} mb="5px">
              <IconCube size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>モデル</Text>
            </Group>
            {imageData?.apiWork?.status ? (
              <Pill mb="md">
                <Group gap={"5px"}>
                  {imageData?.apiWork?.model}
                </Group>
              </Pill>
            ) : (
              <Skeleton 
                mb="md"
                height={22}
                width={"80px"}
                radius={"xl"}
              />
            )}

            {/* プロンプト */}
            <Group gap={"5px"} mb="5px">
              <IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>プロンプト</Text>
            </Group>
            {imageData?.apiWork?.prompt ? (
              <Textarea
                mb="md"
                rows={5}
                minRows={5}
                maxRows={5}
                readOnly
                value={imageData?.apiWork?.prompt || ""}
              />
            ) : (
              <Skeleton 
                mb="md"
                height={121.438}
                width={"100%"}
                radius={"md"}
              />
            )}

            {/* ネガティブプロンプト */}
            <Group gap={"5px"} mb="5px">
              <IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>ネガティブプロンプト</Text>
            </Group>
            {imageData? (
              <Textarea
                mb="md"
                rows={5}
                minRows={5}
                maxRows={5}
                readOnly
                value={imageData?.apiWork?.negativePrompt || ""}
              />
            ) : (
              <Skeleton 
                mb="md"
                height={121.438}
                width={"100%"}
                radius={"md"}
              />
            )}
          </Grid.Col>
        </Grid>
      </Card>

      {/* モーダルで画像拡大表示 */}
      <WorkModal opened={opened} onClose={close} imageUrl={imageData?.apiWork?.titleImgUrl} />
    </>
  );
});
PostedWorkView.displayName = 'PostedWorkView';