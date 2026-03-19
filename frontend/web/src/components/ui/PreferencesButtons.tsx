'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from 'next-intl';
import { normalizePathname } from '@/utils/pathname';
import { ESupportedLanguages } from '@shared/enums/language';
import ThemeSwitcher from './ThemeSwitcher';
import { EPopoverContentDirection } from '@/enums/ui';

export default function PreferencesButtons() {
  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-3 lg:bottom-3 lg:right-3">
      <ThemeSwitcher
        triggerPatchUserMutation={false}
        wrapperClassName="text-chart-2"
        popoverContentDirection={EPopoverContentDirection.LEFT}
      />

      <LanguageSwitcher
        currentPath={normalizedPath}
        currentLang={currentLocale as ESupportedLanguages}
        wrapperClassName="text-chart-2"
        popoverContentDirection={EPopoverContentDirection.LEFT}
      />
    </div>
  );
}
