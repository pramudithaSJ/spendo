'use client';

import { GameOption } from '@/lib/gameTypes';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  option: GameOption;
  onConfirm: () => void;
  onCancel: () => void;
  language: 'en' | 'ta';
}

export default function ConfirmationDialog({
  option,
  onConfirm,
  onCancel,
  language,
}: ConfirmationDialogProps) {
  const text = language === 'ta' ? option.textTa : option.text;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold">
              {language === 'ta' ? 'உறுதிப்படுத்தவும்' : 'Confirm Choice'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            {language === 'ta'
              ? 'நீங்கள் இந்த தேர்வை உறுதி செய்ய விரும்புகிறீர்களா? இதை மாற்ற முடியாது!'
              : 'Are you sure you want to select this option? This choice cannot be changed!'}
          </p>

          <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-400">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">
                {option.id}
              </div>
              <p className="text-base font-medium flex-1">{text}</p>
            </div>
          </div>

          {/* Dead-end warning removed - players discover consequences at the end */}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 min-h-[48px] touch-manipulation"
          >
            {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 min-h-[48px] touch-manipulation bg-black hover:bg-gray-900 text-yellow-400 font-semibold border-2 border-yellow-400"
          >
            {language === 'ta' ? 'உறுதிப்படுத்து' : 'Confirm & Lock'}
          </Button>
        </div>
      </div>
    </div>
  );
}
