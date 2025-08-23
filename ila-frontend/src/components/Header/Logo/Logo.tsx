import { Box, Flex, Text } from '@mantine/core';
import { useTranslations } from "next-intl";
import { useNavigate } from '@/utils/navigate';
import { useState } from 'react';
import classes from './Logo.module.css';
import { IconPencilCode } from '@tabler/icons-react';

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
      <Box
        ml={-15}
        mr={15}>
          <IconPencilCode
            size={30}
            color='var(--mantine-color-cyan-3)'/>
      </Box>
      <Text
        fw={700}
        c={"var(--mantine-color-gray-7)"}
        // c={"var(--mantine-color-blue-5)"}
        size='20px'
        ml={-15}
        fs="italic"
        lts="-0.15em"
      >
        イラスト
      </Text>
      <Text
        fw={510}
        ml={-4}
        // c={"var(--mantine-color-pink-3)"}
        c={"var(--mantine-color-cyan-3)"}
        // c={"#00BCD4"}
        size='29px'
        fs="italic"
        lts="-0.02em"
      >
        AI
      </Text>
    </Flex>
  );
};