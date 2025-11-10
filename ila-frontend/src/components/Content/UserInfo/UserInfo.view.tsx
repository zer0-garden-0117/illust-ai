'use client';

import React, { useState, memo } from 'react';
import { UserInfoFormValues } from './UserInfo.hook';
import { IconSettings, IconPencil, IconEdit } from '@tabler/icons-react';
import { UsersGetResult } from '@/apis/openapi/users/useUsersGet';
import FollowButton from '@/components/Common/FollowButton/FollowButton';
import LogoutButton from '@/components/Common/LogoutButton/LogoutButton';
import { Skeleton, Button, Group, Text, Card, Space, Modal, TextInput, Textarea, Center, Loader, Anchor, Pill } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { MyUserGetResult } from '@/apis/openapi/myusers/useMyUserGet';
import { SkeltonIcon } from '../SkeltonIcon/SkeltonIcon';
import { useRouter } from 'next/navigation';
import UserWorksCards from '../UserWorksCards/UserWorksCards';
import { CustomPill } from '@/components/Common/CustomPill/CustomPill';

type UserInfoViewProps = {
  page: number;
  tab: string;
  form: UseFormReturnType<UserInfoFormValues>;
  userData: UsersGetResult | undefined,
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
        <Card.Section
          key={userData?.coverImageUrl} 
          h={140}
          style={{
            backgroundImage: hasCover ? `url(${coverImageUrl})` : 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Skeleton visible={!userData || isUserDataLoading} height={140} width="100%">
            <div style={{ width: '100%', height: '140px' }}></div>
          </Skeleton>
        </Card.Section>

        {/* アイコンとログアウトボタン */}
        <Group justify="space-between">
          <SkeltonIcon
            profileImageUrl={userData?.profileImageUrl}
            width={70}
            height={70}
            marginTop={-30}
            isUserDataLoading={isUserDataLoading}
            isClickable={false}
            onClick={() => {}}
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
              style={{ flexShrink: 0, minWidth: 120 }}
              onClick={handleEditButton}
            >
              <Text c="var(--mantine-color-gray-8)">編集</Text>
            </Button>
          )}
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
              <CustomPill onClick={() => router.push(`/illust/tag/${encodeURIComponent("test")}`)}>test</CustomPill>
              <CustomPill onClick={() => router.push(`/illust/tag/${encodeURIComponent("test1")}`)}>test1</CustomPill>
              <CustomPill onClick={() => router.push(`/illust/tag/${encodeURIComponent("test2")}`)}>test2</CustomPill>
            </Group>
          </Card>
        )}
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
            disabled={isLoading || !isUserIdAvailable}
            maxLength={20}
            minLength={1}
          />

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
            mb="md"
          />

          {/* プランの状態 */}
          <Group gap={"10px"} mb="5px">
            <Text fw={500} fz={"sm"}>
              プラン
            </Text>
            <Anchor>
              <Button
                onClick={handlePlanChangeClick}
                size='compact-xs'
                fw={500}
                fz={"xs"}
                mb={3}
              >
                プランの変更
              </Button>
            </Anchor>
          </Group>
          <Pill
            mb="md"
            style={{ display: 'inline-flex', width: 'fit-content' }}
          >
            {(() => {
              const parts = loginUser?.plan?.split(':') || [];
              const [planName, renewDate, renewTime] = parts;
              if (!planName) return 'Free';
              return `${planName} (${renewDate}:${renewTime}に自動更新)`;
            })()}
          </Pill>

          {/* ブーストの状態 */}
          <Group gap={"10px"} mb="5px">
            <Text fw={500} fz={"sm"}>
              ブースト
            </Text>
            <Anchor>
              <Button
                onClick={handleBoostChangeClick}
                size='compact-xs'
                fw={500}
                fz={"xs"}
                mb={3}
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