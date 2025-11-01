'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, Radio, AspectRatio, Center, Button, Text, Pill, Skeleton } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { IconCube, IconLock, IconPencilCode, IconPhoto } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { ApiWork } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';

type WorkViewProps = {
  workId: string;
  imageData: ApiWork;
  handlePostClick: (workId: string) => void;
};

export const WorkView = memo(function WorkViewComponent({
  workId,
  imageData,
  handlePostClick,
}: WorkViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  return (
    <>
      <Card withBorder>
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {/* 画像表示 */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
            <Center>
              <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
              {imageData?.thumbnailImgUrl ? (
                <Image
                  src={imageData?.thumbnailImgUrl}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <Skeleton height="100%" />
              )}
              </AspectRatio>
            </Center>
          </Grid.Col>

          {/* 画像のメタデータ */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>

            {/* 画像の状態 */}
            <Group gap={"5px"} mb="5px">
              <IconPhoto size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>状態</Text>
            </Group>
            {imageData?.status ? (
              <Pill mb="md">
                <Group gap={"5px"}>
                  {/* imageData?.statusがposted以外はIconLockを非表示 */}
                  {imageData?.status === "posted" ? null : <IconLock size="15px"/>}
                  {imageData?.status}
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

            {/* モデルの選択 */}
            <Group gap={"5px"} mb="5px">
              <IconCube size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>モデル</Text>
            </Group>
            {imageData?.status ? (
              <Pill mb="md">
                <Group gap={"5px"}>
                  {imageData?.model}
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
            {imageData?.prompt ? (
              <Textarea
                mb="md"
                rows={5}
                minRows={5}
                maxRows={5}
                readOnly
                value={imageData?.prompt || ""}
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
                value={imageData?.negativePrompt || ""}
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
            {imageData?.createdAt ? (
              <DateTimePicker
                withSeconds
                placeholder="Pick date and time"
                valueFormat="YYYY/MM/DD HH:mm:ss"
                value={new Date(imageData?.createdAt || '')}
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
            {imageData?.expiredAt ? (
              <DateTimePicker
                withSeconds
                placeholder="Pick date and time"
                valueFormat="YYYY/MM/DD HH:mm:ss"
                value={new Date(imageData?.expiredAt || '')}
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
        <Center>
          <Button
            radius={"xl"}
            w="fit-content"
            onClick={() => handlePostClick(workId)}
          >
            {"投稿する"}
          </Button>
        </Center>
      </Card>
    </>
  );
});
WorkView.displayName = 'WorkView';