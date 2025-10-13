import { GameState, GameChoice, OptionId, DisabledOption, GameResult } from './gameTypes';
import { GAME2_STEPS, GAME2_PROFILE } from './game2Data';
import { getGame2DisabledOptions as getGame2DisabledOptionsFromFile } from './game2DisabledOptions';

const STORAGE_KEY_PREFIX = 'spendo-game2-group-';
const EMERGENCY_AMOUNT = 500000; // Rs 500,000 emergency after 2 years
const CBSL_INSURANCE_LIMIT = 1000000; // Rs 10,00,000 CBSL insurance coverage

/**
 * Load game state from localStorage for a specific group (Game 2)
 */
export function loadGame2State(groupNumber: number): GameState | null {
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
 * Save game state to localStorage (Game 2)
 */
export function saveGame2State(state: GameState): void {
  if (typeof window === 'undefined') return;

  const key = `${STORAGE_KEY_PREFIX}${state.groupNumber}`;
  localStorage.setItem(key, JSON.stringify(state));
}

/**
 * Initialize a new game state (Game 2)
 */
export function initializeGame2State(
  groupNumber: number,
  scenarioId: string = 'scenario-2',
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
 * Make a choice and lock it (Game 2)
 */
export function makeGame2Choice(
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
    const results = calculateGame2Results(newChoices);
    actualBalance = results.emergencyFund;
    const correctAnswer = results.hasEnoughBalance ? 'yes' : 'no';

    // Validate student's answer
    isCorrect = studentAnswer === correctAnswer;
  }

  const newState: GameState = {
    ...state,
    choices: newChoices,
    currentStep: nextStep,
    isDeadEnd: false, // Game 2 has no dead-ends, only success/failure based on final emergency fund
    completedAt: nextStep > 4 ? new Date().toISOString() : undefined, // Complete after step 4
    studentAnswer,
    isCorrect,
    actualBalance,
  };

  saveGame2State(newState);
  return newState;
}

/**
 * Check if the choice path is a winning path based on game2winpath.md
 * Winning paths (4 total):
 * - Step 1: Must be B (Diversified Portfolio)
 * - Step 2: Any (A, B, C, or D)
 * - Step 3: Must be D (Liquid Savings)
 */
function isGame2WinningPath(choices: GameChoice[]): boolean {
  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);

  // Must have all 3 steps
  if (!step1 || !step2 || !step3) return false;

  // Check winning path: Step1=B AND Step3=D
  return step1.option === 'B' && step3.option === 'D';
}

/**
 * Calculate portfolio value based on investment choices
 */
function calculatePortfolioValue(choices: GameChoice[]): {
  cse: number;
  fd: number;
  land: number;
  savings: number;
  moneyMarket: number;
  treasuryBond: number;
  total: number;
} {
  const initialSavings = GAME2_PROFILE.savings;
  const portfolio = {
    cse: 0,
    fd: 0,
    land: 0,
    savings: 0,
    moneyMarket: 0,
    treasuryBond: 0,
    total: 0,
  };

  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);

  // Step 1: Initial investment allocation
  if (step1) {
    switch (step1.option) {
      case 'A': // 100% FD
        portfolio.fd = initialSavings;
        break;
      case 'B': // 20% CSE, 20% Money Market, 30% Land, 30% Bank Savings
        portfolio.cse = initialSavings * 0.20;
        portfolio.moneyMarket = initialSavings * 0.20;
        portfolio.land = initialSavings * 0.30;
        portfolio.savings = initialSavings * 0.30;
        break;
      case 'C': // 20% CSE, 40% FD, 10% Savings, 30% Treasury Bond
        portfolio.cse = initialSavings * 0.20;
        portfolio.fd = initialSavings * 0.40;
        portfolio.savings = initialSavings * 0.10;
        portfolio.treasuryBond = initialSavings * 0.30;
        break;
      case 'D': // 100% CSE
        portfolio.cse = initialSavings;
        break;
    }
  }

  // Step 2: Market crash (CSE drops to 20%)
  if (step2 && portfolio.cse > 0) {
    const originalCSE = portfolio.cse;
    portfolio.cse = originalCSE * 0.20; // 80% loss

    switch (step2.option) {
      case 'A': // Sell all shares, move to savings
        portfolio.savings += portfolio.cse;
        portfolio.cse = 0;
        break;
      case 'B': // Sell 50%, move to savings
        portfolio.savings += portfolio.cse * 0.50;
        portfolio.cse = portfolio.cse * 0.50;
        break;
      case 'C': // Keep unchanged
        // No change
        break;
      case 'D': // Buy Rs 100,000 more shares (from salary)
        portfolio.cse += 100000;
        break;
    }
  }

  // Step 3: Bank collapse (CBSL insurance up to Rs 10,00,000)
  if (step3) {
    const bankDeposits = portfolio.fd + portfolio.savings;
    const insuredAmount = Math.min(bankDeposits, CBSL_INSURANCE_LIMIT);
    const loss = Math.max(0, bankDeposits - CBSL_INSURANCE_LIMIT);

    // Reset bank deposits
    portfolio.fd = 0;
    portfolio.savings = 0;

    // Reinvest insured amount based on choice
    switch (step3.option) {
      case 'A': // FD
        portfolio.fd = insuredAmount;
        break;
      case 'B': // CSE
        portfolio.cse += insuredAmount;
        break;
      case 'C': // Land
        portfolio.land += insuredAmount;
        break;
      case 'D': // Savings
        portfolio.savings = insuredAmount;
        break;
    }
  }

  // Apply growth rates for 2 years
  // Assumptions:
  // - CSE: 15% annual return (if market recovers)
  // - FD: 10% annual return
  // - Land: 8% annual appreciation
  // - Savings: 2% annual interest
  // - Money Market: 6% annual return
  // - Treasury Bond: 9% annual return

  portfolio.cse = portfolio.cse * Math.pow(1.15, 2);
  portfolio.fd = portfolio.fd * Math.pow(1.10, 2);
  portfolio.land = portfolio.land * Math.pow(1.08, 2);
  portfolio.savings = portfolio.savings * Math.pow(1.02, 2);
  portfolio.moneyMarket = portfolio.moneyMarket * Math.pow(1.06, 2);
  portfolio.treasuryBond = portfolio.treasuryBond * Math.pow(1.09, 2);

  // Add salary savings for 2 years (24 months)
  // Assume 20% of salary saved monthly: Rs 100,000 * 0.20 = Rs 20,000/month
  const monthlySavings = GAME2_PROFILE.salary * 0.20;
  const totalSalarySavings = monthlySavings * 24;
  portfolio.savings += totalSalarySavings;

  portfolio.total = portfolio.cse + portfolio.fd + portfolio.land + portfolio.savings + portfolio.moneyMarket + portfolio.treasuryBond;

  return portfolio;
}

/**
 * Get disabled options based on previous choices (Game 2)
 * NO hints - all players see all options regardless of previous choices
 */
export function getGame2DisabledOptions(choices: GameChoice[], currentStep: number): DisabledOption[] {
  // Use Game 2 disabled options logic from game2DisabledOptions.ts
  return getGame2DisabledOptionsFromFile(choices, currentStep);
}

/**
 * Check if a specific option is disabled (Game 2)
 */
export function isGame2OptionDisabled(
  choices: GameChoice[],
  currentStep: number,
  option: OptionId
): { disabled: boolean; reason?: string; reasonTa?: string } {
  const disabledOptions = getGame2DisabledOptions(choices, currentStep);
  const found = disabledOptions.find(d => d.step === currentStep && d.option === option);

  if (found) {
    return { disabled: true, reason: found.reason, reasonTa: found.reasonTa };
  }

  return { disabled: false };
}

/**
 * Calculate final game results based on all choices (Game 2)
 */
export function calculateGame2Results(choices: GameChoice[], startTime?: string): GameResult {
  const portfolio = calculatePortfolioValue(choices);
  const hasEnoughBalance = portfolio.total >= EMERGENCY_AMOUNT;

  // Check if the path taken is a winning path
  const isWinPath = isGame2WinningPath(choices);

  // Determine outcome based on winning path validation
  const outcome: GameResult['outcome'] = isWinPath && hasEnoughBalance ? 'excellent' : 'failed';
  const outcomeSummary = isWinPath && hasEnoughBalance
    ? 'Successful!'
    : 'Not successful, better next time';
  const outcomeSummaryTa = isWinPath && hasEnoughBalance
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
    totalLoanAmount: 0, // Not applicable for investment game
    totalPaid: 0,
    remainingDebt: 0,
    monthlyPayment: 0,
    yearsToComplete: 2, // Fixed 2 years timeline
    totalInterestPaid: 0,
    savings: Math.round(portfolio.total),
    outcome,
    outcomeSummary,
    outcomeSummaryTa,
    recommendations: [],
    recommendationsTa: [],
    timeSpent,
    hasEnoughBalance,
    emergencyFund: Math.round(portfolio.total),
  };
}

/**
 * Reset game state for a group (Game 2)
 */
export function resetGame2State(groupNumber: number): void {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEY_PREFIX}${groupNumber}`;
  localStorage.removeItem(key);
}

/**
 * Get all group numbers that have saved states (Game 2)
 */
export function getAllSavedGame2Groups(): number[] {
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
