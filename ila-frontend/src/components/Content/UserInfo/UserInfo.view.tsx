'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { memo } from 'react';
import { Button, Group, Avatar, Text, Card, Tabs, Space, Modal, TextInput, Textarea, Center, Loader } from '@mantine/core';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import LoginButton from '@/components/Common/LoginButton/LoginButton';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import { IconSettings, IconPencil } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useUserCheckAvailability } from '@/apis/openapi/users/useUserCheckAvailability';
import { useMyUserUpdate } from '@/apis/openapi/users/useMyUserUpdate';
import { useRouter } from "next/navigation";

type UserInfoViewProps = {
  userData: UsersGetResult | undefined
  updateUser: () => void
};

export const UserInfoView = memo(function WorkViewComponent({
  userData,
  updateUser
}: UserInfoViewProps): JSX.Element {
  const { user, idToken, getFreshIdToken } = useFirebaseAuthContext();
  const [isLoginUser, setIsLoginUser] = useState(false);
  const [opened, setOpened] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File>(new File([], ""));
  const [profileImageFile, setProfileImageFile] = useState<File>(new File([], ""));
  const { trigger: checkAvailability, isMutating: isChecking } = useUserCheckAvailability();
  const [isUserIdAvailable, setIsUserIdAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const { trigger: updateMyUser } = useMyUserUpdate();
  const [isTypingUserId, setIsTypingUserId] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoginUser(!!(user && userData?.customUserId === user.customUserId));
  }, [user, userData]);

  const form = useForm({
    initialValues: {
      customUserId: userData?.customUserId || '',
      profileImageUrl: userData?.profileImageUrl || '',
      coverImageUrl: userData?.coverImageUrl || '',
      userProfile: userData?.userProfile || '',
    },
  });

  const validateCustomUserId = async (value: string) => {
    setIsLoading(true)
    // 3文字以上かつ12文字以下の英数字とアンダースコアのみ許可
    const regex = /^[a-zA-Z0-9_]{3,12}$/;
    if (!regex.test(value)) {
      setIsUserIdAvailable(false);
      setIsLoading(false);
      return 'ユーザーIDは3〜12文字の英数字と_のみ使用可能です';
    }

    // 空文字または元のユーザーIDと同じ場合はチェックしない
    if (!value || value === userData?.customUserId) {
      setIsUserIdAvailable(true);
      setIsLoading(false);
      return null;
    }

    // ここで0.5秒遅延
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const isAvailable = await checkAvailability({ 
        customUserId: value,
        headers: { Authorization: `Bearer ${await idToken}` }
      });
      setIsUserIdAvailable(isAvailable);
      setIsLoading(false);
      return isAvailable ? null : 'このユーザーIDは既に使用されています';
    } catch (error) {
      console.error('ユーザーIDチェックエラー:', error);
      setIsUserIdAvailable(false);
      setIsLoading(false);
      return 'ユーザーIDの確認中にエラーが発生しました';
    }
  }

  const handleCoverImageDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      setCoverImageFile(files[0]);
      const previewUrl = URL.createObjectURL(files[0]);
      form.setFieldValue('coverImageUrl', previewUrl);
    }
  }, []);

  const handleProfileImageDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      setProfileImageFile(files[0]);
      const previewUrl = URL.createObjectURL(files[0]);
      form.setFieldValue('profileImageUrl', previewUrl);
    }
  }, []);

  const handleSave = async (values: typeof form.values) => {
    // ここでAPIを呼び出してプロフィールを更新する処理を実装
    console.log('保存する値:', values, coverImageFile, profileImageFile);

    await updateMyUser({
      headers: { Authorization: `Bearer ${await idToken}` },
      body: {
        coverImage: coverImageFile,
        profileImage: profileImageFile,
        customUserId: values.customUserId,
        userProfile: values.userProfile
      }
    });
    // 更新処理後、モーダルを閉じる
    setOpened(false);

    // トークンと認証情報を更新
    await getFreshIdToken();
    updateUser();

    // 画面遷移
    router.replace(`/user/${values.customUserId}`);
  };

  return (
    <>
      <Card withBorder padding="xl" radius="md">
        <Card.Section
          h={140}
          style={{
            backgroundImage: `url(${userData?.coverImageUrl})`
          }}
        />
        <Group gap={0} style={{ position: 'relative', width: 'fit-content' }}>
          <Avatar
            src={userData?.profileImageUrl}
            size={80}
            radius={80}
            mx="auto"
            mt={-30}
          />
        </Group>
        <Group gap={30} style={{ position: 'relative', width: 'fit-content' }}>
          <Text ta="center" fz="lg" fw={500}>
            @{userData?.customUserId}
          </Text>
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
              onClick={() => {
                form.setValues({
                  customUserId: userData?.customUserId || '',
                  profileImageUrl: userData?.profileImageUrl || '',
                  coverImageUrl: userData?.coverImageUrl || '',
                  userProfile: userData?.userProfile || '',
                });
                setCoverImageFile(new File([], ""));
                setProfileImageFile(new File([], ""));
                setOpened(true);
              }}
            >
              <Text c="var(--mantine-color-gray-8)">変更</Text>
            </Button>
          )}
        </Group>
        <Group gap={0} style={{ position: 'relative', width: 'fit-content' }}>
          <Text ta="center" fz="sm" c="dimmed">
            {userData?.userProfile}
          </Text>
          <Space h={40}/>
        </Group>
        <Group gap={30} style={{ position: 'relative', width: 'fit-content' }}>
          <div key="Follow">
            <Text ta="center" fz="lg" fw={500}>
              {userData?.follow}
            </Text>
            <Text ta="center" fz="sm" c="dimmed" lh={1}>
              Follow
            </Text>
          </div>
          <div key="Follower">
            <Text ta="center" fz="lg" fw={500}>
              {userData?.follower}
            </Text>
            <Text ta="center" fz="sm" c="dimmed" lh={1}>
              Follower
            </Text>
          </div>
          <div key="LoginButton">
            {isLoginUser &&
              <LoginButton />
            }
            {!isLoginUser &&
              <FollowButton customUserId={userData?.customUserId} />
            }
          </div>
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
      >
        <form onSubmit={form.onSubmit(handleSave)}>
          {/* カバー画像のドロップゾーン */}
          <Card withBorder padding="xl" radius="md">
          <Card.Section
            h={140}
            style={{
              backgroundImage: form.values.coverImageUrl
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
          
          <Textarea
            label="自己紹介"
            placeholder="自己紹介を入力"
            {...form.getInputProps('userProfile')}
            mb="md"
            autosize
            minRows={3}
            disabled={isLoading || !isUserIdAvailable}
          />
          
          <Group justify="flex-end" mt="xl">
            <Button
              variant="outline"
              onClick={() => setOpened(false)}
              disabled={isLoading || !isUserIdAvailable}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isUserIdAvailable || isTypingUserId}
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