import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CustomMantineProvider } from '../../providers/mantine/mantineProvider';
import { AuthProvider } from '../../providers/auth/authProvider';
import { AppShellLayout } from '../../components/AppShellLayout/AppShellLayout';
import { ErrorProvider } from '@/providers/error/errorProvider';
import { UserTokenProvider } from '@/providers/auth/userTokenProvider';
import type { Metadata } from 'next';
import type { Viewport } from 'next'
import { AccessTokenProvider } from '@/providers/auth/accessTokenProvider';

export const metadata: Metadata = {
  title: 'Unlimited Angel Generation',
  description: 'Unlimited Angel Generation',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

const LocaleLayout = async ({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <CustomMantineProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorProvider>
              <AuthProvider>
                <AccessTokenProvider>
                  <UserTokenProvider>
                    <AppShellLayout>
                      {children}
                    </AppShellLayout>
                  </UserTokenProvider>
                </AccessTokenProvider>
              </AuthProvider>
            </ErrorProvider>
          </NextIntlClientProvider>
        </CustomMantineProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;