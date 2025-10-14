'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  delay?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  delay = 0,
  isActive = false,
  onClick
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'relative group',
        'rounded-xl p-6 md:p-7',
        'bg-surface-elevated border-2 border-surface-border',
        'hover:border-bee-primary/60 hover:shadow-xl hover:shadow-bee-primary/20',
        'hover:scale-[1.02] active:scale-[0.98]',
        'transition-all duration-500 ease-out',
        'cursor-pointer',
        isActive
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      )}
      style={{
        transitionDelay: isActive ? `${delay}ms` : '0ms'
      }}
      onClick={onClick}
    >
      {/* Animated border pulse */}
      <div className="absolute inset-0 rounded-xl border-2 border-bee-primary/30 opacity-0 group-hover:opacity-100 animate-pulse-slow" />

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-bee-primary/10 to-bee-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3 md:gap-4">
        {/* Icon */}
        <div className="p-4 rounded-full bg-surface-accent group-hover:bg-bee-primary/15 transition-all duration-300 shadow-sm group-hover:shadow-md">
          <Icon
            size={32}
            className="text-bee-primary group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-300"
            strokeWidth={2}
          />
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-bold text-text-primary group-hover:text-bee-primary transition-colors duration-300 leading-snug">
          {title}
        </h3>

        {/* Description (optional) */}
        {description && (
          <p className="text-sm md:text-base text-text-secondary line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}
