import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { ReactNode } from 'react';
import StoreProvider from '@/app/[locale]/StoreProvider';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from '@/components/shadcn/sonner';
import { ThemeProvider } from 'next-themes';

const arimoItalic = localFont({
  src: '../../../public/fonts/Arimo-Italic-VariableFont_wght.ttf',
  weight: '100 900'
});
const arimo = localFont({
  src: '../../../public/fonts/Arimo-VariableFont_wght.ttf',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'FachApp',
  description: 'FachApp - streamline your issue management',
  authors: { name: 'DerSoft Daniel Dereniowski' }
};

export interface IRootLayout {
  children: ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params }: IRootLayout) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${arimoItalic.className} ${arimo.className} antialiased`}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>

            <Toaster visibleToasts={3} richColors />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
