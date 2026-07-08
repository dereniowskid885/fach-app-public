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
          className={`bg-background text-foreground absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full font-semibold ${className}`}
        >
          {amount > 99 ? '99+' : amount}
        </div>
      ) : null}
    </div>
  );
}
