/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { categoryService } from '@/lib/categoryService';
import { Category, Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: {
    amount: number;
    type: 'income' | 'expense';
    categoryId: string;
    description: string;
    date: Date;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function TransactionForm({ transaction, onSubmit, onCancel, loading }: TransactionFormProps) {
  const [amountCents, setAmountCents] = useState<number>(
    transaction?.amount ? Math.round(transaction.amount * 100) : 0
  );
  const displayAmount = (amountCents / 100).toFixed(2);
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState(transaction?.categoryId || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [date, setDate] = useState(
    transaction?.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { user } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    
    try {
      const userCategories = await categoryService.getCategories(user.uid);
      setCategories(userCategories);
      
      // Auto-select first category of the current type if none selected
      if (!selectedCategoryId) {
        const categoryOfType = userCategories.find(cat => cat.type === type);
        if (categoryOfType) {
          setSelectedCategoryId(categoryOfType.id);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Update selected category when type changes
  useEffect(() => {
    const categoryOfType = categories.find(cat => cat.type === type);
    if (categoryOfType && (!selectedCategoryId || !categories.find(cat => cat.id === selectedCategoryId && cat.type === type))) {
      setSelectedCategoryId(categoryOfType.id);
    }
  }, [type, categories, selectedCategoryId]);

  const handleAmountKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (/^[0-9]$/.test(e.key)) {
      setAmountCents(prev => {
        const next = prev * 10 + parseInt(e.key, 10);
        return next > 9999999 ? prev : next; // cap at 99,999.99
      });
    } else if (e.key === 'Backspace') {
      setAmountCents(prev => Math.floor(prev / 10));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amountCents <= 0) {
      alert(t.forms.enterValidAmount);
      return;
    }

    if (!selectedCategoryId) {
      alert(t.forms.selectCategory);
      return;
    }

    onSubmit({
      amount: amountCents / 100,
      type,
      categoryId: selectedCategoryId,
      description: description.trim(),
      date: new Date(date),
    });
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  const filteredCategories = categories.filter(cat => cat.type === type);

  if (loadingCategories) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {transaction ? t.transactions.editTransaction : t.transactions.addTransaction}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>{t.forms.type}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setType('income')}
              >
                {t.dashboard.income}
              </Button>
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setType('expense')}
              >
                {t.dashboard.expenses}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold">
              {t.forms.amount}
            </Label>
            <div className="relative">
              {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-semibold text-sm select-none">
                LKR
              </div> */}
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                value={displayAmount}
                onKeyDown={handleAmountKey}
                onChange={() => {}}
                className="w-full pl-14 pr-4 text-right text-3xl font-bold h-16 rounded-xl border-2
                  bg-[var(--surface-elevated)] border-[var(--surface-border)] text-[var(--text-primary)]
                  focus:ring-2 focus:ring-bee-primary focus:border-bee-primary focus:outline-none
                  transition-all cursor-text"
                aria-label={t.forms.amount}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t.forms.category}</Label>
            {filteredCategories.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {t.forms.noCategories.replace('{type}', type === 'income' ? t.dashboard.income : t.dashboard.expenses)}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {filteredCategories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <Button
                      key={category.id}
                      type="button"
                      variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-xs text-center leading-tight">
                        {category.name}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.forms.description}</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.forms.descriptionPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold">
              {t.forms.date}
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="h-12 rounded-xl border-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-base"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ta' ? 'பரிவர்த்தனை தேதியை தேர்ந்தெடுக்கவும்' : 'Select transaction date'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={loading}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || amountCents <= 0 || !selectedCategoryId}
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{t.forms.saving}</>
                : t.common.save
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}