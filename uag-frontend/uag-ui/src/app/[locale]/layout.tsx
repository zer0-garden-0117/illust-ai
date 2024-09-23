import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CustomMantineProvider } from '../../providers/mantine/mantineProvider';
import { AuthProvider } from '../../providers/auth/authProvider';
import { AppShellLayout } from '../../components/AppShellLayout/AppShellLayout';
import { ErrorProvider } from '@/providers/error/errorProvider';
import { UserTokenProvider } from '@/providers/auth/userTokenProvider';

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
                <UserTokenProvider>
                  <AppShellLayout>
                    {children}
                  </AppShellLayout>
                </UserTokenProvider>
              </AuthProvider>
            </ErrorProvider>
          </NextIntlClientProvider>
        </CustomMantineProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;