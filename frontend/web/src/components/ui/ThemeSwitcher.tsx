import { Button } from '../shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Check, Palette } from 'lucide-react';
import { themeObj } from '@/constants/theme';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/shared';
import AnimateCollapse from '../common/AnimateCollapse';
import { PatchUsersByIdApiArg, ThemeType, usePatchUsersByIdMutation } from '@/api/accountApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData, setUserTheme } from '@/redux/slices/UserDataSlice';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import Typography from '../common/Typography';

export interface IThemeSwitcher {
  popoverContentDirection?: 'top' | 'bottom' | 'left' | 'right';
  triggerPatchUserMutation?: boolean;
  isSidebarCollapsed?: boolean;
  hideButtonText?: boolean;
  wrapperClassName?: string;
}

export default function ThemeSwitcher({
  popoverContentDirection = 'right',
  triggerPatchUserMutation = true,
  isSidebarCollapsed = false,
  hideButtonText = false,
  wrapperClassName = ''
}: IThemeSwitcher) {
  const t = useTranslations();
  const { userId, theme: userTheme } = useSelector(selectUserData);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userTheme) return;

    setTheme(userTheme);
  }, [setTheme, userTheme]);

  const [trigger, { error }] = usePatchUsersByIdMutation();

  useErrorHandler(error);

  const handleThemeChange = async (themeClass: string) => {
    if (triggerPatchUserMutation) {
      const payload: PatchUsersByIdApiArg = {
        id: userId,
        body: {
          theme: themeClass as ThemeType
        }
      };

      await trigger(payload);
    }

    setTheme(themeClass);
    dispatch(setUserTheme(themeClass as ThemeType));
  };

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
            <Palette strokeWidth={2.5} />
          ) : (
            <div className="flex items-center gap-3">
              <Palette strokeWidth={2.5} className="ml-2" />

              <AnimateCollapse isHidden={isSidebarCollapsed}>
                <Typography variant="small">{t('theme.sidebarButtonText')}</Typography>
              </AnimateCollapse>
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent side={popoverContentDirection} align="end" className="w-48 p-1">
        <div className="mb-1 border-b px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t('common.selectTheme')}
        </div>

        <div className="grid gap-0.5">
          {Object.values(themeObj).map(themeObjItem => {
            const isCurrentTheme = theme === themeObjItem.className;

            return (
              <Button
                key={themeObjItem.id}
                disabled={isCurrentTheme}
                onClick={() => handleThemeChange(themeObjItem.className)}
                variant="ghost"
                className={cn(
                  'animation-base animation-idle animation-interactive group flex w-full items-center justify-start gap-3 px-3 py-2 text-sm',
                  isCurrentTheme ? 'font-bold' : ''
                )}
              >
                <themeObjItem.icon size={12} />
                <span className="flex-1 text-left">{t(`theme.${themeObjItem.label}`)}</span>

                {isCurrentTheme && <Check size={12} className="text-primary" />}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
