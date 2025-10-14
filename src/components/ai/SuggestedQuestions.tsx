'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({
  questions,
  onSelectQuestion,
  disabled = false,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="mb-4 animate-fade-slide-up">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Sparkles size={14} className="text-bee-secondary" />
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Suggested Questions
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectQuestion(question)}
            disabled={disabled}
            className={cn(
              'text-xs px-3 py-2 h-auto',
              'text-black dark:bg-card',
              'border-bee-secondary/30 hover:border-bee-secondary',
              'hover:bg-bee-secondary/5',
              'transition-all duration-200',
              'text-left whitespace-normal',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <span className="line-clamp-2">{question}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
