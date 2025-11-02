'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Loader, Space, Box } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../DrawHistory/ImageCardsForHistory/ImageCardsForHistory';
import { UseFormReturnType } from '@mantine/form';
import { PostWorkValues } from './PostForm.hook';

type PostFormViewProps = {
  form: UseFormReturnType<PostWorkValues>;
  workId: string;
  imageData: ApiWorkWithTag | undefined;
  isSubmitting: boolean;
  isPosted: boolean;
  handlePostClick: (values: PostWorkValues) => Promise<void>,
  handleConfirmClick: () => void;
};

export const PostFormView = memo(function WorkViewComponent({
  form,
  workId,
  imageData,
  isSubmitting,
  isPosted,
  handlePostClick,
  handleConfirmClick
}: PostFormViewProps): JSX.Element {
  console.log('isSubmitting:', isSubmitting);
  console.log('isPosted:', isPosted);
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
            <form onSubmit={form.onSubmit(handlePostClick)}>
            <Textarea
              label={<Group gap={"5px"}><IconPencil size={20} color='var(--mantine-color-blue-6)'/>キャプション</Group>}
              placeholder="キャプションを入力してください。#でタグ付けできます。例: #黒髪 #白背景"
              {...form.getInputProps('description')}  
              mb="md"
              rows={5}
              minRows={5}
              maxRows={5}
              disabled={isSubmitting || isPosted}
            />

          {/* サブミットボタン */}
          <Group justify="flex-end" mt="md">
          {/* isPostedがtrueの時はボタンを表示 */}
            {isPosted && (
              <>
              <Space h="md" />
                <Button
                  type="submit"
                  radius={"xl"}
                  w="fit-content"
                  onClick={handleConfirmClick}
                  variant='outline'
                >
                  投稿の確認
                </Button>
              </>
            )}
            <Button
              type="submit"
              radius={"xl"}
              w="fit-content"
              disabled={isSubmitting || isPosted}
            >
              {/* isSubmittingがtrueの時はLoaderを表示、isPostedがtrueの時は"投稿完了"と表示 */}
              {isSubmitting ? (
                <Group gap="xs" align="center">
                  <span>投稿中…</span>
                  <Loader size="xs" color='gray'/>
                </Group>
              ) : isPosted ? (
                <Group gap="xs" align="center">
                  <span>投稿完了</span>
                  <IconCheck size={20} />
                </Group>
              ) : (
                '投稿'
              )}
            </Button>
          </Group>
          </form>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
});
PostFormView.displayName = 'PostFormView';