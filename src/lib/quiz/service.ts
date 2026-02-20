/**
 * Quiz Service — all Firestore operations for the quiz feature.
 *
 * NOTE: This collection is publicly readable/writable (students are unauthenticated).
 * Add these Firestore security rules:
 *
 *   match /quiz_sessions/{sessionId} {
 *     allow read, write: if true;
 *     match /participants/{participantId} {
 *       allow read, write: if true;
 *     }
 *   }
 *
 * REQUIRED COMPOSITE INDEX for PIN lookup:
 *   Collection: quiz_sessions
 *   Fields: pin ASC, status ASC
 *   (Firebase will provide an auto-link to create it on first query failure.)
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  QuizSession,
  QuizParticipant,
  LeaderboardEntry,
  QuizSessionStatus,
} from './types';

const SESSIONS_COLLECTION = 'quiz_sessions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomSixDigit(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generatePin(): Promise<string> {
  // Generate a random 6-digit PIN and check for collision with active sessions.
  for (let attempt = 0; attempt < 10; attempt++) {
    const pin = randomSixDigit();
    const existing = await getDocs(
      query(
        collection(db, SESSIONS_COLLECTION),
        where('pin', '==', pin),
        where('status', 'in', ['lobby', 'question', 'answer_reveal', 'leaderboard'])
      )
    );
    if (existing.empty) return pin;
  }
  // Fallback: very unlikely to collide after 10 tries, return anyway
  return randomSixDigit();
}

function mapDocToSession(id: string, data: Record<string, unknown>): QuizSession {
  return {
    id,
    pin: data.pin as string,
    status: data.status as QuizSessionStatus,
    currentQuestionIndex: data.currentQuestionIndex as number,
    questionStartedAt: (data.questionStartedAt as Timestamp) ?? null,
    quizId: data.quizId as string,
    totalQuestions: data.totalQuestions as number,
    timeLimit: data.timeLimit as number,
    createdAt: data.createdAt as Timestamp,
    leaderboard: (data.leaderboard as LeaderboardEntry[]) ?? [],
  };
}

function mapDocToParticipant(id: string, data: Record<string, unknown>): QuizParticipant {
  return {
    id,
    name: data.name as string,
    score: data.score as number,
    answeredCurrentQuestion: data.answeredCurrentQuestion as boolean,
    answers: (data.answers as QuizParticipant['answers']) ?? {},
    joinedAt: data.joinedAt as Timestamp,
  };
}

// ─── Session Management ───────────────────────────────────────────────────────

export async function createQuizSession(
  quizId: string,
  totalQuestions: number,
  timeLimit = 30
): Promise<{ sessionId: string; pin: string }> {
  const pin = await generatePin();
  const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
    pin,
    status: 'lobby' as QuizSessionStatus,
    currentQuestionIndex: -1,
    questionStartedAt: null,
    quizId,
    totalQuestions,
    timeLimit,
    createdAt: serverTimestamp(),
    leaderboard: [],
  });
  return { sessionId: docRef.id, pin };
}

export async function joinQuizByPin(
  pin: string,
  name: string
): Promise<{ sessionId: string; participantId: string }> {
  // Find active session with this PIN
  // NOTE: Requires composite index on (pin ASC, status ASC)
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('pin', '==', pin),
    where('status', '==', 'lobby')
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error('SESSION_NOT_FOUND');
  }
  const sessionDoc = snapshot.docs[0];
  const sessionId = sessionDoc.id;

  // Add participant sub-document
  const participantRef = doc(collection(db, SESSIONS_COLLECTION, sessionId, 'participants'));
  await setDoc(participantRef, {
    name,
    score: 0,
    answeredCurrentQuestion: false,
    answers: {},
    joinedAt: serverTimestamp(),
  });

  return { sessionId, participantId: participantRef.id };
}

// ─── Real-time Subscriptions ─────────────────────────────────────────────────

export function subscribeToSession(
  sessionId: string,
  callback: (session: QuizSession) => void
): () => void {
  const ref = doc(db, SESSIONS_COLLECTION, sessionId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(mapDocToSession(snap.id, snap.data() as Record<string, unknown>));
    }
  });
}

export function subscribeToParticipants(
  sessionId: string,
  callback: (participants: QuizParticipant[]) => void
): () => void {
  const ref = collection(db, SESSIONS_COLLECTION, sessionId, 'participants');
  return onSnapshot(ref, (snap) => {
    const participants = snap.docs.map((d) =>
      mapDocToParticipant(d.id, d.data() as Record<string, unknown>)
    );
    callback(participants);
  });
}

// ─── Participant Actions ──────────────────────────────────────────────────────

export async function submitAnswer(
  sessionId: string,
  participantId: string,
  questionIndex: number,
  option: string,
  isCorrect: boolean,
  points: number,
  timeMs: number
): Promise<void> {
  const ref = doc(db, SESSIONS_COLLECTION, sessionId, 'participants', participantId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const current = snap.data() as Record<string, unknown>;
  const currentScore = (current.score as number) ?? 0;

  await updateDoc(ref, {
    answeredCurrentQuestion: true,
    score: currentScore + points,
    [`answers.${questionIndex}`]: { option, isCorrect, points, timeMs },
  });
}

// ─── Admin Actions ────────────────────────────────────────────────────────────

/**
 * Move to next question. Uses WriteBatch to:
 *  1. Reset all participants' answeredCurrentQuestion = false
 *  2. Update session: status='question', currentQuestionIndex, questionStartedAt
 */
export async function advanceQuestion(
  sessionId: string,
  nextIndex: number,
  totalQuestions: number
): Promise<void> {
  const participantsSnap = await getDocs(
    collection(db, SESSIONS_COLLECTION, sessionId, 'participants')
  );

  const batch = writeBatch(db);

  // Reset each participant (max 100 writes, within 500-op Firestore batch limit)
  participantsSnap.docs.forEach((participantDoc) => {
    batch.update(participantDoc.ref, { answeredCurrentQuestion: false });
  });

  // Update session document
  const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
  batch.update(sessionRef, {
    status: 'question' as QuizSessionStatus,
    currentQuestionIndex: nextIndex,
    questionStartedAt: serverTimestamp(),
    totalQuestions,
  });

  await batch.commit();
}

export async function showAnswerReveal(sessionId: string): Promise<void> {
  await updateDoc(doc(db, SESSIONS_COLLECTION, sessionId), {
    status: 'answer_reveal' as QuizSessionStatus,
  });
}

export async function pushLeaderboard(sessionId: string): Promise<void> {
  const participantsSnap = await getDocs(
    collection(db, SESSIONS_COLLECTION, sessionId, 'participants')
  );

  const sorted = participantsSnap.docs
    .map((d) => mapDocToParticipant(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => b.score - a.score);

  const leaderboard: LeaderboardEntry[] = sorted.map((p, i) => ({
    participantId: p.id,
    name: p.name,
    score: p.score,
    rank: i + 1,
  }));

  await updateDoc(doc(db, SESSIONS_COLLECTION, sessionId), {
    status: 'leaderboard' as QuizSessionStatus,
    leaderboard,
  });
}

export async function endSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, SESSIONS_COLLECTION, sessionId), {
    status: 'ended' as QuizSessionStatus,
  });
}

// ─── Helpers for resuming ─────────────────────────────────────────────────────

export async function getSession(sessionId: string): Promise<QuizSession | null> {
  const snap = await getDoc(doc(db, SESSIONS_COLLECTION, sessionId));
  if (!snap.exists()) return null;
  return mapDocToSession(snap.id, snap.data() as Record<string, unknown>);
}

export async function getActiveSessions(): Promise<QuizSession[]> {
  const snap = await getDocs(
    query(
      collection(db, SESSIONS_COLLECTION),
      where('status', 'in', ['lobby', 'question', 'answer_reveal', 'leaderboard'])
    )
  );
  return snap.docs.map((d) =>
    mapDocToSession(d.id, d.data() as Record<string, unknown>)
  );
}
