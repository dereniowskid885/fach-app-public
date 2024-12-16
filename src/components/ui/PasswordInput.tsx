import React, { useState } from 'react';
import { Input } from '../shadcn/input';
import { HiEye } from 'react-icons/hi';
import { HiEyeOff } from 'react-icons/hi';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface IPasswordInput {
  register: UseFormRegisterReturn;
  id: string;
  className?: string;
  minLength?: number;
  maxLength?: number;
}

export default function PasswordInput({
  register,
  id,
  className,
  minLength = 7,
  maxLength = 64
}: IPasswordInput) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="relative flex">
      <Input
        {...register}
        id={id}
        className={`pr-[40px] ${className}`}
        type={showPassword ? 'text' : 'password'}
        placeholder="*******"
        minLength={minLength}
        maxLength={maxLength}
      />
      <div
        className="absolute right-[12px] top-[50%] translate-y-[-50%] cursor-pointer opacity-70"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <HiEye /> : <HiEyeOff />}
      </div>
    </div>
  );
}
