'use client';

import { useEffect, useState } from 'react';

interface LaunchCounterProps {
  targetCount: number;
  duration?: number;
  isVisible: boolean;
}

export default function LaunchCounter({
  targetCount,
  duration = 2000,
  isVisible,
}: LaunchCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutQuad * targetCount));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, targetCount, duration]);

  if (!isVisible) return null;

  return (
    <div className="text-center animate-fade-slide-up">
      <div className="text-5xl md:text-6xl font-bold text-bee-primary mb-2">
        {count.toLocaleString()}+
      </div>
      <p className="text-sm md:text-base text-text-secondary font-medium">
        Users Ready
      </p>
    </div>
  );
}
