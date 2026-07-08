import { Search } from 'lucide-react';
import { Input } from '../shadcn/input';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ESearchComponentVariant } from '@/enums/ui';
import CloseIcon from './CloseIcon';

export interface ISearchComponent {
  variant?: ESearchComponentVariant;
  placeholder?: string;
  inputClassName?: string;
  inputValue: string;
  inputOnChangeHandler: (value: string) => void;
}

export default function SearchComponent({
  variant = ESearchComponentVariant.PAGE,
  placeholder,
  inputClassName,
  inputValue,
  inputOnChangeHandler
}: ISearchComponent) {
  const t = useTranslations();

  let variantClasses = '';

  switch (variant) {
    case ESearchComponentVariant.HEADER:
      variantClasses = 'w-full max-w-md';
      break;
    case ESearchComponentVariant.PAGE:
    default:
      variantClasses = 'w-full lg:max-w-md';
      break;
  }

  return (
    <div className={cn('group relative', variantClasses)}>
      <Search className="absolute top-1/2 left-3 -translate-y-1/2" size={24} />

      <Input
        value={inputValue}
        onChange={e => inputOnChangeHandler?.(e.target.value)}
        placeholder={placeholder || t('common.search')}
        className={cn('bg-background h-11 px-11 font-medium', inputClassName)}
      />

      {inputValue ? (
        <CloseIcon
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={() => inputOnChangeHandler('')}
        />
      ) : null}
    </div>
  );
}
