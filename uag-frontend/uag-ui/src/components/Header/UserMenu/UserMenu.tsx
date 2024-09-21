import React, { useState } from 'react';
import { useAccessToken } from '../../../apis/auth/useAccessToken';
import { Menu } from '@mantine/core';
import { MdLogin, MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine, RiDeleteBin6Line, RiUserSettingsLine
} from "react-icons/ri";
import { RiUserLine } from "react-icons/ri";
import classes from './UserMenu.module.css';
import AuthModal from '../AuthModal/AuthModal';

export const UserMenu: React.FC = () => {
  const { isAuthenticated, login, loginWithHosted, logout, email } = useAccessToken();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false); // メニュー開閉状態を管理

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleSignupClick = () => {
    setSignupModalOpen(true);
  };

  return (
    <>
      <Menu
        opened={menuOpened} // メニューが開かれているかどうかを制御
        onOpen={() => setMenuOpened(true)} // メニューが開かれたときの処理
        onClose={() => setMenuOpened(false)} // メニューが閉じられたときの処理
      >
        <Menu.Target>
          <div className={`${classes.clickableAvatar} ${menuOpened ? classes.active : ''}`}>
            <RiUserLine
              size="1.3rem"
              className={classes.userIcon}
              aria-label="Open user menu"
            />
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
              onClick={handleLoginClick}
            >
              ログイン
            </Menu.Item>
          )}
          {!isAuthenticated && (
            <Menu.Item
              leftSection={<MdLogin className={classes.icon} />}
              onClick={handleSignupClick}
            >
              アカウントを作成
            </Menu.Item>
          )}
          {isAuthenticated && (
            <>
              <Menu.Item
                leftSection={<MdLogout className={classes.icon} />}
                onClick={logout}
              >
                ログアウト
              </Menu.Item>
              <Menu.Item
                leftSection={<RiUserSettingsLine className={classes.icon} />}
              >
                登録内容変更
              </Menu.Item>
              <Menu.Item
                leftSection={<RiShieldKeyholeLine className={classes.icon} />}
              >
                パスワード変更
              </Menu.Item>
              <Menu.Item
                leftSection={<RiDeleteBin6Line className={classes.icon} />}
              >
                登録削除
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>

      <AuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        isLogin={true}
      />
      <AuthModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        isLogin={false}
      />
    </>
  );
};