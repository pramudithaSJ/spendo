import { transactionService } from './transactionService';
import { TransactionWithCategory } from './types';

export interface FinancialContext {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  topExpenseCategories: Array<{ name: string; amount: number; count: number }>;
  topIncomeCategories: Array<{ name: string; amount: number; count: number }>;
  monthlyTrend: string;
  transactionCount: number;
  averageTransactionAmount: number;
  lastMonthComparison: {
    incomeDiff: number;
    expensesDiff: number;
    percentageChange: number;
  };
}

class FinancialAnalysisService {
  async analyzeUserFinances(userId: string): Promise<FinancialContext> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Get current month transactions
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    const currentTransactions = await transactionService.getTransactionsByDateRange(
      userId,
      startDate,
      endDate
    );

    // Get last month transactions for comparison
    const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59);
    const lastMonthTransactions = await transactionService.getTransactionsByDateRange(
      userId,
      lastMonthStart,
      lastMonthEnd
    );

    // Calculate totals
    const totalIncome = this.calculateTotal(currentTransactions, 'income');
    const totalExpenses = this.calculateTotal(currentTransactions, 'expense');
    const balance = totalIncome - totalExpenses;

    const lastMonthIncome = this.calculateTotal(lastMonthTransactions, 'income');
    const lastMonthExpenses = this.calculateTotal(lastMonthTransactions, 'expense');

    // Calculate top categories
    const topExpenseCategories = this.getTopCategories(currentTransactions, 'expense', 5);
    const topIncomeCategories = this.getTopCategories(currentTransactions, 'income', 3);

    // Calculate trends
    const expensesDiff = totalExpenses - lastMonthExpenses;
    const expensesPercentChange = lastMonthExpenses > 0
      ? (expensesDiff / lastMonthExpenses) * 100
      : 0;

    let monthlyTrend = 'stable';
    if (expensesPercentChange > 10) monthlyTrend = 'increasing';
    else if (expensesPercentChange < -10) monthlyTrend = 'decreasing';

    return {
      totalIncome,
      totalExpenses,
      balance,
      topExpenseCategories,
      topIncomeCategories,
      monthlyTrend,
      transactionCount: currentTransactions.length,
      averageTransactionAmount: currentTransactions.length > 0
        ? totalExpenses / currentTransactions.filter(t => t.type === 'expense').length
        : 0,
      lastMonthComparison: {
        incomeDiff: totalIncome - lastMonthIncome,
        expensesDiff: expensesDiff,
        percentageChange: expensesPercentChange,
      },
    };
  }

  private calculateTotal(
    transactions: TransactionWithCategory[],
    type: 'income' | 'expense'
  ): number {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private getTopCategories(
    transactions: TransactionWithCategory[],
    type: 'income' | 'expense',
    limit: number
  ): Array<{ name: string; amount: number; count: number }> {
    const categoryMap = new Map<string, { amount: number; count: number }>();

    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        const existing = categoryMap.get(t.category.name) || { amount: 0, count: 0 };
        categoryMap.set(t.category.name, {
          amount: existing.amount + t.amount,
          count: existing.count + 1,
        });
      });

    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }

  formatContextForAI(context: FinancialContext, currency: string): string {
    const topExpenses = context.topExpenseCategories
      .slice(0, 3)
      .map((cat, i) => `${i + 1}. ${cat.name}: ${cat.amount.toFixed(2)} ${currency} (${cat.count} transactions)`)
      .join('\n');

    const trend = context.monthlyTrend === 'increasing'
      ? `Expenses are increasing by ${Math.abs(context.lastMonthComparison.percentageChange).toFixed(1)}%`
      : context.monthlyTrend === 'decreasing'
      ? `Expenses are decreasing by ${Math.abs(context.lastMonthComparison.percentageChange).toFixed(1)}%`
      : 'Expenses are stable';

    return `
User's Financial Data (This Month):
- Total Income: ${context.totalIncome.toFixed(2)} ${currency}
- Total Expenses: ${context.totalExpenses.toFixed(2)} ${currency}
- Net Balance: ${context.balance.toFixed(2)} ${currency}
- Transaction Count: ${context.transactionCount}

Top Expense Categories:
${topExpenses || 'No expenses yet'}

Monthly Trend: ${trend}

${context.totalIncome > 0 ? `Expense Ratio: ${((context.totalExpenses / context.totalIncome) * 100).toFixed(1)}% of income` : ''}
`.trim();
  }
}

export const financialAnalysisService = new FinancialAnalysisService();
