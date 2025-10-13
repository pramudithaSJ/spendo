'use client';

import { useState } from 'react';
import { GameResult } from '@/lib/gameTypes';
import { Award, Clock, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { submitGameResult, hasExistingSubmission } from '@/lib/gameResultsService';
import { formatTimeWithUnits } from '@/lib/gameTimer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface GameResultsProps {
  result: GameResult;
  language: 'en' | 'ta';
  groupNumber: number;
  scenarioId: string;
  startTime: string;
  wasRefreshed?: boolean;
  refreshCount?: number;
  refreshTimestamps?: string[];
  studentAnswer?: 'yes' | 'no';
  isCorrect?: boolean;
  actualBalance?: number;
}

export default function GameResults({
  result,
  language,
  groupNumber,
  scenarioId,
  startTime,
  wasRefreshed = false,
  refreshCount = 0,
  refreshTimestamps = [],
  studentAnswer,
  isCorrect,
  actualBalance,
}: GameResultsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const getOutcomeColor = (outcome: GameResult['outcome']) => {
    switch (outcome) {
      case 'excellent':
        return 'text-black bg-yellow-400 border-black font-bold';
      case 'good':
        return 'text-yellow-900 bg-yellow-50 border-yellow-400';
      case 'fair':
        return 'text-yellow-900 bg-yellow-100 border-yellow-400';
      case 'poor':
        return 'text-yellow-400 bg-black border-yellow-400';
      default:
        return 'text-yellow-400 bg-black border-yellow-400';
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

  const handleSubmit = async () => {
    if (!user || !result.timeSpent || submitted) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Check for existing submission
      const exists = await hasExistingSubmission(groupNumber, scenarioId);

      if (exists) {
        setSubmitError(
          language === 'ta'
            ? `குழு ${groupNumber} ஏற்கனவே இந்த சூழ்நிலைக்கு சமர்ப்பித்துள்ளது`
            : `Group ${groupNumber} has already submitted for this scenario`
        );
        setSubmitting(false);
        return;
      }

      // Submit with refresh data and validation results
      await submitGameResult({
        groupNumber,
        scenarioId,
        timeSpent: formatTimeWithUnits(result.timeSpent, 'en'), // Format time for Firebase (e.g., "2m 30s")
        timeSpentSeconds: result.timeSpent, // Raw seconds for sorting
        outcome: result.outcome,
        completedAt: new Date().toISOString(),
        userId: user.uid,
        totalLoanAmount: result.totalLoanAmount,
        savings: result.savings,
        remainingDebt: result.remainingDebt,
        pageLoadCount: refreshCount + 1,
        wasRefreshed,
        refreshTimestamps,
        studentAnswer: studentAnswer || 'no', // Student's final answer
        isCorrect: isCorrect || false, // Whether assessment was correct
        actualBalance: actualBalance || 0, // Calculated balance
        submittedAt: new Date().toISOString(), // Submission timestamp for ranking
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting result:', error);
      setSubmitError(
        language === 'ta'
          ? 'சமர்ப்பிப்பதில் பிழை. மீண்டும் முயற்சிக்கவும்.'
          : 'Error submitting. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isWinner = result.outcome === 'excellent' || result.outcome === 'good';

  return (
    <div id="game-results" className="space-y-6">
      {/* Winner Banner */}
      {isWinner && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 text-center shadow-lg">
          <Award size={64} className="mx-auto mb-3" />
          <h2 className="text-3xl font-bold mb-2">
            {language === 'ta' ? '🎉 வாழ்த்துக்கள்! வெற்றிகரமானது!' : '🎉 Congratulations! Successful!'}
          </h2>
          <p className="text-green-100">
            {language === 'ta'
              ? 'சிறந்த நிதி மேலாண்மை முடிவுகள்!'
              : 'Excellent financial management decisions!'}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {language === 'ta' ? 'விளையாட்டு முடிந்தது!' : 'Game Complete!'}
        </h2>
        <p className="text-gray-600">
          {language === 'ta' ? `குழு ${groupNumber} முடிவுகள்` : `Group ${groupNumber} Results`}
        </p>
      </div>

      {/* Time Spent */}
      {result.timeSpent && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-black">
              {language === 'ta' ? 'செலவழித்த நேரம்' : 'Time Spent'}
            </h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {formatTimeWithUnits(result.timeSpent, language)}
          </p>
        </div>
      )}

      {/* Student Assessment Validation Result */}
      {studentAnswer && isCorrect !== undefined && actualBalance !== undefined && (
        <div className="space-y-4">
          {/* Student's Answer */}
          {/* <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <h3 className="text-lg font-bold text-black mb-2">
              {language === 'ta' ? 'உங்கள் பதில்' : 'Your Answer'}
            </h3>
            <p className="text-yellow-900 font-semibold">
              {studentAnswer === 'yes'
                ? (language === 'ta' ? '✓ ஆம், எனக்கு போதுமான இருப்பு உள்ளது' : '✓ Yes, I have enough balance')
                : (language === 'ta' ? '✗ இல்லை, எனக்கு போதுமான இருப்பு இல்லை' : '✗ No, I don\'t have enough balance')}
            </p>
          </div> */}

          {/* Actual Balance & Required Amount */}
          {/* <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {language === 'ta' ? 'நிதி விவரங்கள்' : 'Financial Details'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">{language === 'ta' ? 'உங்கள் உண்மையான இருப்பு:' : 'Your Actual Balance:'}</span>
                <span className="font-bold text-gray-900">Rs. {actualBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{language === 'ta' ? 'தேவையான தொகை:' : 'Required Amount:'}</span>
                <span className="font-bold text-gray-900">
                  Rs. {scenarioId === 'scenario-1' ? '300,000' : '500,000'}
                </span>
              </div>
            </div>
          </div> */}

          {/* Validation Result */}
          {/* <div className={cn(
            'border-2 rounded-lg p-6 text-center',
            isCorrect
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-red-50 border-red-500'
          )}>
            {isCorrect ? (
              <>
                <CheckCircle size={64} className="mx-auto mb-3 text-yellow-600" />
                <h3 className="text-2xl font-bold text-black mb-2">
                  {language === 'ta' ? '✅ சரியான மதிப்பீடு!' : '✅ CORRECT Assessment!'}
                </h3>
                <p className="text-yellow-900 font-medium">
                  {language === 'ta'
                    ? 'உங்கள் மதிப்பீடு உண்மையான இருப்புடன் பொருந்துகிறது'
                    : 'Your assessment matches the actual balance'}
                </p>
              </>
            ) : (
              <>
                <AlertCircle size={64} className="mx-auto mb-3 text-red-600" />
                <h3 className="text-2xl font-bold text-red-900 mb-2">
                  {language === 'ta' ? '❌ தவறான மதிப்பீடு' : '❌ INCORRECT Assessment'}
                </h3>
                <p className="text-red-800 font-medium">
                  {language === 'ta'
                    ? 'உங்கள் மதிப்பீடு உண்மையான இருப்புடன் பொருந்தவில்லை'
                    : 'Your assessment doesn\'t match the actual balance'}
                </p>
              </>
            )}
          </div> */}
        </div>
      )}

      {/* Refresh Warning (if page was refreshed) */}
      {/* {wasRefreshed && refreshCount > 0 && (
        <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 mb-1">
                {language === 'ta' ? 'பக்கம் புதுப்பிப்பு கண்டறியப்பட்டது' : 'Page Refresh Detected'}
              </h3>
              <p className="text-sm text-orange-800">
                {language === 'ta'
                  ? `பக்கம் ${refreshCount} முறை புதுப்பிக்கப்பட்டது. இந்த தகவல் சமர்ப்பிப்பில் சேர்க்கப்படும்.`
                  : `Page was refreshed ${refreshCount} time${refreshCount > 1 ? 's' : ''}. This will be included in your submission.`}
              </p>
            </div>
          </div>
        </div>
      )} */}

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

      {/* Action Buttons */}
      <div className="space-y-3">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || !result.timeSpent || !user}
            className="w-full bg-black hover:bg-gray-900 text-yellow-400 font-semibold border-2 border-yellow-400 py-6 text-lg"
          >
            {submitting ? (
              <>
                <Send size={20} className="mr-2 animate-pulse" />
                {language === 'ta' ? 'சமர்ப்பிக்கிறது...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Send size={20} className="mr-2" />
                {language === 'ta' ? 'முடிவுகளைச் சமர்ப்பிக்கவும்' : 'Submit Results'}
              </>
            )}
          </Button>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4 text-center">
            <CheckCircle size={48} className="mx-auto mb-2 text-yellow-600" />
            <p className="text-black font-bold">
              {language === 'ta'
                ? '✓ முடிவுகள் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டன!'
                : '✓ Results submitted successfully!'}
            </p>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 text-center text-red-900">
            {submitError}
          </div>
        )}

        {/* Back to Scenarios Button */}
        <Button
          onClick={() => router.push('/game-scenarios')}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft size={16} className="mr-2" />
          {language === 'ta' ? 'சூழ்நிலைகளுக்குத் திரும்பு' : 'Back to Scenarios'}
        </Button>
      </div>
    </div>
  );
}
