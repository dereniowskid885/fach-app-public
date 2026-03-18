import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Input } from '../shadcn/input';
import Typography from './Typography';
import { ESupportedCurrency } from '@shared/enums/currency';

export interface IPriceInput {
  className: string;
  max: number;
  defaultInputValue?: string;
  setPrice: Dispatch<SetStateAction<number>>;
  currency: ESupportedCurrency;
}

export default function PriceInput({
  className,
  max,
  defaultInputValue,
  setPrice,
  currency
}: IPriceInput) {
  const [priceInput, setPriceInput] = useState<string>(defaultInputValue ?? '');

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // numeric only, with comma or dot
    const cleaned = value.replace(/[^0-9.,]/g, '');

    // change comma for dot
    const normalized = cleaned.replace(',', '.');

    const priceRegex = /^(0|[1-9][0-9]*)([.,][0-9]{0,2})?$/;
    if (normalized.length > 1 && !priceRegex.test(normalized)) {
      return;
    }

    const parsed = normalized ? parseFloat(normalized) : 0;
    if (parsed > max) {
      return;
    }

    setPriceInput(normalized);

    const priceInCents = Math.round(parsed * 100);

    setPrice(priceInCents);
  };

  return (
    <div className="relative">
      <Input
        className={className}
        type="text"
        value={priceInput}
        onChange={handlePriceChange}
        inputMode="decimal"
      />

      <Typography
        variant="small"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {currency}
      </Typography>
    </div>
  );
}
