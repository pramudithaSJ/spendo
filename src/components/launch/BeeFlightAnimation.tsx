'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BeeFlightAnimationProps {
  stage: number;
  onComplete?: () => void;
}

export default function BeeFlightAnimation({ stage, onComplete }: BeeFlightAnimationProps) {
  const [isFlying, setIsFlying] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    if (stage === 2) {
      setIsFlying(true);
      // Call onComplete after flight animation
      const timer = setTimeout(() => {
        setHasLanded(true);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  if (stage < 2) {
    // Initial position - bottom left
    return (
      <div className="absolute left-[10%] bottom-[20%] z-20 animate-scale-in">
        <div
          className="relative bee-float"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255,205,63,0.4))',
          }}
        >
          <Image
            src="/icons/BeeWise -logo.svg"
            alt="BeeWise Bee"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  if (isFlying && !hasLanded) {
    // Flying to center with particles
    return (
      <>
        {/* Particle Trail */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bee-particle"
              style={{
                background: 'radial-gradient(circle, rgba(255,205,63,0.6) 0%, transparent 70%)',
                left: '10%',
                bottom: '20%',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Flying Bee */}
        <div className="absolute z-20 bee-flight-path">
          <div
            className="relative bee-rotate"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255,205,63,0.6))',
            }}
          >
            <Image
              src="/icons/BeeWise -logo.svg"
              alt="BeeWise Bee"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </>
    );
  }

  // Landed in center - subtle hover
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <div
        className="relative bee-hover"
        style={{
          filter: 'drop-shadow(0 0 40px rgba(255,205,63,0.7))',
        }}
      >
        <Image
          src="/icons/BeeWise -logo.svg"
          alt="BeeWise Bee"
          width={100}
          height={100}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
