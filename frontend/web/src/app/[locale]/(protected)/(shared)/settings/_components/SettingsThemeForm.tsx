'use client';

import ContentCard from '@/components/ui/ContentCard';
import ContentSectionItem from '@/components/ui/ContentSectionItem';
import Typography from '@/components/ui/Typography';
import { themeObj } from '@/constants/theme';
import { ESectionItemType } from '@/enums/ui';
import { useThemeHandler } from '@/hooks/useThemeHandler';
import { cn } from '@/utils/shared';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function SettingsThemeForm() {
  const t = useTranslations();
  const { theme, handleThemeChange } = useThemeHandler();

  return (
    <ContentCard index={2} className="space-y-6 p-6 sm:p-8">
      <ContentSectionItem
        title={t('settingsPage.themeForm.title')}
        titleClass={'text-sm font-bold text-primary'}
        description={t('settingsPage.themeForm.description')}
        descriptionClass={'font-semibold text-muted-foreground'}
        variant={ESectionItemType.SETTINGS_THEME}
      />

      <div className="flex gap-4">
        {Object.values(themeObj).map((themeObjItem, index) => {
          const isCurrentTheme = theme === themeObjItem.className;

          return (
            <ContentCard
              index={index}
              key={themeObjItem.className}
              onClick={() => handleThemeChange(themeObjItem.className)}
              className={cn(
                'cursor-pointer rounded-2xl border-[1px]',
                isCurrentTheme ? 'border-pink-200 bg-pink-50' : ''
              )}
            >
              <div className="relative flex items-center pr-16">
                <ContentSectionItem
                  titleComponent={
                    <Typography variant="p" className="font-bold">
                      {t(themeObjItem.translationKey)}
                    </Typography>
                  }
                  description={t(
                    `settingsPage.themeForm.themeDescription.${themeObjItem.className}`
                  )}
                  descriptionClass={'font-normal text-muted-foreground'}
                  iconComponent={
                    <div
                      className={cn(
                        'rounded-md border p-3',
                        isCurrentTheme ? 'border-pink-200 bg-pink-100 text-pink-600' : ''
                      )}
                    >
                      <themeObjItem.icon size={24} />
                    </div>
                  }
                  variant={ESectionItemType.SETTINGS_THEME}
                />

                {isCurrentTheme ? (
                  <div className="absolute right-0 rounded-full bg-pink-100 p-1">
                    <Check size={16} className="text-pink-600" />
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
