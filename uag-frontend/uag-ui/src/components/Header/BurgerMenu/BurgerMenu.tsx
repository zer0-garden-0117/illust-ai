import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '@mantine/core';
import { MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine, RiDeleteBin6Line, RiUserSettingsLine
} from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import classes from './BurgerMenu.module.css';

export const BurgerMenu: React.FC = () => {
  const [menuOpened, setMenuOpened] = useState(false); // メニュー開閉状態を管理
  const router = useRouter();

  const onClickFreeicon = () => {
    router.push("/icon");
  };

  const onClickFreeillustration = () => {
    router.push("/illustration");
  };

  const onClickUtinoko = () => {
    router.push("/utinoko");
  };

  return (
    <>
      <Menu
        opened={menuOpened} // メニューが開かれているかどうかを制御
        onOpen={() => setMenuOpened(true)} // メニューが開かれたときの処理
        onClose={() => setMenuOpened(false)} // メニューが閉じられたときの処理
      >
        <Menu.Target>
          <div className={`${classes.clickableIcon} ${menuOpened ? classes.active : ''}`}>
            <RxHamburgerMenu
              size="1.3rem"
              className={classes.userIcon}
              aria-label="Open menu"
            />
          </div>
        </Menu.Target>
        <Menu.Dropdown className={classes.menuDropdown}>
          <Menu.Item
            leftSection={<RiUserSettingsLine className={classes.icon} />}
            onClick={onClickFreeicon}
          >
            フリーアイコン
          </Menu.Item>
          <Menu.Item
            leftSection={<RiShieldKeyholeLine className={classes.icon} />}
            onClick={onClickFreeillustration}
          >
            フリーイラスト
          </Menu.Item>
          <Menu.Item
            leftSection={<RiDeleteBin6Line className={classes.icon} />}
            onClick={onClickUtinoko}
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
        </Menu.Dropdown>
      </Menu>
    </>
  );
};