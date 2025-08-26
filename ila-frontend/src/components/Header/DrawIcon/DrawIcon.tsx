import React from 'react';
import { Box, ActionIcon, useMantineColorScheme, Group, Badge } from '@mantine/core';
import { useRouter } from "next/navigation";
import { IconPencil } from '@tabler/icons-react';

export const DrawIcon: React.FC = () => {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const onIconClick = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

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
      >
        <IconPencil />
      </ActionIcon>
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
        5
      </Badge>
    </Group>
    </Box>
  );
};