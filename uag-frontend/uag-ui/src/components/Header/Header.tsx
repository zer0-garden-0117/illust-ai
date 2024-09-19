import React, { useState } from 'react';
import { Box, Button, Space, TextInput } from '@mantine/core';
import { Logo } from './Logo/Logo';
import { UserMenu } from './UserMenu/UserMenu';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { QuickSearch } from './QuickSearch/QuickSearch';
import classes from './Header.module.css';
import { Butterfly_Kids } from 'next/font/google';

export interface HeaderProps {
  burger?: React.ReactNode;
  onSearchClick: () => void;
  isSearching: boolean;
}

export const Header: React.FC<HeaderProps> = (
  { burger, onSearchClick, isSearching }
) => {
  return (
    <>
      <header className={classes.header}>
        {burger && burger}
        <Logo />
        <Box className={classes.flexGrow} />
        {/* 検索状態によって表示を切り替え */}
        <QuickSearch
          onSearchClick={() => onSearchClick()}
          isSearching={isSearching} />
        <UserMenu />
        <BurgerMenu />
      </header>
      {isSearching && (
        <>
          <Box className={classes.flexGrow} />
          <Space w="md" />
          {/* 検索ボックスとボタンを横に並べる */}
          <Box className={classes.searchBoxWrapper}>
            <TextInput
              placeholder="Search..."
              className={classes.searchBox}
              // onBlur={() => onSearchClick()}
              size="xs"
              styles={{ input: { fontSize: '16px' } }}
              radius="xl"
            />
            <Button
              className={classes.searchButton}
              size="xs"
              color="orange"
              variant="light"
              radius="xl"
            >
              検索
            </Button>
          </Box>
          <Space w="md" />
        </>
      )}
    </>
  );
};

