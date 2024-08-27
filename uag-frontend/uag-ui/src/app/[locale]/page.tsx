'use client';
import { useUserToken } from '@/apis/auth/useUserToken';
import { useUserTokenContext } from '@/providers/auth/userTokenProvider';
import { Box, Fieldset, } from '@mantine/core';
import { useTranslations } from "next-intl";

const TopPage: React.FC = () => {
  const t = useTranslations("toppage");

  return (
    <Fieldset legend={t('legend')}>
      <Box style={{ 'maxWidth': '800', padding: '20px', margin: 'auto', }} />
    </Fieldset>
  );
};

export default TopPage;