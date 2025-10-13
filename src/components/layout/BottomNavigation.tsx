'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Plus, List, User, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/dashboard', icon: Home, label: t.nav.home },
    { href: '/transactions', icon: List, label: t.nav.history },
    { href: '/add', icon: Plus, label: t.nav.add, isMainAction: true },
    { href: '/ask-ai', icon: Sparkles, label: t.nav.askAI },
    { href: '/profile', icon: User, label: t.nav.profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-card/95 backdrop-blur-md border-t border-surface-border z-50 safe-area-pb shadow-xl">
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label, isMainAction }) => {
          const isActive = pathname === href;

          if (isMainAction) {
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center transition-all duration-300',
                  'w-16 h-16 -mt-4 rounded-2xl',
                  'bg-bee-primary',
                  'shadow-lg hover:shadow-xl hover:scale-110 hover:bg-bee-primary-hover',
                  'active:scale-95',
                  'text-bee-text-on-primary'
                )}
              >
                <Icon size={26} strokeWidth={2.5} />
                <span className="text-[8px] mt-0.5 font-bold tracking-wide">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center transition-all duration-300',
                'py-2 px-2 rounded-xl min-w-[60px]',
                'active:scale-95',
                isActive
                  ? 'text-bee-secondary bg-gradient-to-b from-surface-accent to-transparent'
                  : 'text-text-muted hover:text-bee-secondary hover:bg-surface-accent/50'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
              <span className={cn(
                'text-[10px] mt-1 transition-all',
                isActive ? 'font-bold' : 'font-medium'
              )}>
                {label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-bee-secondary rounded-full mt-0.5 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}