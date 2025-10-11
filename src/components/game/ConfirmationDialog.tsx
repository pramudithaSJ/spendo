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

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                {option.id}
              </div>
              <p className="text-sm font-medium flex-1">{text}</p>
            </div>
          </div>

          {/* Dead-end warning removed - players discover consequences at the end */}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-black hover:bg-gray-800"
          >
            {language === 'ta' ? 'உறுதிப்படுத்து' : 'Confirm & Lock'}
          </Button>
        </div>
      </div>
    </div>
  );
}
