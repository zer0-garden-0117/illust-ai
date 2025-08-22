import React, { useState } from 'react';
import { Box, Button, Group, Space, TextInput } from '@mantine/core';
import { Logo } from './Logo/Logo';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import classes from './Header.module.css';
import { useNavigate } from '@/utils/navigate';
import { useTranslations } from 'next-intl';
import { LangMenu } from './LangMenu/LangMenu';
import { GithubLink } from './GithubLink/GithubLink';
import { DarkMode } from './DarkMode/DarkMode';

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
        <Group gap="8">
          <Box className={classes.flexGrow} />
          <BurgerMenu />
        </Group>
      </header>
      <Space w="md" />
    </>
  );
};

