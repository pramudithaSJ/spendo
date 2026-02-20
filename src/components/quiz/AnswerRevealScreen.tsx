'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { QuizQuestion, QuizParticipant } from '@/lib/quiz/types';

interface AnswerRevealScreenProps {
  question: QuizQuestion;
  participant: QuizParticipant;
  questionIndex: number;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function AnswerRevealScreen({
  question,
  participant,
  questionIndex,
}: AnswerRevealScreenProps) {
  const { language } = useLanguage();
  const myAnswer = participant.answers[questionIndex];
  const isCorrect = myAnswer?.isCorrect ?? false;
  const pointsEarned = myAnswer?.points ?? 0;

  const explanationText =
    language === 'si'
      ? question.explanation.si
      : language === 'ta'
      ? question.explanation.ta
      : question.explanation.en;

  const questionText =
    language === 'si'
      ? question.question.si
      : language === 'ta'
      ? question.question.ta
      : question.question.en;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col px-4 py-6 space-y-4">
      {/* Result Banner */}
      <div
        className={`rounded-xl p-5 text-center ${
          isCorrect ? 'bg-green-600' : 'bg-red-600'
        }`}
      >
        <div className="flex justify-center mb-2">
          {isCorrect ? <CheckCircle size={40} /> : <XCircle size={40} />}
        </div>
        <p className="text-xl font-bold">
          {isCorrect
            ? language === 'si' ? 'නිවැරදි!' : language === 'ta' ? 'சரியானது!' : 'Correct!'
            : language === 'si' ? 'වැරදි!' : language === 'ta' ? 'தவறானது!' : 'Wrong!'}
        </p>
        {isCorrect && (
          <p className="text-sm opacity-90 mt-1">
            +{pointsEarned}{' '}
            {language === 'si' ? 'ලකුණු' : language === 'ta' ? 'புள்ளிகள்' : 'points'}
          </p>
        )}
      </div>

      {/* Question + Options */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm text-gray-300 leading-snug">{questionText}</p>
          <div className="space-y-2">
            {OPTION_LABELS.map((label, i) => {
              const option = question.options[i];
              const optText =
                language === 'si'
                  ? option.text.si
                  : language === 'ta'
                  ? option.text.ta
                  : option.text.en;
              const isThisCorrect = label === question.correctOption;
              const isMyAnswer = myAnswer?.option === label;

              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isThisCorrect
                      ? 'bg-green-600 text-white'
                      : isMyAnswer
                      ? 'bg-red-700 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  <span className="text-xs font-bold w-5">{label}</span>
                  <span className="text-sm flex-1">{optText}</span>
                  {isThisCorrect && <CheckCircle size={16} className="flex-shrink-0" />}
                  {isMyAnswer && !isThisCorrect && <XCircle size={16} className="flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-yellow-400 mb-1 uppercase tracking-wide">
            {language === 'si' ? 'පැහැදිලි කිරීම' : language === 'ta' ? 'விளக்கம்' : 'Explanation'}
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">{explanationText}</p>
        </CardContent>
      </Card>

      {/* Total Score */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-400">
            {language === 'si' ? 'ඔබේ මුළු ලකුණු' : language === 'ta' ? 'உங்கள் மொத்த புள்ளிகள்' : 'Your Total Score'}
          </p>
          <p className="text-3xl font-bold text-white mt-1">{participant.score}</p>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-gray-500 animate-pulse">
        {language === 'si'
          ? 'ලොතරැයි ලැයිස්තු රැඳී සිටිනු...'
          : language === 'ta'
          ? 'லீடர்போர்டுக்காக காத்திருக்கவும்...'
          : 'Waiting for leaderboard...'}
      </p>
    </div>
  );
}
