import { Input } from '@/components/shadcn/input';
import { ETimePickerType } from '@/enums/ui';
import { cn } from '@/lib/utils';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

export interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: ETimePickerType;
  minutes: number;
  setMinutes: Dispatch<SetStateAction<number>>;
  minMinutes?: number;
  maxMinutes?: number;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

export const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    {
      className,
      type = 'tel',
      minutes,
      setMinutes,
      minMinutes = 0,
      maxMinutes = 1440,
      id,
      name,
      onChange,
      onKeyDown,
      picker,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref
  ) => {
    const [flag, setFlag] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');

    const pickerInputValue = useMemo(() => {
      switch (picker) {
        case ETimePickerType.DAYS:
          // divide total minutes by 1440 (minutes in a day) to get the number of full days.
          return Math.floor(minutes / 1440);
        case ETimePickerType.HOURS:
          // first get the remaining minutes after full days using modulo, then divide by 60 to get full hours.
          return Math.floor((minutes % 1440) / 60);
        case ETimePickerType.MINUTES:
          // return the remaining minutes after full hours using modulo 60.
          return minutes % 60;
      }
    }, [picker, minutes]);

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => clearTimeout(timer);
      }

      setInputValue('');
    }, [flag]);

    useEffect(() => {
      if (inputValue === '') return;

      const numericValue = parseInt(inputValue, 10);

      if (!isNaN(numericValue)) {
        handleInputChange(numericValue);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const handleInputChange = (value: number) => {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = minutes % 60;

      let newTotalMinutes = minutes;

      switch (picker) {
        case ETimePickerType.DAYS:
          newTotalMinutes = value * 1440 + hours * 60 + mins;
          break;
        case ETimePickerType.HOURS:
          newTotalMinutes = days * 1440 + value * 60 + mins;
          break;
        case ETimePickerType.MINUTES:
          newTotalMinutes = days * 1440 + hours * 60 + value;
          break;
      }

      if (newTotalMinutes >= maxMinutes) {
        setMinutes(maxMinutes);
        return;
      }

      if (newTotalMinutes >= minMinutes) {
        setMinutes(newTotalMinutes);
      }
    };

    // amount of minutes in specific picker type
    const getMinutesStepAmount = () => {
      switch (picker) {
        case ETimePickerType.DAYS:
          return 1440;
        case ETimePickerType.HOURS:
          return 60;
        case ETimePickerType.MINUTES:
          return 1;
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') return;
      e.preventDefault();
      if (e.key === 'ArrowRight') onRightFocus?.();
      if (e.key === 'ArrowLeft') onLeftFocus?.();
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        if (flag) setFlag(false);

        const direction = e.key === 'ArrowUp' ? 1 : -1;
        const step = getMinutesStepAmount();
        const newMinutesAmount = minutes + step * direction;

        if (newMinutesAmount >= minMinutes && newMinutesAmount <= maxMinutes) {
          setMinutes(newMinutesAmount);
        }
      }
      if (e.key >= '0' && e.key <= '9') {
        if (flag) onRightFocus?.();
        setFlag(prev => !prev);
        setInputValue(prevState => prevState + e.key);
      }
    };

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn(
          'focus:bg-secondary dark:focus:bg-secondary w-[48px] text-center font-mono text-base tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none',
          className
        )}
        value={pickerInputValue}
        onChange={e => {
          e.preventDefault();
          onChange?.(e);
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={e => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        {...props}
      />
    );
  }
);

TimePickerInput.displayName = 'TimePickerInput';
