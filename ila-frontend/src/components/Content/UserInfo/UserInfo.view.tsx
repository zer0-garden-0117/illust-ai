'use client';

import React, { useState } from 'react';
import { memo } from 'react';
import { Button, Group, Avatar, Text, Card, Tabs, Space, Modal, TextInput, Textarea } from '@mantine/core';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import LoginButton from '@/components/Common/LoginButton/LoginButton';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import { IconSettings } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

type UserInfoViewProps = {
  userData: UsersGetResult | undefined
};

export const UserInfoView = memo(function WorkViewComponent({
  userData
}: UserInfoViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  const isLoginUser = user && userData?.customUserId === user.customUserId;
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      customUserId: userData?.customUserId || '',
      profileImageUrl: userData?.profileImageUrl || '',
      coverImageUrl: userData?.coverImageUrl || '',
      userProfile: userData?.userProfile || '',
    },
  });

  const handleSave = (values: typeof form.values) => {
    // ここでAPIを呼び出してプロフィールを更新する処理を実装
    console.log('保存する値:', values);
    // 更新処理後、モーダルを閉じる
    setOpened(false);
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
          <TextInput
            label="ユーザーID"
            placeholder="ユーザーIDを入力"
            {...form.getInputProps('customUserId')}
            mb="md"
          />
          
          <Textarea
            label="自己紹介"
            placeholder="自己紹介を入力"
            {...form.getInputProps('userProfile')}
            mb="md"
            autosize
            minRows={3}
          />
          
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setOpened(false)}>
              キャンセル
            </Button>
            <Button type="submit">
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