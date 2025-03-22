'use server';

import { cookies } from 'next/headers';
import { getTokenPayload } from './token';
import { notFound } from 'next/navigation';

// get userData from token for server components
export const getUserData = async () => {
  const token = (await cookies()).get('accessToken');
  const tokenPayload = getTokenPayload(token?.value ?? '');

  if (!tokenPayload) {
    notFound();
  }

  return tokenPayload;
};
