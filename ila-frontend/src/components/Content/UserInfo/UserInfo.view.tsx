'use client';

import React from 'react';
import { memo } from 'react';
import { Button, Group, Avatar, Text, Loader, Card, Tabs, Space } from '@mantine/core';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import LoginButton from '@/components/Common/LoginButton/LoginButton';

type UserInfoViewProps = {
  userData: UsersGetResult | undefined
};

export const UserInfoView = memo(function WorkViewComponent({
  userData
}: UserInfoViewProps): JSX.Element {
  return (
    <>
    <Card withBorder padding="xl" radius="md">
      <Card.Section
        h={140}
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
        }}
      />
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {userData?.userName}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {userData?.userProfile}
      </Text>
      <Group mt="md" justify="center" gap={30}>
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
        <div key="Button">
          {/* <Button
            mt={10}
            radius="md"
            size="md"
            variant="default"
          >
            Follow
          </Button> */}
          <LoginButton />
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