'use client';
// ブラウザのwidthにより動的にバーガーメニュー表示切替のレイアウトのためCSR
import { AppShell, Burger, Text, Loader, Center } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { Header } from '../Header/Header';
import { useTranslations } from "next-intl";

export const AppShellLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const t = useTranslations("appshell");
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggle = () => setOpened((o) => !o);

  useEffect(() => {
    // 初回や再マウントのレンダリング時にアイコンだけ遅延表示するのを防ぐために
    // ローディングスピナーを表示（0.5秒は必ず表示する設定）
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
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      transitionDuration={500}
      transitionTimingFunction="ease"
    >
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Header>
        <Header
          burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mr="xl" />}
        />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Text w="full" size="sm" ta="right" pr="20">
          {t('copyright')}
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
};