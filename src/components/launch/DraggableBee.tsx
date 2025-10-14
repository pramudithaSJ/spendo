'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DraggableBeeProps {
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onHoverPad?: (isOver: boolean) => void;
  isDragDisabled?: boolean;
  className?: string;
}

export default function DraggableBee({
  onDragStart,
  onDragEnd,
  onHoverPad,
  isDragDisabled = false,
  className
}: DraggableBeeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const beeRef = useRef<HTMLDivElement>(null);
  const trailIdRef = useRef(0);

  // Handle desktop mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDragDisabled) return;
    e.preventDefault();

    setIsDragging(true);
    setCursorPosition({ x: e.clientX, y: e.clientY });
    onDragStart?.();
  };

  // Global mouse move and mouse up listeners for desktop drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Add trail effect
      setTrail(prev => [
        ...prev,
        { x: e.clientX, y: e.clientY, id: trailIdRef.current++ }
      ].slice(-10));

      // Check if bee is hovering over launch pad
      const padElement = document.querySelector('[data-launch-pad]');
      if (padElement && onHoverPad) {
        const padRect = padElement.getBoundingClientRect();
        const beeRect = {
          left: e.clientX - 80,
          right: e.clientX + 80,
          top: e.clientY - 80,
          bottom: e.clientY + 80
        };

        // Check collision
        const isColliding = !(
          beeRect.right < padRect.left ||
          beeRect.left > padRect.right ||
          beeRect.bottom < padRect.top ||
          beeRect.top > padRect.bottom
        );

        onHoverPad(isColliding);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Check if bee was dropped on launch pad
      const padElement = document.querySelector('[data-launch-pad]');
      if (padElement) {
        const padRect = padElement.getBoundingClientRect();
        const beeRect = {
          left: e.clientX - 80,
          right: e.clientX + 80,
          top: e.clientY - 80,
          bottom: e.clientY + 80
        };

        // Check collision
        const isColliding = !(
          beeRect.right < padRect.left ||
          beeRect.left > padRect.right ||
          beeRect.bottom < padRect.top ||
          beeRect.top > padRect.bottom
        );

        if (isColliding) {
          onDragEnd?.();
        }
      }

      setIsDragging(false);
      setCursorPosition({ x: 0, y: 0 });
      setTrail([]);
      onHoverPad?.(false); // Reset hover state
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onDragEnd]);

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
      {/* Trail effects - rendered via portal */}
      {typeof window !== 'undefined' && trail.length > 0 && createPortal(
        <>
          {trail.map((point, index) => (
            <div
              key={point.id}
              className="fixed pointer-events-none z-[9998]"
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
        </>,
        document.body
      )}

      {/* Dragging Bee - follows cursor (Desktop drag) - rendered via portal */}
      {typeof window !== 'undefined' && isDragging && createPortal(
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%) scale(1.15) rotate(5deg)',
          }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-bee-primary/30 rounded-full blur-3xl scale-150 opacity-100 animate-pulse-slow" />

            {/* Bee logo */}
            <div className="relative z-10">
              <Image
                src="/icons/BeeWise -logo.svg"
                alt="BeeWise Mascot"
                width={160}
                height={160}
                className="object-contain drop-shadow-2xl"
                draggable={false}
                priority
              />
            </div>

            {/* Wing flap animation */}
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute top-1/4 left-0 w-8 h-12 bg-bee-primary/20 rounded-full blur-sm -rotate-45" />
              <div className="absolute top-1/4 right-0 w-8 h-12 bg-bee-primary/20 rounded-full blur-sm rotate-45" />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Original Draggable Bee (hidden during desktop drag) */}
      <div
        ref={beeRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'relative group select-none',
          !isDragDisabled && 'cursor-grab active:cursor-grabbing',
          isDragDisabled && 'cursor-not-allowed opacity-50',
          isDragging && 'opacity-0', // Hide original during any drag
          !isDragging && 'z-10',
          className
        )}
        style={{
          transform: isDragging && position.x !== 0
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
          {/* Enhanced glow effect with pulsing */}
          <div className={cn(
            'absolute inset-0 bg-bee-primary/30 rounded-full blur-3xl scale-150 transition-all duration-300',
            isDragging ? 'opacity-100 animate-pulse-slow' : 'opacity-80 group-hover:opacity-100 animate-pulse-slow'
          )} />

          {/* Bee logo - increased size */}
          <div className="relative z-10">
            <Image
              src="/icons/BeeWise -logo.svg"
              alt="BeeWise Mascot"
              width={160}
              height={160}
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
