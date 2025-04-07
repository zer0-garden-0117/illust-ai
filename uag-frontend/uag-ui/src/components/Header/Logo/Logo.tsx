import { Flex, Text } from '@mantine/core';
import { useTranslations } from "next-intl";
import { useNavigate } from '@/utils/navigate';
import { useState } from 'react';
import classes from './Logo.module.css';

export interface LogoProps {
  width?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = () => {
  const t = useTranslations("logo");
  const navigation = useNavigate();
  const [isActive, setIsActive] = useState(false);

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
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        transform: isActive ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.2s ease',
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
    >
      <Text
        fw={900}
        variant="gradient"
        gradient={{ from: '#fd7e14', to: 'hotpink', deg: 90 }}
        size='lg'
        ml={-15}
        style={{
          transition: 'filter 0.2s ease',
          filter: isActive ? 'brightness(0.9)' : 'brightness(1)',
        }}
      >
        {t("title")}
      </Text>
    </Flex>
  );
};