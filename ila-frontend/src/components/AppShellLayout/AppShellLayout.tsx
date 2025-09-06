'use client';

import { AppShell, Loader, Center } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Header } from '../Header/Header';
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from 'next/navigation';

export const AppShellLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const t = useTranslations("appshell");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
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
      footer={{ height: 20 }}
      padding="md"
      transitionDuration={0}
      transitionTimingFunction="ease"
      styles={(theme) => ({
        root: {
          '--app-shell-border-color': 'transparent', // ボーダーカラーを透明に
        },
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
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};