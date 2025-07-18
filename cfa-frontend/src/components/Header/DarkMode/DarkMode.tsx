import React from 'react';
import { Box, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useRouter } from "next/navigation";
import { MdDarkMode } from 'react-icons/md';

export const DarkMode: React.FC = () => {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const onIconClick = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box mt={2}>
      <ActionIcon
        onClick={onIconClick}
        variant="outline"
        color={isDark ? "var(--mantine-color-gray-5)" : "var(--mantine-color-gray-8)"} 
        radius='md'
        styles={{
          root: {
            borderColor: isDark 
              ? "var(--mantine-color-gray-8)"
              : "var(--mantine-color-gray-5)",
          }
        }}
      >
      <MdDarkMode color="gray"/>
      </ActionIcon>
    </Box>
  );
};