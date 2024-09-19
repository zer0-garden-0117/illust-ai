import React from 'react';
import { Menu, Burger } from '@mantine/core';
import { MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine, RiDeleteBin6Line, RiUserSettingsLine
} from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import classes from './BurgerMenu.module.css';

export const BurgerMenu: React.FC = () => {
  return (
    <>
      <Menu>
        <Menu.Target>
          <div className={classes.clickableIcon}>
            <RxHamburgerMenu
              size="1.3rem"
              className={classes.userIcon}
              aria-label="Open search menu"
            />
          </div>
        </Menu.Target>
        <Menu.Dropdown className={classes.menuDropdown}>
          <Menu.Item
            leftSection={<RiUserSettingsLine className={classes.icon} />}
          >
            フリーアイコン
          </Menu.Item>
          <Menu.Item
            leftSection={<RiShieldKeyholeLine className={classes.icon} />}
          >
            フリーイラスト
          </Menu.Item>
          <Menu.Item
            leftSection={<RiDeleteBin6Line className={classes.icon} />}
          >
            うちの子
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<MdLogout className={classes.icon} />}
          >
            本サイトについて
          </Menu.Item>
          <Menu.Divider />
          <LanguagePicker />
          <ThemeSwitcher />
          <Menu.Divider />
        </Menu.Dropdown>
      </Menu>
    </>
  );
};