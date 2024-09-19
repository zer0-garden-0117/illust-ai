import React, { useState } from 'react';
import { useAccessToken } from '../../../apis/auth/useAccessToken';
import { Avatar, Menu } from '@mantine/core';
import { MdLogin, MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine, RiDeleteBin6Line, RiUserSettingsLine
} from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import LoginModal from '../LoginModal/LoginModal';
import classes from './UserMenu.module.css';
import SignupModal from '../SignupModal/SignupModal';

export const UserMenu: React.FC = () => {
  const { isAuthenticated, login, loginWithHosted, logout, email } = useAccessToken();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const handleLoginClick = () => {
    // 独自ログイン画面を使う場合
    setLoginModalOpen(true);

    // HostedUIを使う場合
    // loginWithHosted();
  };

  const handleSignupClick = () => {
    // 独自ログイン画面を使う場合
    setSignupModalOpen(true);

    // HostedUIを使う場合
    // loginWithHosted();
  };


  return (
    <>
      <Menu>
        <Menu.Target>
          <div className={classes.clickableAvatar}>
            <RiUserLine
              size="1.3rem"
              className={classes.userIcon}
              aria-label="Open search menu"
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

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
      />
    </>
  );
};