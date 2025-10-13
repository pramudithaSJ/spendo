'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Ask about your spending...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-[80px] left-0 right-0 z-40 bg-white/95 dark:bg-card/95 backdrop-blur-md border-t border-surface-border shadow-lg">
      <div className="max-w-3xl mx-auto p-3">
        <div className="flex items-end gap-2">
          {/* Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                'w-full resize-none rounded-2xl',
                'px-4 py-3 pr-12',
                'bg-surface-bg dark:bg-surface-elevated',
                'border border-surface-border',
                'text-[15px] leading-relaxed',
                'focus:outline-none focus:ring-2 focus:ring-bee-secondary/30',
                'placeholder:text-text-muted',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />

            {/* Character counter (optional) */}
            {message.length > 100 && (
              <span className="absolute bottom-2 right-14 text-[10px] text-text-muted">
                {message.length}/500
              </span>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            size="icon"
            className={cn(
              'w-12 h-12 rounded-full flex-shrink-0',
              'bg-bee-secondary hover:bg-bee-secondary-light',
              'disabled:opacity-40',
              'transition-all duration-200',
              'active:scale-95'
            )}
          >
            <Send size={20} className="text-white" />
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-[10px] text-text-muted text-center mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
