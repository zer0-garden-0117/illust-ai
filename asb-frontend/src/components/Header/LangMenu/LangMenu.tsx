import React, { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ActionIcon, Group, Menu, Text, useMantineColorScheme } from '@mantine/core';
import classes from './LangMenu.module.css';
import AuthModal from '../../Common/AuthModal/AuthModal';
import { useLocale, useTranslations } from 'next-intl';
import { CircleFlag } from 'react-circle-flags'

interface LanguageData {
  label: string;
  code: string;
  lang: string;
}

const data: LanguageData[] = [
  { label: '日本語', code: 'JP', lang: 'ja' },
  { label: 'English', code: 'US', lang: 'en' },
  { label: '繁體中文', code: 'TW', lang: 'zh-Hant' },
  { label: '简体中文', code: 'CN', lang: 'zh-Hans' },
  { label: '한국의', code: 'KR', lang: 'ko' },
  { label: 'Melayu', code: 'MY', lang: 'ms' },
  { label: 'ไทย', code: 'TH', lang: 'th' },
  { label: 'Deutsch', code: 'DE', lang: 'de' },
  { label: 'Français', code: 'FR', lang: 'fr' },
  { label: 'Tiếng Việt', code: 'VN', lang: 'vi' },
  { label: 'Bahasa Indonesia', code: 'ID', lang: 'id' },
  { label: 'Filipino', code: 'PH', lang: 'fil' },
  { label: 'Português', code: 'PT', lang: 'pt' },
];

export const LangMenu: React.FC = () => {
  const t = useTranslations("page");
  const [menuOpened, setMenuOpened] = useState(false); // メニュー開閉状態を管理
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<LanguageData>(() => {
    const foundLang = data.find(item => item.lang === locale);
    return foundLang || data[0];
  });
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLanguageChange = (item: LanguageData) => {
    setSelected(item);
    
    if (!pathname) return;
    
    // 現在のパスを言語部分で分割
    const pathParts = pathname.split('/').filter(Boolean);
    
    // 現在のパスに言語コードが含まれているか確認
    const hasLang = data.some(d => d.lang === pathParts[0]);
    
    // 新しいパスを構築
    let newPath;
    if (hasLang) {
      // 言語部分を置き換え
      pathParts[0] = item.lang;
      newPath = `/${pathParts.join('/')}`;
    } else {
      // 言語が含まれていない場合、先頭に追加
      newPath = `/${item.lang}${pathname}`;
    }
    
    // クエリパラメータがある場合は追加
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;
    
    window.location.href = fullPath
    // router.replace(fullPath);
  };

  const items = data.map((item) => (
    <Menu.Item
      onClick={() => handleLanguageChange(item)}
      key={item.label}
    >
      <Group gap="xs">
        <CircleFlag
          countryCode={item.code.toLowerCase()}
          height="32"
          style={{ transform: 'scale(0.75)' }}
        />
        {/* <Flag code={item.code} className={classes.flag} /> */}
        <span><Text size='xs'>{item.label}</Text></span>
      </Group>
    </Menu.Item>
  ));

  return (
    <>
        <Menu
          opened={menuOpened}
          onClose={() => setMenuOpened(false)}
          closeOnClickOutside={true}
          closeOnEscape={true}
          closeOnItemClick={true}
          withinPortal={true}
        >
        <Menu.Target>
          <ActionIcon
          onClick={() => setMenuOpened((o) => !o)} 
          variant="outline"
          color={isDark ? "var(--mantine-color-gray-5)" : "var(--mantine-color-gray-8)"} 
          radius='md'
          styles={{
            root: {
              borderColor: isDark 
                ? "var(--mantine-color-gray-8)"
                : "var(--mantine-color-gray-5)",
            }
          }}
          >
            <div className={`${classes.clickableIcon} ${menuOpened ? classes.active : ''}`}>
              <ActionIcon variant='transparent'>
                <CircleFlag
                  countryCode={selected.code.toLowerCase()} 
                  height="20"
                  style={{ transform: 'scale(0.75)' }}
                />
              </ActionIcon>
            </div>
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown className={classes.menuDropdown}>
          {items}
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