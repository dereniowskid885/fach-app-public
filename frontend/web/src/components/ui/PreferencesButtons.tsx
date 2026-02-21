'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from 'next-intl';
import { normalizePathname } from '@/lib/pathnameUtils';
import { ESupportedLanguages } from '@shared/constants/enums';
import ThemeSwitcher from './ThemeSwitcher';

export default function PreferencesButtons() {
  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-3 lg:bottom-3 lg:right-3">
      <ThemeSwitcher
        triggerPatchUserMutation={false}
        hideButtonText={true}
        wrapperClassName="text-chart-2"
      />

      <LanguageSwitcher
        currentPath={normalizedPath}
        currentLang={currentLocale as ESupportedLanguages}
        hideButtonText={true}
        wrapperClassName="text-chart-2"
      />
    </div>
  );
}
