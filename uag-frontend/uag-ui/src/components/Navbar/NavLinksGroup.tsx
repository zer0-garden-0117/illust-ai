'use client';

import { Box, Group, ThemeIcon, UnstyledButton } from '@mantine/core';
import React from 'react';
import classes from './NavLinksGroup.module.css';
import { useRouter } from 'next/navigation';
import { IconType } from "react-icons";
import { useNavigate } from '@/utils/navigate';

export interface NavLinksGroupProps {
  icon: IconType;
  label: string;
  href: string;
  onClick: () => void;
}

export const NavLinksGroup: React.FC<NavLinksGroupProps> = ({
  icon: Icon,
  label,
  href,
  onClick
}) => {
  const navigation = useNavigate();
  const handleClick = () => {
    onClick();
    navigation(href);
  };

  return (
    <UnstyledButton className={classes.control} onClick={handleClick}>
      <Group gap={0} justify="space-between">
        <Box className={classes.box}>
          <ThemeIcon variant="light" size={30} color="yellow">
            <Icon size="1.1rem" />
          </ThemeIcon>
          <Box ml="md">{label}</Box>
        </Box>
      </Group>
    </UnstyledButton>
  );
};