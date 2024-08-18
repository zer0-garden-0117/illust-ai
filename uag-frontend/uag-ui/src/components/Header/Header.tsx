import React from 'react';
import { Box } from '@mantine/core';
import { Logo } from './Logo/Logo';
import { UserMenu } from './UserMenu/UserMenu';  // 新しくインポート
import classes from './Header.module.css';

export interface HeaderProps {
  burger?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ burger }) => {
  return (
    <header className={classes.header}>
      {burger && burger}
      <Logo />
      <Box className={classes.flexGrow} />
      <UserMenu />
    </header>
  );
};