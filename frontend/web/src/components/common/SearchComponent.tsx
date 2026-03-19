import { Search, X } from 'lucide-react';
import { Input } from '../shadcn/input';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/shared';
import { Button } from '../shadcn/button';
import { ESearchComponentVariant } from '@/enums/ui';

export interface ISearchComponent {
  variant?: ESearchComponentVariant;
  placeholder?: string;
  inputClassName?: string;
  inputValue: string;
  inputOnChangeHandler: (value: string) => void;
}

export default function SearchComponent({
  variant = ESearchComponentVariant.DEFAULT,
  placeholder,
  inputClassName,
  inputValue,
  inputOnChangeHandler
}: ISearchComponent) {
  const t = useTranslations();

  let variantClasses = '';

  switch (variant) {
    case ESearchComponentVariant.BIG:
      variantClasses = 'w-48 lg:w-64 xl:w-[500px]';
      break;
    case ESearchComponentVariant.DEFAULT:
    default:
      variantClasses = 'w-full max-w-md';
      break;
  }

  return (
    <div className={cn('group relative', variantClasses)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={24} />

      <Input
        value={inputValue}
        onChange={e => inputOnChangeHandler?.(e.target.value)}
        placeholder={placeholder || t('common.search')}
        className={cn('h-11 bg-background px-11 font-medium dark:bg-secondary', inputClassName)}
      />

      {inputValue ? (
        <Button
          variant="ghost"
          size="icon"
          className="animation-base animation-idle animation-interactive absolute right-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 hover:bg-transparent"
          onClick={() => inputOnChangeHandler('')}
        >
          <X />
        </Button>
      ) : null}
    </div>
  );
}
