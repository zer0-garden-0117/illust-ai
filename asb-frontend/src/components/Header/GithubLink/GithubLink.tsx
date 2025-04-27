import React from 'react';
import { Box, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { BsGithub } from "react-icons/bs";
import { useRouter } from "next/navigation";

export const GithubLink: React.FC = () => {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const onIconClick = async () => {
    router.push('/');
  };

  return (
    <Box mt={2}>
      <ActionIcon
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
      <BsGithub
        size="1.3rem"
        height="32"
        style={{ 
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
        onClick={onIconClick}
      />
      </ActionIcon>
    </Box>
  );
};