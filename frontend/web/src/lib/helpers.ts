import { IResult } from '@/constants/interfaces';
import axios from 'axios';

// helpful with axios error handling
// gets axios error message or returns default unknown error
export const handleError = (error: unknown) => {
  let result: IResult = { success: false };

  if (axios.isAxiosError(error)) {
    result.error = error.response ? error.response.data.message : 'Unknown server error';
  }

  return result;
};

export const getLastPathSegment = (path: string) => {
  const splittedPath = path.split('/');
  return splittedPath[splittedPath.length - 1];
};
