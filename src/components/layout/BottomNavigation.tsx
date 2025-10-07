'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Plus, List, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/dashboard', icon: Home, label: t.nav.home },
    { href: '/transactions', icon: List, label: t.nav.history },
    { href: '/add', icon: Plus, label: t.nav.add, isMainAction: true },
    { href: '/profile', icon: User, label: t.nav.profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, label, isMainAction }) => {
          const isActive = pathname === href;
          
          if (isMainAction) {
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center transition-all duration-200',
                  'w-14 h-14 -mt-2 rounded-full shadow-lg',
                  'bg-black text-white hover:bg-gray-800',
                  'active:scale-95'
                )}
              >
                <Icon size={24} strokeWidth={2} />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center transition-all duration-200',
                'py-2 px-3 rounded-xl min-w-[64px]',
                'active:scale-95',
                isActive
                  ? 'text-black bg-gray-100'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                'text-xs mt-1 transition-all',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-black rounded-full mt-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}