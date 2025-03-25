import { useState, useEffect } from 'react';
import { UnstyledButton, Menu, Group, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Flag from 'react-world-flags';
import classes from './LanguagePicker.module.css';
import { GrLanguage } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useNavigate } from '@/utils/navigate';

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
// const data: LanguageData[] = [
//   { label: '日', code: 'JP', lang: 'ja' },
//   { label: 'EN', code: 'US', lang: 'en' },
//   { label: 'TW', code: 'TW', lang: 'zh-Hant' },
//   { label: 'CN', code: 'CN', lang: 'zh-Hans' },
//   { label: 'KR', code: 'KR', lang: 'ko' },
//   { label: 'MY', code: 'MY', lang: 'ms' },
//   { label: 'TH', code: 'TH', lang: 'th' },
//   { label: 'DE', code: 'DE', lang: 'de' },
//   { label: 'FR', code: 'FR', lang: 'fr' },
//   { label: 'VN', code: 'VN', lang: 'vi' },
//   { label: 'ID', code: 'ID', lang: 'id' },
//   { label: 'PH', code: 'PH', lang: 'fil' },
//   { label: 'PT', code: 'PT', lang: 'pt' },
// ];
export interface LanguagePickerProps { }

export const LanguagePicker: React.FC<LanguagePickerProps> = () => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<LanguageData>(data[0]);
  const [pathname, setPathname] = useState<string>('');
  const navigation = useNavigate();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedLang = data.find(item => item.lang === locale) || data[0];
      setSelected(selectedLang);
      setPathname(window.location.pathname);
    }
  }, [locale]);

  const handleLanguageChange = (item: LanguageData) => {
    setSelected(item);
    const newPath = pathname.replace(/^\/(en|ja|zh-Hant|zh-Hans|ko|ms|th|de|fr|vi|id|fil|pt)/, `/${item.lang}`);
    navigation(newPath);
  };

  const items = data.map((item) => (
    <Menu.Item
      onClick={() => handleLanguageChange(item)}
      key={item.label}
    >
      <Group gap="xs">
        <Flag code={item.code} className={classes.flag} />
        <span><Text size='xs'>{item.label}</Text></span>
      </Group>
    </Menu.Item>
  ));

  return (
    <div className={classes.langlabel}>
      <Group>
        <GrLanguage color="lightblue"/>
        <Menu
          onOpen={() => setOpened(true)}
          onClose={() => setOpened(false)}
          radius="md"
          width="target"
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              className={`
                ${classes.control}
                ${opened ? classes.controlExpanded : ''}
              `}
              data-expanded={opened || undefined}
            >
              <Group gap="xs">
                <span className={classes.label}></span>
                <Flag code={selected.code} className={classes.flag} />
                <span className={classes.label}>
                  <Text size='xs'>{selected.label}</Text>
                </span>
              </Group>
              <IconChevronDown
                size="1rem"
                className={`
                  ${classes.icon}
                  ${opened ? classes.iconExpanded : ''}
                `}
                stroke={1.5} />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown
            className={classes.menuDropdown}
          >
            {items}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};