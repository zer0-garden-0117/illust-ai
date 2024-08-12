'use client';
import ArticlesCardsGrid from '@/components/ArticlesCardsGrid/ArticlesCardsGrid';
import { Box, Fieldset, } from '@mantine/core';
import { useTranslations } from "next-intl";

const TopPage: React.FC = () => {
  const t = useTranslations("toppage");

  return (
    <>
      {/* <Fieldset legend={t('legend')}> */}
      <ArticlesCardsGrid />
      {/* </Fieldset> */}
    </>
  );
};

export default TopPage;