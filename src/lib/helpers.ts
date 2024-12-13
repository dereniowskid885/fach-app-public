import { IResult } from '@/constants/interfaces';
import axios from 'axios';

// helpful with axios error handling
// gets axios error message or returns default unknown error
export const handleError = (error: unknown) => {
  let result: IResult = { success: false };

  if (axios.isAxiosError(error)) {
    result.error = error.response?.data.message;
  } else {
    result.error = 'Unknown server error';
  }

  return result;
};
