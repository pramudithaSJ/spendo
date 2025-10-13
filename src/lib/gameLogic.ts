import { GameState, GameChoice, OptionId, DisabledOption, GameResult } from './gameTypes';
import { GAME_STEPS, GAME_PROFILE } from './gameData';
import { getGame1DisabledOptions } from './game1DisabledOptions';

const STORAGE_KEY_PREFIX = 'spendo-game-group-';

/**
 * Load game state from localStorage for a specific group
 */
export function loadGameState(groupNumber: number): GameState | null {
  if (typeof window === 'undefined') return null;

  const key = `${STORAGE_KEY_PREFIX}${groupNumber}`;
  const stored = localStorage.getItem(key);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as GameState;
  } catch {
    return null;
  }
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;

  const key = `${STORAGE_KEY_PREFIX}${state.groupNumber}`;
  localStorage.setItem(key, JSON.stringify(state));
}

/**
 * Initialize a new game state
 */
export function initializeGameState(
  groupNumber: number,
  scenarioId: string = 'scenario-1',
  groupName?: string
): GameState {
  return {
    groupNumber,
    groupName,
    scenarioId,
    choices: [],
    currentStep: 1,
    isDeadEnd: false,
    startTime: new Date().toISOString(),
    pageLoadCount: 1,
    wasRefreshed: false,
    refreshTimestamps: [],
  };
}

/**
 * Make a choice and lock it
 */
export function makeChoice(
  state: GameState,
  step: number,
  option: OptionId
): GameState {
  const choice: GameChoice = {
    step,
    option,
    locked: true,
    timestamp: new Date().toISOString(),
  };

  const newChoices = [...state.choices, choice];

  // Check if this choice leads to a dead end
  const currentStepData = GAME_STEPS.find(s => s.step === step);
  const selectedOption = currentStepData?.options.find(o => o.id === option);

  let isDeadEnd = false;
  let deadEndReason = undefined;

  if (selectedOption?.isDeadEnd) {
    isDeadEnd = true;
    deadEndReason = selectedOption.deadEndReason;
  }

  // Check for combination-based dead ends
  const deadEndCheck = checkCombinationDeadEnd(newChoices);
  if (deadEndCheck.isDeadEnd) {
    isDeadEnd = true;
    deadEndReason = deadEndCheck.reason;
  }

  // Check if this is the final assessment step (Step 5)
  let studentAnswer: 'yes' | 'no' | undefined;
  let isCorrect: boolean | undefined;
  let actualBalance: number | undefined;

  if (step === 5) {
    // Student selected their answer
    studentAnswer = option === 'A' ? 'yes' : 'no';

    // Calculate the CORRECT answer
    const results = calculateGameResults(newChoices);
    actualBalance = results.emergencyFund;
    const correctAnswer = results.hasEnoughBalance ? 'yes' : 'no';

    // Validate student's answer
    isCorrect = studentAnswer === correctAnswer;
  }

  const newState: GameState = {
    ...state,
    choices: newChoices,
    currentStep: step + 1, // Always progress to next step, even on dead-end
    isDeadEnd,
    deadEndReason,
    completedAt: step >= 5 ? new Date().toISOString() : undefined, // Only complete after step 5
    studentAnswer,
    isCorrect,
    actualBalance,
  };

  saveGameState(newState);
  return newState;
}

/**
 * Check if a combination of choices leads to a dead end
 */
function checkCombinationDeadEnd(choices: GameChoice[]): { isDeadEnd: boolean; reason?: string } {
  // Example: If chose Income-based plan (Step 1 C) + Lifestyle spending (Step 2 D) = financial trouble
  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);
  const step4 = choices.find(c => c.step === 4);

  // Dead end: Minimum payment plan + increased lifestyle spending + new loan = debt spiral
  if (step1?.option === 'C' && step2?.option === 'D' && step4?.option === 'A') {
    return {
      isDeadEnd: true,
      reason: 'Taking a large new loan while maintaining minimum payments and high lifestyle spending creates unsustainable debt.',
    };
  }

  // Dead end: Skip payment or credit card debt already triggered
  if (step3?.option === 'C' || step3?.option === 'D') {
    return {
      isDeadEnd: true,
      reason: step3.option === 'C'
        ? 'Skipping payments damages credit and triggers penalties.'
        : 'Using credit card debt to cover loan payments creates a dangerous debt cycle.',
    };
  }

  return { isDeadEnd: false };
}

/**
 * Get disabled options based on previous choices
 * Uses Game 1 disabled options mapping from game1DisabledOptions.ts
 */
export function getDisabledOptions(choices: GameChoice[], currentStep: number): DisabledOption[] {
  // Use Game 1 disabled options mapping based on path combinations
  return getGame1DisabledOptions(choices, currentStep);
}

/**
 * Check if a specific option is disabled
 */
export function isOptionDisabled(
  choices: GameChoice[],
  currentStep: number,
  option: OptionId
): { disabled: boolean; reason?: string; reasonTa?: string } {
  const disabledOptions = getDisabledOptions(choices, currentStep);
  const found = disabledOptions.find(d => d.step === currentStep && d.option === option);

  if (found) {
    return { disabled: true, reason: found.reason, reasonTa: found.reasonTa };
  }

  return { disabled: false };
}

/**
 * Check if the choice path is a winning path based on game1winpath.md
 * Winning paths:
 * - Step 1: A, B, or C (any)
 * - Step 2: Must be A
 * - Step 3: Must be A
 * - Step 4: B, C, or D (any except A)
 */
function isWinningPath(choices: GameChoice[]): boolean {
  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);
  const step4 = choices.find(c => c.step === 4);

  // Must have all 4 steps
  if (!step1 || !step2 || !step3 || !step4) return false;

  // Check winning path: Step2=A AND Step3=A AND Step4 is B/C/D
  return step2.option === 'A' && step3.option === 'A' && ['B', 'C', 'D'].includes(step4.option);
}

/**
 * Calculate emergency fund based on choices
 * Emergency happens at 18 months - need Rs 300,000
 */
function calculateEmergencyFund(choices: GameChoice[]): number {
  let totalSavings = 0;
  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);

  // Base calculation: 12 months of savings from month 6 to month 18
  // After Step 2, salary is Rs 100,000/month

  if (step2?.option === 'A') {
    // Keep repayment same, save extra Rs 30,000/month
    // 12 months × Rs 30,000 = Rs 360,000 ✓ WIN
    totalSavings = 30000 * 12;
  } else if (step2?.option === 'B') {
    // Increase payment to Rs 40,000, save remaining after expenses
    // Assume Rs 35,000 expenses: (100,000 - 40,000 - 35,000) × 12 = Rs 300,000 ✓ WIN
    totalSavings = 25000 * 12;
  } else if (step2?.option === 'C') {
    // Invest extra Rs 30,000/month at 12% for 12 months
    // Simple: Rs 30,000 × 12 = Rs 360,000 ✓ WIN (ignoring 12% for simplicity)
    totalSavings = 30000 * 12;
  } else if (step2?.option === 'D') {
    // Lifestyle spending, no savings = Rs 0 ✗ LOSE
    totalSavings = 0;
  }

  return totalSavings;
}

/**
 * Calculate final game results based on all choices
 */
export function calculateGameResults(choices: GameChoice[], startTime?: string): GameResult {
  const totalLoanAmount = GAME_PROFILE.studentLoan;
  const monthlyPayment = 0;
  const savings = 0;
  const additionalDebt = 0;

  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);
  const step4 = choices.find(c => c.step === 4);

  // Calculate emergency fund (Step 5 auto-check)
  const emergencyFund = calculateEmergencyFund(choices);
  const hasEnoughBalance = emergencyFund >= 300000;

  // Check if the path taken is a winning path
  const isWinPath = isWinningPath(choices);

  // Win/Lose logic based on winning path validation
  const outcome: GameResult['outcome'] = isWinPath && hasEnoughBalance ? 'excellent' : 'failed';
  const outcomeSummary = isWinPath && hasEnoughBalance
    ? 'Successful!'
    : 'Not successful, better next time';
  const outcomeSummaryTa = isWinPath && hasEnoughBalance
    ? 'வெற்றிகரமானது!'
    : 'வெற்றிபெறவில்லை, அடுத்த முறை சிறப்பாக';

  // Minimal data for display (kept for compatibility)
  const yearsToComplete = 5;
  const totalInterestPaid = 0;
  const totalPaid = totalLoanAmount;
  const remainingDebt = totalLoanAmount;
  const recommendations: string[] = [];
  const recommendationsTa: string[] = [];

  // Calculate time spent if startTime is provided
  let timeSpent: number | undefined;
  if (startTime) {
    const start = new Date(startTime).getTime();
    const end = Date.now();
    timeSpent = Math.floor((end - start) / 1000); // in seconds
  }

  return {
    totalLoanAmount,
    totalPaid,
    remainingDebt,
    monthlyPayment,
    yearsToComplete: Math.round(yearsToComplete * 10) / 10,
    totalInterestPaid: Math.round(totalInterestPaid),
    savings: Math.max(0, savings),
    outcome,
    outcomeSummary,
    outcomeSummaryTa,
    recommendations,
    recommendationsTa,
    timeSpent,
    hasEnoughBalance,
    emergencyFund,
  };
}

/**
 * Reset game state for a group
 */
export function resetGameState(groupNumber: number): void {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEY_PREFIX}${groupNumber}`;
  localStorage.removeItem(key);
}

/**
 * Get all group numbers that have saved states
 */
export function getAllSavedGroups(): number[] {
  if (typeof window === 'undefined') return [];

  const groups: number[] = [];
  for (let i = 1; i <= 12; i++) {
    const key = `${STORAGE_KEY_PREFIX}${i}`;
    if (localStorage.getItem(key)) {
      groups.push(i);
    }
  }
  return groups;
}
