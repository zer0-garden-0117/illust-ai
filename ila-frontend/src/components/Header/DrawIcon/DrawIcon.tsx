import React from 'react';
import { Box, ActionIcon, useMantineColorScheme, Group, Badge, Skeleton } from '@mantine/core';
import { useRouter } from "next/navigation";
import { IconPencil } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

export const DrawIcon: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useFirebaseAuthContext();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const onIconClick = () => {
    router.push('/illust/create');
  };

  // loading 中は何も表示しない
  if (loading) {
    return (
      <Box>
        <Skeleton circle height={36} width={36} />
      </Box>
    );
  }

  // userがnullの場合は何も表示しない
  if (!user) {
    return null;
  }


  return (
    <Box>
    <Group gap={0} style={{ position: 'relative', width: 'fit-content' }}>
      <ActionIcon
        variant="default"
        size="lg"
        radius={"xl"}
        color={isDark ? "var(--mantine-color-gray-5)" : "var(--mantine-color-gray-8)"} 
        styles={{
          root: {
            borderColor: isDark 
              ? "var(--mantine-color-gray-8)"
              : "var(--mantine-color-gray-5)",
          }
        }}
        onClick={onIconClick}
      >
        <IconPencil />
      </ActionIcon>
      {/* userがnullの場合は非表示 */}
      {user && (
        <Badge
          size="xs"
          circle
          style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            minWidth: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {user?.remainingIllustNum}
        </Badge>
      )}
    </Group>
    </Box>
  );
};