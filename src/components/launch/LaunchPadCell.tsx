'use client';

import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchPadCellProps {
  onDrop: () => void;
  isActive?: boolean;
  className?: string;
}

export default function LaunchPadCell({
  onDrop,
  isActive = false,
  className
}: LaunchPadCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);

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
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'w-64 h-64 md:w-80 md:h-80',
        'rounded-2xl',
        'border-4 border-dashed',
        'transition-all duration-500 ease-out',
        'backdrop-blur-sm',
        isDragOver
          ? 'border-bee-primary bg-bee-primary/20 scale-105 shadow-2xl shadow-bee-primary/50'
          : isActive
          ? 'border-bee-primary/50 bg-surface-elevated/50 shadow-lg'
          : 'border-slate-600/30 bg-surface-elevated/30',
        !isActive && 'animate-pulse-slow',
        className
      )}
    >
      {/* Glow effect */}
      {(isDragOver || isActive) && (
        <div className="absolute inset-0 bg-gradient-to-br from-bee-primary/10 via-bee-secondary/10 to-transparent rounded-2xl" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        <div className={cn(
          'p-6 rounded-full',
          'transition-all duration-300',
          isDragOver
            ? 'bg-bee-primary scale-110 rotate-12'
            : 'bg-surface-accent'
        )}>
          <Rocket
            size={48}
            className={cn(
              'transition-colors duration-300',
              isDragOver ? 'text-bee-dark' : 'text-bee-primary'
            )}
          />
        </div>

        <div className="space-y-2">
          <h3 className={cn(
            'text-xl md:text-2xl font-bold transition-colors duration-300',
            isDragOver ? 'text-bee-primary' : 'text-text-primary'
          )}>
            {isDragOver ? 'Release to Launch!' : 'Launch Pad'}
          </h3>
          {!isActive && !isDragOver && (
            <p className="text-sm text-text-secondary">
              Drag Mr. Bee here to activate the platform
            </p>
          )}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-bee-primary/30 rounded-tl" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-bee-primary/30 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-bee-primary/30 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-bee-primary/30 rounded-br" />
    </div>
  );
}
