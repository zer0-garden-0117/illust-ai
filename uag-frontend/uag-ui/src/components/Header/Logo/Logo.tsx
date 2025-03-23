import { Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import classes from './Logo.module.css';
import { useNavigate } from '@/utils/navigate';

export interface LogoProps {
  width?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = () => {
    const t = useTranslations("logo");
  const navigation = useNavigate();

  const onClickLogo = () => {
    navigation("/");
  };

  return (
    <Flex
      direction="row"
      justify="flex-start"
      align="center"
      gap={4}
      onClick={onClickLogo}
      className={classes.logoContainer}
    >
      <>
        <Text fw={700} size='sm' ml={-15}>
          {/* Angel Sandbox */}
          {t("title")}
        </Text>
      </>
    </Flex>
  );
};