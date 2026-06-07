import { Button } from '../shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Check, Palette } from 'lucide-react';
import { themeObj } from '@/constants/theme';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { EPopoverContentDirection } from '@/enums/ui';
import { useThemeHandler } from '@/hooks/useThemeHandler';

export interface IThemeSwitcher {
  popoverContentDirection?: EPopoverContentDirection;
  triggerPatchUserMutation?: boolean;
  wrapperClassName?: string;
}

export default function ThemeSwitcher({
  popoverContentDirection = EPopoverContentDirection.BOTTOM,
  triggerPatchUserMutation = true,
  wrapperClassName = ''
}: IThemeSwitcher) {
  const t = useTranslations();
  const { theme, handleThemeChange } = useThemeHandler();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('animation-hover h-10 w-10 rounded-2xl', wrapperClassName)}
        >
          <Palette size={24} strokeWidth={2.5} />
        </Button>
      </PopoverTrigger>

      <PopoverContent side={popoverContentDirection} align="end" className="w-48 p-1">
        <div className="text-muted-foreground mb-1 border-b px-3 py-2 text-xs font-bold tracking-widest uppercase">
          {t('common.selectTheme')}
        </div>

        <div className="grid gap-0.5">
          {Object.values(themeObj).map(themeObjItem => {
            const isCurrentTheme = theme === themeObjItem.className;

            return (
              <Button
                key={themeObjItem.id}
                onClick={() => handleThemeChange(themeObjItem.className, triggerPatchUserMutation)}
                variant="ghost"
                className={cn(
                  'animation-hover group flex w-full items-center justify-start gap-3 px-3 py-2 text-sm',
                  isCurrentTheme ? 'animation-active' : ''
                )}
              >
                <themeObjItem.icon size={12} />
                <span className="flex-1 text-left">{t(themeObjItem.translationKey)}</span>

                {isCurrentTheme ? <Check size={12} /> : null}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
