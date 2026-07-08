import Typography from '@/components/ui/Typography';
import { ReactNode } from 'react';
import AuthBackground from '@assets/auth-background.jpg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import PreferencesButtons from './_components/PreferencesButtons';
import Logo from '@/components/ui/Logo';
import AuthFeatureColumns from './_components/AuthFeatureColumns';

export interface IAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: IAuthLayout) {
  const t = useTranslations();

  return (
    <div className="relative z-0 flex min-h-dvh w-full flex-col gap-12 bg-black p-10 md:gap-12 md:p-12 lg:flex-row">
      <div className="flex flex-col justify-between gap-8 lg:w-1/2">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <Logo />

          <Typography
            variant="h1"
            className="from-chart-2 to-chart-5 bg-linear-to-br bg-clip-text text-5xl text-transparent"
          >
            {t('common.appTitle')}
          </Typography>
        </div>

        <div
          className="animate-zoom-enter space-y-4 text-center lg:text-left 2xl:w-2/3"
          style={{ animationDuration: '2000ms' }}
        >
          <Typography variant="h2" className="text-white md:text-5xl">
            {t('authLayout.title')}
          </Typography>

          <Typography variant="lead" className="text-chart-3">
            {t('authLayout.subtitle')}
          </Typography>
        </div>

        <AuthFeatureColumns className="hidden lg:flex" />
      </div>

      <div className="order-1 flex w-full flex-col items-center justify-center gap-12 lg:w-1/2">
        {children}

        <AuthFeatureColumns className="lg:hidden" />

        <PreferencesButtons />
      </div>

      <Image
        src={AuthBackground}
        alt="auth background image"
        className="-z-10 object-cover opacity-30"
        placeholder="blur"
        priority
        fill
      />
    </div>
  );
}
