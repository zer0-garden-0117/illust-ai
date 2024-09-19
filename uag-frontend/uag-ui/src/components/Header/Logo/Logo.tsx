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
  return (
    <Flex direction="row" align="center" gap={4}>
      <>
        <span>
          Angel Sandbox
        </span>
      </>
      {/* <span className={classes.subtitle}>
        猫耳天使のフリーイラストサイト
      </span> */}
    </Flex>
  );
};