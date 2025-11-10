'use client';

import React, { useState, memo } from 'react';
import {
  Modal,
  Card,
  Group,
  Text,
  Button,
  Anchor,
  TextInput,
  Textarea,
  Pill,
  Center,
  Loader,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPencil } from '@tabler/icons-react';
import { UseFormReturnType } from '@mantine/form';

import { SkeltonIcon } from '../SkeltonIcon/SkeltonIcon';
import { UserInfoFormValues } from './UserInfo.hook';
import { MyUserGetResult } from '@/apis/openapi/myusers/useMyUserGet';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';

type UserInfoEditModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;

  isSaving: boolean;
  isLoading: boolean;
  isUserIdAvailable: boolean;
  isChecking: boolean;

  form: UseFormReturnType<UserInfoFormValues>;
  userData: UsersGetResult | undefined;
  loginUser: MyUserGetResult;

  coverImageUrl: string | undefined;
  hasCover: boolean;

  validateCustomUserId: (value: string) => Promise<string | null>;

  handleSave: (values: UserInfoFormValues) => Promise<void>;
  handleCoverImageDrop: (files: File[]) => void;
  handleProfileImageDrop: (files: File[]) => void;
  handlePlanChangeClick: () => void;
  handleBoostChangeClick: () => void;
};

export const UserInfoEditModal = memo(function UserInfoEditModal({
  opened,
  setOpened,
  isSaving,
  isLoading,
  isUserIdAvailable,
  isChecking,
  form,
  userData,
  loginUser,
  coverImageUrl,
  hasCover,
  validateCustomUserId,
  handleSave,
  handleCoverImageDrop,
  handleProfileImageDrop,
  handlePlanChangeClick,
  handleBoostChangeClick,
}: UserInfoEditModalProps) {
  const [isTypingUserId, setIsTypingUserId] = useState(false);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="プロフィール編集"
      size="lg"
      closeOnClickOutside={!isSaving}
      withCloseButton={!isSaving}
      radius="md"
    >
      <form onSubmit={form.onSubmit(handleSave)}>
        <Card withBorder padding="xl" radius="md">
          {/* カバー画像のドロップゾーン */}
          <Card.Section
            h={140}
            style={{
              backgroundImage: hasCover ? `url(${coverImageUrl})` : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Dropzone
              onDrop={handleCoverImageDrop}
              accept={IMAGE_MIME_TYPE}
              maxSize={5 * 1024 ** 2}
              mb="md"
              disabled={isLoading || !isUserIdAvailable}
              style={{
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: form.values.coverImageUrl
                  ? `url(${form.values.coverImageUrl})`
                  : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: form.values.coverImageUrl
                  ? 'transparent'
                  : 'var(--mantine-color-gray-1)',
                cursor: 'pointer',
              }}
            >
              <IconPencil size={30} color="var(--mantine-color-gray-5)" />
            </Dropzone>
          </Card.Section>

          {/* プロフィール画像のドロップゾーン */}
          <Group gap={0} style={{ position: 'relative', width: 'fit-content' }}>
            <Dropzone
              onDrop={handleProfileImageDrop}
              accept={IMAGE_MIME_TYPE}
              maxSize={5 * 1024 ** 2}
              disabled={isLoading || !isUserIdAvailable}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <SkeltonIcon
                profileImageUrl={form.values.profileImageUrl}
                width={70}
                height={70}
                marginTop={-30}
                isClickable={false}
                onClick={() => {}}
              />
              <Center
                mt={-20}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <IconPencil size={30} color="var(--mantine-color-gray-5)" />
              </Center>
            </Dropzone>
          </Group>

          {/* ユーザーID */}
          <TextInput
            label="ユーザーID"
            placeholder="ユーザーIDを入力"
            {...form.getInputProps('customUserId')}
            mb="md"
            error={form.errors.customUserId}
            onFocus={() => setIsTypingUserId(true)}
            onBlur={async () => {
              const error = await validateCustomUserId(form.values.customUserId);
              if (error) {
                form.setFieldError('customUserId', error);
              }
              setIsTypingUserId(false);
            }}
            disabled={isChecking}
          />

          {/* Loader表示 */}
          {isLoading && (
            <Group gap={3} style={{ position: 'relative', width: 'fit-content' }}>
              <Loader size="10" mt={-22} />
              <Text size="xs" c="blue" mt={-15} mb={10} ml={2}>
                使用可能かチェック中
              </Text>
            </Group>
          )}

          {/* 使用可能メッセージ */}
          {!isLoading &&
            isUserIdAvailable === true &&
            form.values.customUserId !== userData?.customUserId &&
            !form.errors.customUserId && (
              <Text size="xs" c="blue" mt={-15} mb={10} ml={2}>
                使用可能です
              </Text>
            )}

          {/* ユーザー名 */}
          <TextInput
            label="ユーザー名"
            placeholder="ユーザー名を入力"
            {...form.getInputProps('userName')}
            mb="md"
            error={form.errors.userName}
            disabled={isLoading || !isUserIdAvailable}
            maxLength={20}
            minLength={1}
          />

          {/* 自己紹介 */}
          <Textarea
            label="自己紹介"
            placeholder="自己紹介を入力"
            {...form.getInputProps('userProfile')}
            autoSave="true"
            rows={5}
            minRows={5}
            maxRows={5}
            disabled={isLoading || !isUserIdAvailable}
            onChange={(e) => {
              let value = e.currentTarget.value;
              let lines = value.split('\n');

              // 最大行数を制限
              if (lines.length > 5) {
                lines = lines.slice(0, 5);
              }

              // 各行の文字数制限
              lines = lines.map((line) => line.slice(0, 15));

              value = lines.join('\n');
              e.currentTarget.value = value;
              form.setFieldValue('userProfile', value);
            }}
            mb="md"
          />

          {/* プランの状態 */}
          <Group gap="10px" mb="5px">
            <Text fw={500} fz="sm">
              プラン
            </Text>
            <Anchor>
              <Button
                onClick={handlePlanChangeClick}
                size="compact-xs"
                fw={500}
                fz="xs"
                mb={3}
                radius="xl"
              >
                プランの変更
              </Button>
            </Anchor>
          </Group>
          <Pill mb="md" style={{ display: 'inline-flex', width: 'fit-content' }}>
            {(() => {
              const parts = loginUser?.plan?.split(':') || [];
              const [planName, renewDate, renewTime] = parts;
              if (!planName) return 'Free';
              return `${planName} (${renewDate}:${renewTime}に自動更新)`;
            })()}
          </Pill>

          {/* ブーストの状態 */}
          <Group gap="10px" mb="5px">
            <Text fw={500} fz="sm">
              ブースト
            </Text>
            <Anchor>
              <Button
                onClick={handleBoostChangeClick}
                size="compact-xs"
                fw={500}
                fz="xs"
                mb={3}
                radius="xl"
              >
                ブーストの追加
              </Button>
            </Anchor>
          </Group>
          <Group gap={1}>
            {loginUser?.boost?.map((boostItem, index) => {
              const [label, date] = boostItem.split(':');
              return (
                <Pill
                  key={index}
                  mb="md"
                  style={{ display: 'inline-flex', width: 'fit-content', marginRight: 8 }}
                >
                  {label} ({date}まで有効)
                </Pill>
              );
            })}
          </Group>

          {/* ボタン */}
          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              radius="xl"
              onClick={() => setOpened(false)}
              disabled={isLoading || !isUserIdAvailable || isSaving}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              radius="xl"
              loading={isSaving}
              disabled={
                isLoading ||
                !isUserIdAvailable ||
                isTypingUserId ||
                !form.values.userName.trim()
              }
            >
              保存
            </Button>
          </Group>
        </Card>
      </form>
    </Modal>
  );
});

UserInfoEditModal.displayName = 'UserInfoEditModal';