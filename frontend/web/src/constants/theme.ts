import { Moon, Sun, MonitorCog } from 'lucide-react';
import { EThemeType } from 'shared-types';

export const themeObj = {
  [EThemeType.SYSTEM]: {
    id: 'theme-variant-system',
    icon: MonitorCog,
    iconWrapperClass: 'border-neutral-200 bg-neutral-50',
    iconClass: 'text-neutral-600',
    translationKey: 'theme.systemVariant',
    className: 'system'
  },
  [EThemeType.LIGHT]: {
    id: 'theme-variant-light',
    icon: Sun,
    iconWrapperClass: 'border-yellow-200 bg-yellow-50',
    iconClass: 'text-yellow-600',
    translationKey: 'theme.lightVariant',
    className: 'light'
  },
  [EThemeType.DARK]: {
    id: 'theme-variant-dark',
    icon: Moon,
    iconWrapperClass: 'border-black-200 bg-black-50',
    iconClass: 'text-black-600',
    translationKey: 'theme.darkVariant',
    className: 'dark'
  }
};
