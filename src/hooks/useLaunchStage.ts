import { useState, useCallback } from 'react';

export function useLaunchStage() {
  const [stage, setStage] = useState(0);

  const advanceStage = useCallback(() => {
    setStage((prev) => Math.min(prev + 1, 3));
  }, []);

  const resetStage = useCallback(() => {
    setStage(0);
  }, []);

  return {
    stage,
    advanceStage,
    resetStage,
  };
}
