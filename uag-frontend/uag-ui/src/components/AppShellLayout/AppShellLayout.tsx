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
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 200, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
      footer={{ height: 20 }}
      padding="md"
      transitionDuration={0}
      transitionTimingFunction="ease"
    >
      <AppShell.Navbar>
        <Navbar setOpened={setOpened} />
      </AppShell.Navbar>
      <AppShell.Header>
        <Header
          burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mr="xl" />}
        />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Aside>
        <Sidebar />
      </AppShell.Aside>
      <AppShell.Footer>
        <Text w="full" size="sm" ta="right" pr="20">
          {t('copyright')}
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
};