'use client';

import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchPadCellProps {
  onDrop: () => void;
  isActive?: boolean;
  isBeingDraggedOver?: boolean;
  className?: string;
}

export default function LaunchPadCell({
  onDrop,
  isActive = false,
  isBeingDraggedOver = false,
  className
}: LaunchPadCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Combine both hover states (HTML5 drag or custom mouse)
  const isHovered = isDragOver || isBeingDraggedOver;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop();
  };

  return (
    <div
      data-launch-pad
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'w-64 h-64 md:w-72 md:h-72',
        'rounded-2xl',
        'border-4 border-dashed',
        'transition-all duration-500 ease-out',
        'backdrop-blur-sm',
        isHovered
          ? 'border-bee-primary bg-bee-primary/25 scale-110 shadow-[0_20px_70px_-15px_rgba(255,205,63,0.7)]'
          : isActive
          ? 'border-bee-primary/50 bg-surface-elevated/50 shadow-xl'
          : 'border-bee-primary/20 bg-surface-elevated/30 shadow-lg',
        !isActive && 'animate-pulse-slow',
        className
      )}
    >
      {/* Enhanced glow effect */}
      {(isHovered || isActive) && (
        <div className="absolute inset-0 bg-gradient-to-br from-bee-primary/20 via-bee-secondary/15 to-transparent rounded-3xl animate-pulse-slow" />
      )}

      {/* Honeycomb pattern background */}
      <div className="absolute inset-0 opacity-5 hexagon-bg rounded-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        <div className={cn(
          'p-6 rounded-full',
          'transition-all duration-300 shadow-lg',
          isHovered
            ? 'bg-bee-primary scale-110 rotate-12 shadow-[0_10px_30px_-10px_rgba(255,205,63,0.8)]'
            : 'bg-surface-accent shadow-md'
        )}>
          <Rocket
            size={48}
            className={cn(
              'transition-colors duration-300',
              isHovered ? 'text-bee-dark' : 'text-bee-primary'
            )}
            strokeWidth={2}
          />
        </div>

        <div className="space-y-2">
          <h3 className={cn(
            'text-xl md:text-2xl font-bold transition-all duration-300 drop-shadow-md',
            isHovered ? 'text-bee-primary scale-105' : 'text-text-primary'
          )}>
            {isHovered ? 'Release to Launch!' : 'Launch Pad'}
          </h3>
          {!isActive && !isHovered && (
            <p className="text-sm md:text-base text-text-secondary font-medium leading-relaxed">
              Drop Mr. Bee here
            </p>
          )}
        </div>
      </div>

      {/* Enhanced corner decorations */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-[3px] border-l-[3px] border-bee-primary/40 rounded-tl-lg" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-[3px] border-r-[3px] border-bee-primary/40 rounded-tr-lg" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-[3px] border-l-[3px] border-bee-primary/40 rounded-bl-lg" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-[3px] border-r-[3px] border-bee-primary/40 rounded-br-lg" />
    </div>
  );
}
