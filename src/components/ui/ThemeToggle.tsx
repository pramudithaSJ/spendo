'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'icon';
}

export default function ThemeToggle({ className, variant = 'icon' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          'rounded-full hover:bg-[var(--surface-accent)] dark:hover:bg-[var(--surface-elevated)] transition-all',
          className
        )}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-[var(--text-primary)] transition-transform hover:rotate-12" />
        ) : (
          <Sun className="h-5 w-5 text-[var(--bee-secondary)] transition-transform hover:rotate-45" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className={cn('gap-2', className)}
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span>Light Mode</span>
        </>
      )}
    </Button>
  );
}
