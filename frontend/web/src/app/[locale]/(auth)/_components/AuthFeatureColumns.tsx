import Typography from '@/components/ui/Typography';
import { EFallbackKey } from '@/enums/ui';
import { cn } from '@/lib/utils';
import { Layers, CheckCircle, RefreshCw, Star, Heart, Bolt } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface IAuthFeatureColumns {
  className?: string;
}

export default function AuthFeatureColumns({ className }: IAuthFeatureColumns) {
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
    <div
      className={cn(
        'animate-zoom-enter order-0 flex flex-col justify-between gap-4 sm:flex-row sm:gap-8',
        className
      )}
      style={{ animationDuration: '2000ms' }}
    >
      {featureColumns.map((col, i) => (
        <ul key={`${EFallbackKey.AUTH_FEATURE_LIST}-${i}`} className="space-y-4">
          {col.map((item, j) => (
            <li
              key={`${EFallbackKey.AUTH_FEATURE_LIST_ITEM}-${j}`}
              className="flex items-center gap-4"
            >
              <div className="bg-chart-3 flex rounded-full p-2">
                <item.icon className="text-black" />
              </div>

              <Typography variant="muted" className="text-white">
                {item.text}
              </Typography>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
