import { Moon, Sun, MonitorCog } from 'lucide-react';
import { EThemeType } from '@shared/constants/enums';

export const themeTypesObj = {
  [EThemeType.SYSTEM]: {
    id: 'theme-variant-system',
    icon: MonitorCog,
    label: 'systemVariant',
    className: 'system'
  },
  [EThemeType.LIGHT]: {
    id: 'theme-variant-light',
    icon: Sun,
    label: 'lightVariant',
    className: 'light'
  },
  [EThemeType.DARK]: {
    id: 'theme-variant-dark',
    icon: Moon,
    label: 'darkVariant',
    className: 'dark'
  }
};
