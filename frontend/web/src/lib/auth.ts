import { IResult } from '@/constants/const';
import { AuthAPI } from '@/constants/api';
import axios from 'axios';
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
    const response = await axios.post(AuthAPI.LOGIN, formData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    if (response.status === 200) {
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
    const response = await axios.post(AuthAPI.REGISTER, formData);

    if (response.status === 201) {
      return { success: true };
    } else if (response.status === 207) {
      return { success: false, status: response.status };
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
    const response = await axios.post(AuthAPI.PASSWORD_RESET_REQUEST, formData);

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
    const response = await axios.post(AuthAPI.PASSWORD_RESET, formData);

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
    const response = await axios.post(AuthAPI.EMAIL_VERIFY_REQUEST, formData);

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
    const response = await axios.post(AuthAPI.EMAIL_VERIFY, formData, { withCredentials: true });

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Account verification error' };
    }
  } catch (err) {
    return handleError(err);
  }
};

export const logoutHandler = async (): Promise<IResult> => {
  try {
    const response = await axios.post(AuthAPI.LOGOUT, {}, { withCredentials: true });

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Logout request failed' };
    }
  } catch (err) {
    return handleError(err);
  }
};
