import React, { useEffect, useState } from 'react';
import { Box, ActionIcon, useMantineColorScheme, Avatar, Modal, Button, Text } from '@mantine/core';
import { useRouter } from "next/navigation";
import { IconUser } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import LoginButton from '@/components/Common/LoginButton/LoginButton';

export const UserIcon: React.FC = () => {
  const { user } = useFirebaseAuthContext();
  const router = useRouter();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [opened, setOpened] = useState(false);

  const onIconClick = () => {
    if (user?.customUserId) {
      router.push(`/user/${user?.customUserId}`);
    } else {
      setOpened(true);
    }
  };

  const closeModal = () => {
    setOpened(false);
  };

  const avatarSize = 36;
  const actionIconSize = 36;

  return (
    <Box>
      {/* ログイン済の場合 */}
      {user && (
        <ActionIcon
          size={actionIconSize}
          onClick={onIconClick}
          variant="transparent"
          color={isDark ? "var(--mantine-color-gray-5)" : "var(--mantine-color-gray-8)"} 
          radius="xl"
          styles={{
            root: {
              width: actionIconSize,
              height: actionIconSize,
              borderColor: isDark 
                ? "var(--mantine-color-gray-8)"
                : "var(--mantine-color-gray-5)",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }
          }}
        >
          <Avatar 
            variant="transparent"
            src={user?.profileImageUrl} 
            radius="xl"
            size={avatarSize}
            styles={{
              root: {
                width: avatarSize,
                height: avatarSize,
                minWidth: avatarSize,
                minHeight: avatarSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              image: {
                objectFit: 'cover'
              }
            }}
          >
          </Avatar>
        </ActionIcon>
      )}
      {/* ログイン前 */}
      {!user && (
        <Button
          onClick={onIconClick}
          color={isDark ? "var(--mantine-color-gray-8)" : "var(--mantine-color-gray-5)"} 
          variant="outline"
          radius={"xl"}
          leftSection={
            <IconUser
              color="var(--mantine-color-gray-8)"
              size={20}
              style={{ display: 'block' }}
            />
          }
        >
          <Text c="var(--mantine-color-gray-8)">ログイン</Text>
        </Button>
      )}

      <Modal
        opened={opened}
        onClose={closeModal}
        title="ログインまたはサインアップ"
        centered
        size="sm"
        radius={"md"}
      >
        <LoginButton onSuccess={closeModal} />
      </Modal>
    </Box>
  );
};