'use client';

import ContentCard from '@/components/ui/ContentCard';
import ContentSectionItem from '@/components/ui/ContentSectionItem';
import { themeObj } from '@/constants/theme';
import { ESectionItemType } from '@/enums/ui';
import { useThemeHandler } from '@/hooks/useThemeHandler';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function SettingsThemeForm() {
  const t = useTranslations();
  const { theme, handleThemeChange } = useThemeHandler();

  return (
    <ContentCard index={2} className="bg-popover" contentClass="space-y-8">
      <ContentSectionItem
        title={t('settingsPage.themeForm.title')}
        titleClass={'text-foreground font-bold text-base'}
        description={t('settingsPage.themeForm.description')}
        descriptionClass={'text-muted-foreground'}
        variant={ESectionItemType.SETTINGS_THEME}
      />

      <div className="flex gap-6">
        {Object.values(themeObj).map((themeObjItem, index) => {
          const isCurrentTheme = theme === themeObjItem.className;

          return (
            <ContentCard
              index={index}
              key={themeObjItem.className}
              onClick={() => handleThemeChange(themeObjItem.className)}
              className={cn('cursor-pointer rounded-2xl border', themeObjItem.iconWrapperClass)}
            >
              <div className="relative flex items-center pr-16">
                <ContentSectionItem
                  title={t(themeObjItem.translationKey)}
                  titleClass={cn('text-base font-bold', themeObjItem.iconClass)}
                  description={t(
                    `settingsPage.themeForm.themeDescription.${themeObjItem.className}`
                  )}
                  descriptionClass={cn('font-normal', themeObjItem.iconClass)}
                  iconComponent={
                    <div className={cn('rounded-md border p-3', themeObjItem.iconWrapperClass)}>
                      <themeObjItem.icon size={24} className={themeObjItem.iconClass} />
                    </div>
                  }
                  variant={ESectionItemType.SETTINGS_THEME}
                />

                {isCurrentTheme ? (
                  <div
                    className={cn(
                      'absolute right-0 rounded-full p-1',
                      themeObjItem.iconWrapperClass
                    )}
                  >
                    <Check size={16} className={themeObjItem.iconClass} />
                  </div>
                ) : null}
              </div>
            </ContentCard>
          );
        })}
      </div>
    </ContentCard>
  );
}
