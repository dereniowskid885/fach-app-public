'use client';

import { Button } from '@/components/shadcn/button';
import { permanentRedirect } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CountdownProps {
  seconds?: number;
  redirectPath?: string;
}

export const AsyncCountdown: React.FC<CountdownProps> = ({ seconds = 5, redirectPath = '/' }) => {
  const [count, setCount] = useState(seconds);

  const timer = count > 0 ? setTimeout(() => setCount(count - 1), 1000) : undefined;

  const handleClick = () => {
    clearTimeout(timer);
    permanentRedirect(redirectPath);
  };

  useEffect(() => {
    if (count === 0) {
      permanentRedirect(redirectPath);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [count, redirectPath, timer]);

  return (
    <div>
      <div>Konto zostało aktywowane!</div>
      <div>{count} sekund do przekierowania</div>
      <Button onClick={handleClick}>Przejdź do aplikacji</Button>
    </div>
  );
};
