'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, Radio, AspectRatio, Center, Button, Text, Pill } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { IconCube, IconLock, IconPencilCode, IconPhoto } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { ImageDataOfImageCardsForHistory } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';

type HistoryWorkViewProps = {
  workId: string;
  imageData: ImageDataOfImageCardsForHistory;
  handlePostClick: (workId: string) => void;
};

export const HistoryWorkView = memo(function WorkViewComponent({
  workId,
  imageData,
  handlePostClick,
}: HistoryWorkViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  return (
    <>
  
      <Card>
        {/* 画像の投稿ボタン */}
        <Center>
          <Button
            radius={"xl"}
            w="fit-content"
            onClick={() => handlePostClick(workId)}
          >
            {"画像を投稿する"}
          </Button>
        </Center>

        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {/* 画像表示 */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
            <Center>
              <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
                <Image
                  src={imageData.titleImage}
                  alt={imageData.titleImage}
                />
              </AspectRatio>
            </Center>
          </Grid.Col>

          {/* 画像のメタデータ */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>

            {/* 画像の状態 */}
            <Group gap={"5px"} mb="5px">
              <IconPhoto size={20} color='var(--mantine-color-blue-6)'/>
              <Text fw={500} fz={"sm"}>
                状態
              </Text>
            </Group>
            <Pill mb="md"><Group gap={"5px"}><IconLock size="15px"/>未公開</Group></Pill>

            {/* モデルの選択 */}
            <Radio.Group
              name="モデル"
              label={<Group gap={"5px"}><IconCube size={20} color='var(--mantine-color-blue-6)'/>モデル</Group>}
              mb="md"
            >
              <Group mt={"3px"}>
                <Radio value="illust-ai-v1" label="Illust-ai-v1" />
                <Radio value="illust-ai-v2" label="Illust-ai-v2(近日実装)" disabled/>
              </Group>
            </Radio.Group>

            {/* プロンプト */}
            <Textarea
              label={<Group gap={"5px"}><IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>プロンプト</Group>}
              placeholder="1girl, blonde hair, smile, ..."
              mb="md"
              rows={5}
              minRows={5}
              maxRows={5}
              readOnly
              value={"1girl, blonde hair, smile, ..."}
            />

            {/* ネガティブプロンプト */}
            <Textarea
              label={<Group gap={"5px"}><IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>ネガティブプロンプト</Group>}
              placeholder="lowres, bad anatomy, ..."
              mb="md"
              rows={5}
              minRows={5}
              maxRows={5}
              readOnly
              value={"lowres, bad anatomy, ..."}
            />

            {/* 生成日時 */}
            <DateTimePicker
              withSeconds
              label={<Group gap={"5px"}><IconClock size={20} color='var(--mantine-color-blue-6)'/>生成日時</Group>}
              placeholder="Pick date and time"
              valueFormat="YYYY/MM/DD HH:mm:ss"
              value={new Date()}
              readOnly
              mb="md"
            />

            {/* 履歴の有効期限 */}
            <DateTimePicker
              withSeconds
              label={<Group gap={"5px"}><IconClock size={20} color='var(--mantine-color-blue-6)'/>履歴の有効期限</Group>}
              placeholder="Pick date and time"
              valueFormat="YYYY/MM/DD HH:mm:ss"
              value={new Date()}
              readOnly
              mb="md"
            />

          </Grid.Col>
        </Grid>

        {/* 画像の投稿ボタン */}
        <Center>
          <Button
            radius={"xl"}
            w="fit-content"
            onClick={() => handlePostClick(workId)}
          >
            {"画像を投稿する"}
          </Button>
        </Center>
      </Card>
    </>
  );
});
HistoryWorkView.displayName = 'HistoryWorkView';