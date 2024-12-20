'use server';

import { IResult } from '@/constants/interfaces';
import {
  API_EMAIL_VERIFY_REQUEST_URL,
  API_EMAIL_VERIFY_URL,
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
  city: string;
}

export interface IPasswordResetRequestForm {
  email: string;
}

export interface IAccountVerifyRequestForm {
  email: string;
}

export interface IPasswordResetForm {
  newPassword: string;
  newPasswordConfirm: string;
  token: string;
}

export interface IAccountVerifyForm {
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

export const registerHandler = async (formData: IRegisterForm): Promise<IResult> => {
  try {
    const response = await axios.post(API_REGISTER_URL, formData);

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

export const passwordResetHandler = async (formData: IPasswordResetForm): Promise<IResult> => {
  try {
    const response = await axios.post(API_PASSWORD_RESET_URL, formData);

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Password reset error' };
    }
  } catch (err) {
    return handleError(err);
  }
};

export const accountVerifyRequestHandler = async (
  formData: IAccountVerifyRequestForm
): Promise<IResult> => {
  try {
    const response = await axios.post(API_EMAIL_VERIFY_REQUEST_URL, formData);

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Account verification request error' };
    }
  } catch (err) {
    return handleError(err);
  }
};

export const accountVerifyHandler = async (formData: IAccountVerifyForm): Promise<IResult> => {
  try {
    const response = await axios.post(API_EMAIL_VERIFY_URL, formData);

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Account verification error' };
    }
  } catch (err) {
    return handleError(err);
  }
};
