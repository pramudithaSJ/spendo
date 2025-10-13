'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinancialContext } from '@/lib/financialAnalysisService';
import { formatCurrency } from '@/lib/utils';

interface QuickInsightsCardProps {
  context: FinancialContext;
  currency: string;
  onDismiss: () => void;
}

export default function QuickInsightsCard({ context, currency, onDismiss }: QuickInsightsCardProps) {
  const topExpense = context.topExpenseCategories[0];
  const expenseRatio = context.totalIncome > 0
    ? ((context.totalExpenses / context.totalIncome) * 100).toFixed(0)
    : 0;

  return (
    <Card className="bg-gradient-to-br from-bee-primary/10 to-bee-secondary/10 border-bee-primary/20 mb-4 animate-scale-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bee-primary/20 flex items-center justify-center">
              <DollarSign size={16} className="text-bee-primary" />
            </div>
            <h3 className="font-semibold text-sm text-text-primary">Quick Financial Snapshot</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 -mr-2 -mt-1"
            onClick={onDismiss}
          >
            <X size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Total Expenses */}
          <div className="bg-white/50 dark:bg-card/50 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} className="text-bee-primary" />
              <span className="text-[11px] text-text-secondary font-medium">This Month</span>
            </div>
            <p className="text-base font-bold text-text-primary">
              {formatCurrency(context.totalExpenses, currency)}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {expenseRatio}% of income
            </p>
          </div>

          {/* Top Category */}
          {topExpense && (
            <div className="bg-white/50 dark:bg-card/50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={14} className="text-bee-secondary" />
                <span className="text-[11px] text-text-secondary font-medium">Top Spending</span>
              </div>
              <p className="text-sm font-bold text-text-primary truncate">{topExpense.name}</p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {formatCurrency(topExpense.amount, currency)}
              </p>
            </div>
          )}
        </div>

        {/* Trend Indicator */}
        {context.monthlyTrend !== 'stable' && (
          <div className="mt-3 p-2 bg-white/50 dark:bg-card/50 rounded-lg">
            <p className="text-xs text-text-secondary">
              {context.monthlyTrend === 'increasing' ? '⬆️' : '⬇️'}
              <span className="ml-1">
                Spending is {context.monthlyTrend === 'increasing' ? 'up' : 'down'} by{' '}
                <span className="font-semibold">
                  {Math.abs(context.lastMonthComparison.percentageChange).toFixed(1)}%
                </span>{' '}
                vs last month
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
