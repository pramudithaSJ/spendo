'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LoadingBee() {
  const [stage, setStage] = useState<'entrance' | 'hover'>('entrance');

  useEffect(() => {
    // Switch to hover animation after entrance completes (increased duration)
    const timer = setTimeout(() => {
      setStage('hover');
    }, 2000); // Increased from 1200ms to 2000ms for slower animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center overflow-hidden bg-[var(--surface-bg)]">
      <div className="relative w-full max-w-md px-4">
        {/* Main Content Container */}
        <div className="text-center space-y-8">

          {/* Animated Bee Logo */}
          <div className="relative h-32 flex items-center justify-center">
            <div className={`${stage === 'entrance' ? 'animate-bee-entrance' : 'animate-bee-hover'}`}>
              <Image
                src="/icons/BeeWise -logo.svg"
                alt="BeeWise Logo"
                width={120}
                height={120}
                className="mx-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Just the bee animation - no text, minimalist and professional */}

        </div>

        {/* Decorative Elements - Professional Gold & Blue */}
        <div className="absolute top-1/4 -left-10 w-24 h-24 rounded-full bg-[var(--bee-primary)] opacity-15 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-10 w-32 h-32 rounded-full bg-[var(--bee-secondary)] opacity-12 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[var(--bee-primary-light)] opacity-8 blur-3xl"></div>
      </div>
    </div>
  );
}
