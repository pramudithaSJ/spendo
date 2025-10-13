import { GameStep } from './gameTypes';

// Investment Management Game - Scenario 2
export const GAME2_PROFILE = {
  age: 25,
  salary: 100000,
  savings: 2000000,
  ageEn: 'Age: 25',
  ageTa: 'வயது: 25',
  salaryEn: 'Salary: Rs 1,00,000/month',
  salaryTa: 'சம்பளம்: Rs 1,00,000/மாதம்',
  savingsEn: 'Savings: Rs 20,00,000',
  savingsTa: 'சேமிப்பு: Rs 20,00,000',
};

export const GAME2_STEPS: GameStep[] = [
  {
    step: 1,
    title: 'Step 1: Choosing First Investment',
    titleTa: 'படி 1: முதல் முதலீட்டைத் தேர்வு செய்தல்',
    scenario: 'You have Rs 20,00,000 in savings. How would you like to invest?',
    scenarioTa: 'உங்களிடம் Rs 20,00,000 சேமிப்பு உள்ளது. நீங்கள் எவ்வாறு முதலீடு செய்ய விரும்புகிறீர்கள்?',
    context: 'Salary: Rs 1,00,000/month | Total Savings: Rs 20,00,000',
    contextTa: 'சம்பளம்: Rs 1,00,000/மாதம் | மொத்த சேமிப்பு: Rs 20,00,000',
    options: [
      {
        id: 'A',
        text: 'A)Invest all savings in 5-year Fixed Deposit',
        textTa: 'A) பழமைவாத அணுகுமுறை - அனைத்து சேமிப்பையும் 5 ஆண்டு நிலையான வைப்புத்தொகையில் முதலீடு செய்யவும்',
      },
      {
        id: 'B',
        text: 'B)20% CSE, 20% Money Market, 30% Land, 30% Bank Savings',
        textTa: 'B) பன்முகப்படுத்தப்பட்ட போர்ட்ஃபோலியோ - 20% CSE, 20% பண சந்தை, 30% நிலம், 30% வங்கி சேமிப்பு',
      },
      {
        id: 'C',
        text: 'C) 20% CSE, 40% FD, 10% Savings, 30% Treasury Bond',
        textTa: 'C) சமநிலை போர்ட்ஃபோலியோ - 20% CSE, 40% FD, 10% சேமிப்பு, 30% கருவூல பத்திரம்',
      },
      {
        id: 'D',
        text: 'D) Invest all savings in CSE',
        textTa: 'D) ஆக்கிரமிப்பு அணுகுமுறை - அனைத்து சேமிப்பையும் CSE இல் முதலீடு செய்யவும்',
      },
    ],
  },
  {
    step: 2,
    title: 'Step 2: Economic Crisis - Share Market Crashed',
    titleTa: 'படி 2: பொருளாதார நெருக்கடி - பங்குச் சந்தை வீழ்ச்சி',
    scenario: 'Due to an economic crisis, the Share Market crashed and the value of shares has gone down to 20%',
    scenarioTa: 'பொருளாதார நெருக்கடி காரணமாக, பங்குச் சந்தை வீழ்ந்தது மற்றும் பங்குகளின் மதிப்பு 20% ஆக குறைந்துள்ளது',
    context: 'Your CSE investments have dropped to 20% of their original value',
    contextTa: 'உங்கள் CSE முதலீடுகள் அவற்றின் அசல் மதிப்பில் 20% ஆக குறைந்துள்ளன',
    options: [
      {
        id: 'A',
        text: 'A) Sell all shares and invest in savings account',
        textTa: 'A) வெளியேறும் உத்தி - அனைத்து பங்குகளையும் விற்று சேமிப்பு கணக்கில் முதலீடு செய்யவும்',
      },
      {
        id: 'B',
        text: 'B)  Sell 50% of shares and deposit in savings account',
        textTa: 'B) பகுதி வெளியேற்றம் - 50% பங்குகளை விற்று சேமிப்பு கணக்கில் டெபாசிட் செய்யவும்',
      },
      {
        id: 'C',
        text: 'C)Keep the investment unchanged',
        textTa: 'C) நிலையை பராமரிக்கவும் - முதலீட்டை மாற்றமில்லாமல் வைத்திருக்கவும்',
      },
      {
        id: 'D',
        text: 'D)  Buy shares worth Rs. 1,00,000 in AAA graded company',
        textTa: 'D) வீழ்ச்சியில் வாங்கவும் - AAA தரமதிப்பீடு நிறுவனத்தில் Rs. 1,00,000 பங்குகளை வாங்கவும்',
      },
    ],
  },
  {
    step: 3,
    title: 'Step 3: Financial Crisis - Bank Collapsed',
    titleTa: 'படி 3: நிதி நெருக்கடி - வங்கி வீழ்ச்சி',
    scenario: 'Due to a financial crisis, your bank has faced liquidity issues and collapsed',
    scenarioTa: 'நிதி நெருக்கடி காரணமாக, உங்கள் வங்கி பணப்புழக்கச் சிக்கல்களை எதிர்கொண்டு வீழ்ந்தது',
    context: 'You can get eligible amount from CBSL liquidity support scheme (up to Rs 10,00,000)',
    contextTa: 'நீங்கள் CBSL பணப்புழக்க ஆதரவு திட்டத்திலிருந்து தகுதியான தொகையைப் பெறலாம் (Rs 10,00,000 வரை)',
    options: [
      {
        id: 'A',
        text: 'A) Safe Fixed Income - Get CBSL amount and invest in bank FD for 5 years',
        textTa: 'A) பாதுகாப்பான நிலையான வருமானம் - CBSL தொகையைப் பெற்று 5 ஆண்டு வங்கி FD இல் முதலீடு செய்யவும்',
      },
      {
        id: 'B',
        text: 'B) Equity Investment - Get CBSL amount and invest in CSE',
        textTa: 'B) பங்கு முதலீடு - CBSL தொகையைப் பெற்று CSE இல் முதலீடு செய்யவும்',
      },
      {
        id: 'C',
        text: 'C) Real Estate - Get CBSL amount and purchase land',
        textTa: 'C) ரியல் எஸ்டேட் - CBSL தொகையைப் பெற்று நிலம் வாங்கவும்',
      },
      {
        id: 'D',
        text: 'D) Liquid Savings - Get CBSL amount and deposit in savings account',
        textTa: 'D) திரவ சேமிப்பு - CBSL தொகையைப் பெற்று சேமிப்பு கணக்கில் டெபாசிட் செய்யவும்',
      },
    ],
  },
  {
    step: 4,
    title: 'Step 4: Emergency Expense After 2 Years',
    titleTa: 'படி 4: 2 ஆண்டுகளுக்குப் பிறகு அவசர செலவு',
    scenario: 'An emergency expense of Rs. 500,000 arises after 2 years. Based on your investment decisions, do you have enough balance?',
    scenarioTa: '2 ஆண்டுகளுக்குப் பிறகு Rs. 500,000 அவசர செலவு ஏற்படுகிறது. உங்கள் முதலீட்டு முடிவுகளின் அடிப்படையில், உங்களிடம் போதுமான இருப்பு உள்ளதா?',
    context: 'Required: Rs. 500,000 | Calculate your portfolio value based on Steps 1-3',
    contextTa: 'தேவை: Rs. 500,000 | படி 1-3 இன் அடிப்படையில் உங்கள் போர்ட்ஃபோலியோ மதிப்பைக் கணக்கிடுங்கள்',
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

export const GAME2_TOTAL_STEPS = 4; // 4 total steps (3 decision + 1 final assessment)
