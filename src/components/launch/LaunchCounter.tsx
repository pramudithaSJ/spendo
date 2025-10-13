'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

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
    <div className="text-center space-y-6 animate-fade-slide-up w-full max-w-md">
      {/* Progress Percentage */}
      <div className="relative">
        <div className="text-7xl md:text-8xl font-bold bee-gradient-text mb-2 tabular-nums">
          {progress}%
        </div>
        {isComplete && (
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Check size={48} className="text-green-500 drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-surface-accent rounded-full overflow-hidden border border-surface-border shadow-inner">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-bee-secondary via-bee-primary to-bee-secondary-light rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: progress > 0 ? '0 0 20px rgba(255, 205, 63, 0.6)' : 'none'
          }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Progress segments */}
        <div className="absolute inset-0 flex">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-surface-border/30" />
          ))}
        </div>
      </div>

      {/* Status Text */}
      <div className="space-y-2">
        <p className={`text-lg font-semibold transition-all duration-300 ${
          isComplete ? 'text-bee-primary scale-110' : 'text-text-secondary'
        }`}>
          {isComplete ? (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={20} className="animate-pulse" />
              App Loaded Successfully!
              <Sparkles size={20} className="animate-pulse" />
            </span>
          ) : (
            'Loading Platform...'
          )}
        </p>

        {/* Loading phases */}
        {!isComplete && (
          <p className="text-sm text-text-muted">
            {progress < 30 && 'Initializing modules...'}
            {progress >= 30 && progress < 60 && 'Loading AI engine...'}
            {progress >= 60 && progress < 90 && 'Preparing dashboard...'}
            {progress >= 90 && 'Finalizing launch...'}
          </p>
        )}
      </div>
    </div>
  );
}
