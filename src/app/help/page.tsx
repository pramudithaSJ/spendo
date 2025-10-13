'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Mail,
  BookOpen,
  Video,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Wallet,
  BarChart3,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function HelpPage() {
  const { language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: language === 'ta' ? 'BeeWise பயன்பாடு எவ்வாறு பயன்படுத்துவது?' : 'How do I use the BeeWise app?',
      answer: language === 'ta'
        ? 'பதிவு செய்து உள்நுழையுங்கள். பின்னர் உங்கள் வருமானம் மற்றும் செலவுகளை கண்காணிக்க பரிவர்த்தனைகளை சேர்க்கவும். வகைகளை உருவாக்கவும், அறிக்கைகளை பார்க்கவும் மற்றும் நிதி விளையாட்டுகளை விளையாடவும்.'
        : 'Register and log in. Then add transactions to track your income and expenses. Create categories, view reports, and play financial games.'
    },
    {
      question: language === 'ta' ? 'விளையாட்டு சூழ்நிலைகள் எவ்வாறு செயல்படுகின்றன?' : 'How do game scenarios work?',
      answer: language === 'ta'
        ? 'விளையாட்டு சூழ்நிலைகள் -> சூழ்நிலையை தேர்ந்தெடுக்கவும் -> குழு எண் (1-12) உள்ளிடவும் -> முடிவுகளை எடுக்கவும். ஒவ்வொரு தேர்வும் உங்கள் நிதி முடிவுகளை பாதிக்கிறது. சிறந்த நேரத்தில் முடிக்கவும்!'
        : 'Go to Game Scenarios → Choose scenario → Enter group number (1-12) → Make decisions. Each choice affects your financial outcome. Complete in best time!'
    },
    {
      question: language === 'ta' ? 'பரிவர்த்தனை எவ்வாறு சேர்ப்பது?' : 'How do I add a transaction?',
      answer: language === 'ta'
        ? 'டாஷ்போர்டில் "+" பொத்தானை அழுத்தவும். வகை (வருமானம்/செலவு), தொகை, வகை, விளக்கம் மற்றும் தேதியை தேர்ந்தெடுக்கவும். சேமி பொத்தானை அழுத்தவும்.'
        : 'Click the "+" button on dashboard. Select type (income/expense), amount, category, description, and date. Click save.'
    },
    {
      question: language === 'ta' ? 'வகைகளை எவ்வாறு நிர்வகிப்பது?' : 'How do I manage categories?',
      answer: language === 'ta'
        ? 'சுயவிவரம் -> வகைகளை நிர்வகிக்கவும் -> புதிய வகையை சேர்க்கவும் அல்லது தற்போதுள்ளவற்றை திருத்தவும். ஐகான் மற்றும் வகை (வருமானம்/செலவு) தேர்ந்தெடுக்கவும்.'
        : 'Profile → Manage Categories → Add new or edit existing. Choose icon and type (income/expense).'
    },
    {
      question: language === 'ta' ? 'அறிக்கைகளை எவ்வாறு பார்ப்பது?' : 'How do I view reports?',
      answer: language === 'ta'
        ? 'கீழ் வழிசெலுத்தலில் "அறிக்கைகள்" தாவலை அழுத்தவும். மாத/வருடத்தை தேர்ந்தெடுக்கவும். வகை வாரியான பகுப்பாய்வு மற்றும் போக்குகளை பார்க்கவும்.'
        : 'Tap "Reports" tab in bottom navigation. Select month/year. View category-wise analysis and trends.'
    },
    {
      question: language === 'ta' ? 'மொழியை எவ்வாறு மாற்றுவது?' : 'How do I change language?',
      answer: language === 'ta'
        ? 'சுயவிவரம் -> மொழி பகுதி -> English அல்லது தமிழ் தேர்ந்தெடுக்கவும். மாற்றங்கள் உடனடியாக பயன்படுத்தப்படும்.'
        : 'Profile → Language section → Select English or தமிழ். Changes apply immediately.'
    },
    {
      question: language === 'ta' ? 'எனது தரவு பாதுகாப்பானதா?' : 'Is my data safe?',
      answer: language === 'ta'
        ? 'ஆம்! அனைத்து தரவும் Firebase இல் குறியாக்கத்துடன் பாதுகாப்பாக சேமிக்கப்படுகிறது. மேலும் விவரங்களுக்கு தனியுரிமை கொள்கையை பார்க்கவும்.'
        : 'Yes! All data is securely stored in Firebase with encryption. See Privacy Policy for details.'
    },
    {
      question: language === 'ta' ? 'உள்ளூர் சேமிப்பகத்தை எவ்வாறு அழிப்பது?' : 'How do I clear local storage?',
      answer: language === 'ta'
        ? 'சுயவிவரம் -> அமைப்புகள் -> உள்ளூர் சேமிப்பகத்தை அழி. நிர்வாக கடவுச்சொல் (6164) உள்ளிடவும் மற்றும் உறுதிப்படுத்தவும்.'
        : 'Profile → Settings → Clear Local Storage. Enter admin password (6164) and confirm.'
    }
  ];

  const quickLinks = [
    {
      icon: Wallet,
      title: language === 'ta' ? 'பரிவர்த்தனைகள்' : 'Transactions',
      description: language === 'ta' ? 'வருமானம் மற்றும் செலவுகளை சேர்க்கவும்' : 'Add income and expenses',
      href: '/add'
    },
    {
      icon: Gamepad2,
      title: language === 'ta' ? 'விளையாட்டுகள்' : 'Games',
      description: language === 'ta' ? 'நிதி விளையாட்டுகளை விளையாடுங்கள்' : 'Play financial games',
      href: '/game-scenarios'
    },
    {
      icon: BarChart3,
      title: language === 'ta' ? 'அறிக்கைகள்' : 'Reports',
      description: language === 'ta' ? 'செலவு பகுப்பாய்வை பார்க்கவும்' : 'View expense analysis',
      href: '/reports'
    },
    {
      icon: Settings,
      title: language === 'ta' ? 'அமைப்புகள்' : 'Settings',
      description: language === 'ta' ? 'பயன்பாட்டை தனிப்பயனாக்கவும்' : 'Customize the app',
      href: '/settings'
    }
  ];

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
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ta' ? 'உதவி & ஆதரவு' : 'Help & Support'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'ta'
                  ? 'கேள்விகளுக்கு பதில்கள் மற்றும் உதவி'
                  : 'Answers and assistance'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3 px-1">
            {language === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link key={index} href={link.href}>
                  <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900">{link.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3 px-1">
            {language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white border-gray-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <HelpCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-sm text-gray-900">{faq.question}</span>
                    </div>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="pl-8 text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tutorials */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="h-5 w-5 text-orange-600" />
              {language === 'ta' ? 'வீடியோ பயிற்சிகள்' : 'Video Tutorials'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              {language === 'ta'
                ? 'விரைவில் வரவிருக்கும் வீடியோ பயிற்சிகள் உங்களுக்கு உதவும்.'
                : 'Video tutorials coming soon to help you get started.'}
            </p>
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <BookOpen className="h-4 w-4" />
              <span>{language === 'ta' ? 'விரைவில்' : 'Coming Soon'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-5 w-5 text-orange-600" />
              {language === 'ta' ? 'ஆதரவை தொடர்பு கொள்ளுங்கள்' : 'Contact Support'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-orange-900">
              {language === 'ta'
                ? 'உங்கள் கேள்விக்கு பதில் கிடைக்கவில்லையா? எங்களை தொடர்பு கொள்ளுங்கள்:'
                : "Can't find an answer? Contact us:"}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-orange-600" />
              <a href="mailto:support@beewise.app" className="font-medium text-orange-900 underline">
                support@beewise.app
              </a>
            </div>
            <p className="text-xs text-orange-700">
              {language === 'ta'
                ? 'பதில் நேரம்: 24-48 மணிநேரம்'
                : 'Response time: 24-48 hours'}
            </p>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            BeeWise v1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'ta' ? 'Next.js & Firebase உடன் உருவாக்கப்பட்டது' : 'Built with Next.js & Firebase'}
          </p>
        </div>
      </div>
    </div>
  );
}
