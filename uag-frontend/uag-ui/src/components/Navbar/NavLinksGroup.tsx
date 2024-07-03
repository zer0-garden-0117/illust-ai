'use client';

import { Box, Group, ThemeIcon, UnstyledButton } from '@mantine/core';
import React from 'react';
import classes from './NavLinksGroup.module.css';
import { IconType } from "react-icons";

export interface NavLinksGroupProps {
  icon: IconType;
  label: string;
}

export const NavLinksGroup: React.FC<NavLinksGroupProps> = ({
  icon: Icon,
  label,
}) => {
  return (
    <UnstyledButton className={classes.control}>
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