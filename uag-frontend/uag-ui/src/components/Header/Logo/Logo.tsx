import { Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslations } from "next-intl";

import Link from 'next/link';
import classes from './Logo.module.css';

export interface LogoProps {
  width?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = () => {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const t = useTranslations("header");

  return (
    <Flex direction="row" align="center" gap={4}>
      <Link href="/" className={classes.heading}>
        <Text fw="bolder" size={isSmallScreen ? "sm" : ""}>
          {/* {t('title')} */}
        </Text>
      </Link>
      {!isSmallScreen && (
        <Text className={classes.subtitle}>
          {/* {t('subtitle')} */}
        </Text>
      )}
    </Flex>
  );
};