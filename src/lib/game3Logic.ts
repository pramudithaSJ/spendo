import { GameState, GameChoice, OptionId, DisabledOption, GameResult } from './gameTypes';
import { GAME3_STEPS, GAME3_PROFILE } from './game3Data';

const STORAGE_KEY_PREFIX = 'spendo-game3-group-';
const EMERGENCY_AMOUNT = 500000; // Rs 500,000 emergency after 36 months

/**
 * Load game state from localStorage for a specific group (Game 3)
 */
export function loadGame3State(groupNumber: number): GameState | null {
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
 * Save game state to localStorage (Game 3)
 */
export function saveGame3State(state: GameState): void {
  if (typeof window === 'undefined') return;

  const key = `${STORAGE_KEY_PREFIX}${state.groupNumber}`;
  localStorage.setItem(key, JSON.stringify(state));
}

/**
 * Initialize a new game state (Game 3)
 */
export function initializeGame3State(
  groupNumber: number,
  scenarioId: string = 'scenario-3',
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
 * Make a choice and lock it (Game 3)
 */
export function makeGame3Choice(
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

  // Always progress to next step - all players go through all 4 steps
  const nextStep = step + 1;

  // Check if this is the final assessment step (Step 4)
  let studentAnswer: 'yes' | 'no' | undefined;
  let isCorrect: boolean | undefined;
  let actualBalance: number | undefined;

  if (step === 4) {
    // Student selected their answer
    studentAnswer = option === 'A' ? 'yes' : 'no';

    // Calculate the CORRECT answer
    const results = calculateGame3Results(newChoices);
    actualBalance = results.emergencyFund;
    const correctAnswer = results.hasEnoughBalance ? 'yes' : 'no';

    // Validate student's answer
    isCorrect = studentAnswer === correctAnswer;
  }

  const newState: GameState = {
    ...state,
    choices: newChoices,
    currentStep: nextStep,
    isDeadEnd: false,
    completedAt: nextStep > 4 ? new Date().toISOString() : undefined, // Complete after step 4
    studentAnswer,
    isCorrect,
    actualBalance,
  };

  saveGame3State(newState);
  return newState;
}

/**
 * Calculate savings and expenses over 36 months based on choices
 */
function calculateSavingsBalance(choices: GameChoice[]): number {
  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);

  let totalSavings = GAME3_PROFILE.savings; // Starting Rs. 20,000
  let monthlyDebt = 0;

  // Step 1: Monthly budgeting for 36 months
  if (step1) {
    switch (step1.option) {
      case 'A': // Rs. 15k savings + Rs. 10k investments @10% + Rs. 10k insurance
        // Savings: Rs. 15,000 * 36 = Rs. 540,000
        totalSavings += 15000 * 36;
        // Investment: Rs. 10,000 * 36 with 10% annual for 3 years
        const monthlyInvestment = 10000;
        const months = 36;
        const annualRate = 0.10;
        // Simple calculation: principal * (1 + rate)^years
        const investmentValue = (monthlyInvestment * months) * Math.pow(1 + annualRate, 3);
        totalSavings += investmentValue;
        break;
      case 'B': // Rs. 10k savings only
        totalSavings += 10000 * 36; // Rs. 360,000
        break;
      case 'C': // Rs. 35k investment @10% (locked for 10 years - not accessible)
        // Investment locked for 10 years, NOT accessible at 36 months
        totalSavings += 0;
        break;
    }
  }

  // Step 2: iPhone purchase
  if (step2) {
    switch (step2.option) {
      case 'A': // Skip - no impact
        break;
      case 'B': // Save Rs. 15k/month
        // Reduces available savings by Rs. 15k/month for saving towards phone
        totalSavings -= 15000 * 36;
        break;
      case 'C': // Borrow Rs. 300k to be paid after 2 years
        // At 36 months (3 years), already paid Rs. 300k at 24 months
        totalSavings -= 300000;
        break;
      case 'D': // Credit card Rs. 12,368/month for 24 months
        // Paid Rs. 12,368 * 24 = Rs. 296,832
        totalSavings -= 296832;
        break;
    }
  }

  // Step 3: Overseas trip
  if (step3) {
    switch (step3.option) {
      case 'A': // Skip - no impact
        break;
      case 'B': // Credit card Rs. 200k
        // Assume paid with interest over time: ~Rs. 240,000
        totalSavings -= 240000;
        break;
      case 'C': // Use savings + borrow
        // Use all current savings + borrow rest
        totalSavings -= 200000;
        break;
      case 'D': // Local trip Rs. 20k
        totalSavings -= 20000;
        break;
    }
  }

  return Math.max(0, totalSavings);
}

/**
 * Get disabled options based on previous choices (Game 3)
 * NO hints - all players see all options regardless of previous choices
 */
export function getGame3DisabledOptions(choices: GameChoice[], currentStep: number): DisabledOption[] {
  // Return empty array - no hints, no disabled options
  return [];
}

/**
 * Check if a specific option is disabled (Game 3)
 */
export function isGame3OptionDisabled(
  choices: GameChoice[],
  currentStep: number,
  option: OptionId
): { disabled: boolean; reason?: string; reasonTa?: string } {
  const disabledOptions = getGame3DisabledOptions(choices, currentStep);
  const found = disabledOptions.find(d => d.step === currentStep && d.option === option);

  if (found) {
    return { disabled: true, reason: found.reason, reasonTa: found.reasonTa };
  }

  return { disabled: false };
}

/**
 * Calculate final game results based on all choices (Game 3)
 */
export function calculateGame3Results(choices: GameChoice[], startTime?: string): GameResult {
  const totalBalance = calculateSavingsBalance(choices);
  const hasEnoughBalance = totalBalance >= EMERGENCY_AMOUNT;

  // Determine outcome
  const outcome: GameResult['outcome'] = hasEnoughBalance ? 'excellent' : 'failed';
  const outcomeSummary = hasEnoughBalance
    ? 'Successful!'
    : 'Not successful, better next time';
  const outcomeSummaryTa = hasEnoughBalance
    ? 'வெற்றிகரமானது!'
    : 'வெற்றிபெறவில்லை, அடுத்த முறை சிறப்பாக';

  // Calculate time spent if startTime is provided
  let timeSpent: number | undefined;
  if (startTime) {
    const start = new Date(startTime).getTime();
    const end = Date.now();
    timeSpent = Math.floor((end - start) / 1000); // in seconds
  }

  return {
    totalLoanAmount: 0, // Not applicable for expense game
    totalPaid: 0,
    remainingDebt: 0,
    monthlyPayment: 0,
    yearsToComplete: 3, // Fixed 3 years timeline
    totalInterestPaid: 0,
    savings: Math.round(totalBalance),
    outcome,
    outcomeSummary,
    outcomeSummaryTa,
    recommendations: [],
    recommendationsTa: [],
    timeSpent,
    hasEnoughBalance,
    emergencyFund: Math.round(totalBalance),
  };
}

/**
 * Reset game state for a group (Game 3)
 */
export function resetGame3State(groupNumber: number): void {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEY_PREFIX}${groupNumber}`;
  localStorage.removeItem(key);
}

/**
 * Get all group numbers that have saved states (Game 3)
 */
export function getAllSavedGame3Groups(): number[] {
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
