'use client';

import { GameOption } from '@/lib/gameTypes';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  option: GameOption;
  onSelect: () => void;
  disabled?: boolean;
  disabledReason?: string;
  language: 'en' | 'ta';
  selected?: boolean;
}

export default function OptionCard({
  option,
  onSelect,
  disabled = false,
  disabledReason,
  language,
  selected = false,
}: OptionCardProps) {
  const text = language === 'ta' ? option.textTa : option.text;

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
        'min-h-[60px] active:scale-98 touch-manipulation',
        disabled
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
          : selected
          ? 'bg-yellow-50 border-yellow-500 shadow-lg ring-2 ring-yellow-300'
          : 'bg-white border-gray-300 hover:border-yellow-400 hover:shadow-md active:shadow-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
            disabled
              ? 'bg-gray-300 text-gray-500'
              : selected
              ? 'bg-yellow-500 text-white ring-2 ring-yellow-300'
              : 'bg-black text-white'
          )}
        >
          {option.id}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('text-base font-medium mb-1', disabled && 'text-gray-500')}>
            {text}
          </p>

          {/* All hints/suggestions removed - players make choices without pre-warnings */}
        </div>
      </div>
    </button>
  );
}
