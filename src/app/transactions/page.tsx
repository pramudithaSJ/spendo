'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import TransactionForm from '@/components/forms/TransactionForm';
import { useAuth } from '@/contexts/AuthContext';
import { transactionService } from '@/lib/transactionService';
import { TransactionWithCategory } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    loadTransactions();
  }, [user]);

  useEffect(() => {
    // Filter transactions based on search term
    const filtered = transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm]);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const userTransactions = await transactionService.getTransactions(user.uid);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async (data: {
    amount: number;
    type: 'income' | 'expense';
    categoryId: string;
    description: string;
    date: Date;
  }) => {
    if (!editingTransaction) return;
    
    setFormLoading(true);
    try {
      await transactionService.updateTransaction(editingTransaction.id, data);
      await loadTransactions();
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await transactionService.deleteTransaction(id);
      await loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleEditTransaction}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          loading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500">View and manage your transactions</p>
          </div>
          <Button size="sm" asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/add">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No transactions found' : 'No transactions yet'}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Transaction
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const IconComponent = getIconComponent(transaction.category.icon);
              return (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {transaction.description || transaction.category.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.category.name} • {formatDate(transaction.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className={`font-medium ${
                            transaction.type === 'income' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}