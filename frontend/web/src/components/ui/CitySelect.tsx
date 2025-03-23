import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/select';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface ICitySelect {
  register: UseFormRegisterReturn;
  id: string;
}

export default function CitySelect({ register, id }: ICitySelect) {
  const cities = [
    'Warszawa',
    'Kraków',
    'Katowice',
    'Wrocław',
    'Poznań',
    'Gdańsk',
    'Szczecin',
    'Bydgoszcz',
    'Lublin',
    'Łódź',
    'Rzeszów',
    'Białystok',
    'Kielce',
    'Olsztyn',
    'Opole',
    'Zielona Góra'
  ];

  return (
    <Select
      onValueChange={value => register.onChange({ target: { name: register.name, value } })}
      defaultValue=""
      required
    >
      <SelectTrigger id={id}>
        <SelectValue placeholder="Wybierz miasto" />
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
