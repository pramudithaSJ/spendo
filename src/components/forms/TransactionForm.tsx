/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { categoryService } from '@/lib/categoryService';
import { Category, Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

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
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState(transaction?.categoryId || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [date, setDate] = useState(
    transaction?.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const { user } = useAuth();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!selectedCategoryId) {
      alert('Please select a category');
      return;
    }
    
    onSubmit({
      amount: numAmount,
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
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <p>Loading categories...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setType('income')}
              >
                Income
              </Button>
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setType('expense')}
              >
                Expense
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                LKR
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Category</Label>
            {filteredCategories.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No {type} categories available. Create one first.
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !amount || !selectedCategoryId || filteredCategories.length === 0}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}