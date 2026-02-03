import { Typography } from '@/components/common/Typography';
import { ReactNode } from 'react';
import { Layers, CheckCircle, RefreshCw, Star, Heart, Bolt } from 'lucide-react';
import AuthLeftBanner from '@assets/auth-left-banner.jpg';
import Image from 'next/image';
import { MdEngineering } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { EFallbackKey } from '@/constants/enums';

export interface IAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: IAuthLayout) {
  const t = useTranslations();

  const featureColumns = [
    [
      { icon: Layers, text: t('authLayout.feature1') },
      { icon: Bolt, text: t('authLayout.feature2') },
      { icon: Heart, text: t('authLayout.feature3') }
    ],
    [
      { icon: Star, text: t('authLayout.feature4') },
      { icon: RefreshCw, text: t('authLayout.feature5') },
      { icon: CheckCircle, text: t('authLayout.feature6') }
    ]
  ];

  return (
    <div className="relative z-0 flex min-h-dvh w-full flex-col gap-8 bg-black p-8 md:gap-12 md:p-12 lg:flex-row">
      <div className="flex flex-col justify-between gap-8 lg:w-1/2">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="flex rounded-full bg-chart-2 p-3">
            <MdEngineering className="text-black" size={40} />
          </div>

          <Typography
            variant="h1"
            className="bg-gradient-to-br from-chart-2 to-chart-6 bg-clip-text text-5xl text-transparent"
          >
            {t('common.appTitle')}
          </Typography>
        </div>

        <div
          className="animate-zoom-enter space-y-4 text-center lg:text-left 2xl:w-2/3"
          style={{ animationDuration: '2000ms' }}
        >
          <Typography variant="h2" className="text-muted-constant md:text-5xl">
            {t('authLayout.title')}
          </Typography>

          <Typography variant="lead" className="text-chart-6">
            {t('authLayout.subtitle')}
          </Typography>
        </div>

        <div
          className="animate-zoom-enter flex flex-col justify-between gap-4 sm:flex-row sm:gap-8"
          style={{ animationDuration: '2000ms' }}
        >
          {featureColumns.map((col, i) => (
            <ul key={`${EFallbackKey.AUTH_FEATURE_LIST}-${i}`} className="space-y-4">
              {col.map((item, j) => (
                <li
                  key={`${EFallbackKey.AUTH_FEATURE_LIST_ITEM}-${j}`}
                  className="flex items-center gap-4"
                >
                  <div className="flex rounded-full bg-chart-6 p-2">
                    <item.icon className="text-black" />
                  </div>

                  <Typography variant="muted" className="text-muted-constant">
                    {item.text}
                  </Typography>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2">{children}</div>

      <Image
        src={AuthLeftBanner}
        alt="auth left banner"
        className="-z-10 object-cover opacity-30"
        placeholder="blur"
        priority
        fill
      />
    </div>
  );
}
