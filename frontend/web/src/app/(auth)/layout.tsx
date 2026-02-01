import { Typography } from '@/components/common/Typography';
import { ReactNode } from 'react';
import { Layers, CheckCircle, RefreshCw, Star, Heart, Bolt } from 'lucide-react';
import AuthLeftBanner from '@assets/auth-left-banner.jpg';
import Image from 'next/image';
import { MdEngineering } from 'react-icons/md';

export interface IAuthLayout {
  children: ReactNode;
}

export default function AuthLayout({ children }: IAuthLayout) {
  const featureColumns = [
    [
      { icon: Layers, text: 'Organized category-based ticket management' },
      { icon: Bolt, text: 'Lightning fast solutions from top specialists' },
      { icon: Heart, text: 'Reliable assistance whenever you need it' }
    ],
    [
      { icon: Star, text: 'Experts you can trust for every issue' },
      { icon: RefreshCw, text: 'Stay updated with real-time ticket progress' },
      { icon: CheckCircle, text: 'Fast resolution and peace of mind' }
    ]
  ];

  return (
    <div className="relative z-0 flex min-h-screen w-full flex-col-reverse gap-8 overflow-hidden bg-black p-8 md:gap-12 md:p-12 lg:flex-row">
      <div className="flex max-h-screen flex-col justify-between gap-8 overflow-hidden lg:w-1/2">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="flex rounded-full bg-chart-2 p-3">
            <MdEngineering className="text-black" size={40} />
          </div>

          <Typography
            variant="h1"
            className="bg-gradient-to-br from-chart-2 to-chart-6 bg-clip-text text-5xl text-transparent"
          >
            FachApp
          </Typography>
        </div>

        <div
          className="animate-zoom-enter space-y-4 text-center lg:text-left 2xl:w-2/3"
          style={{ animationDuration: '2000ms' }}
        >
          <Typography variant="h2" className="text-muted-constant md:text-5xl">
            Streamline Your Issue Management
          </Typography>

          <Typography variant="lead" className="text-chart-6">
            The all-in-one platform for reporting, tracking, and resolving technical challenges with
            world-class specialists.
          </Typography>
        </div>

        <div
          className="animate-zoom-enter flex flex-col justify-between gap-4 sm:flex-row sm:gap-8"
          style={{ animationDuration: '2000ms' }}
        >
          {featureColumns.map((col, i) => (
            <ul key={`auth-feature-list-${i}`} className="space-y-4">
              {col.map((item, j) => (
                <li key={`auth-feature-list-item-${j}`} className="flex items-center gap-4">
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
