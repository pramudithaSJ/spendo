'use client';

import { GameChoice, GameStep } from '@/lib/gameTypes';
import { CheckCircle2 } from 'lucide-react';

interface ChoiceHistoryProps {
  choices: GameChoice[];
  language: 'en' | 'ta';
  gameSteps: GameStep[];
}

export default function ChoiceHistory({ choices, language, gameSteps }: ChoiceHistoryProps) {
  if (choices.length === 0) return null;

  return (
    <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-900">
        <CheckCircle2 size={16} className="text-yellow-600" />
        {language === 'ta' ? 'உங்கள் முந்தைய தேர்வுகள்' : 'Your Previous Choices'}
      </h3>

      <div className="space-y-2">
        {choices.map((choice) => {
          const step = gameSteps.find(s => s.step === choice.step);
          const option = step?.options.find(o => o.id === choice.option);

          if (!step || !option) return null;

          const optionText = language === 'ta' ? option.textTa : option.text;
          const stepTitle = language === 'ta' ? step.titleTa : step.title;

          return (
            <div
              key={choice.step}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-300"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                {choice.option}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-1">{stepTitle}</p>
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {optionText}
                </p>
              </div>

              <div className="flex-shrink-0">
                <CheckCircle2 size={18} className="text-yellow-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
