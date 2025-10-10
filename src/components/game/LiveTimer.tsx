'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { formatTime, calculateTimeSpent } from '@/lib/gameTimer';
import { cn } from '@/lib/utils';

interface LiveTimerProps {
  startTime: string;
  wasRefreshed?: boolean;
  refreshCount?: number;
  language: 'en' | 'ta';
  className?: string;
}

export default function LiveTimer({
  startTime,
  wasRefreshed = false,
  refreshCount = 0,
  language,
  className,
}: LiveTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    // Calculate initial elapsed time
    const updateElapsed = () => {
      const seconds = calculateTimeSpent(startTime);
      setElapsedSeconds(seconds);
    };

    // Update immediately
    updateElapsed();

    // Update every second
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Color coding based on time
  const getTimerColor = () => {
    if (elapsedSeconds < 600) return 'text-green-600'; // < 10 min
    if (elapsedSeconds < 1200) return 'text-yellow-600'; // < 20 min
    return 'text-red-600'; // > 20 min
  };

  // Background color based on time
  const getBackgroundColor = () => {
    if (elapsedSeconds < 600) return 'bg-green-50 border-green-200';
    if (elapsedSeconds < 1200) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Main Timer Display */}
      <div
        className={cn(
          'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 shadow-sm transition-colors',
          getBackgroundColor()
        )}
      >
        <Clock className={cn('h-5 w-5 animate-pulse', getTimerColor())} />
        <span className={cn('text-2xl font-bold font-mono tabular-nums', getTimerColor())}>
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      {/* Refresh Warning */}
      {wasRefreshed && refreshCount > 0 && (
        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 border-2 border-orange-300 rounded-lg text-orange-900 text-xs font-medium animate-pulse">
          <AlertCircle className="h-4 w-4" />
          <span>
            {language === 'ta'
              ? `பக்கம் ${refreshCount} முறை புதுப்பிக்கப்பட்டது`
              : `Refreshed ${refreshCount} time${refreshCount > 1 ? 's' : ''}`}
          </span>
        </div>
      )}
    </div>
  );
}
