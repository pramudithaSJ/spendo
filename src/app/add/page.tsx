'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TransactionForm from '@/components/forms/TransactionForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { transactionService } from '@/lib/transactionService';

export default function AddTransactionPage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (data: {
    amount: number;
    type: 'income' | 'expense';
    categoryId: string;
    description: string;
    date: Date;
  }) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await transactionService.addTransaction({
        ...data,
        userId: user.uid,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <header className="bg-[var(--surface-elevated)] border-b border-[var(--surface-border)] sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.transactions.addTransaction}</h1>
              <p className="text-sm text-[var(--text-muted)]">{t.transactions.recordNew}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
}