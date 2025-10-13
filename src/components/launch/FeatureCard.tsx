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
        'rounded-xl p-6',
        'bg-surface-elevated border border-surface-border',
        'hover:border-bee-primary/50 hover:shadow-lg hover:shadow-bee-primary/10',
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
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-bee-primary/5 to-bee-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        {/* Icon */}
        <div className="p-4 rounded-full bg-surface-accent group-hover:bg-bee-primary/10 transition-colors duration-300">
          <Icon
            size={32}
            className="text-bee-primary group-hover:scale-110 transition-transform duration-300"
            strokeWidth={1.5}
          />
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-text-primary group-hover:text-bee-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description (optional) */}
        {description && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}
