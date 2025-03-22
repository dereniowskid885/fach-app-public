import { IResult } from '@/constants/const';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import axios from 'axios';

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
  const message =
    'data' in error ? (error.data as { message: string }).message : 'Server is unavailable';
  const status = 'status' in error && typeof error.status === 'number' ? error.status : null;

  return {
    message,
    status
  };
};
