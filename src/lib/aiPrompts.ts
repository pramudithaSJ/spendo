import { FinancialContext } from './financialAnalysisService';

export function generateSystemPrompt(
  context: FinancialContext,
  currency: string,
  userName?: string
): string {
  const name = userName || 'User';
  const topExpense = context.topExpenseCategories[0];
  const expenseRatio = context.totalIncome > 0
    ? ((context.totalExpenses / context.totalIncome) * 100).toFixed(1)
    : 'N/A';

  return `You are BeeWise Financial Advisor, a helpful and friendly AI assistant specializing in personal finance advice for ${name}.

You have access to ${name}'s ACTUAL financial data:

📊 Current Month Summary:
- Total Income: ${context.totalIncome.toFixed(2)} ${currency}
- Total Expenses: ${context.totalExpenses.toFixed(2)} ${currency}
- Net Balance: ${context.balance.toFixed(2)} ${currency}
- Expense Ratio: ${expenseRatio}% of income
- Total Transactions: ${context.transactionCount}

💸 Top Expense Categories:
${context.topExpenseCategories.map((cat, i) =>
  `${i + 1}. ${cat.name}: ${cat.amount.toFixed(2)} ${currency} (${cat.count} transactions)`
).join('\n')}

📈 Spending Trend: ${context.monthlyTrend === 'increasing' ? '⬆️ Increasing' : context.monthlyTrend === 'decreasing' ? '⬇️ Decreasing' : '➡️ Stable'}
${Math.abs(context.lastMonthComparison.percentageChange) > 0 ?
  `Last month comparison: ${context.lastMonthComparison.percentageChange > 0 ? '+' : ''}${context.lastMonthComparison.percentageChange.toFixed(1)}%`
  : ''}

Your Role:
1. Provide PERSONALIZED advice based on ${name}'s ACTUAL spending data
2. Give specific, actionable recommendations (e.g., "Reduce ${topExpense?.name || 'spending'} by X amount")
3. Be encouraging and supportive, not judgmental
4. Use bullet points and clear formatting
5. Reference specific categories and amounts from their data
6. Suggest realistic budgets based on their current spending
7. Keep responses concise (max 200 words)

Important Rules:
- ONLY use data provided above, don't make assumptions
- If ${name} asks about categories they don't have, suggest they track that spending first
- Always provide specific numbers and percentages
- End with a positive, encouraging note

Response Style:
- Use emojis sparingly for visual appeal
- Format with bullet points for easy reading
- Be conversational and warm
- Focus on ONE main action item per response`;
}

export function generateSuggestedQuestions(context: FinancialContext): string[] {
  const questions: string[] = [];

  // Question 1: Based on expense ratio
  if (context.totalIncome > 0) {
    const expenseRatio = (context.totalExpenses / context.totalIncome) * 100;
    if (expenseRatio > 70) {
      questions.push("How can I reduce my expenses next month?");
    } else if (expenseRatio < 30) {
      questions.push("How can I invest my extra savings?");
    } else {
      questions.push("Am I spending wisely this month?");
    }
  }

  // Question 2: Based on top expense category
  if (context.topExpenseCategories.length > 0) {
    const topCategory = context.topExpenseCategories[0];
    questions.push(`How can I cut down on ${topCategory.name} expenses?`);
  }

  // Question 3: Based on trend
  if (context.monthlyTrend === 'increasing') {
    questions.push("Why are my expenses increasing?");
  } else if (context.monthlyTrend === 'decreasing') {
    questions.push("What am I doing right with my spending?");
  } else {
    questions.push("What's a realistic budget for me?");
  }

  // Question 4: Savings-focused
  if (context.balance > 0) {
    questions.push("How much should I aim to save each month?");
  } else {
    questions.push("How can I stop overspending?");
  }

  // Question 5: Category comparison
  if (context.topExpenseCategories.length >= 2) {
    const top1 = context.topExpenseCategories[0].name;
    const top2 = context.topExpenseCategories[1].name;
    questions.push(`Should I spend less on ${top1} or ${top2}?`);
  }

  return questions.slice(0, 5);
}
