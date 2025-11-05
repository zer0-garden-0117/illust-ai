'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Loader } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../ImageCard/ImageCard';

type PostCompletedViewProps = {
  workId: string;
  imageData: ApiWorkWithTag | undefined;
};

export const PostCompletedView = memo(function WorkViewComponent({
  workId,
  imageData,
}: PostCompletedViewProps): JSX.Element {
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

          {/* サブミットボタン */}
          <Center>
            <Button
              radius={"xl"}
              w="fit-content"
            >
            </Button>
          </Center>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
});
PostCompletedView.displayName = 'PostCompletedView';