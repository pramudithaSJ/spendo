'use client';

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-2 mb-4 animate-fade-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-bee-primary'
            : 'bg-gradient-to-br from-bee-secondary to-bee-secondary-light'
        )}
      >
        {isUser ? (
          <User size={16} className="text-bee-text-on-primary" strokeWidth={2.5} />
        ) : (
          <Bot size={16} className="text-white" strokeWidth={2.5} />
        )}
      </div>

      {/* Message Bubble */}
      <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start', 'max-w-[75%]')}>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl shadow-sm',
            isUser
              ? 'bg-bee-primary text-bee-text-on-primary rounded-tr-sm'
              : 'bg-white dark:bg-card border border-surface-border rounded-tl-sm'
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-text-muted mt-1 px-1">
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </span>
      </div>
    </div>
  );
}
