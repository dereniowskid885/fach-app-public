import { Moon, Sun, MonitorCog } from 'lucide-react';
import { EThemeType } from 'shared-types';

export const themeObj = {
  [EThemeType.SYSTEM]: {
    id: 'theme-variant-system',
    icon: MonitorCog,
    translationKey: 'theme.systemVariant',
    className: 'system'
  },
  [EThemeType.LIGHT]: {
    id: 'theme-variant-light',
    icon: Sun,
    translationKey: 'theme.lightVariant',
    className: 'light'
  },
  [EThemeType.DARK]: {
    id: 'theme-variant-dark',
    icon: Moon,
    translationKey: 'theme.darkVariant',
    className: 'dark'
  }
};
