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
  title: 'Issue Solver',
  description: 'Issue Solver Prototype',
  authors: { name: 'DDS' }
};

export interface IRootLayout {
  children: ReactNode;
}

export default function RootLayout({ children }: IRootLayout) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${arimoItalic.className} ${arimo.className} bg-primary-700 antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </StoreProvider>
  );
}
