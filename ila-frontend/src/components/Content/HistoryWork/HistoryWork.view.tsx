'use client';

import React, { memo } from 'react';
import { Group, Text, Card, Grid, Image, Button, Pill, Textarea, Radio } from '@mantine/core';
import { DateTimePicker, TimeInput } from '@mantine/dates';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { RiHashtag, RiUserLine, RiFileLine, RiStackLine } from "react-icons/ri";
import { GoDownload } from "react-icons/go";
import { CustomPill } from '@/components/Common/CustomPill/CustomPill';
import { IconAi, IconCube, IconKarate, IconPencil, IconPencilCode, IconRobot } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';

type HistoryWorkViewProps = {
  workId: string;
};

export const HistoryWorkView = memo(function WorkViewComponent({
  workId
}: HistoryWorkViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  return (
    <>
  
      <Card>
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {/* 画像表示 */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image/>
            </div>
          </Grid.Col>

          {/* 画像のメタデータ */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>

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
      </Card>
    </>
  );
});
HistoryWorkView.displayName = 'HistoryWorkView';