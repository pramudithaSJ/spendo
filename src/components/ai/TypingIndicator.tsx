'use client';

import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-4 animate-fade-slide-up">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-bee-secondary to-bee-secondary-light flex items-center justify-center">
        <Bot size={16} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Typing Bubble */}
      <div className="bg-white dark:bg-card border border-surface-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-text-muted rounded-full animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '1s' }}
          />
          <div
            className="w-2 h-2 bg-text-muted rounded-full animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '1s' }}
          />
          <div
            className="w-2 h-2 bg-text-muted rounded-full animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '1s' }}
          />
        </div>
      </div>
    </div>
  );
}
