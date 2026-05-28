import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/select';
import { cities } from 'shared-types';
import { useTranslations } from 'next-intl';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface ICitySelect {
  register: UseFormRegisterReturn;
  defaultValue?: string;
  id: string;
}

export default function CitySelect({ register, defaultValue, id }: ICitySelect) {
  const t = useTranslations();

  return (
    <Select
      onValueChange={value => register.onChange({ target: { name: register.name, value } })}
      defaultValue={defaultValue}
      required
    >
      <SelectTrigger id={id}>
        <SelectValue placeholder={t('select.city')} />
      </SelectTrigger>
      <SelectContent>
        {cities.map(city => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
