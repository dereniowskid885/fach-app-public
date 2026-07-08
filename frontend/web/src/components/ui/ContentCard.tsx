'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../shadcn/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface IContentCard {
  children: ReactNode;
  index?: number;
  className?: string;
  contentClass?: string;
  noBackground?: boolean;
  onClick?: () => void;
}

export default function ContentCard({
  children,
  index = 0,
  className = '',
  contentClass = '',
  noBackground = false,
  onClick
}: IContentCard) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
    >
      <Card
        onClick={onClick}
        className={cn(
          'rounded-2xl',
          noBackground
            ? 'border-none bg-transparent shadow-none ring-0 outline-none'
            : 'border shadow-xs transition-shadow hover:shadow-md',
          className
        )}
      >
        <CardContent className={contentClass}>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
