'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ChevronRight, Eye, BarChart3, Trophy, StopCircle, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  subscribeToSession,
  subscribeToParticipants,
  advanceQuestion,
  showAnswerReveal,
  pushLeaderboard,
  endSession,
} from '@/lib/quiz/service';
import { QuizSession, QuizParticipant, QuizDefinition } from '@/lib/quiz/types';

interface AdminDashboardProps {
  sessionId: string;
  quiz: QuizDefinition;
  initialSession: QuizSession;
}

export default function AdminDashboard({ sessionId, quiz, initialSession }: AdminDashboardProps) {
  const { language } = useLanguage();
  const [session, setSession] = useState<QuizSession>(initialSession);
  const [participants, setParticipants] = useState<QuizParticipant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubSession = subscribeToSession(sessionId, setSession);
    const unsubParticipants = subscribeToParticipants(sessionId, setParticipants);
    return () => {
      unsubSession();
      unsubParticipants();
    };
  }, [sessionId]);

  const answeredCount = participants.filter((p) => p.answeredCurrentQuestion).length;
  const totalParticipants = participants.length;

  const currentQ = session.currentQuestionIndex >= 0
    ? quiz.questions[session.currentQuestionIndex]
    : null;

  // ─── Actions ────────────────────────────────────────────────────────────────

  const handleStartOrNext = async () => {
    setLoading(true);
    const nextIndex = session.currentQuestionIndex + 1;
    await advanceQuestion(sessionId, nextIndex, quiz.questions.length);
    setLoading(false);
  };

  const handleRevealAnswer = async () => {
    setLoading(true);
    await showAnswerReveal(sessionId);
    setLoading(false);
  };

  const handleShowLeaderboard = async () => {
    setLoading(true);
    await pushLeaderboard(sessionId);
    setLoading(false);
  };

  const handleEndSession = async () => {
    setLoading(true);
    await endSession(sessionId);
    setLoading(false);
  };

  // ─── UI labels ───────────────────────────────────────────────────────────────

  const T = {
    pin: language === 'si' ? 'PIN' : language === 'ta' ? 'PIN' : 'PIN',
    participants: language === 'si' ? 'සහභාගිකරුවන්' : language === 'ta' ? 'பங்கேற்பாளர்கள்' : 'Participants',
    answered: language === 'si' ? 'පිළිතුරු දීම' : language === 'ta' ? 'பதிலளித்தவர்கள்' : 'Answered',
    question: language === 'si' ? 'ප්‍රශ්නය' : language === 'ta' ? 'கேள்வி' : 'Question',
    status: language === 'si' ? 'තත්ත්වය' : language === 'ta' ? 'நிலை' : 'Status',
    start: language === 'si' ? 'ප්‍රශ්නාවලිය ආරම්භ කරන්න' : language === 'ta' ? 'வினாடி வினாவை தொடங்கு' : 'Start Quiz',
    next: language === 'si' ? 'ඊළඟ ප්‍රශ්නය' : language === 'ta' ? 'அடுத்த கேள்வி' : 'Next Question',
    reveal: language === 'si' ? 'පිළිතුර දෙන්න' : language === 'ta' ? 'பதிலை காட்டு' : 'Reveal Answer',
    leaderboard: language === 'si' ? 'ලොතරැයි ලැයිස්තු' : language === 'ta' ? 'லீடர்போர்டு காட்டு' : 'Show Leaderboard',
    end: language === 'si' ? 'සැසිය අවසන් කරන්න' : language === 'ta' ? 'அமர்வை முடி' : 'End Session',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-black text-white px-4 py-5">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{T.pin}</p>
        <p className="text-5xl font-bold font-mono tracking-[0.3em]">{session.pin}</p>
        <p className="text-sm text-gray-400 mt-2">
          {quiz.title[language === 'si' ? 'si' : language === 'ta' ? 'ta' : 'en']}
        </p>
      </header>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white">
            <CardContent className="p-3 flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalParticipants}</p>
                <p className="text-xs text-gray-500">{T.participants}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-3 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {session.status === 'question' ? `${answeredCount}/${totalParticipants}` : '-'}
                </p>
                <p className="text-xs text-gray-500">{T.answered}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Question */}
        {currentQ && (
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                {T.question} {session.currentQuestionIndex + 1}/{quiz.questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-800">
                {currentQ.question[language === 'si' ? 'si' : language === 'ta' ? 'ta' : 'en']}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {T.status}:{' '}
                <span className="font-semibold capitalize text-gray-600">{session.status}</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Control Buttons */}
        <div className="space-y-3">
          {/* Lobby → Start */}
          {session.status === 'lobby' && (
            <Button
              onClick={handleStartOrNext}
              disabled={loading || totalParticipants === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              {T.start}
            </Button>
          )}

          {/* Question → Reveal Answer */}
          {session.status === 'question' && (
            <Button
              onClick={handleRevealAnswer}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
            >
              <Eye className="h-5 w-5 mr-2" />
              {T.reveal}
            </Button>
          )}

          {/* Answer Reveal → Leaderboard */}
          {session.status === 'answer_reveal' && (
            <Button
              onClick={handleShowLeaderboard}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base"
            >
              <Trophy className="h-5 w-5 mr-2" />
              {T.leaderboard}
            </Button>
          )}

          {/* Leaderboard → Next Question or End */}
          {session.status === 'leaderboard' && (
            <>
              {session.currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  onClick={handleStartOrNext}
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white h-12 text-base"
                >
                  <ChevronRight className="h-5 w-5 mr-2" />
                  {T.next}
                </Button>
              ) : (
                <Button
                  onClick={handleEndSession}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base"
                >
                  <StopCircle className="h-5 w-5 mr-2" />
                  {T.end}
                </Button>
              )}
            </>
          )}

          {session.status === 'ended' && (
            <div className="text-center py-6 space-y-2">
              <Trophy className="h-10 w-10 text-yellow-500 mx-auto" />
              <p className="font-bold text-gray-800">
                {language === 'si' ? 'සැසිය අවසන් වී ඇත!' : language === 'ta' ? 'அமர்வு முடிந்தது!' : 'Session ended!'}
              </p>
            </div>
          )}
        </div>

        {/* Participant List */}
        {participants.length > 0 && (
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{T.participants}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 max-h-52 overflow-y-auto">
              {participants
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm py-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          p.answeredCurrentQuestion ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-gray-800 truncate max-w-[180px]">{p.name}</span>
                    </div>
                    <span className="font-semibold text-gray-600">{p.score}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
