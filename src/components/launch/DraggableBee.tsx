'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DraggableBeeProps {
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDragDisabled?: boolean;
  className?: string;
}

export default function DraggableBee({
  onDragStart,
  onDragEnd,
  isDragDisabled = false,
  className
}: DraggableBeeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const beeRef = useRef<HTMLDivElement>(null);
  const trailIdRef = useRef(0);

  // Handle desktop drag
  const handleDragStart = (e: React.DragEvent) => {
    if (isDragDisabled) return;

    setIsDragging(true);
    onDragStart?.();

    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('bee', 'dragging');

    // Create a transparent drag image (prevents default ghost image)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1);
    }
    e.dataTransfer.setDragImage(canvas, 0, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Ignore end position

    // Add trail effect
    setTrail(prev => [
      ...prev,
      { x: e.clientX, y: e.clientY, id: trailIdRef.current++ }
    ].slice(-10)); // Keep last 10 trail points
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    setTrail([]);
    onDragEnd?.();
  };

  // Handle mobile touch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDragDisabled) return;
    e.preventDefault();
    setIsDragging(true);
    onDragStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isDragDisabled) return;
    e.preventDefault();

    const touch = e.touches[0];
    if (beeRef.current) {
      const rect = beeRef.current.getBoundingClientRect();
      const newX = touch.clientX - rect.left - rect.width / 2;
      const newY = touch.clientY - rect.top - rect.height / 2;

      setPosition({ x: newX, y: newY });

      // Add trail for touch
      setTrail(prev => [
        ...prev,
        { x: touch.clientX, y: touch.clientY, id: trailIdRef.current++ }
      ].slice(-10));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    setTrail([]);
    onDragEnd?.();
  };

  // Clean up trail after delay
  useEffect(() => {
    if (trail.length > 0 && !isDragging) {
      const timer = setTimeout(() => setTrail([]), 500);
      return () => clearTimeout(timer);
    }
  }, [trail, isDragging]);

  return (
    <>
      {/* Trail effects */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: point.x,
            top: point.y,
            opacity: index / trail.length * 0.5,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-8 h-8 bg-bee-primary/30 rounded-full blur-md animate-fade-out" />
        </div>
      ))}

      {/* Draggable Bee */}
      <div
        ref={beeRef}
        draggable={!isDragDisabled}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'relative group select-none',
          !isDragDisabled && 'cursor-grab active:cursor-grabbing',
          isDragDisabled && 'cursor-not-allowed opacity-50',
          isDragging && 'z-50',
          className
        )}
        style={{
          transform: isDragging
            ? `translate(${position.x}px, ${position.y}px) scale(1.15) rotate(5deg)`
            : 'translate(0, 0) scale(1) rotate(0deg)',
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Floating animation */}
        <div className={cn(
          'relative transition-all duration-500',
          !isDragging && 'animate-float'
        )}>
          {/* Glow effect */}
          <div className={cn(
            'absolute inset-0 bg-bee-primary/20 rounded-full blur-2xl scale-150 transition-opacity duration-300',
            isDragging ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'
          )} />

          {/* Bee logo */}
          <div className="relative z-10">
            <Image
              src="/icons/BeeWise -logo.svg"
              alt="BeeWise Mascot"
              width={120}
              height={120}
              className="object-contain drop-shadow-2xl pointer-events-none"
              draggable={false}
              priority
            />
          </div>

          {/* Wing flap animation when dragging */}
          {isDragging && (
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute top-1/4 left-0 w-8 h-12 bg-bee-primary/20 rounded-full blur-sm -rotate-45" />
              <div className="absolute top-1/4 right-0 w-8 h-12 bg-bee-primary/20 rounded-full blur-sm rotate-45" />
            </div>
          )}

          {/* Pulse ring when not disabled and not dragging */}
          {!isDragDisabled && !isDragging && (
            <div className="absolute inset-0 rounded-full border-2 border-bee-primary/30 animate-ping" />
          )}
        </div>

        {/* Instruction hint */}
        {!isDragDisabled && !isDragging && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="bg-bee-dark text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Drag me! 🐝
            </div>
          </div>
        )}
      </div>
    </>
  );
}
