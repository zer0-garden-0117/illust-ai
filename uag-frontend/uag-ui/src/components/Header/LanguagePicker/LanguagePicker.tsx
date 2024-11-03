import { useState, useEffect } from 'react';
import { UnstyledButton, Menu, Group } from '@mantine/core';
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
  { label: 'English', code: 'USA', lang: 'en' },
];

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
    const newPath = pathname.replace(/^\/(en|ja)/, `/${item.lang}`);
    navigation(newPath);
  };

  const items = data.map((item) => (
    <Menu.Item
      onClick={() => handleLanguageChange(item)}
      key={item.label}
    >
      <Group gap="xs">
        <Flag code={item.code} className={classes.flag} />
        <span>{item.label}</span>
      </Group>
    </Menu.Item>
  ));

  return (
    <div className={classes.langlabel}>
      <Group>
        <GrLanguage />
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
                <span className={classes.label}>{selected.label}</span>
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