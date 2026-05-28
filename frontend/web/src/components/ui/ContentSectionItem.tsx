import { cn } from '@/utils/shared';
import Typography from './Typography';
import { Skeleton } from '../shadcn/skeleton';
import { ReactNode } from 'react';
import { ESectionItemType } from '@/enums/ui';
import { sectionItemObj } from '@/constants/sectionItem';

export interface IContentSectionItem {
  variant?: ESectionItemType;
  className?: string;
  title?: string;
  titleClass?: string;
  titleComponent?: ReactNode;
  description?: string;
  descriptionClass?: string;
  descriptionComponent?: ReactNode;
  Icon?: JSX.ElementType;
  iconClass?: string;
  iconWrapperClass?: string;
  iconComponent?: ReactNode;
  hideContent?: boolean;
}

export default function ContentSectionItem({
  variant,
  className,
  title,
  titleClass,
  titleComponent,
  description,
  descriptionClass,
  descriptionComponent,
  Icon,
  iconClass,
  iconWrapperClass,
  iconComponent,
  hideContent = false
}: IContentSectionItem) {
  const sectionItem = variant
    ? sectionItemObj[variant]
    : {
        icon: Icon,
        iconClass: iconClass,
        iconWrapperClass: iconWrapperClass
      };

  return (
    <div className={cn('flex items-center gap-3', className)} title={title}>
      {iconComponent ? (
        iconComponent
      ) : sectionItem.icon ? (
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border',
            sectionItem.iconWrapperClass
          )}
        >
          <sectionItem.icon size={14} className={sectionItem.iconClass} />
        </div>
      ) : null}

      {hideContent ? null : (
        <div className="flex flex-col gap-1">
          {titleComponent ? (
            titleComponent
          ) : title ? (
            <Typography variant="note" className={cn('text-nowrap font-bold', titleClass)}>
              {title}
            </Typography>
          ) : (
            <Skeleton className="h-[16px] w-[60px]" />
          )}

          {descriptionComponent ? (
            descriptionComponent
          ) : description ? (
            <Typography
              variant="note"
              className={cn('font-semibold text-muted-foreground', descriptionClass)}
            >
              {description}
            </Typography>
          ) : (
            <Skeleton className="h-[16px] w-[60px]" />
          )}
        </div>
      )}
    </div>
  );
}
