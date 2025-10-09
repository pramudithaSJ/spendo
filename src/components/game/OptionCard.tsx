'use client';

import { GameOption } from '@/lib/gameTypes';
import { AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  option: GameOption;
  onSelect: () => void;
  disabled?: boolean;
  disabledReason?: string;
  language: 'en' | 'ta';
}

export default function OptionCard({
  option,
  onSelect,
  disabled = false,
  disabledReason,
  language,
}: OptionCardProps) {
  const text = language === 'ta' ? option.textTa : option.text;
  const impactDesc = option.financialImpact
    ? language === 'ta'
      ? option.financialImpact.descriptionTa
      : option.financialImpact.description
    : null;

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
        'active:scale-98',
        disabled
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
          : 'bg-white border-gray-300 hover:border-black hover:shadow-md active:shadow-sm',
        option.isDeadEnd && !disabled && 'border-red-200 hover:border-red-500'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
            disabled
              ? 'bg-gray-300 text-gray-500'
              : option.isDeadEnd
              ? 'bg-red-100 text-red-700'
              : 'bg-black text-white'
          )}
        >
          {option.id}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium mb-1', disabled && 'text-gray-500')}>
            {text}
          </p>

          {impactDesc && (
            <p className={cn('text-xs text-gray-600 mt-2', disabled && 'text-gray-400')}>
              💡 {impactDesc}
            </p>
          )}

          {disabled && disabledReason && (
            <div className="flex items-start gap-2 mt-2 p-2 bg-gray-200 rounded text-xs text-gray-700">
              <Lock size={14} className="flex-shrink-0 mt-0.5" />
              <span>{disabledReason}</span>
            </div>
          )}

          {option.isDeadEnd && !disabled && (
            <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                {language === 'ta' ? 'எச்சரிக்கை: இது பிரச்சினைகளுக்கு வழிவகுக்கலாம்' : 'Warning: This may lead to problems'}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
