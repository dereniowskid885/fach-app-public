'use server';

import { IResult } from '@/constants/interfaces';
import {
  API_LOGIN_URL,
  API_PASSWORD_RESET_REQUEST_URL,
  API_PASSWORD_RESET_URL,
  API_REGISTER_URL
} from '@/constants/api';
import axios from 'axios';
import { cookies } from 'next/headers';
import { handleError } from './helpers';

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  email: string;
  name: string;
  surname: string;
  password: string;
  passwordConfirm: string;
}

export interface IPasswordResetRequestForm {
  email: string;
}

export interface IPasswordResetForm {
  newPassword: string;
  newPasswordConfirm: string;
  token: string;
}

export const loginHandler = async (formData: ILoginForm): Promise<IResult> => {
  try {
    const response = await axios.post(API_LOGIN_URL, formData);

    if (response.status === 200 && response.data.accessToken) {
      const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      (await cookies()).set('token', response.data.accessToken, { expires, httpOnly: true });

      return { success: true };
    } else {
      return { success: false, error: 'Invalid token' };
    }
  } catch (err) {
    return handleError(err);
  }
};

// TODO: extend backend register endpoint with missing values
export const registerHandler = async ({
  email,
  name,
  surname,
  password
}: IRegisterForm): Promise<IResult> => {
  try {
    const response = await axios.post(API_REGISTER_URL, {
      email,
      password
    });

    if (response.status === 201) {
      return { success: true };
    } else {
      return { success: false, error: 'Registration error' };
    }
  } catch (err) {
    return handleError(err);
  }
};

export const passwordResetRequestHandler = async (
  formData: IPasswordResetRequestForm
): Promise<IResult> => {
  try {
    const response = await axios.post(API_PASSWORD_RESET_REQUEST_URL, formData);

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Password reset request error' };
    }
  } catch (err) {
    return handleError(err);
  }
};

export const passwordResetHandler = async ({
  newPassword,
  token
}: IPasswordResetForm): Promise<IResult> => {
  try {
    const response = await axios.post(API_PASSWORD_RESET_URL, {
      newPassword,
      token
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Password reset error' };
    }
  } catch (err) {
    return handleError(err);
  }
};
