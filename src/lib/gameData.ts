import { GameStep } from './gameTypes';

// Student Loan Management Game - Hardcoded Scenario Data
export const GAME_PROFILE = {
  age: 24,
  studentLoan: 1200000,
  startingSalary: 70000,
  ageEn: 'Age: 24',
  ageTa: 'வயது: 24',
  loanEn: 'Student Loan: ₹12,00,000',
  loanTa: 'கல்விக் கடன்: ₹12,00,000',
  salaryEn: 'Starting Salary: ₹70,000/month',
  salaryTa: 'தொடக்க சம்பளம்: ₹70,000/மாதம்',
};

export const GAME_STEPS: GameStep[] = [
  {
    step: 1,
    title: 'Step 1: Choose Repayment Plan',
    titleTa: 'படி 1: திருப்பிச் செலுத்தும் திட்டத்தைத் தேர்ந்தெடுங்கள்',
    scenario: 'Grace period ending → must start repayment',
    scenarioTa: 'கருணைக் காலம் முடிவடைகிறது → திருப்பிச் செலுத்த வேண்டும்',
    context: 'Current Salary: ₹70,000/month | Student Loan: ₹12,00,000',
    contextTa: 'தற்போதைய சம்பளம்: ₹70,000/மாதம் | கல்விக் கடன்: ₹12,00,000',
    options: [
      {
        id: 'A',
        text: 'Standard Plan: ₹25,000/month (5 years), remaining balance spent on essentials',
        textTa: 'நிலையான திட்டம்: ₹25,000/மாதம் (5 ஆண்டுகள்), மீதமுள்ளது அத்தியாவசியங்களுக்கு',
        financialImpact: {
          description: 'High monthly payment but loan-free in 5 years',
          descriptionTa: 'அதிக மாதாந்திர செலுத்துதல் ஆனால் 5 ஆண்டுகளில் கடன் இல்லாமல்',
          monthlyPayment: 25000,
          totalDebt: 1200000,
        },
      },
      {
        id: 'B',
        text: 'Extended Plan: ₹12,000/month (10 years), remaining balance spent on essentials',
        textTa: 'நீட்டிக்கப்பட்ட திட்டம்: ₹12,000/மாதம் (10 ஆண்டுகள்), மீதமுள்ளது அத்தியாவசியங்களுக்கு',
        financialImpact: {
          description: 'Lower monthly burden, more time to repay',
          descriptionTa: 'குறைந்த மாதாந்திர சுமை, திருப்பிச் செலுத்த அதிக நேரம்',
          monthlyPayment: 12000,
          totalDebt: 1200000,
        },
      },
      {
        id: 'C',
        text: 'Income-based Plan: 15% of salary (~₹10,500/month), remaining balance spent on essentials',
        textTa: 'வருமான அடிப்படை திட்டம்: சம்பளத்தின் 15% (~₹10,500/மாதம்), மீதமுள்ளது அத்தியாவசியங்களுக்கு',
        financialImpact: {
          description: 'Flexible payment based on income level',
          descriptionTa: 'வருமான நிலைக்கு ஏற்ற நெகிழ்வான செலுத்துதல்',
          monthlyPayment: 10500,
          totalDebt: 1200000,
        },
      },
    ],
  },
  {
    step: 2,
    title: 'Step 2: After 6 Months - Salary Hike to ₹1,00,000',
    titleTa: 'படி 2: 6 மாதங்களுக்குப் பிறகு - சம்பளம் ₹1,00,000 ஆக உயர்வு',
    scenario: 'Your salary has increased to ₹1,00,000 per month',
    scenarioTa: 'உங்கள் சம்பளம் மாதம் ₹1,00,000 ஆக அதிகரித்துள்ளது',
    context: 'New Salary: ₹1,00,000/month | Extra Income: ₹30,000/month',
    contextTa: 'புதிய சம்பளம்: ₹1,00,000/மாதம் | கூடுதல் வருமானம்: ₹30,000/மாதம்',
    options: [
      {
        id: 'A',
        text: 'Keep repayment same, save extra amount',
        textTa: 'திருப்பிச் செலுத்துதலை அப்படியே வைத்து, கூடுதல் தொகையைச் சேமிக்கவும்',
        financialImpact: {
          description: 'Build emergency savings, maintain original timeline',
          descriptionTa: 'அவசரகால சேமிப்பை உருவாக்கவும், அசல் காலவரிசையை பராமரிக்கவும்',
          savings: 30000,
        },
      },
      {
        id: 'B',
        text: 'Increase repayment to finish early (~₹40,000) & Save the remaining amount',
        textTa: 'முன்கூட்டியே முடிக்க திருப்பிச் செலுத்துதலை அதிகரிக்கவும் (~₹40,000) & மீதமுள்ளதைச் சேமிக்கவும்',
        financialImpact: {
          description: 'Become debt-free faster, reduce interest',
          descriptionTa: 'வேகமாக கடன் இல்லாமல் ஆகவும், வட்டியைக் குறைக்கவும்',
          monthlyPayment: 40000,
        },
      },
      {
        id: 'C',
        text: 'Invest extra in 15-year investment plan at 12% rate',
        textTa: '15 ஆண்டு முதலீட்டுத் திட்டத்தில் 12% வட்டியில் கூடுதல் முதலீடு செய்யவும்',
        financialImpact: {
          description: 'Build wealth through long-term investments',
          descriptionTa: 'நீண்டகால முதலீடுகள் மூலம் செல்வத்தை உருவாக்கவும்',
          savings: 30000,
        },
      },
      {
        id: 'D',
        text: 'Keep minimum repayment, increase lifestyle spending',
        textTa: 'குறைந்தபட்ச திருப்பிச் செலுத்துதலை வைத்து, வாழ்க்கை முறை செலவை அதிகரிக்கவும்',
        financialImpact: {
          description: 'Enjoy higher standard of living, extend debt period',
          descriptionTa: 'உயர்ந்த வாழ்க்கைத் தரத்தை அனுபவிக்கவும், கடன் காலத்தை நீட்டிக்கவும்',
        },
        isDeadEnd: false, // Can lead to problems later
      },
    ],
  },
  {
    step: 3,
    title: 'Step 3: After 1 Year - Inflation Impact',
    titleTa: 'படி 3: 1 ஆண்டுக்குப் பிறகு - பணவீக்க தாக்கம்',
    scenario: 'Due to inflation, living expenses increased by 7-10%',
    scenarioTa: 'பணவீக்கம் காரணமாக, வாழ்க்கைச் செலவுகள் 7-10% அதிகரித்துள்ளன',
    context: 'Monthly Expenses Increased: ~₹5,000-7,000 more',
    contextTa: 'மாதாந்திர செலவுகள் அதிகரிப்பு: ~₹5,000-7,000 அதிகம்',
    options: [
      {
        id: 'A',
        text: 'Stick to plan, cut non-essential expenses',
        textTa: 'திட்டத்தில் நிலைத்திருங்கள், தேவையற்ற செலவுகளைக் குறைக்கவும்',
        financialImpact: {
          description: 'Maintain financial discipline, sacrifice comfort',
          descriptionTa: 'நிதி ஒழுக்கத்தை பராமரிக்கவும், வசதியை தியாகம் செய்யவும்',
        },
      },
      {
        id: 'B',
        text: 'Switch to extended plan for lower EMI',
        textTa: 'குறைந்த EMI க்காக நீட்டிக்கப்பட்ட திட்டத்திற்கு மாறவும்',
        financialImpact: {
          description: 'Reduce monthly pressure, extend loan duration',
          descriptionTa: 'மாதாந்திர அழுத்தத்தைக் குறைக்கவும், கடன் காலத்தை நீட்டிக்கவும்',
        },
      },
      {
        id: 'C',
        text: 'Skip one month payment',
        textTa: 'ஒரு மாத கட்டணத்தைத் தவிர்க்கவும்',
        financialImpact: {
          description: 'Temporary relief but damages credit score',
          descriptionTa: 'தற்காலிக நிவாரணம் ஆனால் கடன் மதிப்பெண்ணை சேதப்படுத்துகிறது',
        },
        isDeadEnd: true,
        deadEndReason: 'Skipping payments damages credit score and adds penalties. This leads to a debt spiral.',
        deadEndReasonTa: 'கட்டணங்களைத் தவிர்ப்பது கடன் மதிப்பெண்ணை சேதப்படுத்துகிறது மற்றும் அபராதங்களைச் சேர்க்கிறது. இது கடன் சுழலுக்கு வழிவகுக்கிறது.',
      },
      {
        id: 'D',
        text: 'Take new credit card to cover shortfall',
        textTa: 'பற்றாக்குறையை சரிசெய்ய புதிய கடன் அட்டை எடுக்கவும்',
        financialImpact: {
          description: 'Quick fix but creates new debt',
          descriptionTa: 'விரைவு தீர்வு ஆனால் புதிய கடனை உருவாக்குகிறது',
        },
        isDeadEnd: true,
        deadEndReason: 'Taking credit card debt to pay existing debt creates a dangerous debt cycle.',
        deadEndReasonTa: 'தற்போதுள்ள கடனைச் செலுத்த கடன் அட்டைக் கடனை எடுப்பது ஆபத்தான கடன் சுழற்சியை உருவாக்குகிறது.',
      },
    ],
  },
  {
    step: 4,
    title: 'Step 4: After 12 Months - Masters Abroad Opportunity',
    titleTa: 'படி 4: 12 மாதங்களுக்குப் பிறகு - வெளிநாட்டில் முதுகலை வாய்ப்பு',
    scenario: 'Opportunity for Masters abroad - needs additional funding',
    scenarioTa: 'வெளிநாட்டில் முதுகலை வாய்ப்பு - கூடுதல் நிதி தேவை',
    context: 'Masters Program Cost: ₹20,00,000',
    contextTa: 'முதுகலை திட்ட செலவு: ₹20,00,000',
    options: [
      {
        id: 'A',
        text: 'Take new loan ₹20,00,000 with new installments',
        textTa: 'புதிய தவணைகளுடன் ₹20,00,000 புதிய கடன் எடுக்கவும்',
        financialImpact: {
          description: 'Invest in education, manage dual loans',
          descriptionTa: 'கல்வியில் முதலீடு செய்யவும், இரட்டை கடன்களை நிர்வகிக்கவும்',
          totalDebt: 2000000,
        },
        isDeadEnd: false, // Risky but manageable if previous choices were good
      },
      {
        id: 'B',
        text: 'Delay Masters until current loan is finished',
        textTa: 'தற்போதைய கடன் முடியும் வரை முதுகலையை தாமதப்படுத்தவும்',
        financialImpact: {
          description: 'Conservative approach, avoid over-leveraging',
          descriptionTa: 'பழமைவாத அணுகுமுறை, அதிக கடன் சுமையைத் தவிர்க்கவும்',
        },
      },
      {
        id: 'C',
        text: 'Seek scholarship → minimize loan amount',
        textTa: 'உதவித்தொகை தேடவும் → கடன் தொகையைக் குறைக்கவும்',
        financialImpact: {
          description: 'Smart strategy, reduce financial burden',
          descriptionTa: 'புத்திசாலித்தனமான உத்தி, நிதி சுமையைக் குறைக்கவும்',
          totalDebt: 500000, // Partial loan
        },
      },
      {
        id: 'D',
        text: 'Drop plan → avoid over-debt completely',
        textTa: 'திட்டத்தை கைவிடவும் → அதிக கடனை முற்றிலும் தவிர்க்கவும்',
        financialImpact: {
          description: 'Focus on current financial stability',
          descriptionTa: 'தற்போதைய நிதி ஸ்திரத்தன்மையில் கவனம் செலுத்தவும்',
        },
      },
    ],
  },
  {
    step: 5,
    title: 'Step 5: After 18 Months - Family Emergency',
    titleTa: 'படி 5: 18 மாதங்களுக்குப் பிறகு - குடும்ப அவசரநிலை',
    scenario: 'Family emergency requires ₹3,00,000 immediately',
    scenarioTa: 'குடும்ப அவசரநிலைக்கு உடனடியாக ₹3,00,000 தேவை',
    context: 'Emergency Fund Needed: ₹3,00,000',
    contextTa: 'அவசரகால நிதி தேவை: ₹3,00,000',
    options: [
      {
        id: 'A',
        text: 'Pause loan repayment temporarily',
        textTa: 'கடன் திருப்பிச் செலுத்துதலை தற்காலிகமாக நிறுத்தவும்',
        financialImpact: {
          description: 'Handle emergency, negotiate with bank',
          descriptionTa: 'அவசரநிலையை சமாளிக்கவும், வங்கியுடன் பேச்சுவார்த்தை நடத்தவும்',
        },
      },
      {
        id: 'B',
        text: 'Borrow extra from bank (18% annual interest)',
        textTa: 'வங்கியிலிருந்து கூடுதலாகக் கடன் வாங்கவும் (18% ஆண்டு வட்டி)',
        financialImpact: {
          description: 'High interest personal loan, increases debt burden',
          descriptionTa: 'உயர் வட்டி தனிநபர் கடன், கடன் சுமையை அதிகரிக்கிறது',
          totalDebt: 300000,
        },
        isDeadEnd: false, // Expensive but might be necessary
      },
      {
        id: 'C',
        text: 'Use savings/investments for emergency',
        textTa: 'அவசரநிலைக்காக சேமிப்பு/முதலீடுகளை பயன்படுத்தவும்',
        financialImpact: {
          description: 'Best use of emergency fund, no additional debt',
          descriptionTa: 'அவசரகால நிதியின் சிறந்த பயன்பாடு, கூடுதல் கடன் இல்லை',
          savings: -300000,
        },
      },
      {
        id: 'D',
        text: 'Ask bank for temporary repayment reduction',
        textTa: 'தற்காலிக திருப்பிச் செலுத்துதல் குறைப்புக்காக வங்கியிடம் கேட்கவும்',
        financialImpact: {
          description: 'Negotiate better terms, maintain loan account',
          descriptionTa: 'சிறந்த நிபந்தனைகளை பேச்சுவார்த்தை செய்யவும், கடன் கணக்கை பராமரிக்கவும்',
        },
      },
    ],
  },
];

export const TOTAL_STEPS = GAME_STEPS.length;
