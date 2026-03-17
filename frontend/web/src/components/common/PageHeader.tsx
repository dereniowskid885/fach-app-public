import React from 'react';
import Typography from './Typography';
import { Skeleton } from '../shadcn/skeleton';

export interface IPageHeader {
  title: string;
  description?: string;
  isDataLoaded?: boolean;
}

export default function PageHeader({ title, description, isDataLoaded = true }: IPageHeader) {
  return isDataLoaded ? (
    <div className="flex flex-col gap-1">
      <Typography variant="h3" className="font-bold">
        {title}
      </Typography>

      {description ? <Typography variant="muted">{description}</Typography> : null}
    </div>
  ) : (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-[32px] w-[200px]" />
      <Skeleton className="h-[20px] w-[180px]" />
    </div>
  );
}
