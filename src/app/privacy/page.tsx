'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function PrivacyPage() {
  const { language } = useLanguage();

  const sections = [
    {
      icon: Database,
      title: language === 'ta' ? 'தரவு சேகரிப்பு' : 'Data Collection',
      titleTa: 'தரவு சேகரிப்பு',
      content: language === 'ta'
        ? 'நாங்கள் உங்கள் மின்னஞ்சல் முகவரி, பயனர் பெயர் மற்றும் நிதி பரிவர்த்தனை தரவை சேகரிக்கிறோம். எல்லா தரவும் பாதுகாப்பாக Firebase இல் சேமிக்கப்படுகிறது.'
        : 'We collect your email address, username, and financial transaction data. All data is securely stored in Firebase.',
      points: language === 'ta'
        ? [
            'மின்னஞ்சல் மற்றும் பயனர் விவரங்கள்',
            'பரிவர்த்தனை தரவு (தொகை, வகை, விளக்கம்)',
            'விளையாட்டு முன்னேற்றம் மற்றும் முடிவுகள்',
            'பயன்பாட்டு விருப்பத்தேர்வுகள் (மொழி, நாணயம்)'
          ]
        : [
            'Email and user details',
            'Transaction data (amount, type, description)',
            'Game progress and results',
            'App preferences (language, currency)'
          ]
    },
    {
      icon: Lock,
      title: language === 'ta' ? 'தரவு பாதுகாப்பு' : 'Data Security',
      titleTa: 'தரவு பாதுகாப்பு',
      content: language === 'ta'
        ? 'உங்கள் தரவு Firebase Authentication மற்றும் Firestore பாதுகாப்பு விதிகளால் பாதுகாக்கப்படுகிறது.'
        : 'Your data is protected by Firebase Authentication and Firestore security rules.',
      points: language === 'ta'
        ? [
            'குறியாக்கப்பட்ட தரவு பரிமாற்றம் (HTTPS)',
            'பாதுகாப்பான அங்கீகாரம் (Firebase Auth)',
            'தனித்த பயனர் தரவு',
            'வழக்கமான பாதுகாப்பு புதுப்பிப்புகள்'
          ]
        : [
            'Encrypted data transmission (HTTPS)',
            'Secure authentication (Firebase Auth)',
            'Isolated user data',
            'Regular security updates'
          ]
    },
    {
      icon: Eye,
      title: language === 'ta' ? 'தரவு பயன்பாடு' : 'Data Usage',
      titleTa: 'தரவு பயன்பாடு',
      content: language === 'ta'
        ? 'உங்கள் தரவு பயன்பாட்டு செயல்பாட்டிற்காக மட்டுமே பயன்படுத்தப்படுகிறது.'
        : 'Your data is used solely for app functionality.',
      points: language === 'ta'
        ? [
            'செலவு கண்காணிப்பு மற்றும் அறிக்கைகள்',
            'விளையாட்டு முன்னேற்றம் மற்றும் தரவரிசை',
            'தனிப்பயனாக்கப்பட்ட அனுபவம்',
            'மூன்றாம் தரப்பினருடன் பகிரப்படவில்லை'
          ]
        : [
            'Expense tracking and reports',
            'Game progress and leaderboards',
            'Personalized experience',
            'Never shared with third parties'
          ]
    },
    {
      icon: Users,
      title: language === 'ta' ? 'உங்கள் உரிமைகள்' : 'Your Rights',
      titleTa: 'உங்கள் உரிமைகள்',
      content: language === 'ta'
        ? 'உங்கள் தனிப்பட்ட தரவின் மீது உங்களுக்கு முழு கட்டுப்பாடு உள்ளது.'
        : 'You have full control over your personal data.',
      points: language === 'ta'
        ? [
            'எந்த நேரத்திலும் உங்கள் தரவை அணுகவும்',
            'தவறான தகவலை திருத்தவும்',
            'உங்கள் கணக்கை நீக்கவும்',
            'தரவு ஏற்றுமதி கோரவும்'
          ]
        : [
            'Access your data at any time',
            'Correct inaccurate information',
            'Delete your account',
            'Request data export'
          ]
    },
    {
      icon: FileText,
      title: language === 'ta' ? 'குக்கீகள் & சேமிப்பகம்' : 'Cookies & Storage',
      titleTa: 'குக்கீகள் & சேமிப்பகம்',
      content: language === 'ta'
        ? 'நாங்கள் பயன்பாட்டு செயல்பாட்டிற்காக உள்ளூர் சேமிப்பகத்தைப் பயன்படுத்துகிறோம்.'
        : 'We use local storage for app functionality.',
      points: language === 'ta'
        ? [
            'அமர்வு தரவு மற்றும் அங்கீகாரம்',
            'விளையாட்டு முன்னேற்றம் (உள்ளூர் சேமிப்பு)',
            'பயனர் விருப்பத்தேர்வுகள்',
            'கண்காணிப்பு குக்கீகள் இல்லை'
          ]
        : [
            'Session data and authentication',
            'Game progress (local storage)',
            'User preferences',
            'No tracking cookies'
          ]
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
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ta' ? 'தனியுரிமை கொள்கை' : 'Privacy Policy'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'ta'
                  ? 'உங்கள் தரவு எவ்வாறு பாதுகாக்கப்படுகிறது'
                  : 'How your data is protected'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Intro Card */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-5">
            <p className="text-gray-700 text-sm leading-relaxed">
              {language === 'ta'
                ? 'BeeWise இல், உங்கள் தனியுரிமை மற்றும் தரவு பாதுகாப்பு எங்கள் முக்கிய முன்னுரிமையாகும். இந்த கொள்கை நாங்கள் எவ்வாறு உங்கள் தகவலை சேகரிக்கிறோம், பயன்படுத்துகிறோம் மற்றும் பாதுகாக்கிறோம் என்பதை விளக்குகிறது.'
                : 'At BeeWise, your privacy and data security are our top priorities. This policy explains how we collect, use, and protect your information.'}
            </p>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">{section.content}</p>
                <ul className="space-y-2">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        {/* Contact Card */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-5">
            <h3 className="font-semibold text-purple-900 mb-2 text-sm">
              {language === 'ta' ? 'எங்களை தொடர்பு கொள்ளுங்கள்' : 'Contact Us'}
            </h3>
            <p className="text-sm text-purple-800">
              {language === 'ta'
                ? 'தனியுரிமை தொடர்பான கேள்விகள் அல்லது கவலைகளுக்கு, எங்களை தொடர்பு கொள்ளுங்கள்:'
                : 'For privacy-related questions or concerns, contact us at:'}
            </p>
            <p className="text-sm font-medium text-purple-900 mt-2">
              privacy@beewise.app
            </p>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            {language === 'ta' ? 'கடைசியாக புதுப்பிக்கப்பட்டது' : 'Last Updated'}: {new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
