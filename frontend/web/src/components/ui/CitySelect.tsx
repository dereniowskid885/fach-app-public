import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/select';
import { UseFormRegisterReturn } from 'react-hook-form';

interface ICitySelect {
  register: UseFormRegisterReturn;
  id: string;
}

const CitySelect = ({ register, id }: ICitySelect) => {
  const cities = [
    { value: 'warszawa', label: 'Warszawa' },
    { value: 'krakow', label: 'Kraków' },
    { value: 'katowice', label: 'Katowice' },
    { value: 'wroclaw', label: 'Wrocław' },
    { value: 'poznan', label: 'Poznań' },
    { value: 'gdansk', label: 'Gdańsk' },
    { value: 'szczecin', label: 'Szczecin' },
    { value: 'bydgoszcz', label: 'Bydgoszcz' },
    { value: 'lublin', label: 'Lublin' },
    { value: 'lodz', label: 'Łódź' },
    { value: 'rzeszow', label: 'Rzeszów' },
    { value: 'bialystok', label: 'Białystok' },
    { value: 'kielce', label: 'Kielce' },
    { value: 'olsztyn', label: 'Olsztyn' },
    { value: 'opole', label: 'Opole' },
    { value: 'zielona-gora', label: 'Zielona Góra' }
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
          <SelectItem key={city.value} value={city.value}>
            {city.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CitySelect;
