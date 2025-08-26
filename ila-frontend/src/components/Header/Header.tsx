import React from 'react';
import { Box, Group, Space } from '@mantine/core';
import { Logo } from './Logo/Logo';
import classes from './Header.module.css';
import { useTranslations } from 'next-intl';
import { UserIcon } from './UserIcon/UserIcon';
import { DrawIcon } from './DrawIcon/DrawIcon';

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const t = useTranslations("header");

  return (
    <>
      <header className={classes.header}>
        <Logo />
        <Group gap="8">
          <Box className={classes.flexGrow} />
          <DrawIcon />
          <UserIcon />
        </Group>
      </header>
      <Space w="md" />
    </>
  );
};

