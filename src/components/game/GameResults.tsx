'use client';

import { GameResult } from '@/lib/gameTypes';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Lightbulb, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameResultsProps {
  result: GameResult;
  language: 'en' | 'ta';
  groupNumber: number;
}

export default function GameResults({ result, language, groupNumber }: GameResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOutcomeColor = (outcome: GameResult['outcome']) => {
    switch (outcome) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOutcomeLabel = (outcome: GameResult['outcome']) => {
    if (language === 'ta') {
      switch (outcome) {
        case 'excellent': return 'சிறந்தது';
        case 'good': return 'நல்லது';
        case 'fair': return 'சராசரி';
        case 'poor': return 'மோசம்';
        default: return 'தோல்வி';
      }
    }
    return outcome.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {language === 'ta' ? 'விளையாட்டு முடிந்தது!' : 'Game Complete!'}
        </h2>
        <p className="text-gray-600">
          {language === 'ta' ? `குழு ${groupNumber} முடிவுகள்` : `Group ${groupNumber} Results`}
        </p>
      </div>

      {/* Outcome Badge */}
      <div className={cn(
        'p-6 rounded-lg border-2 text-center',
        getOutcomeColor(result.outcome)
      )}>
        <Award size={48} className="mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">{getOutcomeLabel(result.outcome)}</h3>
        <p className="text-sm">
          {language === 'ta' ? result.outcomeSummaryTa : result.outcomeSummary}
        </p>
      </div>

      {/* Financial Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign size={18} />
          {language === 'ta' ? 'நிதி சுருக்கம்' : 'Financial Summary'}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              {language === 'ta' ? 'மொத்த கடன்' : 'Total Loan'}
            </p>
            <p className="text-lg font-bold">{formatCurrency(result.totalLoanAmount)}</p>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              {language === 'ta' ? 'மாதாந்திர EMI' : 'Monthly EMI'}
            </p>
            <p className="text-lg font-bold">{formatCurrency(result.monthlyPayment)}</p>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              {language === 'ta' ? 'மீதமுள்ள கடன்' : 'Remaining Debt'}
            </p>
            <p className="text-lg font-bold text-orange-600">
              {formatCurrency(result.remainingDebt)}
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              {language === 'ta' ? 'சேமிப்பு' : 'Savings'}
            </p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(result.savings)}
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg col-span-2">
            <p className="text-xs text-gray-500 mb-1">
              {language === 'ta' ? 'முடிக்க ஆண்டுகள்' : 'Years to Complete'}
            </p>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              <p className="text-lg font-bold">
                {result.yearsToComplete} {language === 'ta' ? 'ஆண்டுகள்' : 'years'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-900">
          <Lightbulb size={18} />
          {language === 'ta' ? 'பரிந்துரைகள்' : 'Recommendations'}
        </h3>

        <ul className="space-y-2">
          {(language === 'ta' ? result.recommendationsTa : result.recommendations).map(
            (rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </span>
                <span>{rec}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Key Learnings */}
      <div className="bg-gray-900 text-white rounded-lg p-4">
        <h3 className="font-semibold mb-2">
          {language === 'ta' ? 'முக்கிய கற்றல்கள்' : 'Key Learnings'}
        </h3>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>• {language === 'ta' ? 'திட்டமிடல் மிக முக்கியம்' : 'Planning is crucial'}</li>
          <li>• {language === 'ta' ? 'அவசரகால நிதி அவசியம்' : 'Emergency fund is essential'}</li>
          <li>• {language === 'ta' ? 'நல்ல கடன் vs மோசமான கடன்' : 'Good debt vs bad debt'}</li>
          <li>• {language === 'ta' ? 'சேமிப்பு மற்றும் திருப்பிச் செலுத்துதல் சமநிலை' : 'Balance savings and repayment'}</li>
        </ul>
      </div>
    </div>
  );
}
