'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';

type PostFormViewProps = {
  workId: string;
  imageData: ApiWorkWithTag | undefined;
  handleSubmitClick: (workId: string) => void;
};

export const PostFormView = memo(function WorkViewComponent({
  workId,
  imageData,
  handleSubmitClick,
}: PostFormViewProps): JSX.Element {
  return (
    <>
      <Card withBorder>
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {/* 画像表示 */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
            <Center>
              <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
                <Image
                  src={imageData?.apiWork?.thumbnailImgUrl}
                  alt=""
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
              justifyContent: 'center',
            }}
          >
            <Textarea
              label={<Group gap={"5px"}><IconPencil size={20} color='var(--mantine-color-blue-6)'/>キャプション</Group>}
              placeholder="キャプションを入力してください。#でタグ付けできます。例: #黒髪 #白背景"
              mb="md"
              rows={5}
              minRows={5}
              maxRows={5}
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
PostFormView.displayName = 'PostFormView';