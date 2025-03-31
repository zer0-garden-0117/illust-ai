import React, { useEffect, useState } from 'react';
import { Menu } from '@mantine/core';
import { MdLogin, MdLogout, MdOutlineDelete } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import classes from './BurgerMenu.module.css';
import { useNavigate } from '@/utils/navigate';
import { MdOutlineChevronRight } from "react-icons/md";
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';
import { FaRegStar } from 'react-icons/fa';
import { BiSolidInvader } from "react-icons/bi";
import AuthModal from '../AuthModal/AuthModal';
import { useUserTokenContext } from '@/providers/auth/userTokenProvider';
import { useTranslations } from 'next-intl';
import { CiHeart } from 'react-icons/ci';
import { UserDeleteArgs, UserDeleteHeaders, useUsersDelete } from '@/apis/openapi/users/useUsersDelete';
import { getCsrfTokenFromCookies, getUserTokenFromCookies } from '@/utils/authCookies';

export const BurgerMenu: React.FC = () => {
  const t = useTranslations("burgerMenu");
  const [menuOpened, setMenuOpened] = useState(false); // メニュー開閉状態を管理
  const navigation = useNavigate();
  const { accessToken, isAuthenticated, login, loginWithHosted, logout, email } = useAccessTokenContext();
  const { isAdmin, userToken } = useUserTokenContext();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const { trigger: triggerUserDelete } = useUsersDelete();

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

  const onClickDeleteAccount = async () => {
    const headers: UserDeleteHeaders = {
      Authorization: `Bearer ` + getUserTokenFromCookies() as `Bearer ${string}`,
      "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
    }
    await triggerUserDelete({ headers });
    await logout()
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
                <div className={classes.accountlabel2}>{t("userInfo")}</div> {/* ユーザー情報 */}
                {/* </div> */}
              </Menu.Item>
              <div
                className={classes.email}
                style={{ marginTop: '-12px', marginRight: '10px' }}
              >
                {email}
              </div>
            </>
          )}
          {!isAuthenticated && (
            <Menu.Item
              leftSection={<MdLogin color="orange" className={classes.icon} />}
              onClick={handleLoginClick}
            >
              {t("login")}
            </Menu.Item>
          )}
          {!isAuthenticated && (
            <Menu.Item
              leftSection={<FiUserPlus color="orange" className={classes.icon} />}
              onClick={handleSignupClick}
            >
              {t("signup")}
            </Menu.Item>
          )}
          <Menu.Divider />
          {isAuthenticated && (
            <>
              <Menu.Item
                leftSection={<CiHeart color="hotpink" className={classes.icon} />}
                onClick={onClickLiked}
              >
                {t("favoriteList")}
              </Menu.Item>
              <Menu.Item
                leftSection={<FaRegStar color="orange" className={classes.icon} />}
                onClick={onClickRated}
              >
                {t("reviewList")}
              </Menu.Item>
            </>
          )}
          <Menu.Item
            leftSection={<BiSolidInvader color="purple" className={classes.icon} />}
            onClick={onClickFreeicon}
          >
            {t("family")}
          </Menu.Item>
          <Menu.Item
            leftSection={<BiSolidInvader color="red" className={classes.icon} />}
            onClick={onClickFreeillustration}
          >
            {t("freeillust")}
          </Menu.Item>
          <Menu.Item
            leftSection={<BiSolidInvader color="blue" className={classes.icon} />}
            onClick={onClickFreeicon}
          >
            {t("freeicon")}
          </Menu.Item>
          {isAuthenticated && isAdmin && (
            <>
              <Menu.Item
                leftSection={<MdOutlineChevronRight className={classes.icon} />}
                onClick={onClickManage}
              >
                {t("admin")}
              </Menu.Item>
              <Menu.Item
                leftSection={<MdOutlineChevronRight className={classes.icon} />}
                onClick={onClickAdmin}
              >
                {t("post")}
              </Menu.Item>
            </>
          )}
          {isAuthenticated && (
            <>
              <Menu.Item
                leftSection={<MdLogout color="gray" className={classes.icon} />}
                onClick={onClickLogout}
              >
                {t("logout")}
              </Menu.Item>
              <Menu.Item
                leftSection={<MdOutlineDelete color="gray" className={classes.icon} />}
                onClick={onClickDeleteAccount}
              >
                {t("deleteAccount")}
              </Menu.Item>
            </>
          )}
          <Menu.Divider />
          {/* <LanguagePicker /> */}
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