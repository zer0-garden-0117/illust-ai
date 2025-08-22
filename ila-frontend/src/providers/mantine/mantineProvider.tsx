import '@mantine/core/styles.css';
import { type ReactNode } from "react";
import { MantineProvider } from '@mantine/core';
import { Noto_Sans_JP } from 'next/font/google';

// Noto Sans JP をインポート

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface CustomMantineProviderProps {
  children: ReactNode;
}

export const CustomMantineProvider: React.FC<CustomMantineProviderProps> = ({ children }) => {
  return (
    <MantineProvider
      theme={{
        fontFamily: `${notoSansJP.style.fontFamily}, sans-serif`,
        headings: { fontFamily: `${notoSansJP.style.fontFamily}, sans-serif` },
        components: {
          Icon: {
            defaultProps: {
              color: 'yellow',
            },
          },
        }
      }}
    >
      {children}
    </MantineProvider>
  );
};