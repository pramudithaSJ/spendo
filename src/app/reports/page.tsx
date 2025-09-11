'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { transactionService } from '@/lib/transactionService';
import { TransactionWithCategory } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const [monthlyStats, setMonthlyStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [categoryStats, setCategoryStats] = useState<{ [key: string]: { amount: number; count: number; type: 'income' | 'expense' } }>({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadReportsData();
    }
  }, [user, selectedMonth, selectedYear]);

  const loadReportsData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load monthly stats
      const stats = await transactionService.getMonthlyStats(user.uid, selectedYear, selectedMonth);
      setMonthlyStats(stats);

      // Load transactions for category breakdown
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);
      const transactions = await transactionService.getTransactionsByDateRange(user.uid, startDate, endDate);
      
      // Calculate category statistics
      const categoryData: { [key: string]: { amount: number; count: number; type: 'income' | 'expense' } } = {};
      transactions.forEach(transaction => {
        const categoryName = transaction.category.name;
        if (!categoryData[categoryName]) {
          categoryData[categoryName] = {
            amount: 0,
            count: 0,
            type: transaction.type
          };
        }
        categoryData[categoryName].amount += transaction.amount;
        categoryData[categoryName].count += 1;
      });
      
      setCategoryStats(categoryData);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const expenseCategories = Object.entries(categoryStats).filter(([_, data]) => data.type === 'expense');
  const incomeCategories = Object.entries(categoryStats).filter(([_, data]) => data.type === 'income');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Reports</h1>
          <BarChart3 className="h-6 w-6" />
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Month/Year Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="flex-1 p-2 border border-border rounded-md bg-background"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="p-2 border border-border rounded-md bg-background"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(monthlyStats.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(monthlyStats.totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyStats.balance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Categories */}
        {expenseCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories
                  .sort(([, a], [, b]) => b.amount - a.amount)
                  .map(([categoryName, data]) => {
                    const percentage = monthlyStats.totalExpenses > 0 
                      ? (data.amount / monthlyStats.totalExpenses) * 100 
                      : 0;
                    return (
                      <div key={categoryName}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{categoryName}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(data.amount)} ({data.count} transactions)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {percentage.toFixed(1)}% of total expenses
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Income Categories */}
        {incomeCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Income Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeCategories
                  .sort(([, a], [, b]) => b.amount - a.amount)
                  .map(([categoryName, data]) => {
                    const percentage = monthlyStats.totalIncome > 0 
                      ? (data.amount / monthlyStats.totalIncome) * 100 
                      : 0;
                    return (
                      <div key={categoryName}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{categoryName}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(data.amount)} ({data.count} transactions)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {percentage.toFixed(1)}% of total income
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {monthlyStats.transactionCount === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No transactions found for {monthNames[selectedMonth - 1]} {selectedYear}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}