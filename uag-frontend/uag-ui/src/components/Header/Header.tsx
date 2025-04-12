import React, { useState } from 'react';
import { Box, Button, Space, TextInput } from '@mantine/core';
import { Logo } from './Logo/Logo';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import classes from './Header.module.css';
import { useNavigate } from '@/utils/navigate';
import { useTranslations } from 'next-intl';
import { LangMenu } from './LangMenu/LangMenu';

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const t = useTranslations("header");
  const [searchQuery, setSearchQuery] = useState('');
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
        <Logo />
        <Box className={classes.flexGrow} />
        <LangMenu />
        <BurgerMenu />
      </header>
      <Box className={classes.flexGrow} />
      <Space w="md" />
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
  );
};

