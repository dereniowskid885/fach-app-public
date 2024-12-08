import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { ReactNode } from 'react';

const geistSans = localFont({
  src: '../../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: '../../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-primary-700 antialiased`}>
        {children}
      </body>
    </html>
  );
}
