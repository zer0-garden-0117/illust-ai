import React from 'react';
import { Box, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useRouter } from "next/navigation";
import { IconUser } from '@tabler/icons-react';

export const UserIcon: React.FC = () => {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const onIconClick = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box>
      <ActionIcon
        size={"lg"}
        onClick={onIconClick}
        variant="outline"
        color={isDark ? "var(--mantine-color-gray-5)" : "var(--mantine-color-gray-8)"} 
        radius='xl'
        styles={{
          root: {
            borderColor: isDark 
              ? "var(--mantine-color-gray-8)"
              : "var(--mantine-color-gray-5)",
          }
        }}
      >
      <IconUser color="var(--mantine-color-cyan-4)"/>
      </ActionIcon>
    </Box>
  );
};