'use server';

import { cookies } from 'next/headers';

// check if cookie exists
export async function isCookie(name: string) {
  const cookie = (await cookies()).get(name);

  return !!cookie;
}
