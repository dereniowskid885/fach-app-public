'use client';

import { Button } from '@/components/shadcn/button';
import Typography from '@/components/ui/Typography';
import { useEffect, useState } from 'react';

export interface IAsyncCountdown {
  seconds?: number;
  endOfCountdownHandler: () => void;
  title: string;
  description: string;
  buttonText: string;
}

export default function AsyncCountdown({
  seconds = 5,
  endOfCountdownHandler,
  title,
  description,
  buttonText
}: IAsyncCountdown) {
  const [count, setCount] = useState<number>(seconds);

  const timer = count > 0 ? setTimeout(() => setCount(count - 1), 1000) : undefined;

  const handleClick = () => {
    clearTimeout(timer);
    endOfCountdownHandler();
  };

  useEffect(() => {
    if (count === 0) {
      endOfCountdownHandler();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [count, timer, endOfCountdownHandler]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Typography variant="h2">{title}</Typography>

        <Typography variant="lead">
          {description}

          <span className="text-foreground font-bold">{count}</span>
        </Typography>
      </div>

      <Button onClick={handleClick} className="w-full">
        {buttonText}
      </Button>
    </div>
  );
}
