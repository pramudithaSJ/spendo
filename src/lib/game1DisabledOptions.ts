import { OptionId, DisabledOption, GameChoice } from './gameTypes';

/**
 * Game 1 Disabled Options Mapping
 * Based on game1-disbaleoption.md
 *
 * Disabled options:
 * - Step 3 Option B (3B): Disabled when Step1=(A/B/C) AND Step2=C
 * - Step 4 Option A (4A): Disabled for specific path combinations
 */

/**
 * Check if Step 3 Option B should be disabled based on Steps 1-2
 */
function checkStep3DisabledOptions(step1: OptionId, step2: OptionId): DisabledOption[] {
  const disabled: DisabledOption[] = [];

  // Disable 3B when Step2 = C (Investment plan)
  // This covers: 1A-2C, 1B-2C, 1C-2C
  if (step2 === 'C') {
    let reason: string;
    let reasonTa: string;

    if (step1 === 'A') {
      // Standard Plan + Investment
      reason = 'Taking advance salary conflicts with long-term investment strategy.';
      reasonTa = 'முன்கூட்டிய சம்பளம் எடுப்பது நீண்டகால முதலீட்டு உத்தியுடன் முரண்படுகிறது.';
    } else if (step1 === 'B') {
      // Extended Plan (10 years) + Investment
      reason = 'Extended plan with investment strategy requires stable cash flow - advance salary creates complications.';
      reasonTa = 'முதலீட்டு உத்தியுடன் நீட்டிக்கப்பட்ட திட்டத்திற்கு நிலையான பண ஓட்டம் தேவை - முன்கூட்டிய சம்பளம் சிக்கல்களை உருவாக்குகிறது.';
    } else { // step1 === 'C'
      // Extended Plan (20 years) + Investment
      reason = 'Very long-term plan with investment requires maximum stability - advance salary disrupts strategy.';
      reasonTa = 'முதலீட்டுடன் மிக நீண்ட கால திட்டத்திற்கு அதிகபட்ச ஸ்திரத்தன்மை தேவை - முன்கூட்டிய சம்பளம் உத்தியை சீர்குலைக்கிறது.';
    }

    disabled.push({
      step: 3,
      option: 'B',
      reason,
      reasonTa,
    });
  }

  return disabled;
}

/**
 * Check if Step 4 Option A should be disabled based on Steps 1-3
 */
function checkStep4DisabledOptions(step1: OptionId, step2: OptionId, step3: OptionId): DisabledOption[] {
  const disabled: DisabledOption[] = [];

  // Pattern 1: 1A + 2B + (any step3) → disable 4A
  // Paths: 17, 21, 25, 29
  if (step1 === 'A' && step2 === 'B') {
    let reason: string;
    let reasonTa: string;

    if (step3 === 'A' || step3 === 'B') {
      reason = 'Increased repayment commitment leaves insufficient cash flow for additional loan burden.';
      reasonTa = 'அதிகரித்த திருப்பிச் செலுத்தும் அர்ப்பணிப்பு கூடுதல் கடன் சுமைக்கு போதுமான பண ஓட்டத்தை விட்டுச் செல்லாது.';
    } else if (step3 === 'C') {
      reason = 'Skipping payments damages your credit score - taking new loan will be difficult and expensive.';
      reasonTa = 'கட்டணங்களைத் தவிர்ப்பது உங்கள் கடன் மதிப்பெண்ணை சேதப்படுத்துகிறது - புதிய கடன் எடுப்பது கடினமாகவும் விலை உயர்ந்ததாகவும் இருக்கும்.';
    } else { // step3 === 'D'
      reason = 'Using credit card debt to manage existing loan makes new education loan unfeasible.';
      reasonTa = 'தற்போதுள்ள கடனை நிர்வகிக்க கடன் அட்டையைப் பயன்படுத்துவது புதிய கல்விக் கடனை சாத்தியமற்றதாக்குகிறது.';
    }

    disabled.push({
      step: 4,
      option: 'A',
      reason,
      reasonTa,
    });
  }

  // Pattern 2: 1A + 2C + (3A or 3B or 3D) → disable 4A
  // Paths: 33, 37, 45
  if (step1 === 'A' && step2 === 'C') {
    if (step3 === 'A') {
      // Path 33: 1A-2C-3A
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Extended repayment with investment focus leaves limited capacity for new education loan.',
        reasonTa: 'முதலீட்டு கவனத்துடன் நீட்டிக்கப்பட்ட திருப்பிச் செலுத்துதல் புதிய கல்விக் கடனுக்கு வரையறுக்கப்பட்ட திறனை விட்டுச் செல்கிறது.',
      });
    } else if (step3 === 'B') {
      // Path 37: 1A-2C-3B
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Taking advance salary and new loan simultaneously creates excessive debt burden.',
        reasonTa: 'முன்கூட்டிய சம்பளம் மற்றும் புதிய கடனை ஒரே நேரத்தில் எடுப்பது அதிகப்படியான கடன் சுமையை உருவாக்குகிறது.',
      });
    } else if (step3 === 'D') {
      // Path 45: 1A-2C-3D
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Credit card debt combined with investment plan creates conflicting financial priorities.',
        reasonTa: 'முதலீட்டு திட்டத்துடன் இணைந்த கடன் அட்டைக் கடன் முரண்பட்ட நிதி முன்னுரிமைகளை உருவாக்குகிறது.',
      });
    }
  }

  // Pattern 3: 1B + 2B + 3C → disable 4A
  // Path: 89
  if (step1 === 'B' && step2 === 'B' && step3 === 'C') {
    disabled.push({
      step: 4,
      option: 'A',
      reason: 'Extended plan with skipped payments indicates financial instability - new loan not advisable.',
      reasonTa: 'தவிர்க்கப்பட்ட கட்டணங்களுடன் நீட்டிக்கப்பட்ட திட்டம் நிதி உறுதியின்மையைக் குறிக்கிறது - புதிய கடன் பரிந்துரைக்கப்படவில்லை.',
    });
  }

  // Pattern 4: 1B + 2C + (3A or 3C or 3D) → disable 4A
  // Paths: 97, 105, 109
  if (step1 === 'B' && step2 === 'C') {
    if (step3 === 'A') {
      // Path 97: 1B-2C-3A
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Extended repayment with investment focus leaves limited capacity for new education loan.',
        reasonTa: 'முதலீட்டு கவனத்துடன் நீட்டிக்கப்பட்ட திருப்பிச் செலுத்துதல் புதிய கல்விக் கடனுக்கு வரையறுக்கப்பட்ட திறனை விட்டுச் செல்கிறது.',
      });
    } else if (step3 === 'C') {
      // Path 105: 1B-2C-3C
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Investment plan compromised by skipped payments - new loan creates excessive risk.',
        reasonTa: 'தவிர்க்கப்பட்ட கட்டணங்களால் முதலீட்டு திட்டம் சமரசம் செய்யப்பட்டது - புதிய கடன் அதிகப்படியான ஆபத்தை உருவாக்குகிறது.',
      });
    } else if (step3 === 'D') {
      // Path 109: 1B-2C-3D
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Credit card debt undermines investment strategy - additional education loan not feasible.',
        reasonTa: 'கடன் அட்டைக் கடன் முதலீட்டு உத்தியை குறைமதிப்பிற்கு உட்படுத்துகிறது - கூடுதல் கல்விக் கடன் சாத்தியமில்லை.',
      });
    }
  }

  // Pattern 5: 1C + 2B + 3C → disable 4A
  // Path: 153
  if (step1 === 'C' && step2 === 'B' && step3 === 'C') {
    disabled.push({
      step: 4,
      option: 'A',
      reason: 'Long-term extended plan with payment issues shows financial strain - new loan too risky.',
      reasonTa: 'கட்டணச் சிக்கல்களுடன் நீண்டகால நீட்டிக்கப்பட்ட திட்டம் நிதி அழுத்தத்தைக் காட்டுகிறது - புதிய கடன் மிகவும் ஆபத்தானது.',
    });
  }

  // Pattern 6: 1C + 2C + (3A or 3C or 3D) → disable 4A
  // Paths: 161, 169, 173
  if (step1 === 'C' && step2 === 'C') {
    if (step3 === 'A') {
      // Path 161: 1C-2C-3A
      disabled.push({
        step: 4,
        option: 'A',
        reason: '20-year plan with investment focus indicates limited financial flexibility for new debt.',
        reasonTa: 'முதலீட்டு கவனத்துடன் 20 ஆண்டு திட்டம் புதிய கடனுக்கு வரையறுக்கப்பட்ட நிதி நெகிழ்வுத்தன்மையைக் குறிக்கிறது.',
      });
    } else if (step3 === 'C') {
      // Path 169: 1C-2C-3C
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Long-term investment plan disrupted by skipped payment - new education loan not viable.',
        reasonTa: 'தவிர்க்கப்பட்ட கட்டணத்தால் நீண்டகால முதலீட்டு திட்டம் சீர்குலைந்தது - புதிய கல்விக் கடன் சாத்தியமில்லை.',
      });
    } else if (step3 === 'D') {
      // Path 173: 1C-2C-3D
      disabled.push({
        step: 4,
        option: 'A',
        reason: 'Credit card use indicates cash flow problems - taking large education loan is imprudent.',
        reasonTa: 'கடன் அட்டை பயன்பாடு பண ஓட்ட பிரச்சனைகளைக் குறிக்கிறது - பெரிய கல்விக் கடன் எடுப்பது விவேகமற்றது.',
      });
    }
  }

  return disabled;
}

/**
 * Get disabled options for a given current step based on previous choices
 */
export function getGame1DisabledOptions(choices: GameChoice[], currentStep: number): DisabledOption[] {
  // Only check for disabled options at steps 3 and 4
  if (currentStep < 3 || currentStep > 4) {
    return [];
  }

  const step1 = choices.find(c => c.step === 1);
  const step2 = choices.find(c => c.step === 2);
  const step3 = choices.find(c => c.step === 3);

  if (!step1 || !step2) {
    return [];
  }

  // For Step 3: Check based on Steps 1-2 only
  if (currentStep === 3) {
    return checkStep3DisabledOptions(step1.option, step2.option);
  }

  // For Step 4: Check based on Steps 1-3
  if (currentStep === 4 && step3) {
    return checkStep4DisabledOptions(step1.option, step2.option, step3.option);
  }

  return [];
}

/**
 * Check if a specific option is disabled at current step
 */
export function isGame1OptionDisabled(
  choices: GameChoice[],
  currentStep: number,
  option: OptionId
): { disabled: boolean; reason?: string; reasonTa?: string } {
  const disabledOptions = getGame1DisabledOptions(choices, currentStep);
  const found = disabledOptions.find(d => d.option === option);

  if (found) {
    return { disabled: true, reason: found.reason, reasonTa: found.reasonTa };
  }

  return { disabled: false };
}
