/**
 * Firebase Game Results Service
 * Handles CRUD operations for game results in Firestore
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { FirebaseGameResult } from './gameTypes';

const COLLECTION_NAME = 'gameResults';

/**
 * Submit game result to Firebase
 */
export async function submitGameResult(
  result: Omit<FirebaseGameResult, 'id'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...result,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting game result:', error);
    throw new Error('Failed to submit game result');
  }
}

/**
 * Get all game results for a specific scenario
 */
export async function getResultsByScenario(
  scenarioId: string
): Promise<FirebaseGameResult[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('scenarioId', '==', scenarioId),
      orderBy('timeSpentSeconds', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseGameResult[];
  } catch (error) {
    console.error('Error fetching results by scenario:', error);
    throw new Error('Failed to fetch scenario results');
  }
}

/**
 * Get all game results for a specific user
 */
export async function getResultsByUser(
  userId: string
): Promise<FirebaseGameResult[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseGameResult[];
  } catch (error) {
    console.error('Error fetching results by user:', error);
    throw new Error('Failed to fetch user results');
  }
}

/**
 * Get result for specific group and scenario
 */
export async function getResultByGroupAndScenario(
  groupNumber: number,
  scenarioId: string
): Promise<FirebaseGameResult | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('groupNumber', '==', groupNumber),
      where('scenarioId', '==', scenarioId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as FirebaseGameResult;
  } catch (error) {
    console.error('Error fetching result by group and scenario:', error);
    throw new Error('Failed to fetch group result');
  }
}

/**
 * Check if a group has already submitted for a specific scenario
 * Returns true if submission exists, false otherwise
 */
export async function hasExistingSubmission(
  groupNumber: number,
  scenarioId: string
): Promise<boolean> {
  try {
    const result = await getResultByGroupAndScenario(groupNumber, scenarioId);
    return result !== null;
  } catch (error) {
    console.error('Error checking existing submission:', error);
    // Return false to allow submission attempt (fail open)
    return false;
  }
}

/**
 * Calculate winner(s) for a scenario
 * Winner is determined by:
 * 1. Best outcome (excellent > good > fair > poor > failed)
 * 2. If tied, shortest time spent
 */
export async function calculateWinners(
  scenarioId: string
): Promise<FirebaseGameResult[]> {
  try {
    const allResults = await getResultsByScenario(scenarioId);

    if (allResults.length === 0) {
      return [];
    }

    // Outcome ranking
    const outcomeRank = {
      excellent: 5,
      good: 4,
      fair: 3,
      poor: 2,
      failed: 1,
    };

    // Sort by outcome (best first), then by time (fastest first)
    const sortedResults = allResults.sort((a, b) => {
      const outcomeA = outcomeRank[a.outcome];
      const outcomeB = outcomeRank[b.outcome];

      if (outcomeA !== outcomeB) {
        return outcomeB - outcomeA; // Higher outcome rank wins
      }

      return a.timeSpentSeconds - b.timeSpentSeconds; // Lower time wins
    });

    // Get best outcome and time
    const bestOutcome = sortedResults[0].outcome;
    const bestTime = sortedResults[0].timeSpentSeconds;

    // Return all results with best outcome and time (in case of exact ties)
    return sortedResults.filter(
      r => r.outcome === bestOutcome && r.timeSpentSeconds === bestTime
    );
  } catch (error) {
    console.error('Error calculating winners:', error);
    throw new Error('Failed to calculate winners');
  }
}

/**
 * Get leaderboard for a scenario
 */
export async function getLeaderboard(
  scenarioId: string,
  limit: number = 10
): Promise<FirebaseGameResult[]> {
  try {
    const allResults = await getResultsByScenario(scenarioId);

    // Outcome ranking
    const outcomeRank = {
      excellent: 5,
      good: 4,
      fair: 3,
      poor: 2,
      failed: 1,
    };

    // Sort by outcome (best first), then by time (fastest first)
    const sortedResults = allResults.sort((a, b) => {
      const outcomeA = outcomeRank[a.outcome];
      const outcomeB = outcomeRank[b.outcome];

      if (outcomeA !== outcomeB) {
        return outcomeB - outcomeA;
      }

      return a.timeSpentSeconds - b.timeSpentSeconds;
    });

    return sortedResults.slice(0, limit);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error('Failed to fetch leaderboard');
  }
}
