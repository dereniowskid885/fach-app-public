import { ReactNode } from 'react';

export interface IAmountIcon {
  className?: string;
  amount: number;
  children: ReactNode;
}

export default function AmountIcon({ className, amount, children }: IAmountIcon) {
  return (
    <div className="relative inline-block">
      {children}
      {amount > 0 ? (
        <div
          className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent text-xs font-medium text-white ${className}`}
        >
          {amount > 99 ? '99+' : amount}
        </div>
      ) : null}
    </div>
  );
}
