import React from 'react';
import { Box, Group, Space } from '@mantine/core';
import { Logo } from './Logo/Logo';
import { useTranslations } from 'next-intl';
import { UserIcon } from './UserIcon/UserIcon';
import { DrawIcon } from './DrawIcon/DrawIcon';

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const t = useTranslations("header");

  return (
    <>
      <Box
        component="header"
        p="md"
        px="sm"
        style={{
          gap: 'var(--mantine-spacing-md)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Logo />
        <Group gap="8">
          <Box style={{ flex: 1 }} />
          <DrawIcon />
          <UserIcon />
        </Group>
      </Box>
      <Space w="md" />
    </>
  );
};