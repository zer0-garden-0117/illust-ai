import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Text } from '@mantine/core';
import { MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine, RiDeleteBin6Line, RiUserSettingsLine
} from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import classes from './BurgerMenu.module.css';
import { useNavigate } from '@/utils/navigate';
import { PiStarOfDavidLight } from "react-icons/pi";
import { GiLibertyWing } from "react-icons/gi";
import { FiChevronsRight } from "react-icons/fi";
import { PiShootingStarThin } from "react-icons/pi";
import { PiStarFour } from "react-icons/pi";
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";


export const BurgerMenu: React.FC = () => {
  const [menuOpened, setMenuOpened] = useState(false); // メニュー開閉状態を管理
  const navigation = useNavigate();

  const onClickFreeicon = () => {
    navigation("/icon?page=1");
  };

  const onClickFreeillustration = () => {
    navigation("/illustration?page=1");
  };

  const onClickUtinoko = () => {
    navigation("/utinoko?page=1");
  };

  const onClickAdmin = () => {
    navigation("/admin?page=1");
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
          <Menu.Label>零崎家</Menu.Label>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeicon}
          >
            真白
          </Menu.Item>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeillustration}
          >
            くるみ
          </Menu.Item>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeillustration}
          >
            鈴
          </Menu.Item>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeillustration}
          >
            蒼
          </Menu.Item>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeillustration}
          >
            etc
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>ジャンル別</Menu.Label>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeillustration}
          >
            フリーイラスト
          </Menu.Item>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeicon}
          >
            フリーアイコン
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
          >
            本サイトについて
          </Menu.Item>
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickAdmin}
          >
            管理
          </Menu.Item>
          <Menu.Divider />
          <LanguagePicker />
          <ThemeSwitcher />
        </Menu.Dropdown>
      </Menu>
    </>
  );
};