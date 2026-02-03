import { IErrorData, IResult } from '@/constants/interfaces';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import axios from 'axios';
import { EResponseStatus } from '@shared/constants/responseStatus';

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

export const getLastPathSegment = (path: string) => {
  const splittedPath = path.split('/');
  return splittedPath[splittedPath.length - 1];
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

export const getFormattedDate = (isoString?: string) => {
  if (!isoString) return '-';

  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const getFormattedPriceAmount = (amountInCents = 0) =>
  amountInCents ? (amountInCents / 100).toFixed(2) : 0;
