'use server';

import { cookies } from 'next/headers';

export const deleteCookie = async (name: string) => {
  (await cookies()).delete(name);
};
