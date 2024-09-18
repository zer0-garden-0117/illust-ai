'use client';

import { ScrollArea } from '@mantine/core';
import { IconType } from "react-icons";
import classes from './Navbar.module.css';
import { NavLinksGroup } from './NavLinksGroup';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineFileDownload } from 'react-icons/md';
import { RiAdminLine } from "react-icons/ri";
import { useTranslations } from "next-intl";
import React from 'react';

export interface NavbarProps {
  setOpened: (opened: boolean) => void;
}

export interface NavItem {
  label: string;
  icon: IconType;
  href: string;
}

export const Navbar: React.FC<NavbarProps> = ({ setOpened }) => {
  const t = useTranslations("navbar.menu");

  const navLinks: NavItem[] = [
    { label: t('top'), icon: LuLayoutDashboard, href: '/' },
    { label: t('about'), icon: LuLayoutDashboard, href: '/about' },
    { label: t('freeicon'), icon: MdOutlineFileDownload, href: '/icon' },
    { label: t('freeillust'), icon: MdOutlineFileDownload, href: '/illustration' },
    { label: t('utinoko'), icon: MdOutlineFileDownload, href: '/utinoko' },
    { label: t('admin'), icon: RiAdminLine, href: '/admin' },
  ];

  const links = navLinks.map(item => (
    <NavLinksGroup key={item.label} {...item} onClick={() => setOpened(false)} />
  ));


  return (
    <ScrollArea className={classes.links}>
      {links}
    </ScrollArea>
  );
};