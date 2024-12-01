'use server';

import { IResult } from '@/constants/interfaces';
import { LOGIN_URL } from '@/constants/urls';
import axios from 'axios';
import { cookies } from 'next/headers';
import { handleError } from './helpers';

export interface ILoginForm {
  email: string;
  password: string;
}

export const login = async ({ email, password }: ILoginForm): Promise<IResult> => {
  try {
    const response = await axios.post(LOGIN_URL, {
      accountName: email,
      password: password
    });

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

// export async function register(
//   nickname: string,
//   name: string,
//   surname: string,
//   email: string,
//   password: string
// ) {
//   const t = await getTranslations('Errors');

//   return axios
//     .post(process.env.NEXT_USER_API + '/register', {
//       nickname,
//       name,
//       surname,
//       email,
//       password
//     })
//     .then(() => ({ success: true, error: '' }))
//     .catch(() => ({ success: false, error: t('registerError') }));
// }
