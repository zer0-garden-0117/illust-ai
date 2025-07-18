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
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import ClientGoogleAnalytics from '@/utils/googleAnalytics';

const APP_NAME = 'ANGEL SANDBOX';
const APP_DESCRIPTION = 'ANGEL SANDBOX';
const APP_IMAGE_URL = process.env.NEXT_PUBLIC_CDN_URL + '/toppage_ogpImage.jpeg'
const APP_IMAGE_ALT = 'ANGEL SANDBOX';

export const metadata: Metadata = {
  icons: {
    icon: 'favicon.ico',
  },
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: APP_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: APP_IMAGE_ALT,
      },
    ],
    type: 'website',
    url: APP_IMAGE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [APP_IMAGE_URL],
  },
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
        <ClientGoogleAnalytics />
      </body>
    </html>
  );
};

export default LocaleLayout;