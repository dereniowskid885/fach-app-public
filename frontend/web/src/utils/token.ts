import { ITokenPayload } from '@/types/token';

export const getTokenPayload = (token: string): ITokenPayload | null => {
  const tokenInvalid = isTokenInvalid(token);

  if (tokenInvalid) {
    return null;
  }

  try {
    const tokenArr = token.split('.');
    return JSON.parse(atob(tokenArr[1])) as ITokenPayload;
  } catch (err) {
    console.error('Error in decodeJWT: ', err);
  }

  return null;
};

export const isTokenInvalid = (token: string) => {
  const tokenArr = token.split('.');
  return tokenArr.length !== 3;
};

export const isTokenExpired = (token: string) => {
  const tokenPayload = getTokenPayload(token);
  return tokenPayload ? tokenPayload.exp <= Date.now() / 1000 : true;
};
