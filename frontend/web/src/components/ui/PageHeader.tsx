import React from 'react';
import Typography from './Typography';
import { Skeleton } from '@/components/shadcn/skeleton';

export interface IPageHeader {
  title: string;
  description?: string;
  isDataLoaded?: boolean;
}

export default function PageHeader({ title, description, isDataLoaded = true }: IPageHeader) {
  return isDataLoaded ? (
    <div className="space-y-1">
      <Typography variant="h3" className="font-bold">
        {title}
      </Typography>

      {description ? (
        <Typography variant="muted" className="text-muted-foreground">
          {description}
        </Typography>
      ) : null}
    </div>
  ) : (
    <div className="space-y-1">
      <Skeleton className="h-8 w-50" />
      <Skeleton className="h-5 w-45" />
    </div>
  );
}
