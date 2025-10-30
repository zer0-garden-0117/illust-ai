'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button } from '@mantine/core';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { IconPencil } from '@tabler/icons-react';
import { ApiWork } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';

type WorkFormViewProps = {
  workId: string;
  imageData: ApiWork;
  handleSubmitClick: (workId: string) => void;
};

export const WorkFormView = memo(function WorkViewComponent({
  workId,
  imageData,
  handleSubmitClick,
}: WorkFormViewProps): JSX.Element {
  return (
    <>
      <Card withBorder>
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {/* 画像表示 */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
            <Center>
              <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
                <Image
                  src={imageData.thumbnailImgUrl}
                />
              </AspectRatio>
            </Center>
          </Grid.Col>

          {/* キャプション */}
          <Grid.Col
            span={{ base: 12, sm: 6, lg: 6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // 垂直方向中央
            }}
          >
            <Textarea
              label={<Group gap={"5px"}><IconPencil size={20} color='var(--mantine-color-blue-6)'/>キャプション</Group>}
              placeholder="キャプションを入力してください。ハッシュタグも使用できます。"
              mb="md"
              rows={5}
              minRows={5}
              maxRows={5}
              readOnly
            />

          {/* サブミットボタン */}
          <Center>
            <Button
              radius={"xl"}
              w="fit-content"
              onClick={() => handleSubmitClick(workId)}
            >
              {"投稿"}
            </Button>
          </Center>

          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
});
WorkFormView.displayName = 'WorkFormView';