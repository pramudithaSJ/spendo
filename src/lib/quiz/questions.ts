import { QuizDefinition } from './types';

export const financialLiteracyQuiz: QuizDefinition = {
  id: 'financial-literacy-v1',
  title: {
    en: 'Financial Literacy Quiz',
    si: 'මූල්‍ය සාක්‍ෂරතා ප්‍රශ්නාවලිය',
    ta: 'நிதி அறிவுத் தேர்வு',
  },
  questions: [
    // Q1: Savings
    {
      id: 'q1',
      question: {
        en: 'What is the recommended minimum percentage of income you should save each month?',
        si: 'සෑම මසකම ඔබ ඉතිරි කළ යුතු ආදායමේ නිර්දේශිත අවම ප්‍රතිශතය කොපමණද?',
        ta: 'ஒவ்வொரு மாதமும் நீங்கள் சேமிக்க வேண்டிய குறைந்தபட்ச வருமானச் சதவீதம் என்ன?',
      },
      options: [
        { label: 'A', text: { en: '5%', si: '5%', ta: '5%' } },
        { label: 'B', text: { en: '10%', si: '10%', ta: '10%' } },
        { label: 'C', text: { en: '20%', si: '20%', ta: '20%' } },
        { label: 'D', text: { en: '50%', si: '50%', ta: '50%' } },
      ],
      correctOption: 'C',
      explanation: {
        en: 'Financial experts recommend saving at least 20% of your income each month to build a solid financial future.',
        si: 'ශක්තිමත් මූල්‍ය අනාගතයක් ගොඩනැගීමට සෑම මසකම ඔබේ ආදායමෙන් අවම වශයෙන් 20% ඉතිරි කිරීමට මූල්‍ය විශේෂඥයන් නිර්දේශ කරයි.',
        ta: 'உறுதியான நிதி எதிர்காலத்தை உருவாக்க ஒவ்வொரு மாதமும் உங்கள் வருமானத்தில் குறைந்தது 20% சேமிக்க நிதி நிபுணர்கள் பரிந்துரைக்கின்றனர்.',
      },
    },
    // Q2: 50/30/20 Budgeting Rule
    {
      id: 'q2',
      question: {
        en: 'In the 50/30/20 budgeting rule, what does the "30" represent?',
        si: '50/30/20 අයවැය රීතියේ "30" නියෝජනය කරන්නේ කුමක්ද?',
        ta: '50/30/20 பட்ஜெட் விதியில் "30" என்பது எதை குறிக்கிறது?',
      },
      options: [
        { label: 'A', text: { en: 'Needs (rent, food, bills)', si: 'අවශ්‍යතා (කුලිය, ආහාර, බිල්)', ta: 'தேவைகள் (வாடகை, உணவு, கட்டணங்கள்)' } },
        { label: 'B', text: { en: 'Savings and investments', si: 'ඉතිරිකිරීම් සහ ආයෝජන', ta: 'சேமிப்பு மற்றும் முதலீடுகள்' } },
        { label: 'C', text: { en: 'Wants (entertainment, dining out)', si: 'ආශාවන් (විනෝදාස්වාදය, ආහාරාගාර)', ta: 'விருப்பங்கள் (பொழுதுபோக்கு, வெளியே சாப்பிடுவது)' } },
        { label: 'D', text: { en: 'Debt repayment', si: 'ණය ගෙවීම', ta: 'கடன் திருப்பிச் செலுத்துதல்' } },
      ],
      correctOption: 'C',
      explanation: {
        en: 'In the 50/30/20 rule: 50% goes to needs, 30% to wants (lifestyle choices), and 20% to savings/debt repayment.',
        si: '50/30/20 රීතියෙහි: 50% අවශ්‍යතාවන්ට, 30% ආශාවන්ට (ජීවන රටා තේරීම්), 20% ඉතිරිකිරීම්/ණය ගෙවීමට.',
        ta: '50/30/20 விதியில்: 50% தேவைகளுக்கு, 30% விருப்பங்களுக்கு (வாழ்க்கை முறை தேர்வுகள்), 20% சேமிப்பு/கடன் திருப்பிச் செலுத்துதலுக்கு.',
      },
    },
    // Q3: Compound Interest
    {
      id: 'q3',
      question: {
        en: 'Compound interest means you earn interest on:',
        si: 'සංයෝජිත පොළිය යනු ඔබ පොළිය උපයන්නේ:',
        ta: 'கூட்டு வட்டி என்பது நீங்கள் வட்டி சம்பாதிப்பது:',
      },
      options: [
        { label: 'A', text: { en: 'Only your original deposit', si: 'ඔබේ මුල් තැන්පතුව පමණක්', ta: 'உங்கள் அசல் வைப்பு மட்டுமே' } },
        { label: 'B', text: { en: 'Your deposit plus previously earned interest', si: 'ඔබේ තැන්පතුව සහ කලින් උපයා ගත් පොළිය', ta: 'உங்கள் வைப்பு மற்றும் முன்பு சம்பாதித்த வட்டி' } },
        { label: 'C', text: { en: 'Only the bank\'s profits', si: 'බැංකුවේ ලාභ පමණක්', ta: 'வங்கியின் லாபம் மட்டுமே' } },
        { label: 'D', text: { en: 'A fixed amount each year', si: 'සෑම වර්ෂයකම නියත මුදලක්', ta: 'ஒவ்வொரு ஆண்டும் ஒரு நிலையான தொகை' } },
      ],
      correctOption: 'B',
      explanation: {
        en: 'Compound interest grows faster because you earn interest on both your principal AND previously earned interest — making your money grow exponentially over time.',
        si: 'සංයෝජිත පොළිය වේගයෙන් වර්ධනය වන්නේ ඔබ ඔබේ මූල ධනය සහ කලින් උපයා ගත් පොළිය දෙකෙහිම පොළිය උපයන නිසාය.',
        ta: 'கூட்டு வட்டி வேகமாக வளர்கிறது, ஏனெனில் நீங்கள் உங்கள் அசல் மற்றும் முன்பு சம்பாதித்த வட்டி இரண்டிலும் வட்டி சம்பாதிக்கிறீர்கள்.',
      },
    },
    // Q4: Inflation
    {
      id: 'q4',
      question: {
        en: 'If inflation rate is higher than your savings interest rate, what happens to your money\'s purchasing power?',
        si: 'උද්ධමනය ඔබේ ඉතිරිකිරීම් පොළිය අනුපාතයට වඩා වැඩි නම්, ඔබේ මුදලේ ක්‍රය ශක්තිය ගැන කුමක් සිදු වේද?',
        ta: 'பணவீக்க விகிதம் உங்கள் சேமிப்பு வட்டி விகிதத்தை விட அதிகமாக இருந்தால், உங்கள் பணத்தின் கொள்முதல் சக்திக்கு என்ன ஆகும்?',
      },
      options: [
        { label: 'A', text: { en: 'It increases', si: 'එය වැඩි වේ', ta: 'அது அதிகரிக்கிறது' } },
        { label: 'B', text: { en: 'It stays the same', si: 'එය එලෙසම රැඳේ', ta: 'அது அப்படியே இருக்கும்' } },
        { label: 'C', text: { en: 'It decreases', si: 'එය අඩු වේ', ta: 'அது குறைகிறது' } },
        { label: 'D', text: { en: 'It doubles', si: 'එය දෙගුණ වේ', ta: 'அது இரட்டிப்பாகும்' } },
      ],
      correctOption: 'C',
      explanation: {
        en: 'When inflation exceeds your savings rate, your money loses purchasing power — meaning the same amount of money buys less goods and services over time.',
        si: 'උද්ධමනය ඔබේ ඉතිරිකිරීම් අනුපාතය ඉක්මවා යන විට, ඔබේ මුදල් ක්‍රය ශක්තිය නැති කරයි.',
        ta: 'பணவீக்கம் உங்கள் சேமிப்பு விகிதத்தை மீறும்போது, உங்கள் பணம் கொள்முதல் சக்தியை இழக்கிறது.',
      },
    },
    // Q5: Insurance
    {
      id: 'q5',
      question: {
        en: 'What is the primary purpose of buying insurance?',
        si: 'රක්‍ෂණය ගැනීමේ ප්‍රාථමික අරමුණ කුමක්ද?',
        ta: 'காப்பீடு வாங்குவதன் முதன்மை நோக்கம் என்ன?',
      },
      options: [
        { label: 'A', text: { en: 'To make a profit', si: 'ලාභ ඉපැයීමට', ta: 'லாபம் சம்பாதிக்க' } },
        { label: 'B', text: { en: 'To transfer financial risk to an insurer', si: 'රක්‍ෂකවරයෙකුට මූල්‍ය අවදානම මාරු කිරීමට', ta: 'நிதி அபாயத்தை காப்பீட்டாளருக்கு மாற்ற' } },
        { label: 'C', text: { en: 'To avoid paying taxes', si: 'බදු ගෙවීමෙන් වැළකීමට', ta: 'வரி செலுத்துவதை தவிர்க்க' } },
        { label: 'D', text: { en: 'To keep money in a bank', si: 'බැංකුවේ මුදල් තබා ගැනීමට', ta: 'வங்கியில் பணம் வைக்க' } },
      ],
      correctOption: 'B',
      explanation: {
        en: 'Insurance transfers financial risk from you to the insurer. You pay a small premium so the insurer covers large, unexpected costs (medical bills, accidents, etc.).',
        si: 'රක්‍ෂණය ඔබෙන් රක්‍ෂකවරයාට මූල්‍ය අවදානම මාරු කරයි. ඔබ කුඩා වාරිකයක් ගෙවන්නේ රක්‍ෂකවරයා විශාල, අනපේක්ෂිත පිරිවැය ආවරණය කිරීමටය.',
        ta: 'காப்பீடு உங்களிடமிருந்து காப்பீட்டாளருக்கு நிதி அபாயத்தை மாற்றுகிறது. பெரிய, எதிர்பாராத செலவுகளை காப்பீட்டாளர் ஏற்க நீங்கள் சிறிய பிரீமியம் செலுத்துகிறீர்கள்.',
      },
    },
    // Q6: Debit vs Credit
    {
      id: 'q6',
      question: {
        en: 'What is the key difference between a debit card and a credit card?',
        si: 'ඩෙබිට් කාඩ්පතක් සහ ක්‍රෙඩිට් කාඩ්පතක් අතර ප්‍රධාන වෙනස කුමක්ද?',
        ta: 'டெபிட் கார்டிற்கும் கிரெடிட் கார்டிற்கும் இடையே முக்கிய வித்தியாசம் என்ன?',
      },
      options: [
        { label: 'A', text: { en: 'Debit cards charge higher fees', si: 'ඩෙබිට් කාඩ් ඉහළ ගාස්තු අය කරයි', ta: 'டெபிட் கார்டுகள் அதிக கட்டணங்களை வசூலிக்கின்றன' } },
        { label: 'B', text: { en: 'Debit cards use your own money; credit cards borrow money', si: 'ඩෙබිට් කාඩ් ඔබේ මුදල් භාවිතා කරයි; ක්‍රෙඩිට් කාඩ් මුදල් ණයට ගනී', ta: 'டெபிட் கார்டுகள் உங்கள் சொந்த பணத்தை பயன்படுத்துகின்றன; கிரெடிட் கார்டுகள் பணம் கடன் வாங்குகின்றன' } },
        { label: 'C', text: { en: 'Credit cards are always safer', si: 'ක්‍රෙඩිට් කාඩ් සැමවිටම ආරක්‍ෂිතයි', ta: 'கிரெடிட் கார்டுகள் எப்போதும் பாதுகாப்பானவை' } },
        { label: 'D', text: { en: 'They are exactly the same', si: 'ඒවා හරියටම සමාන ය', ta: 'அவை சரியாக ஒரே மாதிரியானவை' } },
      ],
      correctOption: 'B',
      explanation: {
        en: 'A debit card deducts money directly from your bank account. A credit card lets you borrow money from the bank, which you must repay later (with interest if not paid in full).',
        si: 'ඩෙබිට් කාඩ්පතක් ඔබේ බැංකු ගිණුමෙන් සෘජුවම මුදල් අඩු කරයි. ක්‍රෙඩිට් කාඩ්පතක් ඔබට බැංකුවෙන් ණය ගැනීමට ඉඩ සලසයි.',
        ta: 'டெபிட் கார்டு உங்கள் வங்கி கணக்கிலிருந்து நேரடியாக பணத்தை கழிக்கிறது. கிரெடிட் கார்டு உங்களுக்கு வங்கியிலிருந்து பணம் கடன் வாங்க அனுமதிக்கிறது.',
      },
    },
    // Q7: Phishing / ATM Safety
    {
      id: 'q7',
      question: {
        en: 'You receive a text saying "Your bank account is locked. Click this link to verify your PIN." What should you do?',
        si: '"ඔබේ බැංකු ගිණුම අගුලු දමා ඇත. ඔබේ PIN සත්‍යාපනය කිරීමට මෙම සබැඳිය ක්ලික් කරන්න." ලෙස SMS ලැබෙයි. ඔබ කළ යුත්තේ කුමක්ද?',
        ta: '"உங்கள் வங்கி கணக்கு பூட்டப்பட்டுள்ளது. உங்கள் PIN ஐ சரிபார்க்க இந்த இணைப்பை கிளிக் செய்யுங்கள்." என்று SMS வருகிறது. நீங்கள் என்ன செய்ய வேண்டும்?',
      },
      options: [
        { label: 'A', text: { en: 'Click the link and enter your PIN', si: 'සබැඳිය ක්ලික් කර ඔබේ PIN ඇතුළත් කරන්න', ta: 'இணைப்பை கிளிக் செய்து உங்கள் PIN ஐ உள்ளிடுங்கள்' } },
        { label: 'B', text: { en: 'Forward the message to friends', si: 'පණිවිඩය මිතුරන්ට ඉදිරිපත් කරන්න', ta: 'செய்தியை நண்பர்களுக்கு அனுப்புங்கள்' } },
        { label: 'C', text: { en: 'Ignore it and call your bank\'s official number', si: 'එය නොසලකා බැංකුවේ නිල අංකයට ඇමතුම් ගන්න', ta: 'அதை புறக்கணித்து உங்கள் வங்கியின் அதிகாரப்பூர்வ எண்ணை அழைக்கவும்' } },
        { label: 'D', text: { en: 'Reply with your account number', si: 'ඔබේ ගිණුම් අංකයෙන් පිළිතුරු දෙන්න', ta: 'உங்கள் கணக்கு எண்ணுடன் பதில் அனுப்புங்கள்' } },
      ],
      correctOption: 'C',
      explanation: {
        en: 'This is a phishing scam! Banks never ask for your PIN via SMS or links. Always call the official number on the back of your card or the bank\'s website.',
        si: 'මෙය තතු තතු (phishing) වංචාවකි! බැංකු කිසි විටෙකත් SMS හෝ සබැඳි හරහා ඔබේ PIN ඉල්ලන්නේ නැත.',
        ta: 'இது ஒரு ஃபிஷிங் மோசடி! வங்கிகள் ஒருபோதும் SMS அல்லது இணைப்புகள் மூலம் உங்கள் PIN ஐ கேட்காது.',
      },
    },
    // Q8: Loan Math
    {
      id: 'q8',
      question: {
        en: 'You borrow LKR 100,000 at 12% annual interest for 1 year. How much total do you repay?',
        si: 'ඔබ 1 වර්ෂයක් සඳහා 12% වාර්ෂික පොළියට LKR 100,000ක් ණයට ගනී. ඔබ මුළු කොපමණ ගෙවයිද?',
        ta: '1 வருடத்திற்கு 12% வருடாந்திர வட்டியில் LKR 100,000 கடன் வாங்குகிறீர்கள். மொத்தம் எவ்வளவு திருப்பிச் செலுத்துவீர்கள்?',
      },
      options: [
        { label: 'A', text: { en: 'LKR 100,000', si: 'LKR 100,000', ta: 'LKR 100,000' } },
        { label: 'B', text: { en: 'LKR 106,000', si: 'LKR 106,000', ta: 'LKR 106,000' } },
        { label: 'C', text: { en: 'LKR 112,000', si: 'LKR 112,000', ta: 'LKR 112,000' } },
        { label: 'D', text: { en: 'LKR 120,000', si: 'LKR 120,000', ta: 'LKR 120,000' } },
      ],
      correctOption: 'C',
      explanation: {
        en: 'Interest = 100,000 × 12% = 12,000. Total repayment = 100,000 + 12,000 = LKR 112,000. Always calculate the true cost of a loan before borrowing.',
        si: 'පොළිය = 100,000 × 12% = 12,000. මුළු ගෙවීම = 100,000 + 12,000 = LKR 112,000.',
        ta: 'வட்டி = 100,000 × 12% = 12,000. மொத்த திருப்பிச் செலுத்துதல் = 100,000 + 12,000 = LKR 112,000.',
      },
    },
    // Q9: Diversification
    {
      id: 'q9',
      question: {
        en: 'What does "Don\'t put all your eggs in one basket" mean in investing?',
        si: 'ආයෝජනයේ "සියලු බිත්තර එක කූඩයක නොතබන්න" යන්නෙහි අදහස කුමක්ද?',
        ta: 'முதலீட்டில் "எல்லா முட்டைகளையும் ஒரே கூடையில் வைக்காதீர்கள்" என்பதன் அர்த்தம் என்ன?',
      },
      options: [
        { label: 'A', text: { en: 'Buy only one type of stock', si: 'එක් ආකාරයේ කොටස් පමණක් මිලදී ගන්න', ta: 'ஒரே வகையான பங்குகளை மட்டும் வாங்குங்கள்' } },
        { label: 'B', text: { en: 'Spread investments across different assets to reduce risk', si: 'අවදානම අඩු කිරීමට විවිධ වත්කම් හරහා ආයෝජන පැතිරීම', ta: 'ஆபத்தை குறைக்க வெவ்வேறு சொத்துக்களில் முதலீடுகளை பரப்புங்கள்' } },
        { label: 'C', text: { en: 'Keep all money in a savings account', si: 'සියලු මුදල් ඉතිරිකිරීමේ ගිණුමක තබා ගන්න', ta: 'எல்லா பணத்தையும் சேமிப்பு கணக்கில் வைத்திருங்கள்' } },
        { label: 'D', text: { en: 'Invest only in real estate', si: 'ස්ථාවර දේපල පමණක් ආයෝජනය කරන්න', ta: 'ரியல் எஸ்டேட்டில் மட்டும் முதலீடு செய்யுங்கள்' } },
      ],
      correctOption: 'B',
      explanation: {
        en: 'Diversification means spreading your investments across stocks, bonds, property, etc. If one investment loses value, others may gain, reducing your overall risk.',
        si: 'විවිධාංගීකරණය යනු ඔබේ ආයෝජන කොටස්, බැඳුම්කර, දේපල ආදිය හරහා පැතිරීමයි.',
        ta: 'பல்வகைப்படுத்தல் என்பது பங்குகள், பத்திரங்கள், சொத்து போன்றவற்றில் உங்கள் முதலீடுகளை பரப்புவதாகும்.',
      },
    },
    // Q10: Retirement
    {
      id: 'q10',
      question: {
        en: 'Why is it important to start saving for retirement as early as possible?',
        si: 'හැකි ඉක්මනින් විශ්‍රාම ඉතිරිකිරීම ආරම්භ කිරීම වැදගත් ඇයි?',
        ta: 'ஓய்வூதியத்திற்காக முதலே சேமிக்க ஆரம்பிப்பது ஏன் முக்கியம்?',
      },
      options: [
        { label: 'A', text: { en: 'Government requires it', si: 'රජය එය අවශ්‍ය කරයි', ta: 'அரசாங்கம் அதை கோருகிறது' } },
        { label: 'B', text: { en: 'Compound interest grows your money more over a longer time', si: 'සංයෝජිත පොළිය දිගු කාලයක් තුළ ඔබේ මුදල් වැඩිය', ta: 'கூட்டு வட்டி நீண்ட காலத்தில் உங்கள் பணத்தை அதிகமாக வளர்க்கிறது' } },
        { label: 'C', text: { en: 'You get a tax refund immediately', si: 'ඔබ වහාම බදු ආපසු ගෙවීමක් ලබා ගනී', ta: 'நீங்கள் உடனடியாக வரி திருப்பிச் செலுத்துதல் பெறுவீர்கள்' } },
        { label: 'D', text: { en: 'Retirement funds earn no risk', si: 'විශ්‍රාම අරමුදල් කිසිදු අවදානමක් ලබා ගන්නේ නැත', ta: 'ஓய்வூதிய நிதிகள் எந்த ஆபத்தும் இல்லாமல் சம்பாதிக்கின்றன' } },
      ],
      correctOption: 'B',
      explanation: {
        en: 'Starting early gives compound interest more time to work. Someone who starts saving at 25 will accumulate far more than someone who starts at 40 — even with the same monthly contributions.',
        si: '일찍 ආරම්භ කිරීම සංයෝජිත පොළියට වැඩ කිරීමට වැඩි කාලයක් ලබා දෙයි.',
        ta: '일찍 தொடங்குவது கூட்டு வட்டிக்கு வேலை செய்ய அதிக நேரம் கொடுக்கிறது.',
      },
    },
    // Q11: Good vs Bad Debt
    {
      id: 'q11',
      question: {
        en: 'Which of the following is an example of "good debt"?',
        si: 'පහත සඳහන් ඒවායින් "හොඳ ණය" ගේ නිදසුනක් කුමක්ද?',
        ta: 'பின்வருவனவற்றில் "நல்ல கடன்" இன் உதாரணம் எது?',
      },
      options: [
        { label: 'A', text: { en: 'Credit card debt for buying luxury clothes', si: 'සුඛෝපභෝගී ඇඳුම් මිලදී ගැනීම සඳහා ක්‍රෙඩිට් කාඩ් ණය', ta: 'ஆடம்பர ஆடைகள் வாங்க கிரெடிட் கார்டு கடன்' } },
        { label: 'B', text: { en: 'Student loan for a degree that increases earning potential', si: 'ඉපැයීමේ හැකියාව වැඩි කරන උපාධියක් සඳහා සිසු ණය', ta: 'சம்பாதிக்கும் திறனை அதிகரிக்கும் பட்டத்திற்கான மாணவர் கடன்' } },
        { label: 'C', text: { en: 'Payday loan to buy a new phone', si: 'නව දුරකථනයක් මිලදී ගැනීමට ගෙවීම් දින ණය', ta: 'புதிய தொலைபேசி வாங்க பேடே கடன்' } },
        { label: 'D', text: { en: 'Borrowing money to go on vacation', si: 'නිවාඩුවකට යාමට ණය ගැනීම', ta: 'விடுமுறைக்கு செல்ல பணம் கடன் வாங்குவது' } },
      ],
      correctOption: 'B',
      explanation: {
        en: '"Good debt" helps you build wealth or increase earning capacity (education, home mortgage). "Bad debt" is used for things that lose value quickly (luxury items, vacations).',
        si: '"හොඳ ණය" ඔබට සම්පත් ගොඩනැගීමට හෝ ඉපැයීමේ හැකියාව වැඩි කිරීමට උපකාරී වේ.',
        ta: '"நல்ல கடன்" உங்களுக்கு செல்வம் உருவாக்க அல்லது சம்பாதிக்கும் திறனை அதிகரிக்க உதவுகிறது.',
      },
    },
    // Q12: Emergency Fund
    {
      id: 'q12',
      question: {
        en: 'How many months of expenses should an emergency fund ideally cover?',
        si: 'හදිසි අරමුදලක් ආදර්ශ ලෙස කොපමණ මාස ගණනක වියදම් ආවරණය කළ යුතුද?',
        ta: 'அவசர நிதி இலட்சியமாக எத்தனை மாதங்களின் செலவுகளை உள்ளடக்க வேண்டும்?',
      },
      options: [
        { label: 'A', text: { en: '1 month', si: 'මාස 1', ta: '1 மாதம்' } },
        { label: 'B', text: { en: '2 months', si: 'මාස 2', ta: '2 மாதங்கள்' } },
        { label: 'C', text: { en: '3–6 months', si: 'මාස 3–6', ta: '3–6 மாதங்கள்' } },
        { label: 'D', text: { en: '10+ months', si: 'මාස 10+', ta: '10+ மாதங்கள்' } },
      ],
      correctOption: 'C',
      explanation: {
        en: 'Financial experts recommend keeping 3–6 months of living expenses in an easily accessible emergency fund. This protects you from job loss, medical emergencies, or unexpected bills.',
        si: 'මූල්‍ය විශේෂඥයන් පහසුවෙන් ප්‍රවේශ විය හැකි හදිසි අරමුදලක 3-6 මාසයක ජීවන වියදම් රඳවා ගැනීම නිර්දේශ කරයි.',
        ta: 'நிதி நிபுணர்கள் எளிதில் அணுகக்கூடிய அவசர நிதியில் 3-6 மாத வாழ்க்கை செலவுகளை வைத்திருக்க பரிந்துரைக்கின்றனர்.',
      },
    },
  ],
};

export const allQuizzes = [financialLiteracyQuiz];

export function getQuizById(id: string): QuizDefinition | undefined {
  return allQuizzes.find(q => q.id === id);
}
