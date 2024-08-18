import React from 'react';
import { Avatar, Menu } from '@mantine/core';
import { MdLogin, MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine,
  RiDeleteBin6Line,
  RiUserSettingsLine
} from "react-icons/ri";
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { useAuth } from '../../../hooks/auth/useAuth';
import classes from './UserMenu.module.css';

export const UserMenu: React.FC = () => {
  const { isAuthenticated, login, logout, email } = useAuth();

  const handleLoginClick = () => {
    login();
  };

  return (
    <Menu>
      <Menu.Target>
        <div className={classes.clickableAvatar}>
          <Avatar
            alt="User Avatar"
            radius="xl"
            variant="light"
            color="yellow"
            size="1.9rem"
            className={classes.avatar}
          >
            {isAuthenticated ? email?.charAt(0) : ''}
          </Avatar>
        </div>
      </Menu.Target>
      <Menu.Dropdown className={classes.menuDropdown}>
        {isAuthenticated && (
          <>
            <div className={classes.accountlabel}>アカウント情報</div>
            <div className={classes.email}>{email}</div>
            <Menu.Divider />
          </>
        )}
        {!isAuthenticated && (
          <Menu.Item
            leftSection={<MdLogin className={classes.icon} />}
            onClick={handleLoginClick}>
            ログイン
          </Menu.Item>
        )}
        {isAuthenticated && (
          <>
            <Menu.Item
              leftSection={<MdLogout className={classes.icon} />}
              onClick={logout}>
              ログアウト
            </Menu.Item>
            <Menu.Item
              leftSection={<RiUserSettingsLine className={classes.icon} />}>
              登録内容変更
            </Menu.Item>
            <Menu.Item
              leftSection={<RiShieldKeyholeLine className={classes.icon} />}>
              パスワード変更
            </Menu.Item>
            <Menu.Item
              leftSection={<RiDeleteBin6Line className={classes.icon} />}>
              登録削除
            </Menu.Item>
            <Menu.Divider />
          </>
        )}
        <LanguagePicker />
        <ThemeSwitcher />
      </Menu.Dropdown>
    </Menu>
  );
};