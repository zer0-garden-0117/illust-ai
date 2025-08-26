import React, { useState } from 'react';
import { Box, ActionIcon, useMantineColorScheme, Avatar, Modal } from '@mantine/core';
import { useRouter } from "next/navigation";
import { IconUser } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import AuthButton from '@/components/Common/AuthBottan/AuthButton';

export const UserIcon: React.FC = () => {
  const { user, idToken } = useFirebaseAuthContext();
  const router = useRouter();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [opened, setOpened] = useState(false);

  const onIconClick = () => {
    if (user?.uid) {
      router.push(`/user/${user?.uid}`);
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
          src={user?.photoURL} 
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
          {!user && (
            <IconUser
              size={20}
              style={{ display: 'block' }}
            />
          )}
        </Avatar>
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={closeModal}
        title="ログインまたはサインアップ"
        centered
        size="sm"
      >
        <AuthButton onSuccess={closeModal} />
      </Modal>
    </Box>
  );
};