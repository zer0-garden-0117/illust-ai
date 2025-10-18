import React, { useEffect, useState } from 'react';
import { Box, ActionIcon, useMantineColorScheme, Avatar, Modal, Button, Text, Skeleton } from '@mantine/core';
import { useRouter } from "next/navigation";
import { IconUser } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import LoginButton from '@/components/Common/LoginButton/LoginButton';
import { SkeltonIcon } from '@/components/Content/SkeltonIcon/SkeltonIcon';

export const UserIcon: React.FC = () => {
  const { user, loading } = useFirebaseAuthContext();
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

  // loading 中は何も表示しない
  if (loading) {
    return (
      <Box>
        <Skeleton circle height={avatarSize} width={avatarSize} />
      </Box>
    );
  }

  return (
    <Box>
      {/* ログイン済の場合 */}
      {user && (
        <Box onClick={onIconClick}>
          <SkeltonIcon
            profileImageUrl={user?.profileImageUrl}
            width={avatarSize}
            height={avatarSize}
            marginTop={0}
          />
        </Box>
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