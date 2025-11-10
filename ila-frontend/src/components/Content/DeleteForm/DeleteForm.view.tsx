'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Loader, Space, Box, Modal, Text } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import { ApiWorkWithTag } from '../ImageCard/ImageCard';
import { UseFormReturnType } from '@mantine/form';
import { PostWorkValues } from './DeleteForm.hook';
import { useDisclosure } from '@mantine/hooks';
import { ForbiddenCard } from '../ForbiddenCard/ForbiddenCard';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

type DeleteFormViewProps = {
  form: UseFormReturnType<PostWorkValues>;
  workId: string;
  imageData: ApiWorkWithTag | undefined;
  isSubmitting: boolean;
  isPosted: boolean;
  handlePostClick: (values: PostWorkValues) => Promise<void>,
  handleBackClick: () => void;
};

export const DeleteFormView = memo(function WorkViewComponent({
  form,
  workId,
  imageData,
  isSubmitting,
  isPosted,
  handlePostClick,
  handleBackClick
}: DeleteFormViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  const [opened, { open, close }] = useDisclosure(false);
  const handleConfirmDelete = () => {
    form.onSubmit(handlePostClick)();
    close();
  };

  if (imageData && !imageData.apiWork?.isMine) {
    return <ForbiddenCard alertText='イラストを生成したユーザー以外は削除できません。' />;
  }

  if (!user) {
    return <ForbiddenCard alertText='イラストを生成したユーザー以外は削除できません。' />;
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="削除の確認"
        centered
        withCloseButton={false}
      >
        <Text size="sm" mb="md">
          本当に削除しますか？この操作は取り消しできません。
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={close} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            color="red"
            onClick={handleConfirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Group gap="xs" align="center">
                <span>削除中…</span>
                <Loader size="xs" />
              </Group>
            ) : (
              '削除'
            )}
          </Button>
        </Group>
      </Modal>

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
                readOnly
              />

              {/* サブミットボタン */}
              <Group justify="flex-end" mt="md">
          {/* isPostedがtrueの時はボタンを表示 */}
                {isPosted && (
                  <>
                    <Space h="md" />
                    <Button
                      type="button"
                      radius={"xl"}
                      w="fit-content"
                      onClick={handleBackClick}
                      variant='outline'
                    >
                      一覧に戻る
                    </Button>
                  </>
                )}

                {/* 削除ボタン：submit ではなくモーダルを開く */}
                <Button
                  type="button"
                  radius={"xl"}
                  w="fit-content"
                  disabled={isSubmitting || isPosted}
                  onClick={open}
                >
                  {isSubmitting ? (
                    <Group gap="xs" align="center">
                      <span>削除中…</span>
                  <Loader size="xs" color='gray'/>
                    </Group>
                  ) : isPosted ? (
                    <Group gap="xs" align="center">
                      <span>削除完了</span>
                      <IconCheck size={20} />
                    </Group>
                  ) : (
                    '削除'
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
DeleteFormView.displayName = 'DeleteFormView';