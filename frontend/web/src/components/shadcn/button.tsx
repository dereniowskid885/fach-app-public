import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex duration-300 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
        outline: 'border border-border bg-background text-foreground hover:bg-muted',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        ghost: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
        link: 'bg-transparent text-foreground underline-offset-4 hover:underline',
        'special-1': 'bg-chart-1 text-secondary hover:opacity-90 transition-opacity',
        'special-2': 'bg-chart-2 text-secondary hover:opacity-90 transition-opacity',
        'special-3': 'bg-chart-3 text-secondary hover:opacity-90 transition-opacity',
        'special-4': 'bg-chart-4 text-primary hover:opacity-90 transition-opacity',
        'special-5': 'bg-chart-5 text-primary hover:opacity-90 transition-opacity',
        'special-6': 'bg-chart-6 text-secondary hover:opacity-90 transition-opacity'
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8 text-lg',
        icon: 'h-10 w-10 text-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
