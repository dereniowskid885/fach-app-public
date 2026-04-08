'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../shadcn/card';
import { ReactNode } from 'react';
import { cn } from '@/utils/shared';

export interface IContentCard {
  children: ReactNode;
  index?: number;
  className?: string;
  noBackground?: boolean;
  onClick?: () => void;
}

export default function ContentCard({
  children,
  index = 0,
  className = '',
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
        className="rounded-xl border shadow-sm transition-shadow hover:shadow-md"
      >
        <CardContent className={cn('p-4 sm:p-6', className)}>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
