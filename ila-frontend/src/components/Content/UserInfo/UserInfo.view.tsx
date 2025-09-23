'use client';

import React, { useState, memo } from 'react';
import { UserInfoFormValues } from './UserInfo.hook';
import { IconSettings, IconPencil } from '@tabler/icons-react';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import LogoutButton from '@/components/Common/LogoutButton/LogoutButton';
import { Button, Group, Avatar, Text, Card, Tabs, Space, Modal, TextInput, Textarea, Center, Loader, Anchor } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

type UserInfoViewProps = {
  form: UseFormReturnType<UserInfoFormValues>;
  userData: UsersGetResult | undefined,
  isLoginUser: boolean,
  isChecking: boolean,
  isSaving: boolean,
  isUserIdAvailable: boolean,
  isLoading: boolean,
  opened: boolean,
  handleSave: (values: any) => Promise<void>,
  updateUser: () => void,
  handleCoverImageDrop: (files: File[]) => void,
  handleProfileImageDrop: (files: File[]) => void,
  validateCustomUserId: (value: string) => Promise<string | null>,
  handleEditButton: () => void,
  handleFollowListClick: () => void,
  handleFollowerListClick: () => void,
  setOpened: React.Dispatch<React.SetStateAction<boolean>>,
};

export const UserInfoView = memo(function WorkViewComponent({
  form,
  userData,
  isLoginUser,
  isChecking,
  isSaving,
  isUserIdAvailable,
  isLoading,
  opened,
  handleSave,
  updateUser,
  handleCoverImageDrop,
  handleProfileImageDrop,
  validateCustomUserId,
  handleEditButton,
  handleFollowListClick,
  handleFollowerListClick,
  setOpened
}: UserInfoViewProps): JSX.Element {
  const [isTypingUserId, setIsTypingUserId] = useState(false);

  return (
    <>
      <Card withBorder padding="xl" radius="md">
        <Card.Section
          key={userData?.coverImageUrl} 
          h={140}
          style={{
            backgroundImage: `url(${userData?.coverImageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Group justify="space-between">
          <Avatar
            key={userData?.profileImageUrl}
            src={userData?.profileImageUrl}
            size={80}
            radius={80}
            mt={-30}
          />
          <div key="LoginButton">
            {isLoginUser &&
              <LogoutButton />
            }
            {!isLoginUser &&
              <FollowButton
                isFollowState={userData?.isFollowing}
                userId={userData?.userId}
                updateUser={updateUser}
              />
            }
          </div>
        </Group>
        <Group justify="space-between">
          <div>
          <Text ta="left" fz="xl" fw={500}>
            {userData?.userName}
          </Text>
          <Text ta="left" fz="xs" c="dimmed">
            @{userData?.customUserId}
          </Text>
          </div>
          {isLoginUser && (
            <Button
              color={"var(--mantine-color-gray-5)"} 
              variant="outline"
              radius={"xl"}
              leftSection={
                <IconSettings
                  color="var(--mantine-color-gray-8)"
                  size={20}
                  style={{ display: 'block' }}
                />
              }
              onClick={handleEditButton}
            >
              <Text c="var(--mantine-color-gray-8)">編集</Text>
            </Button>
          )}
        </Group>
        <Space h={5}/>
        <Group gap={30} style={{ position: 'relative', width: 'fit-content' }}>
          <div key="Follow">
            <Anchor
              onClick={handleFollowListClick}
              style={{ textDecorationColor: 'black' }}
            >
            <Text ta="center" fz="xs" fw={500} c="dimmed">
              <Text fz="xs" span fw={700} c={"black"}>{userData?.follow}</Text> フォロー
            </Text>
            </Anchor>
          </div>
          <div key="Follower">
            <Anchor
              onClick={handleFollowerListClick}
              style={{ textDecorationColor: 'black' }}
            >
              <Group>
              <Text ta="center" fz="xs" fw={500} c="dimmed">
                <Text fz="xs" span fw={700} c={"black"}>{userData?.follower}</Text> フォロワー
              </Text>
              </Group>
            </Anchor>
          </div>
        </Group>
        <Group gap={40} style={{ position: 'relative', width: 'fit-content', marginTop: '5px', marginBottom: '10px' }}>
          <Text
            fz="sm"
            style={{
              whiteSpace: 'pre-line',
              lineHeight: 1.2
            }}
          >
            {userData?.userProfile}
          </Text>
        </Group>
        <Space h={15}/>
        <Tabs defaultValue="posted" color="black">
          <Tabs.List>
            <Tabs.Tab value="posted">
              投稿済
            </Tabs.Tab>
            <Tabs.Tab value="favorite" >
              いいね
            </Tabs.Tab>
            <Tabs.Tab value="images" >
              画像生成一覧
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="posted">
            <Card>投稿済</Card>
          </Tabs.Panel>

          <Tabs.Panel value="favorite">
            <Card>いいね</Card>
          </Tabs.Panel>

          <Tabs.Panel value="images">
            <Card>画像生成一覧</Card>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* プロフィール編集モーダル */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="プロフィール編集"
        size="lg"
        closeOnClickOutside={!isSaving}
        withCloseButton={!isSaving}
        radius={"md"}
      >
        <form onSubmit={form.onSubmit(handleSave)}>
          {/* カバー画像のドロップゾーン */}
          <Card withBorder padding="xl" radius="md">
          <Card.Section
            h={140}
            style={{
              backgroundImage: `url(${userData?.coverImageUrl})`,
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
              backgroundImage: form.values.coverImageUrl ? `url(${form.values.coverImageUrl})` : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: form.values.coverImageUrl ? 'transparent' : 'var(--mantine-color-gray-1)',
              cursor: 'pointer'
            }}
          >
          <IconPencil
            size={30}
            color={"var(--mantine-color-gray-5)"} 
          />
          </Dropzone>
          </Card.Section>
          <Group gap={0} style={{ position: 'relative', width: 'fit-content' }}>
          {/* プロフィール画像のドロップゾーン */}
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
                position: 'relative'
              }}
            >
              <Avatar
                src={form.values.profileImageUrl}
                size={80}
                radius={80}
                mx="auto"
                mt={-50}
              >
              </Avatar>
              <Center
                mt={-20}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
              <IconPencil
                size={30}
                color={"var(--mantine-color-gray-5)"} 
              />
            </Center>
            </Dropzone>
          </Group>
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
              <Loader size="10" mt={-22}/>
              <Text size="xs" c="blue" mt={-15} mb={10} ml={2}>
                使用可能かチェック中
              </Text>
            </Group>
          )}
          {/* 使用可能メッセージを表示 */}
          {!isLoading && isUserIdAvailable === true && form.values.customUserId !== userData?.customUserId && !form.errors.customUserId && (
            <Text size="xs" c="blue" mt={-15} mb={10} ml={2}>
              使用可能です
            </Text>
          )}
          
          <TextInput
            label="ユーザー名"
            placeholder="ユーザー名を入力"
            {...form.getInputProps('userName')}
            mb="md"
            error={form.errors.userName}
          />

          <Textarea
            label="自己紹介"
            placeholder="自己紹介を入力"
            {...form.getInputProps('userProfile')}
            mb="md"
            autoSave="true"
            rows={5}
            minRows={5}
            maxRows={5}
            disabled={isLoading || !isUserIdAvailable}
            onChange={(e) => {
              let value = e.currentTarget.value;
              let lines = value.split("\n");

              // 最大行数を制限
              if (lines.length > 5) {
                lines = lines.slice(0, 5);
              }

              // 各行の文字数制限
              lines = lines.map(line => line.slice(0, 15));

              value = lines.join("\n");
              e.currentTarget.value = value;
              form.setFieldValue('userProfile', value);
            }}
          />
          
          <Group justify="flex-end" mt="xl">
            <Button
              variant="outline"
              onClick={() => setOpened(false)}
              disabled={isLoading || !isUserIdAvailable || isSaving}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              disabled={isLoading || !isUserIdAvailable || isTypingUserId || !form.values.userName.trim()}
            >
              保存
            </Button>
          </Group>
          </Card>
        </form>
      </Modal>
    </>
  );
});
UserInfoView.displayName = 'UserInfoView';