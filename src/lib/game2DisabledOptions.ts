import { OptionId, DisabledOption, GameChoice } from './gameTypes';

/**
 * Game 2 Disabled Options Mapping
 * Based on game2-disbaleoption.md
 *
 * Investment Management Game - Disabled options based on portfolio allocation
 */

/**
 * Check if Step 2 options should be disabled based on Step 1 choice
 */
function checkStep2DisabledOptions(step1: OptionId): DisabledOption[] {
  const disabled: DisabledOption[] = [];

  // When Step 1 = 1A (All in 5-year FD)
  // Disable: 2A, 2B, 2D (only 2C allowed)
  if (step1 === 'A') {
    disabled.push({
      step: 2,
      option: 'A',
      reason: 'Cannot sell shares - all funds are in Fixed Deposit (no share portfolio exists).',
      reasonTa: 'பங்குகளை விற்க முடியாது - அனைத்து நிதிகளும் நிலையான வைப்புத்தொகையில் உள்ளன (பங்கு போர்ட்ஃபோலியோ இல்லை).',
    });

    disabled.push({
      step: 2,
      option: 'B',
      reason: 'Cannot sell 50% of shares - no share portfolio exists in Fixed Deposit strategy.',
      reasonTa: 'பங்குகளின் 50% விற்க முடியாது - நிலையான வைப்புத்தொகை உத்தியில் பங்கு போர்ட்ஃபோலியோ இல்லை.',
    });

    disabled.push({
      step: 2,
      option: 'D',
      reason: 'Cannot buy more shares - portfolio has no existing CSE investments to add to.',
      reasonTa: 'மேலும் பங்குகளை வாங்க முடியாது - போர்ட்ஃபோலியோவில் தற்போதுள்ள CSE முதலீடுகள் இல்லை.',
    });
  }

  // When Step 1 = 1D (All in CSE)
  // Disable: 2C, 2D (only 2A and 2B allowed)
  if (step1 === 'D') {
    

    disabled.push({
      step: 2,
      option: 'D',
      reason: 'Cannot buy more shares when portfolio already lost 80% value - high risk strategy blocked.',
      reasonTa: 'போர்ட்ஃபோலியோ ஏற்கனவே 80% மதிப்பை இழந்தபோது மேலும் பங்குகளை வாங்க முடியாது - அதிக ஆபத்து உத்தி தடுக்கப்பட்டது.',
    });
  }

  return disabled;
}

/**
 * Check if Step 3 options should be disabled based on Step 1 and Step 2 choices
 */
function checkStep3DisabledOptions(step1: OptionId, step2: OptionId): DisabledOption[] {
  const disabled: DisabledOption[] = [];

  // When Step 1 = 1D (All in CSE) AND Step 2 = 2C (Keep unchanged)
  // Disable ALL Step 3 options (3A, 3B, 3C, 3D)
  if (step1 === 'D' && step2 === 'C') {
    disabled.push({
      step: 3,
      option: 'A',
      reason: 'No bank deposits exist after market crash - CBSL insurance cannot recover funds.',
      reasonTa: 'சந்தை வீழ்ச்சிக்குப் பிறகு வங்கி வைப்புத்தொகைகள் இல்லை - CBSL காப்பீடு நிதிகளை மீட்க முடியாது.',
    });

    disabled.push({
      step: 3,
      option: 'B',
      reason: 'No bank deposits exist after market crash - CBSL insurance cannot recover funds.',
      reasonTa: 'சந்தை வீழ்ச்சிக்குப் பிறகு வங்கி வைப்புத்தொகைகள் இல்லை - CBSL காப்பீடு நிதிகளை மீட்க முடியாது.',
    });

    disabled.push({
      step: 3,
      option: 'C',
      reason: 'No bank deposits exist after market crash - CBSL insurance cannot recover funds.',
      reasonTa: 'சந்தை வீழ்ச்சிக்குப் பிறகு வங்கி வைப்புத்தொகைகள் இல்லை - CBSL காப்பீடு நிதிகளை மீட்க முடியாது.',
    });

    disabled.push({
      step: 3,
      option: 'D',
      reason: 'No bank deposits exist after market crash - CBSL insurance cannot recover funds.',
      reasonTa: 'சந்தை வீழ்ச்சிக்குப் பிறகு வங்கி வைப்புத்தொகைகள் இல்லை - CBSL காப்பீடு நிதிகளை மீட்க முடியாது.',
    });
  }

  // When Step 1 = 1D (All in CSE) AND Step 2 = 2D (Buy more shares)
  // Disable ALL Step 3 options (3A, 3B, 3C, 3D)
  if (step1 === 'D' && step2 === 'D') {
    disabled.push({
      step: 3,
      option: 'A',
      reason: 'Buying more shares after 80% loss leaves no funds for bank recovery decisions.',
      reasonTa: '80% இழப்புக்குப் பிறகு மேலும் பங்குகளை வாங்குவது வங்கி மீட்பு முடிவுகளுக்கு நிதிகளை விட்டுச் செல்லாது.',
    });

    disabled.push({
      step: 3,
      option: 'B',
      reason: 'Buying more shares after 80% loss leaves no funds for bank recovery decisions.',
      reasonTa: '80% இழப்புக்குப் பிறகு மேலும் பங்குகளை வாங்குவது வங்கி மீட்பு முடிவுகளுக்கு நிதிகளை விட்டுச் செல்லாது.',
    });

    disabled.push({
      step: 3,
      option: 'C',
      reason: 'Buying more shares after 80% loss leaves no funds for bank recovery decisions.',
      reasonTa: '80% இழப்புக்குப் பிறகு மேலும் பங்குகளை வாங்குவது வங்கி மீட்பு முடிவுகளுக்கு நிதிகளை விட்டுச் செல்லாது.',
    });

    disabled.push({
      step: 3,
      option: 'D',
      reason: 'Buying more shares after 80% loss leaves no funds for bank recovery decisions.',
      reasonTa: '80% இழப்புக்குப் பிறகு மேலும் பங்குகளை வாங்குவது வங்கி மீட்பு முடிவுகளுக்கு நிதிகளை விட்டுச் செல்லாது.',
    });
  }

  return disabled;
}

/**
 * Get disabled options for a given current step based on previous choices
 */
export function getGame2DisabledOptions(choices: GameChoice[], currentStep: number): DisabledOption[] {
  // Only check for disabled options at Step 2 and Step 3
  if (currentStep < 2 || currentStep > 3) {
    return [];
  }

  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);

  if (!step1) {
    return [];
  }

  // For Step 2: Check based on Step 1 only
  if (currentStep === 2) {
    return checkStep2DisabledOptions(step1.option);
  }

  // For Step 3: Check based on Step 1 + Step 2
  if (currentStep === 3 && step2) {
    return checkStep3DisabledOptions(step1.option, step2.option);
  }

  return [];
}

/**
 * Check if a specific option is disabled at current step
 */
export function isGame2OptionDisabled(
  choices: GameChoice[],
  currentStep: number,
  option: OptionId
): { disabled: boolean; reason?: string; reasonTa?: string } {
  const disabledOptions = getGame2DisabledOptions(choices, currentStep);
  const found = disabledOptions.find(d => d.option === option);

  if (found) {
    return { disabled: true, reason: found.reason, reasonTa: found.reasonTa };
  }

  return { disabled: false };
}
