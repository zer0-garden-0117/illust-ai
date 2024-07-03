import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CustomMantineProvider } from '../../providers/mantine/mantineProvider';
import { AuthProvider } from '../../providers/auth/authProvider';
import { AppShellLayout } from '../../components/AppShellLayout/AppShellLayout';

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
            <AuthProvider>
              <AppShellLayout>
                {children}
              </AppShellLayout>
            </AuthProvider>
          </NextIntlClientProvider>
        </CustomMantineProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;