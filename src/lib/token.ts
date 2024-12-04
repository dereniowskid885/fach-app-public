export const getTokenPayload = (token: string) => {
  try {
    const tokenArr = token.split('.');
    return JSON.parse(atob(tokenArr[1]));
  } catch (err) {
    console.error('Error in decodeJWT: ', err);
  }
};

export const isTokenExpired = (token: string) => {
  const tokenPayload = getTokenPayload(token);
  return tokenPayload.exp <= Date.now() / 1000;
};
