'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Settings,
  LogOut,
  ChevronRight,
  Tag,
  BarChart3,
  Shield,
  HelpCircle,
  Mail,
  Languages,
  DollarSign,
  Calculator,
  Gamepad2,
  Sun,
  Moon
} from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      icon: Gamepad2,
      label: language === 'en' ? 'Game Scenarios' : 'விளையாட்டு சூழ்நிலைகள்',
      description: language === 'en' ? 'Play financial management scenarios' : 'நிதி மேலாண்மை சூழ்நிலைகளை விளையாடுங்கள்',
      href: '/game-scenarios',
      color: 'text-pink-600 bg-pink-50'
    },
    {
      icon: Tag,
      label: t.profile.manageCategories,
      description: t.profile.manageCategoriesDesc,
      href: '/categories',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: BarChart3,
      label: t.profile.reportsAnalytics,
      description: t.profile.reportsAnalyticsDesc,
      href: '/reports',
      color: 'text-bee-secondary bg-blue-50'
    },
    {
      icon: Calculator,
      label: t.loanCalculator.title,
      description: t.loanCalculator.loanCalculatorDesc,
      href: '/loan-calculator',
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      icon: Settings,
      label: t.profile.appSettings,
      description: t.profile.appSettingsDesc,
      href: '/settings',
      color: 'text-gray-600 bg-gray-50'
    },
    {
      icon: Shield,
      label: t.profile.privacySecurity,
      description: t.profile.privacySecurityDesc,
      href: '/privacy',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: HelpCircle,
      label: t.profile.helpSupport,
      description: t.profile.helpSupportDesc,
      href: '/help',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{t.profile.profile}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.profile.manageAccount}</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user?.displayName || 'User'}
                </h2>
                <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {t.profile.memberSince} {user?.metadata?.creationTime ?
                    new Date(user.metadata.creationTime).toLocaleDateString() :
                    t.profile.recently
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">{t.profile.quickOverview}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">{t.profile.transactionsCount}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">{t.profile.categoriesCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Selector */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 bg-indigo-50">
                <Languages className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{t.profile.language}</h3>
                <p className="text-sm text-gray-500">{t.profile.languageDesc}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className="min-w-[60px]"
                >
                  English
                </Button>
                <Button
                  variant={language === 'ta' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('ta')}
                  className="min-w-[60px]"
                >
                  தமிழ்
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Selector */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-bee-primary bg-yellow-50">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{t.profile.currency}</h3>
                <p className="text-sm text-gray-500">{t.profile.currencyDesc}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={currency === 'USD' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrency('USD')}
                  className="min-w-[60px]"
                >
                  USD
                </Button>
                <Button
                  variant={currency === 'LKR' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrency('LKR')}
                  className="min-w-[60px]"
                >
                  LKR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Toggle */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-yellow-600 bg-yellow-50">
                <Sun className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {language === 'ta' ? 'தீம்' : 'Theme'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'ta' ? 'ஒளி அல்லது இருள் பயன்முறை' : 'Light or Dark mode'}
                </p>
              </div>
              <ThemeToggle variant="button" />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{loading ? t.auth.signingOut : t.auth.signOut}</span>
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">{t.profile.appVersion}</p>
          <p className="text-xs text-gray-400 mt-1">
            {t.profile.builtWith}
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}