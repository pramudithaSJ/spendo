import { Timestamp } from 'firebase/firestore';

// ─── Scoring Constants ───────────────────────────────────────────────────────
export const BASE_CORRECT_POINTS = 1000;
export const MAX_TIME_BONUS = 500;

/**
 * Kahoot-style scoring:
 *  - Correct answer: 1000 base + up to 500 time bonus
 *  - Wrong / no answer: 0
 */
export function calculatePoints(isCorrect: boolean, timeSpentMs: number, timeLimitSeconds: number): number {
  if (!isCorrect) return 0;
  const timeSpentSeconds = timeSpentMs / 1000;
  const timeBonus = Math.max(0, (1 - timeSpentSeconds / timeLimitSeconds) * MAX_TIME_BONUS);
  return Math.round(BASE_CORRECT_POINTS + timeBonus);
}

// ─── Question / Quiz Definition ──────────────────────────────────────────────
export interface QuizOption {
  label: string;   // A, B, C, D
  text: { en: string; si: string; ta: string };
}

export interface QuizQuestion {
  id: string;
  question: { en: string; si: string; ta: string };
  options: [QuizOption, QuizOption, QuizOption, QuizOption]; // exactly 4
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: { en: string; si: string; ta: string };
}

export interface QuizDefinition {
  id: string;
  title: { en: string; si: string; ta: string };
  questions: QuizQuestion[];
}

// ─── Session Status ───────────────────────────────────────────────────────────
export type QuizSessionStatus = 'lobby' | 'question' | 'answer_reveal' | 'leaderboard' | 'ended';

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  participantId: string;
  name: string;
  score: number;
  rank: number;
}

// ─── Firestore Documents ──────────────────────────────────────────────────────
export interface QuizSession {
  id: string;
  pin: string;
  status: QuizSessionStatus;
  currentQuestionIndex: number;   // -1 = not started
  questionStartedAt: Timestamp | null;
  quizId: string;
  totalQuestions: number;
  timeLimit: number;              // seconds per question
  createdAt: Timestamp;
  leaderboard: LeaderboardEntry[];
}

export interface ParticipantAnswer {
  option: string;
  isCorrect: boolean;
  points: number;
  timeMs: number;
}

export interface QuizParticipant {
  id: string;
  name: string;
  score: number;
  answeredCurrentQuestion: boolean;
  answers: Record<number, ParticipantAnswer>;
  joinedAt: Timestamp;
}
