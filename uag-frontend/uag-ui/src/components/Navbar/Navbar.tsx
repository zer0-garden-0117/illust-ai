'use client';

import { ScrollArea } from '@mantine/core';
import { IconType } from "react-icons";
import classes from './Navbar.module.css';
import { NavLinksGroup } from './NavLinksGroup';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineFileDownload } from 'react-icons/md';
import { useTranslations } from "next-intl";
import React from 'react';

export interface NavbarProps { }

export interface NavItem {
  label: string;
  icon: IconType;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const t = useTranslations("navbar.menu");

  const navLinks: NavItem[] = [
    { label: t('top'), icon: LuLayoutDashboard },
    { label: t('about'), icon: LuLayoutDashboard },
    { label: t('freeicon'), icon: MdOutlineFileDownload },
    { label: t('freeillust'), icon: MdOutlineFileDownload },
    { label: t('oc'), icon: MdOutlineFileDownload },
  ];

  const links = navLinks.map(item => <NavLinksGroup key={item.label} {...item} />);

  return (
    <ScrollArea className={classes.links}>
      {links}
    </ScrollArea>
  );
};