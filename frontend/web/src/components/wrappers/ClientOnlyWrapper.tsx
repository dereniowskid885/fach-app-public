'use client';

import { ReactNode, useEffect, useState } from 'react';

export interface IClientOnlyWrapper {
  children: ReactNode;
}

export default function ClientOnlyWrapper({ children }: IClientOnlyWrapper) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return <>{children}</>;
}
