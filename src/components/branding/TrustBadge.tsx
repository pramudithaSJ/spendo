'use client';

import { Shield, Award } from 'lucide-react';
import Image from 'next/image';

interface TrustBadgeProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function TrustBadge({ variant = 'compact', className = '' }: TrustBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center gap-4 text-xs text-[var(--text-muted)] ${className}`}>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Powered By Kandy UNI</span>
        </div>
        <div className="w-px h-3 bg-[var(--surface-border)]" />
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>CBSL Initiative</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* SLIIT Branding */}
      <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-[var(--surface-honey)] border border-[var(--surface-border)]">
        <Image
          src="/icons/kandyuni.png"
          alt="SLIIT Kandy Campus"
          width={40}
          height={40}
          className="object-contain"
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Powered by
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            SLIIT Kandy Campus
          </p>
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--bee-primary)]" />
          <span>Secured</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[var(--bee-primary)]" />
          <span>CBSL Aligned</span>
        </div>
      </div>
    </div>
  );
}
