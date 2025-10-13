import { GameStep } from './gameTypes';

// Expense Management Game - Scenario 3
export const GAME3_PROFILE = {
  age: 25,
  salary: 95000,
  savings: 20000,
  essentialExpenses: 60000,
  surplus: 35000,
  ageEn: 'Age: 25',
  ageTa: 'வயது: 25',
  salaryEn: 'Salary: Rs 95,000/month',
  salaryTa: 'சம்பளம்: Rs 95,000/மாதம்',
  savingsEn: 'Current Savings: Rs 20,000',
  savingsTa: 'தற்போதைய சேமிப்பு: Rs 20,000',
  expensesEn: 'Monthly Expenses: Rs 60,000',
  expensesTa: 'மாதாந்திர செலவுகள்: Rs 60,000',
};

export const GAME3_STEPS: GameStep[] = [
  {
    step: 1,
    title: 'Step 1: First Salary Budgeting',
    titleTa: 'படி 1: முதல் சம்பள பட்ஜெட்',
    scenario: 'After expenses of Rs. 60,000, you have Rs. 35,000 left. How will you allocate?',
    scenarioTa: 'Rs. 60,000 செலவுகளுக்குப் பிறகு, உங்களிடம் Rs. 35,000 உள்ளது. நீங்கள் எவ்வாறு ஒதுக்குவீர்கள்?',
    context: 'Monthly Surplus: Rs. 35,000 | No loans or debt',
    contextTa: 'மாதாந்திர உபரி: Rs. 35,000 | கடன்கள் இல்லை',
    options: [
      {
        id: 'A',
        text: 'A) Balanced Approach - Rs. 15,000 savings + Rs. 10,000 investments (10% interest) + Rs. 10,000 Medical Insurance',
        textTa: 'A) சமநிலை அணுகுமுறை - Rs. 15,000 சேமிப்பு + Rs. 10,000 முதலீடு (10% வட்டி) + Rs. 10,000 மருத்துவ காப்பீடு',
      },
      {
        id: 'B',
        text: 'B) Lifestyle Priority - Rs. 25,000 leisure + Rs. 10,000 savings',
        textTa: 'B) வாழ்க்கை முறை முன்னுரிமை - Rs. 25,000 ஓய்வு + Rs. 10,000 சேமிப்பு',
      },
      {
        id: 'C',
        text: 'C) Long-term Investment Focus - Invest full Rs. 35,000 in investment plan (10% interest, 10 years fixed)',
        textTa: 'C) நீண்ட கால முதலீட்டு கவனம் - முழு Rs. 35,000 முதலீட்டு திட்டத்தில் (10% வட்டி, 10 ஆண்டு நிலையானது)',
      },
    ],
  },
  {
    step: 2,
    title: 'Step 2: Purchase of Brand New iPhone at Discounted Price',
    titleTa: 'படி 2: தள்ளுபடி விலையில் புதிய iPhone வாங்குதல்',
    scenario: 'You have a chance to buy a brand-new Apple iPhone worth Rs. 400,000 for discounted price of Rs. 250,000',
    scenarioTa: 'Rs. 400,000 மதிப்புள்ள புதிய Apple iPhone ஐ Rs. 250,000 தள்ளுபடி விலையில் வாங்க வாய்ப்பு',
    context: 'Market Value: Rs. 400,000 | Discounted Price: Rs. 250,000',
    contextTa: 'சந்தை மதிப்பு: Rs. 400,000 | தள்ளுபடி விலை: Rs. 250,000',
    options: [
      {
        id: 'A',
        text: 'A) Skip the Purchase - Use the current mobile phone',
        textTa: 'A) வாங்குதலைத் தவிர்க்கவும் - தற்போதைய மொபைல் போனைப் பயன்படுத்தவும்',
      },
      {
        id: 'B',
        text: 'B) Save and Buy Later - Save Rs. 15,000 until you can afford the phone',
        textTa: 'B) சேமித்து பின்னர் வாங்கவும் - போன் வாங்க முடியும் வரை Rs. 15,000 சேமிக்கவும்',
      },
      {
        id: 'C',
        text: 'C) Borrow from Friend - Purchase now, pay Rs. 300,000 after 2 years (Rs. 250,000 + Rs. 50,000 extra)',
        textTa: 'C) நண்பரிடமிருந்து கடன் வாங்கவும் - இப்போது வாங்கவும், 2 ஆண்டுகளுக்குப் பிறகு Rs. 300,000 செலுத்தவும்',
      },
      {
        id: 'D',
        text: 'D) Credit Card Installment - 24-month plan with 16% interest rate (~Rs. 12,368/month)',
        textTa: 'D) கிரெடிட் கார்டு தவணை - 24 மாத திட்டம் 16% வட்டி (~Rs. 12,368/மாதம்)',
      },
    ],
  },
  {
    step: 3,
    title: 'Step 3: Lifestyle Temptation - Overseas Trip',
    titleTa: 'படி 3: வாழ்க்கை முறை சோதனை - வெளிநாட்டு பயணம்',
    scenario: 'Your friends plan an overseas trip costing Rs. 200,000. What do you do?',
    scenarioTa: 'உங்கள் நண்பர்கள் Rs. 200,000 செலவில் வெளிநாட்டு பயணத்தை திட்டமிடுகிறார்கள். நீங்கள் என்ன செய்வீர்கள்?',
    context: 'Trip Cost: Rs. 200,000 | Decision required',
    contextTa: 'பயண செலவு: Rs. 200,000 | முடிவு தேவை',
    options: [
      {
        id: 'A',
        text: 'A) Skip now, save specifically for a trip later',
        textTa: 'A) தாமதமான திருப்தி - இப்போது தவிர்க்கவும், பின்னர் பயணத்திற்காக சேமிக்கவும்',
      },
      {
        id: 'B',
        text: 'B) Join using credit card or borrowed money',
        textTa: 'B) கிரெடிட் கார்டு / கடன் வாங்குதல் - கிரெடிட் கார்டு அல்லது கடன் பணத்தைப் பயன்படுத்தி சேரவும்',
      },
      {
        id: 'C',
        text: 'C) Use current savings + borrow remaining amount',
        textTa: 'C) கலப்பு அணுகுமுறை - தற்போதைய சேமிப்பு + மீதமுள்ள தொகையை கடன் வாங்கவும்',
      },
      {
        id: 'D',
        text: 'D) Plan a cheaper local trip instead with Rs. 20,000 from savings',
        textTa: 'D) பட்ஜெட் மாற்று - சேமிப்பிலிருந்து Rs. 20,000 உடன் மலிவான உள்ளூர் பயணத்தை திட்டமிடவும்',
      },
    ],
  },
  {
    step: 4,
    title: 'Step 4: Family Emergency After 36 Months',
    titleTa: 'படி 4: 36 மாதங்களுக்குப் பிறகு குடும்ப அவசரநிலை',
    scenario: 'A family emergency requiring Rs. 500,000 arises after 3 years (36 months). Based on your financial decisions, do you have enough balance?',
    scenarioTa: '3 ஆண்டுகளுக்குப் பிறகு (36 மாதங்கள்) Rs. 500,000 தேவைப்படும் குடும்ப அவசரநிலை ஏற்படுகிறது. உங்கள் நிதி முடிவுகளின் அடிப்படையில், உங்களிடம் போதுமான இருப்பு உள்ளதா?',
    context: 'Required: Rs. 500,000 | Calculate your savings based on Steps 1-3',
    contextTa: 'தேவை: Rs. 500,000 | படி 1-3 இன் அடிப்படையில் உங்கள் சேமிப்பைக் கணக்கிடுங்கள்',
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

export const GAME3_TOTAL_STEPS = 4; // 4 total steps (3 decision + 1 final assessment)
