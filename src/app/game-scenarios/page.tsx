'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Gamepad2,
  GraduationCap,
  TrendingUp,
  Car,
  Briefcase,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Scenario {
  id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  icon: React.ElementType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isAvailable: boolean;
  route: string;
}

export default function GameScenariosPage() {
  const { language, t } = useLanguage();
  const router = useRouter();

  const scenarios: Scenario[] = [
    {
      id: 'scenario-1',
      title: 'Student Loan Management',
      titleTa: 'மாணவர் கடன் மேலாண்மை',
      description: 'Navigate through student loan repayment decisions and financial challenges',
      descriptionTa: 'மாணவர் கடன் திருப்பிச் செலுத்தும் முடிவுகள் மற்றும் நிதி சவால்களை எதிர்கொள்ளுங்கள்',
      icon: GraduationCap,
      difficulty: 'beginner',
      isAvailable: true,
      route: '/game?scenario=scenario-1',
    },
    {
      id: 'scenario-2',
      title: 'Investment Management',
      titleTa: 'முதலீட்டு மேலாண்மை',
      description: 'Navigate investment decisions through economic crisis and market volatility',
      descriptionTa: 'பொருளாதார நெருக்கடி மற்றும் சந்தை ஏற்ற இறக்கத்தின் மூலம் முதலீட்டு முடிவுகளை எடுக்கவும்',
      icon: TrendingUp,
      difficulty: 'intermediate',
      isAvailable: true,
      route: '/game?scenario=scenario-2',
    },
    {
      id: 'scenario-3',
      title: 'Expense Management',
      titleTa: 'செலவு மேலாண்மை',
      description: 'Navigate budgeting decisions, lifestyle temptations, and emergency preparedness',
      descriptionTa: 'பட்ஜெட் முடிவுகள், வாழ்க்கை சோதனைகள் மற்றும் அவசர தயார்நிலையை எதிர்கொள்ளுங்கள்',
      icon: Briefcase,
      difficulty: 'beginner',
      isAvailable: true,
      route: '/game?scenario=scenario-3',
    },
    {
      id: 'scenario-4',
      title: 'Business Loan Strategy',
      titleTa: 'வணிகக் கடன் உத்தி',
      description: 'Navigate business financing decisions and growth strategies',
      descriptionTa: 'வணிக நிதியுதவி முடிவுகள் மற்றும் வளர்ச்சி உத்திகளை எதிர்கொள்ளுங்கள்',
      icon: Briefcase,
      difficulty: 'advanced',
      isAvailable: false,
      route: '/game?scenario=scenario-4',
    },
  ];

  const getDifficultyColor = (difficulty: Scenario['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-red-600 bg-red-50';
    }
  };

  const getDifficultyLabel = (difficulty: Scenario['difficulty']) => {
    if (language === 'ta') {
      switch (difficulty) {
        case 'beginner': return 'ஆரம்ப';
        case 'intermediate': return 'இடைநிலை';
        case 'advanced': return 'மேம்பட்ட';
      }
    }
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-6">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft size={16} className="mr-2" />
              {language === 'ta' ? 'திரும்பு' : 'Back'}
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ta' ? 'விளையாட்டு சூழ்நிலைகள்' : 'Game Scenarios'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'ta'
                  ? 'ஒரு சூழ்நிலையைத் தேர்ந்தெடுத்து விளையாட தொடங்குங்கள்'
                  : 'Choose a scenario to start playing'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Scenarios Grid */}
      <div className="p-4 space-y-4">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <Card
              key={scenario.id}
              className={`bg-white border-gray-200 transition-all ${
                scenario.isAvailable
                  ? 'hover:shadow-md cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => scenario.isAvailable && router.push(scenario.route)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                    scenario.isAvailable
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {scenario.isAvailable ? (
                      <Icon className="h-7 w-7" />
                    ) : (
                      <Lock className="h-7 w-7" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {language === 'ta' ? scenario.titleTa : scenario.title}
                      </h3>
                      {scenario.isAvailable && (
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {language === 'ta' ? scenario.descriptionTa : scenario.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                        {getDifficultyLabel(scenario.difficulty)}
                      </span>
                      {!scenario.isAvailable && (
                        <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                          {language === 'ta' ? 'விரைவில்' : 'Coming Soon'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="px-4 pb-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              {language === 'ta' ? 'எப்படி விளையாடுவது?' : 'How to Play?'}
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {language === 'ta' ? 'ஒரு சூழ்நிலையைத் தேர்ந்தெடுங்கள்' : 'Select a scenario to begin'}</li>
              <li>• {language === 'ta' ? 'உங்கள் குழு எண்ணை உள்ளிடவும் (1-12)' : 'Enter your group number (1-12)'}</li>
              <li>• {language === 'ta' ? 'முடிவுகளை எடுத்து நிதி நிர்வாகத்தைக் கற்றுக்கொள்ளுங்கள்' : 'Make decisions and learn financial management'}</li>
              <li>• {language === 'ta' ? 'சிறந்த நேரத்தில் முடித்து வெற்றி பெறுங்கள்' : 'Complete in best time to win'}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
