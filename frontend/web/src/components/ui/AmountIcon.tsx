import { ReactNode } from 'react';

export interface IAmountIcon {
  className?: string;
  amount?: number;
  children?: ReactNode;
}

export default function AmountIcon({ className, amount, children }: IAmountIcon) {
  return (
    <div className="relative inline-block">
      {children}
      {amount && amount > 0 ? (
        <div
          className={`absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-chart-5 font-semibold text-primary ${className}`}
        >
          {amount > 99 ? '99+' : amount}
        </div>
      ) : null}
    </div>
  );
}
