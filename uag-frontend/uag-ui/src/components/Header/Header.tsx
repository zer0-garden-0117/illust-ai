import React, { useState } from 'react';
import { Box, Button, Space, TextInput } from '@mantine/core';
import { Logo } from './Logo/Logo';
import { UserMenu } from './UserMenu/UserMenu';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { QuickSearch } from './QuickSearch/QuickSearch';
import classes from './Header.module.css';
import { Butterfly_Kids } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useNavigate } from '@/utils/navigate';
import { useTranslations } from 'next-intl';
import { LangMenu } from './LangMenu/LangMenu';

export interface HeaderProps {
  burger?: React.ReactNode;
  onSearchClick: () => void;
  isSearching: boolean;
}

export const Header: React.FC<HeaderProps> = (
  { burger, onSearchClick, isSearching }
) => {
  const t = useTranslations("header");
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const navigation = useNavigate();

  const onSearchButtonClick = () => {
    if (searchQuery.trim()) {
      navigation(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigation(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  return (
    <>
      <header className={classes.header}>
        {burger && burger}
        <Logo />
        <Box className={classes.flexGrow} />
        {/* 検索状態によって表示を切り替え */}
        {/* <QuickSearch
          onSearchClick={() => onSearchClick()}
          isSearching={isSearching} /> */}
        {/* <UserMenu /> */}
        <LangMenu />
        <BurgerMenu />
      </header>
      {isSearching && (
        <>
          <Box className={classes.flexGrow} />
          <Space w="md" />
          {/* 検索ボックスとボタンを横に並べる */}
          <Box className={classes.searchBoxWrapper}>
            <TextInput
              placeholder={t("search")}
              className={classes.searchBox}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              size="xs"
              styles={{ input: { fontSize: '16px' } }}
              radius="md"
              onKeyDown={onKeyDown}
            />
            <Button
              className={classes.searchButton}
              size="xs"
              color="orange"
              variant="light"
              radius="xl"
              onClick={onSearchButtonClick}
            >
              {t("searchButton")}
            </Button>
          </Box>
          <Space w="md" />
        </>
      )}
    </>
  );
};

