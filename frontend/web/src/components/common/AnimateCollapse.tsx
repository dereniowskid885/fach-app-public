import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface IAnimateCollapse {
  isHidden: boolean;
  children: ReactNode;
  className?: string;
}

export default function AnimateCollapse({ isHidden, children, className = '' }: IAnimateCollapse) {
  return (
    <AnimatePresence initial={false}>
      {isHidden ? null : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, width: 0 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
