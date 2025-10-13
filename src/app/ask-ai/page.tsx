/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import ChatMessage, { Message } from '@/components/ai/ChatMessage';
import ChatInput from '@/components/ai/ChatInput';
import TypingIndicator from '@/components/ai/TypingIndicator';
import QuickInsightsCard from '@/components/ai/QuickInsightsCard';
import SuggestedQuestions from '@/components/ai/SuggestedQuestions';
import { openaiService, ChatMessage as OpenAIChatMessage } from '@/lib/openaiService';
import { financialAnalysisService, FinancialContext } from '@/lib/financialAnalysisService';
import { generateSystemPrompt, generateSuggestedQuestions } from '@/lib/aiPrompts';
import Logo from '@/components/branding/Logo';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [financialContext, setFinancialContext] = useState<FinancialContext | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showInsights, setShowInsights] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const router = useRouter();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load financial context on mount
  useEffect(() => {
    loadFinancialContext();
  }, [user]);

  const loadFinancialContext = async () => {
    if (!user) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const context = await financialAnalysisService.analyzeUserFinances(user.uid);
      setFinancialContext(context);

      // Check if user has transactions
      if (context.transactionCount === 0) {
        setError('noTransactions');
        return;
      }

      // Generate suggested questions
      const questions = generateSuggestedQuestions(context);
      setSuggestedQuestions(questions);
    } catch (err) {
      console.error('Error loading financial context:', err);
      setError('loadError');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!financialContext || !user) return;

    // Check if OpenAI is configured
    if (!openaiService.isConfigured()) {
      setError('noApiKey');
      return;
    }

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history
      const chatHistory: OpenAIChatMessage[] = [
        {
          role: 'system',
          content: generateSystemPrompt(
            financialContext,
            currency,
            user.displayName || user.email?.split('@')[0]
          ),
        },
        ...messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        {
          role: 'user',
          content: userMessage,
        },
      ];

      // Stream response
      let assistantContent = '';
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      for await (const chunk of openaiService.sendMessageStream(chatHistory)) {
        if (!chunk.done) {
          assistantContent += chunk.content;
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMessage.id ? { ...m, content: assistantContent } : m
            )
          );
        }
      }
    } catch (err: any) {
      console.error('Error sending message:', err);

      // Remove the empty assistant message if it exists
      setMessages(prev => prev.filter(m => m.content !== ''));

      if (err.message?.includes('rate')) {
        setError('rateLimit');
      } else {
        setError('sendError');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="min-h-screen hexagon-bg flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-bee-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Sparkles size={32} className="text-bee-text-on-primary" />
          </div>
          <p className="text-text-secondary">{t.askAI.thinking}</p>
        </div>
      </div>
    );
  }

  // Error: No API key
  if (error === 'noApiKey') {
    return (
      <div className="min-h-screen hexagon-bg flex items-center justify-center p-4 pb-20">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-bee-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">{t.askAI.errorNoApiKey}</h2>
          <p className="text-sm text-text-secondary mb-4">{t.askAI.setupInstructions}</p>
          <Button onClick={() => router.push('/dashboard')} className="btn-bee-primary">
            {t.common.back}
          </Button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Error: No transactions
  if (error === 'noTransactions') {
    return (
      <div className="min-h-screen hexagon-bg flex items-center justify-center p-4 pb-20">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-bee-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} className="text-bee-secondary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">{t.askAI.title}</h2>
          <p className="text-sm text-text-secondary mb-6">{t.askAI.noTransactionsYet}</p>
          <Button onClick={() => router.push('/add')} className="btn-bee-primary">
            <Plus size={18} className="mr-2" />
            {t.askAI.addTransactionsButton}
          </Button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen hexagon-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-surface-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-bee-secondary to-bee-secondary-light flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">{t.askAI.title}</h1>
              <p className="text-xs text-text-secondary">{t.askAI.subtitle}</p>
            </div>
          </div>
          <Logo size="sm" variant="icon" />
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[180px]">
        {/* Quick Insights Card */}
        {showInsights && financialContext && (
          <QuickInsightsCard
            context={financialContext}
            currency={currency}
            onDismiss={() => setShowInsights(false)}
          />
        )}

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelectQuestion={handleSendMessage}
            disabled={isLoading}
          />
        )}

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-text-muted">{t.askAI.emptyState}</p>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-2">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}

        {/* Error Message */}
        {error && error !== 'noTransactions' && error !== 'noApiKey' && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-text-primary">
              {error === 'rateLimit' ? t.askAI.rateLimitError : t.askAI.errorSendingMessage}
            </p>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !financialContext}
        placeholder={t.askAI.inputPlaceholder}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
