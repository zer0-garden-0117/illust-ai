'use client';

import { AppShell, Burger, Text, Loader, Center } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { Sidebar } from '../Sidebar/Sidebar'
import { Header } from '../Header/Header';
import { useTranslations } from "next-intl";

export const AppShellLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const t = useTranslations("appshell");
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(120); // 初期値を60に設定
  const [isSearching, setIsSearching] = useState(true);

  // 検索アイコンがクリックされたときに高さを切り替える関数
  const toggleHeaderHeight = () => {
    setIsSearching(!isSearching);
    setHeaderHeight(isSearching ? 60 : 120); // クリック時に60か120に切り替える
  };

  const toggle = () => setOpened((o) => !o);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Center style={{ width: '100%', height: '100vh' }}>
        <Loader color="black" size="xs" />
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: headerHeight }}
      // navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      // aside={{ width: 200, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
      footer={{ height: 20 }}
      padding="md"
      transitionDuration={0}
      transitionTimingFunction="ease"
      styles={(theme) => ({
        main: {
          maxWidth: '1200px', // コンテンツエリアの最大幅を設定
          margin: '0 auto', // 両脇に自動で隙間を入れる
          paddingLeft: theme.breakpoints.lg ? '20px' : '10px', // lg以上のときにパディングを調整
          paddingRight: theme.breakpoints.lg ? '20px' : '10px',
        },
        header: {
          maxWidth: '1200px', // ヘッダーの最大幅を設定
          margin: '0 auto',   // 両脇に自動で隙間を入れる
          paddingLeft: theme.breakpoints.lg ? '20px' : '10px', // lg以上のときにパディングを調整
          paddingRight: theme.breakpoints.lg ? '20px' : '10px',
        },
      })}
    >
      {/* <AppShell.Navbar>
        <Navbar setOpened={setOpened} />
      </AppShell.Navbar> */}
      <AppShell.Header>
        <Header
          // burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mr="xl" />}
          onSearchClick={toggleHeaderHeight}
          isSearching={isSearching}
        />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      {/* <AppShell.Aside>
        <Sidebar />
      </AppShell.Aside> */}
      <AppShell.Footer>
        <Text w="full" size="xs" ta="right" pr="20">
          {t('copyright')}
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
};