import { Check, Globe } from 'lucide-react';
import { Button } from '../shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { cn } from '@/lib/utils';
import { supportedLanguagesObj } from '@/constants/supportedLanguages';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import AnimateCollapse from '../common/AnimateCollapse';
import { ESupportedLanguages } from '@shared/constants/enums';

export interface ILanguageSwitcher {
  currentPath: string;
  currentLang: ESupportedLanguages;
  wrapperClassName?: string;
  textClassName?: string;
  popoverContentDirection?: 'top' | 'bottom' | 'left' | 'right';
  hideButtonText?: boolean;
  isSidebarCollapsed?: boolean;
}

export default function LanguageSwitcher({
  currentPath,
  currentLang,
  wrapperClassName = '',
  textClassName = '',
  popoverContentDirection = 'right',
  hideButtonText = false,
  isSidebarCollapsed = false
}: ILanguageSwitcher) {
  const t = useTranslations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'animation-base animation-idle animation-interactive h-9 w-full items-center justify-between px-2',
            wrapperClassName
          )}
        >
          {hideButtonText ? (
            <Globe strokeWidth={2.5} />
          ) : (
            <div className="flex items-center gap-3">
              <Globe strokeWidth={2.5} className="ml-2" />

              <AnimateCollapse isHidden={isSidebarCollapsed}>
                <span className={cn('text-sm font-semibold', textClassName)}>
                  {t('lang.sidebarButtonText')}
                </span>
              </AnimateCollapse>
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent side={popoverContentDirection} align="end" className="w-48 p-1">
        <div className="mb-1 border-b px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t('common.selectLanguage')}
        </div>

        <div className="grid gap-0.5">
          {Object.entries(supportedLanguagesObj).map(([langKey, lang]) => {
            const isCurrentLang = currentLang === langKey;

            return (
              <Link
                key={lang.id}
                locale={langKey}
                href={`/${langKey}${currentPath}`}
                className={cn(
                  'animation-base animation-idle animation-interactive group flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm',
                  isCurrentLang ? 'font-bold text-primary' : ''
                )}
              >
                <Image
                  src={lang.iconPath}
                  alt={lang.id}
                  width={24}
                  height={24}
                  className="h-[24px] w-[24px] object-contain"
                />
                <span className="flex-1 text-left">{t(`lang.${lang.label}`)}</span>

                {isCurrentLang && <Check size={12} className="text-primary" />}
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
