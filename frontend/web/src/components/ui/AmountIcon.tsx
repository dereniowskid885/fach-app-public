import { ReactNode } from 'react';

export interface IAmountIcon {
  className?: string;
  amount: number;
  showZeroAmount?: boolean;
  children?: ReactNode;
}

export default function AmountIcon({
  className,
  amount,
  showZeroAmount = false,
  children
}: IAmountIcon) {
  return (
    <div className="relative">
      {children}

      {showZeroAmount || amount > 0 ? (
        <div
          className={`absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-chart-1 font-semibold text-primary ${className}`}
        >
          {amount > 99 ? '99+' : amount}
        </div>
      ) : null}
    </div>
  );
}
