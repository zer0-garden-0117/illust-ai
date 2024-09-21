import { Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import classes from './Logo.module.css';

export interface LogoProps {
  width?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = () => {
  const router = useRouter();

  const onClickLogo = () => {
    router.push("/");
    // window.location.href = "/";
  };

  return (
    <Flex
      direction="row"
      align="center"
      gap={4}
      onClick={onClickLogo}
      className={classes.logoContainer}
    >
      <>
        <Text fw={700} size='xl'>
          Angel Sandbox
        </Text>
      </>
    </Flex>
  );
};