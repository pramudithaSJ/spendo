import { GameStep } from './gameTypes';

// Student Loan Management Game - Hardcoded Scenario Data
export const GAME_PROFILE = {
  age: 24,
  studentLoan: 1200000,
  startingSalary: 70000,
  ageEn: 'Age: 24',
  ageTa: 'வயது: 24',
  loanEn: 'Student Loan: Rs 12,00,000',
  loanTa: 'கல்விக் கடன்: Rs 12,00,000',
  salaryEn: 'Starting Salary: Rs 70,000/month',
  salaryTa: 'தொடக்க சம்பளம்: Rs 70,000/மாதம்',
};

export const GAME_STEPS: GameStep[] = [
  {
    step: 1,
    title: 'Step 1: Choose Repayment Plan',
    titleTa: 'படி 1: திருப்பிச் செலுத்தும் திட்டத்தைத் தேர்ந்தெடுங்கள்',
    scenario: 'Grace period ending → must start repayment',
    scenarioTa: 'கருணைக் காலம் முடிவடைகிறது → திருப்பிச் செலுத்த வேண்டும்',
    context: 'Current Salary: Rs 70,000/month | Student Loan: Rs 12,00,000',
    contextTa: 'தற்போதைய சம்பளம்: Rs 70,000/மாதம் | கல்விக் கடன்: Rs 12,00,000',
    options: [
      {
        id: 'A',
        text: 'Standard Plan: Rs 25,000/month (5 years)',
        textTa: 'நிலையான திட்டம்: Rs 25,000/மாதம் (5 ஆண்டுகள்)',
      },
      {
        id: 'B',
        text: 'Extended Plan: Rs 15,000/month (10 years)',
        textTa: 'நீட்டிக்கப்பட்ட திட்டம்: Rs 15,000/மாதம் (10 ஆண்டுகள்)',
      },
      {
        id: 'C',
        text: 'Extended Plan: Rs 11,000/month (20 years)',
        textTa: 'நீட்டிக்கப்பட்ட திட்டம்: Rs 11,000/மாதம் (20 ஆண்டுகள்)',
      },
    ],
  },
  {
    step: 2,
    title: 'Step 2: After 6 Months - Salary Hike to Rs 100,000',
    titleTa: 'படி 2: 6 மாதங்களுக்குப் பிறகு - சம்பளம் Rs 100,000 ஆக உயர்வு',
    scenario: 'Your salary has increased to Rs 100,000 per month',
    scenarioTa: 'உங்கள் சம்பளம் மாதம் Rs 1,00,000 ஆக அதிகரித்துள்ளது',
    context: 'New Salary: Rs 1,00,000/month | Extra Income: Rs 30,000/month',
    contextTa: 'புதிய சம்பளம்: Rs 1,00,000/மாதம் | கூடுதல் வருமானம்: Rs 30,000/மாதம்',
    options: [
      {
        id: 'A',
        text: 'Keep repayment same, save extra amount',
        textTa: 'திருப்பிச் செலுத்துதலை அப்படியே வைத்து, கூடுதல் தொகையைச் சேமிக்கவும்',
      },
      {
        id: 'B',
        text: 'Increase repayment to finish early (~Rs 40,000) & Save the remaining balance',
        textTa: 'முன்கூட்டியே முடிக்க திருப்பிச் செலுத்துதலை அதிகரிக்கவும் (~Rs 40,000) & மீதமுள்ளதைச் சேமிக்கவும்',
      },
      {
        id: 'C',
        text: 'Invest extra in 15 years invest Plan at a rate of 12%',
        textTa: '15 ஆண்டு முதலீட்டுத் திட்டத்தில் 12% வட்டியில் கூடுதல் முதலீடு செய்யவும்',
      },
      {
        id: 'D',
        text: 'Keep minimum repayment, increase lifestyle spending',
        textTa: 'குறைந்தபட்ச திருப்பிச் செலுத்துதலை வைத்து, வாழ்க்கை முறை செலவை அதிகரிக்கவும்',
      },
    ],
  },
  {
    step: 3,
    title: 'Step 3: After 1 Year - Inflation Impact',
    titleTa: 'படி 3: 1 ஆண்டுக்குப் பிறகு - பணவீக்க தாக்கம்',
    scenario: 'Due to inflation, living expenses increased by 7-10%',
    scenarioTa: 'பணவீக்கம் காரணமாக, வாழ்க்கைச் செலவுகள் 7-10% அதிகரித்துள்ளன',
    context: 'Monthly Expenses Increased: ~Rs 5,000-7,000 more',
    contextTa: 'மாதாந்திர செலவுகள் அதிகரிப்பு: ~Rs 5,000-7,000 அதிகம்',
    options: [
      {
        id: 'A',
        text: 'Stick to plan, cut non-essential expenses',
        textTa: 'திட்டத்தில் நிலைத்திருங்கள், தேவையற்ற செலவுகளைக் குறைக்கவும்',
      },
      {
        id: 'B',
        text: 'Get an advance salary of Rs.100,000 for 10 months at equal monthly installments',
        textTa: 'Rs.100,000 முன்கூட்டிய சம்பளம் 10 மாதங்களுக்கு சம மாதாந்திர தவணைகளில்',
      },
      {
        id: 'C',
        text: 'Skip one month payment',
        textTa: 'ஒரு மாத கட்டணத்தைத் தவிர்க்கவும்',
        isDeadEnd: true,
        deadEndReason: 'Skipping payments damages credit score and adds penalties. This leads to a debt spiral.',
        deadEndReasonTa: 'கட்டணங்களைத் தவிர்ப்பது கடன் மதிப்பெண்ணை சேதப்படுத்துகிறது மற்றும் அபராதங்களைச் சேர்க்கிறது. இது கடன் சுழலுக்கு வழிவகுக்கிறது.',
      },
      {
        id: 'D',
        text: 'Take new credit card to cover shortfall',
        textTa: 'பற்றாக்குறையை சரிசெய்ய புதிய கடன் அட்டை எடுக்கவும்',
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
    context: 'Masters Program Cost: Rs 20,00,000',
    contextTa: 'முதுகலை திட்ட செலவு: Rs 20,00,000',
    options: [
      {
        id: 'A',
        text: 'Take new loan Rs. 20,00,000 new installments',
        textTa: 'புதிய தவணைகளுடன் Rs. 20,00,000 புதிய கடன் எடுக்கவும்',
      },
      {
        id: 'B',
        text: 'Delay Master\'s until current loan is finished',
        textTa: 'தற்போதைய கடன் முடியும் வரை முதுகலையை தாமதப்படுத்தவும்',
      },
      {
        id: 'C',
        text: 'Seek scholarship → minimize loan',
        textTa: 'உதவித்தொகை தேடவும் → கடன் தொகையைக் குறைக்கவும்',
      },
      {
        id: 'D',
        text: 'Drop plan → avoid over-debt completely',
        textTa: 'திட்டத்தை கைவிடவும் → அதிக கடனை முற்றிலும் தவிர்க்கவும்',
      },
    ],
  },
  {
    step: 5,
    title: 'Step 5: Family Emergency After 18 Months',
    titleTa: 'படி 5: 18 மாதங்களுக்குப் பிறகு குடும்ப அவசரநிலை',
    scenario: 'A family emergency requiring Rs. 300,000 arises after 18 months. Based on your financial decisions, do you have enough balance?',
    scenarioTa: '18 மாதங்களுக்குப் பிறகு Rs. 300,000 தேவைப்படும் குடும்ப அவசரநிலை ஏற்படுகிறது. உங்கள் நிதி முடிவுகளின் அடிப்படையில், உங்களிடம் போதுமான இருப்பு உள்ளதா?',
    context: 'Required: Rs. 300,000 | Calculate your savings based on Steps 1-4',
    contextTa: 'தேவை: Rs. 300,000 | படி 1-4 இன் அடிப்படையில் உங்கள் சேமிப்பைக் கணக்கிடுங்கள்',
    options: [
      {
        id: 'A',
        text: 'A) Yes, I have enough balance to attend the emergency',
        textTa: 'A) ஆம், அவசரநிலையை சந்திக்க எனக்கு போதுமான இருப்பு உள்ளது',
      },
      {
        id: 'B',
        text: 'B) No, I don\'t have enough balance to attend the emergency',
        textTa: 'B) இல்லை, அவசரநிலையை சந்திக்க எனக்கு போதுமான இருப்பு இல்லை',
      },
    ],
  },
];

export const TOTAL_STEPS = 5; // 5 steps total (4 decision + 1 final assessment)
