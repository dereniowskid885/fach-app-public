import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from '@/api/accountApi';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFormattedPriceAmount = (amountInCents = 0) =>
  amountInCents ? (amountInCents / 100).toFixed(2) : 0;

export const getUserFullName = (user?: User, nameFallback = 'Unknown') => {
  return user?.name && user?.surname ? `${user.name} ${user.surname}` : nameFallback;
};
