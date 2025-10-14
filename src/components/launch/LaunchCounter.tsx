'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchCounterProps {
  targetCount?: number; // Keep for backward compatibility, but we'll use percentage
  duration?: number;
  isVisible: boolean;
}

export default function LaunchCounter({
  duration = 2500,
  isVisible,
}: LaunchCounterProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);

      // Easing function for smooth animation (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progressValue / 100, 3);
      setProgress(Math.floor(easeOutCubic * 100));

      if (progressValue < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, duration]);

  if (!isVisible) return null;

  return (
    <div className="text-center space-y-5 md:space-y-6 animate-fade-slide-up w-full max-w-2xl">
      {/* Status Text - TOP SECTION */}
      <div className="space-y-2">
        <p className={cn(
          "text-xl md:text-2xl font-extrabold transition-all duration-300",
          isComplete ? 'bee-gradient-text scale-105' : 'text-text-secondary'
        )}>
          {isComplete ? (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={22} className="animate-pulse" />
              Application is Live Now
              <Sparkles size={22} className="animate-pulse" />
            </span>
          ) : (
            'Loading Platform...'
          )}
        </p>

        {/* Loading phases - only show when loading */}
        {!isComplete && (
          <p className="text-sm md:text-base text-text-muted font-medium">
            {progress < 30 && 'Initializing modules...'}
            {progress >= 30 && progress < 60 && 'Loading AI engine...'}
            {progress >= 60 && progress < 90 && 'Preparing dashboard...'}
            {progress >= 90 && 'Finalizing launch...'}
          </p>
        )}
      </div>

      {/* Progress Bar - MIDDLE SECTION */}
      <div className="relative w-full h-6 md:h-8 bg-surface-accent rounded-full overflow-hidden border-2 border-surface-border shadow-inner">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-bee-secondary via-bee-primary to-bee-secondary-light rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: progress > 0 ? '0 0 30px rgba(255, 205, 63, 0.8)' : 'none'
          }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>

        {/* Progress segments with tick marks */}
        <div className="absolute inset-0 flex">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-1 border-r-2 border-surface-border/40 relative">
              {i % 2 === 0 && (
                <div className="absolute -bottom-1 left-0 w-0.5 h-2 bg-surface-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Percentage - BOTTOM SECTION */}
      <div className="relative flex items-center justify-center">
        <div className={cn(
          "text-6xl md:text-7xl lg:text-8xl font-bold bee-gradient-text tabular-nums drop-shadow-xl",
          isComplete && "animate-pulse-slow"
        )}>
          {progress}%
        </div>
      </div>
    </div>
  );
}
