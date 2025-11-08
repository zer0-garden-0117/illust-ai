'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Text, Pill, Skeleton, Modal } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconCube, IconLock, IconPencilCode, IconPhoto } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../ImageCard/ImageCard';
import { useDisclosure } from '@mantine/hooks';
import { WorkModal } from '../WorkModal/WorkModal';
import { ForbiddenCard } from '../ForbiddenCard/ForbiddenCard';

type HistoryWorkViewProps = {
  workId: string;
  imageData: ApiWorkWithTag | undefined;
  handlePostClick: (workId: string) => void;
};

export const HistoryWorkView = memo(function HistoryWorkViewComponent({
  workId,
  imageData,
  handlePostClick,
}: HistoryWorkViewProps): JSX.Element {
  const [opened, { open, close }] = useDisclosure(false);

  if (imageData && !imageData.apiWork?.isMine) {
    return <ForbiddenCard alertText='イラストを生成したユーザー以外は表示できません。' />;
  }

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
                <Image
                  src={imageData?.apiWork?.thumbnailImgUrl}
                  style={{ cursor: 'pointer' }}
                  onClick={open}
                  alt=""
                />
                </div>
              ) : (
                <Skeleton height="100%" />
              )}
              </AspectRatio>
            </Center>
          </Grid.Col>

          {/* 画像のメタデータ */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>

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

            {/* 生成日時 */}
            <Group gap={"5px"} mb="5px">
              <IconClock size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>生成日時</Text>
            </Group>
            {imageData?.apiWork?.createdAt ? (
              <DateTimePicker
                withSeconds
                placeholder="Pick date and time"
                valueFormat="YYYY/MM/DD HH:mm:ss"
                value={new Date(imageData?.apiWork?.createdAt || '')}
                readOnly
                mb="md"
              />
            ) : (
              <Skeleton 
                mb="md"
                height={36}
                width={"100%"}
                radius={"md"}
              />
            )}

            {/* 有効期限 */}
            <Group gap={"5px"} mb="5px">
              <IconClock size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>履歴の有効期限</Text>
            </Group>
            {imageData?.apiWork?.expiredAt ? (
              <DateTimePicker
                withSeconds
                placeholder="Pick date and time"
                valueFormat="YYYY/MM/DD HH:mm:ss"
                value={new Date(imageData?.apiWork?.expiredAt || '')}
                readOnly
                mb="md"
              />
            ) : (
              <Skeleton 
                mb="md"
                height={36}
                width={"100%"}
                radius={"md"}
              />
            )}

          </Grid.Col>
        </Grid>

        {/* 投稿ボタン */}
        {/* imageData.isMineがtrueの時のみ表示 */}
        {imageData?.apiWork?.isMine && (
        <Center>
          <Button
            radius={"xl"}
            w="fit-content"
            onClick={() => handlePostClick(workId)}
          >
            {"投稿する"}
          </Button>
        </Center>
        )}
      </Card>

      {/* モーダルで画像拡大表示 */}
      <WorkModal opened={opened} onClose={close} imageUrl={imageData?.apiWork?.titleImgUrl} />
    </>
  );
});
HistoryWorkView.displayName = 'HistoryWorkView';