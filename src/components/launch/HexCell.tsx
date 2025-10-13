'use client';

import { cn } from '@/lib/utils';

export interface HexCellProps {
  label: string;
  icon?: string;
  isActive: boolean;
  delay: number;
  onClick?: () => void;
}

export default function HexCell({ label, icon, isActive, delay, onClick }: HexCellProps) {
  return (
    <div
      className={cn(
        'hex-cell relative flex flex-col items-center justify-center',
        'w-24 h-24 md:w-28 md:h-28',
        'border border-slate-600/30',
        'transition-all duration-600 ease-out',
        'cursor-pointer select-none',
        isActive && 'hex-cell-active'
      )}
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        transitionDelay: `${delay}ms`,
      }}
      onClick={onClick}
    >
      {/* Background glow */}
      {isActive && (
        <div
          className="absolute inset-0 bg-bee-primary/10"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1 px-2">
        {icon && (
          <span className="text-2xl" role="img" aria-label={label}>
            {icon}
          </span>
        )}
        <span
          className={cn(
            'text-[10px] md:text-xs text-center font-medium leading-tight',
            'transition-colors duration-300',
            isActive ? 'text-bee-primary' : 'text-slate-500'
          )}
        >
          {label}
        </span>
      </div>

      {/* Hexagon glow effect */}
      {isActive && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            boxShadow: '0 0 20px rgba(255, 205, 63, 0.3)',
          }}
        />
      )}
    </div>
  );
}
