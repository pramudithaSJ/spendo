'use client';

import { useEffect, useState, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { QuizSession, QuizQuestion, calculatePoints } from '@/lib/quiz/types';
import { submitAnswer } from '@/lib/quiz/service';

interface QuestionScreenProps {
  session: QuizSession;
  question: QuizQuestion;
  sessionId: string;
  participantId: string;
}

const OPTION_COLORS: Record<string, string> = {
  A: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
  B: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
  C: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700',
  D: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionScreen({
  session,
  question,
  sessionId,
  participantId,
}: QuestionScreenProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(session.timeLimit);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Compute time left from server timestamp
  useEffect(() => {
    if (!session.questionStartedAt) return;
    const serverStart = (session.questionStartedAt as Timestamp).toMillis();
    startTimeRef.current = serverStart;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - serverStart) / 1000;
      const remaining = Math.max(0, session.timeLimit - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [session.questionStartedAt, session.timeLimit]);

  // Reset state when question index changes
  useEffect(() => {
    setAnswered(false);
    setSelectedOption(null);
  }, [session.currentQuestionIndex]);

  const handleAnswer = async (option: string) => {
    if (answered || timeLeft <= 0) return;
    setAnswered(true);
    setSelectedOption(option);

    const timeMs = Date.now() - startTimeRef.current;
    const isCorrect = option === question.correctOption;
    const points = calculatePoints(isCorrect, timeMs, session.timeLimit * 1000);

    await submitAnswer(sessionId, participantId, session.currentQuestionIndex, option, isCorrect, points, timeMs);
  };

  // Timer color
  const timerPercent = (timeLeft / session.timeLimit) * 100;
  const timerColor =
    timerPercent > 50 ? 'text-green-600' : timerPercent > 25 ? 'text-yellow-500' : 'text-red-600';
  const timerBg =
    timerPercent > 50 ? 'bg-green-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  const questionText =
    language === 'si'
      ? question.question.si
      : language === 'ta'
      ? question.question.ta
      : question.question.en;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Timer + Progress Bar */}
      <div className="px-4 pt-4 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {language === 'si'
              ? `ප්‍රශ්නය ${session.currentQuestionIndex + 1} / ${session.totalQuestions}`
              : language === 'ta'
              ? `கேள்வி ${session.currentQuestionIndex + 1} / ${session.totalQuestions}`
              : `Question ${session.currentQuestionIndex + 1} / ${session.totalQuestions}`}
          </span>
          <span className={`text-2xl font-bold font-mono ${timerColor}`}>
            {Math.ceil(timeLeft)}s
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${timerBg}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-4 pb-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-5 text-center">
          <p className="text-lg font-semibold leading-snug">{questionText}</p>
        </div>

        {/* Answer Grid */}
        {answered ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-3">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={36} />
            </div>
            <p className="text-lg font-semibold">
              {selectedOption === question.correctOption
                ? language === 'si' ? 'නිවැරදි!' : language === 'ta' ? 'சரியானது!' : 'Correct!'
                : language === 'si' ? 'වැරදි' : language === 'ta' ? 'தவறானது' : 'Wrong Answer'}
            </p>
            <p className="text-sm text-gray-400">
              {language === 'si'
                ? 'ප්‍රශ්නාවලිකාරයාගේ ඊළඟ පියවරට රැඳී සිටින්න'
                : language === 'ta'
                ? 'ஹோஸ்டின் அடுத்த நடவடிக்கைக்காக காத்திருக்கவும்'
                : 'Waiting for the host\'s next action'}
            </p>
          </div>
        ) : timeLeft <= 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-3">
            <p className="text-xl font-semibold text-red-400">
              {language === 'si' ? 'කාලය ඉවරයි!' : language === 'ta' ? 'நேரம் முடிந்தது!' : 'Time\'s up!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 flex-1">
            {OPTION_LABELS.map((label, i) => {
              const option = question.options[i];
              const optText =
                language === 'si' ? option.text.si : language === 'ta' ? option.text.ta : option.text.en;
              return (
                <button
                  key={label}
                  onClick={() => handleAnswer(label)}
                  disabled={answered}
                  className={`${OPTION_COLORS[label]} rounded-xl p-4 text-white font-semibold text-left flex flex-col justify-between min-h-[80px] transition-transform active:scale-95 shadow-md`}
                >
                  <span className="text-xs font-bold opacity-80">{label}</span>
                  <span className="text-sm leading-snug">{optText}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
