'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'card' | 'circle';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const variantClasses = {
    default: 'skeleton',
    text: 'skeleton-text',
    card: 'skeleton-card',
    circle: 'skeleton rounded-full',
  };

  return (
    <div
      className={cn(variantClasses[variant], className)}
      aria-live="polite"
      aria-busy="true"
    />
  );
}

// Skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="skeleton-card space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card-elevated p-4 space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function SkeletonTransaction() {
  return (
    <div className="flex items-center gap-3 p-3 border border-[var(--surface-border)] rounded-lg">
      <Skeleton variant="circle" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>

      {/* Recent Transactions */}
      <div className="card-elevated p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          <SkeletonTransaction />
          <SkeletonTransaction />
          <SkeletonTransaction />
        </div>
      </div>
    </div>
  );
}
