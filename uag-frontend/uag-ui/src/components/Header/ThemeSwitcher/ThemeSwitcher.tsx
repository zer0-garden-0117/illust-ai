'use client';

import { Group, Switch, useMantineColorScheme } from '@mantine/core';
import classes from './ThemeSwitcher.module.css';
import { MdDarkMode } from 'react-icons/md';

export interface ThemeSwitcherProps { }

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const handleToggle = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={classes.themelabel}>
      <Group>
        <MdDarkMode color="gray"/>
        <Switch
          checked={colorScheme === 'dark'}
          onChange={handleToggle}
          size="xs"
          className={classes.switch}
        />
      </Group>
    </div>
  );
};