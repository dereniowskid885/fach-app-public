import { cn } from '@/utils/shared';
import { Button } from '../shadcn/button';
import { X } from 'lucide-react';

export interface ICloseIcon {
  className?: string;
  onClick: () => void;
}

export default function CloseIcon({ className, onClick }: ICloseIcon) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'animation-base animation-idle animation-interactive h-[28px] w-[28px] hover:bg-transparent',
        className
      )}
      onClick={onClick}
    >
      <X />
    </Button>
  );
}
