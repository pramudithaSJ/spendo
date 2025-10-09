'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Plus, LogOut } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { transactionService } from '@/lib/transactionService';
import { TransactionWithCategory } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as LucideIcons from 'lucide-react';

export default function DashboardPage() {
  const [monthlyStats, setMonthlyStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // Load monthly stats and recent transactions in parallel
      const [stats, transactions] = await Promise.all([
        transactionService.getMonthlyStats(user.uid, currentYear, currentMonth),
        transactionService.getTransactions(user.uid, 5) // Get latest 5 transactions
      ]);
      
      setMonthlyStats(stats);
      setRecentTransactions(transactions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  const getRelativeDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return t.dashboard.today;
    if (diffDays === 2) return t.dashboard.yesterday;
    if (diffDays <= 7) return `${diffDays - 1} ${t.dashboard.daysAgo}`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t.dashboard.loadingDashboard}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t.dashboard.spendo}</h1>
            <p className="text-sm text-gray-500">
              {t.dashboard.welcomeBack}, {user?.displayName || user?.email}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.balance}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyStats.balance, currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t.dashboard.thisMonth}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.income}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(monthlyStats.totalIncome, currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t.dashboard.thisMonth}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.expenses}</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(monthlyStats.totalExpenses, currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t.dashboard.thisMonth}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t.dashboard.recentTransactions}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/transactions">{t.common.viewAll}</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">{t.dashboard.noTransactions}</p>
                <Button asChild>
                  <Link href="/add">
                    <Plus className="h-4 w-4 mr-2" />
                    {t.dashboard.addFirstTransaction}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const IconComponent = getIconComponent(transaction.category.icon);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.description || transaction.category.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getRelativeDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <span className={`font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount, currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg"
        asChild
      >
        <Link href="/add">
          <Plus className="h-6 w-6" />
        </Link>
      </Button>

      <BottomNavigation />
    </div>
  );
}