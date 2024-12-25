import React from 'react';
import { Typography } from './Typography';
import Link from 'next/link';

export default function LicenseNote() {
  return (
    <div className="fixed bottom-0 z-[1] flex w-full flex-col p-1 text-center">
      <Typography variant="note">
        Ta aplikacja korzysta z czcionki licencjonowanej na{' '}
        <span className="font-bold">Apache License 2.0</span>. Pełny tekst licencji jest dostępny{' '}
        <Link href="http://www.apache.org/licenses/LICENSE-2.0" className="underline">
          tutaj
        </Link>
        .
      </Typography>
    </div>
  );
}
