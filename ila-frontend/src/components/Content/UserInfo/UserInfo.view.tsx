'use client';

import React, { useState, memo } from 'react';
import { UserInfoFormValues } from './UserInfo.hook';
import { IconSettings, IconPencil, IconEdit } from '@tabler/icons-react';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import LogoutButton from '@/components/Common/LogoutButton/LogoutButton';
import { Skeleton, Button, Group, Text, Card, Space, Modal, TextInput, Textarea, Center, Loader, Anchor, Pill, AspectRatio } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { MyUserGetResult } from '@/apis/openapi/myusers/useMyUserGet';
import { SkeltonIcon } from '../SkeltonIcon/SkeltonIcon';
import { useRouter } from 'next/navigation';
import UserWorksCards from '../UserWorksCards/UserWorksCards';
import { CustomPill } from '@/components/Common/CustomPill/CustomPill';
import { UserInfoEditModal } from './UserInfoEditModal';
import { TagUsersGetResult } from '@/apis/openapi/users/useTagUsersGet';

type UserInfoViewProps = {
  page: number;
  tab: string;
  form: UseFormReturnType<UserInfoFormValues>;
  userData: UsersGetResult | undefined,
  taggedUsersData: TagUsersGetResult | undefined,
  loginUser: MyUserGetResult,
  isLoginUser: boolean,
  isChecking: boolean,
  isSaving: boolean,
  isUserIdAvailable: boolean,
  isLoading: boolean,
  isUserDataLoading: boolean,
  opened: boolean,
  updateUser: () => void,
  validateCustomUserId: (value: string) => Promise<string | null>,
  setOpened: React.Dispatch<React.SetStateAction<boolean>>,
  handleSave: (values: UserInfoFormValues) => Promise<void>,
  handleCoverImageDrop: (files: File[]) => void,
  handleProfileImageDrop: (files: File[]) => void,
  handleEditButton: () => void,
  handleFollowListClick: () => void,
  handleFollowerListClick: () => void,
  handlePlanChangeClick: () => void,
  handleBoostChangeClick: () => void
};

export const UserInfoView = memo(function WorkViewComponent({
  page,
  tab,
  form,
  userData,
  taggedUsersData,
  loginUser,
  isLoginUser,
  isChecking,
  isSaving,
  isUserIdAvailable,
  isLoading,
  isUserDataLoading,
  opened,
  updateUser,
  validateCustomUserId,
  setOpened,
  handleSave,
  handleCoverImageDrop,
  handleProfileImageDrop,
  handleEditButton,
  handleFollowListClick,
  handleFollowerListClick,
  handlePlanChangeClick,
  handleBoostChangeClick
}: UserInfoViewProps): JSX.Element {
  const [isTypingUserId, setIsTypingUserId] = useState(false);
  const router = useRouter();
  const coverImageUrl = userData?.coverImageUrl;
  const hasCover = !!coverImageUrl;

  return (
    <>
      <Card withBorder padding="xl" radius="md">
        <Card.Section>
          <AspectRatio ratio={6 / 1} mah={140}>
            <Skeleton
              visible={!userData || isUserDataLoading}
              style={{ width: '100%', height: '100%' }}
            >
              <div
                key={userData?.coverImageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: hasCover ? `url(${coverImageUrl})` : 'none',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </Skeleton>
          </AspectRatio>
        </Card.Section>    

        {/* アイコンとログアウトボタン */}
        <Group justify="space-between" align="flex-start">
          <SkeltonIcon
            profileImageUrl={userData?.profileImageUrl}
            width={70}
            height={70}
            isUserDataLoading={isUserDataLoading}
            isClickable={false}
            onClick={() => {}}
          />
          {/* <div key="LoginButton"> */}
            {/* {isLoginUser &&
              <LogoutButton />
            } */}
            {/* userDataが存在しない場合は非表示 */}
            {/* {!isLoginUser && userData &&
              <FollowButton
                isFollowState={userData?.isFollowing}
                userId={userData?.userId}
                updateUser={updateUser}
              />
            } */}
          {/* </div> */}
        </Group>

        {/* ユーザー名と編集ボタン */}
        <Group justify="space-between" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
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
              size='compact-lg'
              leftSection={
                <IconEdit
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
          {!isLoginUser && userData &&
              <FollowButton
                isFollowState={userData?.isFollowing}
                userId={userData?.userId}
                updateUser={updateUser}
              />
            }
        </Group>
        <Space h={5}/>

        {/* ユーザー名と編集ボタン */}
        <Group justify="space-between" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <div>
          <Group gap={10} style={{ position: 'relative', width: 'fit-content' }}>
            <Anchor
              onClick={handleFollowListClick}
              style={{ textDecorationColor: 'black' }}
            >
            <Text ta="center" fz="xs" fw={500} c="dimmed">
              <Text fz="xs" span fw={700} c={"black"}>{userData?.follow}</Text> フォロー
            </Text>
            </Anchor>
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
          </Group>
          <Text
            mt={5}
            mb={10}
            fz="sm"
            style={{
              whiteSpace: 'pre-line',
              lineHeight: 1.2
            }}
          >
            {userData?.userProfile}
          </Text>
          </div>
          {isLoginUser && (
            <Button
              color={"var(--mantine-color-gray-5)"} 
              variant="outline"
              radius={"xl"}
              size='compact-lg'
              leftSection={
                <IconSettings
                  color="var(--mantine-color-gray-8)"
                  size={20}
                  style={{ display: 'block' }}
                />
              }
              // onClick={handleEditButton}
            >
              <Text c="var(--mantine-color-gray-8)">設定</Text>
            </Button>
          )}
        </Group>

        {/* タブ */}
        <Group gap="3px" mt="xs">
          <Button
            size="compact-sm"
            variant={tab === 'home' ? 'filled' : 'light'}
            onClick={() => router.push(`${userData?.customUserId}?tab=home`)}
          >
            ホーム
          </Button>
          <Button
            size="compact-sm"
            variant={tab === 'favorite' ? 'filled' : 'light'}
            onClick={() => router.push(`${userData?.customUserId}?tab=favorite`)}
          >
            いいね
          </Button>
          <Button
            size="compact-sm"
            variant={tab === 'tag' ? 'filled' : 'light'}
            onClick={() => router.push(`${userData?.customUserId}?tab=tag`)}
          >
            お気に入りタグ
          </Button>
        </Group>
        <Space h={10}/>

        {tab === 'home' && (
          <UserWorksCards
            customUserId={userData?.customUserId || ''}
            page={page}
            userWorksFilterType="posted"
          />
        )}
        {tab === 'favorite' && (
          <UserWorksCards
            customUserId={userData?.customUserId || ''}
            page={page}
            userWorksFilterType="liked"
          />
        )}
        {tab === 'tag' && (
          <Card withBorder padding="md" radius="md">
            <Group gap="xs" wrap="wrap">
              {taggedUsersData?.tags?.map((tag) => (
                <CustomPill key={tag} onClick={() => router.push(`/illust/tag/${encodeURIComponent(tag)}`)}>
                  #{tag}
                </CustomPill>
              ))}
            </Group>
          </Card>
        )}
      </Card>

      {/* プロフィール編集モーダル */}
      <UserInfoEditModal
        opened={opened}
        setOpened={setOpened}
        isSaving={isSaving}
        isLoading={isLoading}
        isUserIdAvailable={isUserIdAvailable}
        isChecking={isChecking}
        form={form}
        userData={userData}
        loginUser={loginUser}
        coverImageUrl={coverImageUrl}
        hasCover={hasCover}
        validateCustomUserId={validateCustomUserId}
        handleSave={handleSave}
        handleCoverImageDrop={handleCoverImageDrop}
        handleProfileImageDrop={handleProfileImageDrop}
        handlePlanChangeClick={handlePlanChangeClick}
        handleBoostChangeClick={handleBoostChangeClick}
      />
    </>
  );
});
UserInfoView.displayName = 'UserInfoView';