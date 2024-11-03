import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessToken } from '../../../apis/auth/useAccessToken';
import { Avatar, Group, Menu, Space } from '@mantine/core';
import { MdLogin, MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine, RiDeleteBin6Line, RiUserSettingsLine, RiHeartAdd2Line
} from "react-icons/ri";
import { FaRegStar, FaRegHeart } from "react-icons/fa";
import { RiUserLine } from "react-icons/ri";
import classes from './UserMenu.module.css';
import AuthModal from '../AuthModal/AuthModal';
import { useNavigate } from '@/utils/navigate';

export const UserMenu: React.FC = () => {
  const { isAuthenticated, login, loginWithHosted, logout, email } = useAccessToken();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false); // メニュー開閉状態を管理
  const navigation = useNavigate();

  const onClickLiked = () => {
    navigation("/likednavigation?page=1");
  };

  const onClickRated = () => {
    navigation("/rated?page=1");
  };

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
              <Menu.Item
                leftSection={<RiUserLine className={classes.icon} />}
                style={{ pointerEvents: 'none' }}
              >
                {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '3px' }}> */}
                <div className={classes.accountlabel2}>ユーザー情報</div> {/* ユーザー情報 */}
                {/* </div> */}
              </Menu.Item>
              <div className={classes.email} style={{ marginTop: '-12px', marginRight: '10px' }}>{email}</div> {/* 余白を調整 */}
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
                leftSection={<FaRegHeart className={classes.icon} />}
                onClick={onClickLiked}
              >
                お気に入りリスト
              </Menu.Item>
              <Menu.Item
                leftSection={<FaRegStar className={classes.icon} />}
                onClick={onClickRated}
              >
                レビューリスト
              </Menu.Item>
              <Menu.Item
                leftSection={<MdLogout className={classes.icon} />}
                onClick={logout}
              >
                ログアウト
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