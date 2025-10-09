import { GameState, GameChoice, OptionId, DisabledOption, GameResult } from './gameTypes';
import { GAME_STEPS, GAME_PROFILE } from './gameData';

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
export function initializeGameState(groupNumber: number, groupName?: string): GameState {
  return {
    groupNumber,
    groupName,
    choices: [],
    currentStep: 1,
    isDeadEnd: false,
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

  const newState: GameState = {
    ...state,
    choices: newChoices,
    currentStep: isDeadEnd ? step : step + 1,
    isDeadEnd,
    deadEndReason,
    completedAt: (isDeadEnd || step >= 5) ? new Date().toISOString() : undefined,
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
 */
export function getDisabledOptions(choices: GameChoice[], currentStep: number): DisabledOption[] {
  const disabled: DisabledOption[] = [];

  const step1Choice = choices.find(c => c.step === 1);
  const step2Choice = choices.find(c => c.step === 2);
  const step3Choice = choices.find(c => c.step === 3);

  // Step 3 logic: If chose Standard Plan (A) with high payments, can't afford to skip
  if (currentStep === 3 && step1Choice?.option === 'A') {
    disabled.push({
      step: 3,
      option: 'C',
      reason: 'Cannot skip payment on Standard Plan - will damage credit and add penalties',
      reasonTa: 'நிலையான திட்டத்தில் கட்டணத்தைத் தவிர்க்க முடியாது - கடன் மதிப்பெண்ணை சேதப்படுத்தும்',
    });
  }

  // Step 3 logic: If chose to increase lifestyle spending, more vulnerable to inflation
  if (currentStep === 3 && step2Choice?.option === 'D') {
    disabled.push({
      step: 3,
      option: 'A',
      reason: 'Already increased spending - cannot easily cut non-essential expenses',
      reasonTa: 'ஏற்கனவே செலவு அதிகரித்துவிட்டது - தேவையற்ற செலவுகளை எளிதில் குறைக்க முடியாது',
    });
  }

  // Step 4 logic: If haven't built savings and still have high debt, can't take another loan
  if (currentStep === 4) {
    const hasGoodSavings = step2Choice?.option === 'A' || step2Choice?.option === 'C';
    const hasHighPayment = step1Choice?.option === 'A';

    if (!hasGoodSavings && !hasHighPayment) {
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Taking another large loan without savings or aggressive repayment is too risky',
        reasonTa: 'சேமிப்பு அல்லது ஆக்கிரமிப்பு திருப்பிச் செலுத்துதல் இல்லாமல் மற்றொரு பெரிய கடன் எடுப்பது மிகவும் ஆபத்தானது',
      });
    }
  }

  // Step 5 logic: Can only use savings if you actually saved
  if (currentStep === 5) {
    const hasSavings = step2Choice?.option === 'A' || step2Choice?.option === 'C';

    if (!hasSavings) {
      disabled.push({
        step: 5,
        option: 'C',
        reason: 'No savings available - you did not build an emergency fund',
        reasonTa: 'சேமிப்பு கிடைக்கவில்லை - நீங்கள் அவசரகால நிதியை உருவாக்கவில்லை',
      });
    }
  }

  return disabled;
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
 * Calculate final game results based on all choices
 */
export function calculateGameResults(choices: GameChoice[]): GameResult {
  let totalLoanAmount = GAME_PROFILE.studentLoan;
  let monthlyPayment = 0;
  let savings = 0;
  let additionalDebt = 0;

  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);
  const step4 = choices.find(c => c.step === 4);
  const step5 = choices.find(c => c.step === 5);

  // Calculate based on Step 1 choice
  if (step1?.option === 'A') {
    monthlyPayment = 25000;
  } else if (step1?.option === 'B') {
    monthlyPayment = 12000;
  } else if (step1?.option === 'C') {
    monthlyPayment = 10500;
  }

  // Adjust based on Step 2
  if (step2?.option === 'A') {
    savings += 30000; // Saved extra income
  } else if (step2?.option === 'B') {
    monthlyPayment = 40000; // Increased payment
  } else if (step2?.option === 'C') {
    savings += 25000; // Invested (some saved)
  }

  // Step 4: Additional education loan
  if (step4?.option === 'A') {
    additionalDebt += 2000000;
    totalLoanAmount += 2000000;
  } else if (step4?.option === 'C') {
    additionalDebt += 500000; // Partial scholarship
    totalLoanAmount += 500000;
  }

  // Step 5: Emergency handling
  if (step5?.option === 'B') {
    additionalDebt += 300000; // High interest loan
    totalLoanAmount += 300000;
  } else if (step5?.option === 'C') {
    savings -= 300000; // Used savings
  }

  // Calculate years to complete
  const yearsToComplete = totalLoanAmount / (monthlyPayment * 12);
  const totalInterestPaid = totalLoanAmount * 0.08 * yearsToComplete; // Assuming 8% interest
  const totalPaid = totalLoanAmount + totalInterestPaid;
  const remainingDebt = Math.max(0, totalLoanAmount - (18 * monthlyPayment)); // After 18 months

  // Determine outcome
  let outcome: GameResult['outcome'] = 'good';
  let outcomeSummary = '';
  let outcomeSummaryTa = '';
  let recommendations: string[] = [];
  let recommendationsTa: string[] = [];

  if (additionalDebt > 1500000 || savings < 0) {
    outcome = 'poor';
    outcomeSummary = 'Your debt burden is very high. You need to restructure your finances.';
    outcomeSummaryTa = 'உங்கள் கடன் சுமை மிக அதிகம். உங்கள் நிதியை மறுசீரமைக்க வேண்டும்.';
    recommendations = [
      'Seek financial counseling immediately',
      'Consider debt consolidation',
      'Avoid taking new loans',
    ];
    recommendationsTa = [
      'உடனடியாக நிதி ஆலோசனை பெறவும்',
      'கடன் ஒருங்கிணைப்பைக் கருத்தில் கொள்ளவும்',
      'புதிய கடன்களை எடுப்பதைத் தவிர்க்கவும்',
    ];
  } else if (monthlyPayment >= 30000 && savings >= 100000) {
    outcome = 'excellent';
    outcomeSummary = 'Excellent financial management! You are on track to be debt-free soon.';
    outcomeSummaryTa = 'சிறந்த நிதி நிர்வாகம்! நீங்கள் விரைவில் கடன் இல்லாமல் இருக்கும் பாதையில் உள்ளீர்கள்.';
    recommendations = [
      'Continue aggressive repayment',
      'Build 6-month emergency fund',
      'Start retirement planning',
    ];
    recommendationsTa = [
      'ஆக்கிரமிப்பு திருப்பிச் செலுத்துதலைத் தொடரவும்',
      '6 மாத அவசரகால நிதியை உருவாக்கவும்',
      'ஓய்வூதிய திட்டமிடலைத் தொடங்கவும்',
    ];
  } else if (savings >= 50000) {
    outcome = 'good';
    outcomeSummary = 'Good progress! You have maintained a balance between repayment and savings.';
    outcomeSummaryTa = 'நல்ல முன்னேற்றம்! திருப்பிச் செலுத்துதல் மற்றும் சேமிப்புக்கு இடையே சமநிலையை பராமரித்துள்ளீர்கள்.';
    recommendations = [
      'Increase savings gradually',
      'Review and optimize expenses monthly',
      'Consider increasing EMI if income grows',
    ];
    recommendationsTa = [
      'சேமிப்பை படிப்படியாக அதிகரிக்கவும்',
      'மாதாந்திர செலவுகளை மதிப்பாய்வு செய்து உகந்ததாக்கவும்',
      'வருமானம் வளர்ந்தால் EMI அதிகரிப்பதைக் கருத்தில் கொள்ளவும்',
    ];
  } else {
    outcome = 'fair';
    outcomeSummary = 'You are managing but need to be more strategic about debt and savings.';
    outcomeSummaryTa = 'நீங்கள் நிர்வகிக்கிறீர்கள் ஆனால் கடன் மற்றும் சேமிப்பு பற்றி மேலும் மூலோபாயமாக இருக்க வேண்டும்.';
    recommendations = [
      'Create a strict monthly budget',
      'Build emergency fund of at least ₹50,000',
      'Avoid lifestyle inflation',
    ];
    recommendationsTa = [
      'கடுமையான மாதாந்திர பட்ஜெட்டை உருவாக்கவும்',
      'குறைந்தது ₹50,000 அவசரகால நிதியை உருவாக்கவும்',
      'வாழ்க்கை முறை பணவீக்கத்தைத் தவிர்க்கவும்',
    ];
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
  for (let i = 1; i <= 10; i++) {
    const key = `${STORAGE_KEY_PREFIX}${i}`;
    if (localStorage.getItem(key)) {
      groups.push(i);
    }
  }
  return groups;
}
