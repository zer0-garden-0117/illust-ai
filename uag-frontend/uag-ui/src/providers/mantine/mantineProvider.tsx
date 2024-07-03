import '@mantine/core/styles.css';
import { type ReactNode } from "react";
import { MantineProvider } from '@mantine/core';
import { Hind_Madurai } from 'next/font/google';

const hindMadurai = Hind_Madurai({
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
        fontFamily: hindMadurai.style.fontFamily,
        headings: { fontFamily: hindMadurai.style.fontFamily },
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