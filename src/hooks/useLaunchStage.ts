import { useState, useEffect, useCallback } from 'react';

const AUTO_ADVANCE_DELAY = 8000; // 8 seconds auto-advance

export function useLaunchStage() {
  const [stage, setStage] = useState(0);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-advance to next stage after delay
  useEffect(() => {
    if (stage >= 3) {
      // Don't auto-advance after final stage
      return;
    }

    const timer = setTimeout(() => {
      advanceStage();
    }, AUTO_ADVANCE_DELAY);

    setAutoAdvanceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [stage]);

  const advanceStage = useCallback(() => {
    setStage((prev) => Math.min(prev + 1, 3));

    // Clear existing timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  }, [autoAdvanceTimer]);

  const resetStage = useCallback(() => {
    setStage(0);
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  }, [autoAdvanceTimer]);

  return {
    stage,
    advanceStage,
    resetStage,
  };
}
