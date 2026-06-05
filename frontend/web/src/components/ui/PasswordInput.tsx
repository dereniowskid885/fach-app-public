import React, { useState } from 'react';
import { Input } from '../shadcn/input';
import { HiEye } from 'react-icons/hi';
import { HiEyeOff } from 'react-icons/hi';
import { UseFormRegisterReturn } from 'react-hook-form';
import Typography from './Typography';
import { useTranslations } from 'next-intl';

export interface IPasswordInput {
  register: UseFormRegisterReturn;
  id: string;
  className?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  showPasswordInfo?: boolean;
}

export default function PasswordInput({
  register,
  id,
  className,
  minLength = 7,
  maxLength = 64,
  placeholder = '*******',
  showPasswordInfo = false
}: IPasswordInput) {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="space-y-2">
      <div className="relative flex">
        <Input
          {...register}
          id={id}
          className={`pr-[40px] ${className}`}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          required
        />

        <div
          className="absolute right-[12px] top-[50%] translate-y-[-50%] cursor-pointer opacity-70"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <HiEye /> : <HiEyeOff />}
        </div>
      </div>

      {showPasswordInfo ? (
        <Typography variant="note" className="text-muted-foreground">
          {t('passwordInput.info')}
        </Typography>
      ) : null}
    </div>
  );
}
