'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Loader, Space, Box, Alert, Notification } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../ImageCard/ImageCard';
import { UseFormReturnType } from '@mantine/form';
import { PostWorkValues } from './EditForm.hook';
import { IoInformationSharp } from 'react-icons/io5';
import { ForbiddenCard } from '../ForbiddenCard/ForbiddenCard';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

type EditFormViewProps = {
  form: UseFormReturnType<PostWorkValues>;
  workId: string;
  imageData: ApiWorkWithTag | undefined;
  isSubmitting: boolean;
  isPosted: boolean;
  handlePostClick: (values: PostWorkValues) => Promise<void>,
  handleConfirmClick: () => void;
};

export const EditFormView = memo(function WorkViewComponent({
  form,
  workId,
  imageData,
  isSubmitting,
  isPosted,
  handlePostClick,
  handleConfirmClick
}: EditFormViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  // imageDataが存在し、かつapiWorkのisMineプロパティがfalseの場合、ForbiddenCardを表示
  if (imageData && !imageData.apiWork?.isMine) {
    return <ForbiddenCard alertText='イラストを生成したユーザー以外は編集できません。' />;
  }

  if (!user) {
    return <ForbiddenCard alertText='イラストを生成したユーザー以外は編集できません。' />;
  }

  return (
    <>
      <Card withBorder>
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {/* 画像表示 */}
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
            <Center>
              <AspectRatio ratio={1 / Math.sqrt(2)} style={{ maxWidth: '350px', width: '100%' }}>
                <div>
                <Image
                  src={imageData?.apiWork?.thumbnailImgUrl}
                  alt=""
                />
                </div>
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
                  <span>編集中…</span>
                  <Loader size="xs" color='gray'/>
                </Group>
              ) : isPosted ? (
                <Group gap="xs" align="center">
                  <span>編集完了</span>
                  <IconCheck size={20} />
                </Group>
              ) : (
                '編集'
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
EditFormView.displayName = 'EditFormView';