'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger exit animation
    setIsVisible(false);

    // Wait for exit animation, then trigger enter animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={isVisible ? 'page-transition-enter' : 'page-transition-exit'}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </div>
  );
}
