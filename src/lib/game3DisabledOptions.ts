import { OptionId, DisabledOption, GameChoice } from './gameTypes';

/**
 * Game 3 Disabled Options Mapping
 * Expense Management Game - Disabled options based on spending decisions
 */

/**
 * Check if Step 2 options should be disabled based on Step 1 choice
 */
function checkStep2DisabledOptions(step1: OptionId): DisabledOption[] {
  const disabled: DisabledOption[] = [];

  // When Step 1 = 1C
  // Disable: 2B only
  if (step1 === 'C') {
    disabled.push({
      step: 2,
      option: 'B',
      reason: 'This option is not available for your current spending plan.',
      reasonTa: 'உங்கள் தற்போதைய செலவுத் திட்டத்திற்கு இந்த விருப்பம் கிடைக்கவில்லை.',
    });
  }

  return disabled;
}

/**
 * Get disabled options for a given current step based on previous choices
 */
export function getGame3DisabledOptions(choices: GameChoice[], currentStep: number): DisabledOption[] {
  // Only check for disabled options at Step 2
  if (currentStep !== 2) {
    return [];
  }

  const step1 = choices.find(c => c.step === 1);

  if (!step1) {
    return [];
  }

  // For Step 2: Check based on Step 1 only
  return checkStep2DisabledOptions(step1.option);
}

/**
 * Check if a specific option is disabled at current step
 */
export function isGame3OptionDisabled(
  choices: GameChoice[],
  currentStep: number,
  option: OptionId
): { disabled: boolean; reason?: string; reasonTa?: string } {
  const disabledOptions = getGame3DisabledOptions(choices, currentStep);
  const found = disabledOptions.find(d => d.option === option);

  if (found) {
    return { disabled: true, reason: found.reason, reasonTa: found.reasonTa };
  }

  return { disabled: false };
}
