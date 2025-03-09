import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Text } from '@mantine/core';
import { MdLogin, MdLogout } from "react-icons/md";
import {
  RiShieldKeyholeLine, RiDeleteBin6Line, RiUserSettingsLine,
  RiUserLine
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
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';
import { FaRegHeart, FaRegStar } from 'react-icons/fa';
import AuthModal from '../AuthModal/AuthModal';
import { IconChevronRight } from '@tabler/icons-react';
import { useUserTokenContext } from '@/providers/auth/userTokenProvider';


export const BurgerMenu: React.FC = () => {
  const [menuOpened, setMenuOpened] = useState(false); // メニュー開閉状態を管理
  const navigation = useNavigate();
  const { isAuthenticated, login, loginWithHosted, logout, email } = useAccessTokenContext();
  const { isAdmin, userToken } = useUserTokenContext();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const onClickLiked = () => {
    navigation("/liked?page=1");
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

  const onClickLogout = async () => {
    await logout()
    window.location.href = "/"
  };

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

  const onClickManage = () => {
    navigation("/works/management/?page=1");
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
              <div
                className={classes.email}
                style={{ marginTop: '-12px', marginRight: '10px' }}
              >
                {email}
              </div>
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
                onClick={onClickLogout}
              >
                ログアウト
              </Menu.Item>
            </>
          )}
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
            onClick={onClickFreeicon}
          >
            零崎家
          </Menu.Item>
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
          <Menu.Item
            leftSection={<MdOutlineChevronRight className={classes.icon} />}
          >
            本サイトについて
          </Menu.Item>
          {isAuthenticated && isAdmin && (
            <>
              <Menu.Item
                leftSection={<MdOutlineChevronRight className={classes.icon} />}
                onClick={onClickManage}
              >
                管理
              </Menu.Item>
              <Menu.Item
                leftSection={<MdOutlineChevronRight className={classes.icon} />}
                onClick={onClickAdmin}
              >
                投稿
              </Menu.Item>
            </>
          )}
          <Menu.Divider />
          <LanguagePicker />
          <ThemeSwitcher />
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