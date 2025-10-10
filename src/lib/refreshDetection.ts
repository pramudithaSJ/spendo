/**
 * Refresh Detection Utility
 * Tracks page refreshes and reloads during game sessions
 */

import { GameState } from './gameTypes';

const SESSION_KEY_PREFIX = 'spendo-game-session-';

/**
 * Check if this is a page refresh (game exists but new page load)
 */
export function detectRefresh(gameState: GameState | null): boolean {
  if (!gameState) return false;

  // If game exists and has started, this is likely a refresh
  // We detect this by checking if the game was previously in progress
  if (typeof window !== 'undefined') {
    const sessionKey = `${SESSION_KEY_PREFIX}${gameState.groupNumber}`;
    const lastSession = sessionStorage.getItem(sessionKey);

    // If no session marker exists, this is the first load
    if (!lastSession) {
      // Mark this session
      sessionStorage.setItem(sessionKey, Date.now().toString());
      return false;
    }

    // Session marker exists, so this is a refresh/reload
    return true;
  }

  return false;
}

/**
 * Record a refresh event in the game state
 */
export function recordRefresh(gameState: GameState): GameState {
  const now = new Date().toISOString();

  return {
    ...gameState,
    pageLoadCount: gameState.pageLoadCount + 1,
    wasRefreshed: true,
    refreshTimestamps: [...(gameState.refreshTimestamps || []), now],
  };
}

/**
 * Clear session marker (call when game completes or resets)
 */
export function clearSessionMarker(groupNumber: number): void {
  if (typeof window !== 'undefined') {
    const sessionKey = `${SESSION_KEY_PREFIX}${groupNumber}`;
    sessionStorage.removeItem(sessionKey);
  }
}

/**
 * Initialize session marker for new game
 */
export function initializeSession(groupNumber: number): void {
  if (typeof window !== 'undefined') {
    const sessionKey = `${SESSION_KEY_PREFIX}${groupNumber}`;
    sessionStorage.setItem(sessionKey, Date.now().toString());
  }
}

/**
 * Get refresh warning message
 */
export function getRefreshWarning(language: 'en' | 'ta', count: number): string {
  if (language === 'ta') {
    return count === 1
      ? '⚠️ பக்கம் புதுப்பிக்கப்பட்டது - இது குறிக்கப்படும்'
      : `⚠️ பக்கம் ${count} முறை புதுப்பிக்கப்பட்டது`;
  }

  return count === 1
    ? '⚠️ Page refreshed - this will be flagged'
    : `⚠️ Page refreshed ${count} times`;
}
