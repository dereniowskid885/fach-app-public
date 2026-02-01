import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { ReactNode } from 'react';
import StoreProvider from '@/app/StoreProvider';
import { Toaster } from '@/components/shadcn/toaster';

const arimoItalic = localFont({
  src: '../../public/fonts/Arimo-Italic-VariableFont_wght.ttf',
  weight: '100 900'
});
const arimo = localFont({
  src: '../../public/fonts/Arimo-VariableFont_wght.ttf',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'FachApp',
  description: 'FachApp - streamline your issue management',
  authors: { name: 'DerSoft Daniel Dereniowski' }
};

export interface IRootLayout {
  children: ReactNode;
}

export default function RootLayout({ children }: IRootLayout) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${arimoItalic.className} ${arimo.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </StoreProvider>
  );
}
