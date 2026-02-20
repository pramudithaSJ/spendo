'use client';

/**
 * Student-facing quiz page.
 * No authentication required.
 * State is driven entirely by session.status from Firestore.
 * Restores from sessionStorage on page refresh.
 */

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { subscribeToSession, subscribeToParticipants } from '@/lib/quiz/service';
import { QuizSession, QuizParticipant } from '@/lib/quiz/types';
import { getQuizById } from '@/lib/quiz/questions';

import JoinScreen from '@/components/quiz/JoinScreen';
import LobbyScreen from '@/components/quiz/LobbyScreen';
import QuestionScreen from '@/components/quiz/QuestionScreen';
import AnswerRevealScreen from '@/components/quiz/AnswerRevealScreen';
import LeaderboardScreen from '@/components/quiz/LeaderboardScreen';

export default function QuizPage() {
  const { language } = useLanguage();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string>('');
  const [session, setSession] = useState<QuizSession | null>(null);
  const [participant, setParticipant] = useState<QuizParticipant | null>(null);

  // ─── Restore from sessionStorage ────────────────────────────────────────────
  useEffect(() => {
    const storedSession = sessionStorage.getItem('quiz_sessionId');
    const storedParticipant = sessionStorage.getItem('quiz_participantId');
    const storedName = sessionStorage.getItem('quiz_name');
    if (storedSession && storedParticipant && storedName) {
      setSessionId(storedSession);
      setParticipantId(storedParticipant);
      setParticipantName(storedName);
    }
  }, []);

  // ─── Subscribe to session ────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    const unsub = subscribeToSession(sessionId, setSession);
    return unsub;
  }, [sessionId]);

  // ─── Subscribe to own participant doc ────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || !participantId) return;
    const unsub = subscribeToParticipants(sessionId, (participants) => {
      const me = participants.find((p) => p.id === participantId);
      if (me) setParticipant(me);
    });
    return unsub;
  }, [sessionId, participantId]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleJoined = (sId: string, pId: string, name: string) => {
    setSessionId(sId);
    setParticipantId(pId);
    setParticipantName(name);
  };

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (sessionId && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="animate-pulse">
          {language === 'si' ? 'සම්බන්ධ වෙමින්...' : language === 'ta' ? 'இணைக்கிறது...' : 'Connecting...'}
        </p>
      </div>
    );
  }

  // ─── No session yet → Join ───────────────────────────────────────────────────
  if (!session) {
    return <JoinScreen onJoined={handleJoined} />;
  }

  // ─── Lobby ───────────────────────────────────────────────────────────────────
  if (session.status === 'lobby') {
    return (
      <LobbyScreen
        sessionId={sessionId!}
        pin={session.pin}
        participantName={participantName}
      />
    );
  }

  // ─── Question ────────────────────────────────────────────────────────────────
  if (session.status === 'question') {
    const quiz = getQuizById(session.quizId);
    const question = quiz?.questions[session.currentQuestionIndex];
    if (!question || !participant) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <p className="animate-pulse">
            {language === 'si' ? 'ලොඩ් වෙමින්...' : language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading question...'}
          </p>
        </div>
      );
    }
    return (
      <QuestionScreen
        session={session}
        question={question}
        sessionId={sessionId!}
        participantId={participantId!}
      />
    );
  }

  // ─── Answer Reveal ───────────────────────────────────────────────────────────
  if (session.status === 'answer_reveal') {
    const quiz = getQuizById(session.quizId);
    const question = quiz?.questions[session.currentQuestionIndex];
    if (!question || !participant) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <p className="animate-pulse">
            {language === 'si' ? 'ලොඩ් වෙමින්...' : language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading...'}
          </p>
        </div>
      );
    }
    return (
      <AnswerRevealScreen
        question={question}
        participant={participant}
        questionIndex={session.currentQuestionIndex}
      />
    );
  }

  // ─── Leaderboard / Ended ─────────────────────────────────────────────────────
  if (session.status === 'leaderboard' || session.status === 'ended') {
    return <LeaderboardScreen session={session} participantId={participantId!} />;
  }

  return null;
}
