'use client';

import { GameChoice } from '@/lib/gameTypes';
import { GAME_STEPS } from '@/lib/gameData';
import { CheckCircle2 } from 'lucide-react';

interface ChoiceHistoryProps {
  choices: GameChoice[];
  language: 'en' | 'ta';
}

export default function ChoiceHistory({ choices, language }: ChoiceHistoryProps) {
  if (choices.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <CheckCircle2 size={16} />
        {language === 'ta' ? 'உங்கள் முந்தைய தேர்வுகள்' : 'Your Previous Choices'}
      </h3>

      <div className="space-y-2">
        {choices.map((choice) => {
          const step = GAME_STEPS.find(s => s.step === choice.step);
          const option = step?.options.find(o => o.id === choice.option);

          if (!step || !option) return null;

          const optionText = language === 'ta' ? option.textTa : option.text;
          const stepTitle = language === 'ta' ? step.titleTa : step.title;

          return (
            <div
              key={choice.step}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                {choice.option}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">{stepTitle}</p>
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {optionText}
                </p>
              </div>

              <div className="flex-shrink-0">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
