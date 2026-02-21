import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IErrorData, IResult } from '@/constants/interfaces';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import axios from 'axios';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { User } from '@/api/accountApi';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// helpful with axios error handling
// gets axios error message or returns default unknown error
export const handleError = (error: unknown) => {
  const result: IResult = { success: false, error: 'Unknown server error' };

  if (axios.isAxiosError(error) && error.response) {
    if (error.response.status) {
      result.status = error.response.status;
    }

    if (error.response.data.message) {
      result.error = error.response.data.message;
    } else if (error.response.statusText) {
      result.error = error.response.statusText;
    }
  }

  return result;
};

export const parseQueryError = (error: FetchBaseQueryError | SerializedError) => {
  const errorDataObj = 'data' in error ? error.data : {};
  const errorData = errorDataObj as IErrorData;

  const message = errorData.message.length > 0 ? errorData.message : 'Server is unavailable';
  const status = errorData.status.length > 0 ? errorData.status : EResponseStatus.SERVER_ERROR;
  const code = 'status' in error && typeof error.status === 'number' ? error.status : 500;

  return {
    message,
    code,
    status
  };
};

export const getFormattedPriceAmount = (amountInCents = 0) =>
  amountInCents ? (amountInCents / 100).toFixed(2) : 0;

export const getUserFullName = (user?: User, nameFallback = 'Unknown') => {
  return user?.name && user?.surname ? `${user.name} ${user.surname}` : nameFallback;
};
