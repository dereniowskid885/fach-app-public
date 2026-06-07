import { Check, Globe } from 'lucide-react';
import { Button } from '../shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { cn } from '@/lib/utils';
import { supportedLanguagesObj } from '@/constants/supportedLanguages';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ESupportedLanguages } from 'shared-types';
import { EPopoverContentDirection } from '@/enums/ui';

export interface ILanguageSwitcher {
  currentPath: string;
  currentLang: ESupportedLanguages;
  wrapperClassName?: string;
  popoverContentDirection?: EPopoverContentDirection;
}

export default function LanguageSwitcher({
  currentPath,
  currentLang,
  wrapperClassName = '',
  popoverContentDirection = EPopoverContentDirection.BOTTOM
}: ILanguageSwitcher) {
  const t = useTranslations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('animation-hover h-10 w-10 rounded-2xl', wrapperClassName)}
        >
          <Globe size={24} strokeWidth={2.5} />
        </Button>
      </PopoverTrigger>

      <PopoverContent side={popoverContentDirection} align="end" className="w-48 p-1">
        <div className="text-muted-foreground mb-1 border-b px-3 py-2 text-xs font-bold tracking-widest uppercase">
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
                  'animation-hover group flex w-full items-center gap-3 rounded-4xl px-3 py-2 text-sm',
                  isCurrentLang ? 'animation-active' : ''
                )}
              >
                <Image
                  src={lang.iconPath}
                  alt={lang.id}
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
                <span className="flex-1 text-left">{t(`lang.${lang.label}`)}</span>

                {isCurrentLang ? <Check size={16} /> : null}
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
