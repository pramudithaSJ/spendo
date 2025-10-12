'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text' | 'landscape';
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  sm: { icon: 40, landscape: 120, text: 'text-lg' },
  md: { icon: 56, landscape: 160, text: 'text-2xl' },
  lg: { icon: 72, landscape: 200, text: 'text-3xl' },
  xl: { icon: 96, landscape: 280, text: 'text-4xl' }
};

export default function Logo({
  size = 'md',
  variant = 'full',
  className = '',
  priority = true
}: LogoProps) {
  const dimensions = sizeMap[size];

  // Icon only variant - uses SVG logo
  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Image
          src="/icons/BeeWise -logo.svg"
          alt="BeeWise Financial Literacy App"
          width={dimensions.icon}
          height={dimensions.icon}
          className="object-contain"
          priority={priority}
        />
      </div>
    );
  }

  // Landscape variant - uses landscape logo
  if (variant === 'landscape') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Image
          src="/icons/BeeWise-land.png"
          alt="BeeWise Financial Literacy App"
          width={dimensions.landscape}
          height={dimensions.icon}
          className="object-contain"
          priority={priority}
        />
      </div>
    );
  }

  // Text only variant
  if (variant === 'text') {
    return (
      <div className={cn('font-bold', dimensions.text, className)}>
        <span className="text-[var(--text-primary)]">Bee</span>
        <span className="bee-gradient-text">Wise</span>
      </div>
    );
  }

  // Full logo with icon + text (default)
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/icons/BeeWise -logo.svg"
        alt="BeeWise"
        width={dimensions.icon}
        height={dimensions.icon}
        className="object-contain"
        priority={priority}
      />
      <div className={cn('font-bold', dimensions.text)}>
        <span className="text-[var(--text-primary)]">Bee</span>
        <span className="bee-gradient-text">Wise</span>
      </div>
    </div>
  );
}
