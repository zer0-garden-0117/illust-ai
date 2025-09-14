'use client';

import React from 'react';
import { memo } from 'react';
import { Button, Group, Avatar, Text, Card, Tabs, Space } from '@mantine/core';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import LoginButton from '@/components/Common/LoginButton/LoginButton';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import { IconSettings } from '@tabler/icons-react';

type UserInfoViewProps = {
  userData: UsersGetResult | undefined
};

export const UserInfoView = memo(function WorkViewComponent({
  userData
}: UserInfoViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  const isLoginUser = user && userData?.customUserId === user.customUserId;

  return (
    <>
    <Card withBorder padding="xl" radius="md">
      <Card.Section
        h={140}
        style={{
          backgroundImage: `url(${userData?.coverImageUrl})` 
          // backgroundImage: 'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
        }}
      />
      <Group gap={0} style={{ position: 'relative', width: 'fit-content' }}>
        <Avatar
          src={userData?.profileImageUrl}
          // src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
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
        >
          <Text c="var(--mantine-color-gray-8)">変更</Text>
        </Button>
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
            // 自分のページはログインボタンを表示
            <LoginButton />
          }
          {!isLoginUser &&
            // 自分以外のページはフォローボタンを表示
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
        {/* <Tabs.Tab value="highlight" >
          ハイライト
        </Tabs.Tab> */}
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

      {/* <Tabs.Panel value="highlight">
        <Card>ハイライト</Card>
      </Tabs.Panel> */}

      <Tabs.Panel value="favorite">
        <Card>いいね</Card>
      </Tabs.Panel>

      <Tabs.Panel value="images">
        <Card>画像生成一覧</Card>
      </Tabs.Panel>
    </Tabs>

    </Card>
    </>
  );
});
UserInfoView.displayName = 'UserInfoView';