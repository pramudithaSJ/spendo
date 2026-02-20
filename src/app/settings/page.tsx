'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Trash2,
  Lock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Brain
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_PASSWORD = '6164';

export default function SettingsPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      setShowConfirm(true);
    } else {
      setError(language === 'ta' ? 'தவறான கடவுச்சொல்' : 'Incorrect password');
      setPassword('');
    }
  };

  const handleClearLocalStorage = () => {
    try {
      // Clear all game-related localStorage items
      const keysToRemove: string[] = [];

      // Collect all keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keysToRemove.push(key);
        }
      }

      // Remove all keys
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      setSuccess(true);
      setShowConfirm(false);
      setPassword('');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      setError(language === 'ta'
        ? 'சேமிப்பகத்தை அழிப்பதில் பிழை'
        : 'Error clearing storage');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPassword('');
    setError('');
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
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'ta'
              ? 'பயன்பாட்டு அமைப்புகளை நிர்வகிக்கவும்'
              : 'Manage application settings'}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Success Message */}
        {success && (
          <Card className="bg-green-50 border-green-500 border-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900">
                    {language === 'ta' ? 'வெற்றி!' : 'Success!'}
                  </h3>
                  <p className="text-sm text-green-800">
                    {language === 'ta'
                      ? 'உள்ளூர் சேமிப்பகம் வெற்றிகரமாக அழிக்கப்பட்டது'
                      : 'Local storage cleared successfully'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clear Local Storage Section */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trash2 className="h-5 w-5 text-red-600" />
              {language === 'ta' ? 'உள்ளூர் சேமிப்பகத்தை அழி' : 'Clear Local Storage'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900 font-medium">
                    {language === 'ta' ? 'எச்சரிக்கை' : 'Warning'}
                  </p>
                  <p className="text-xs text-yellow-800 mt-1">
                    {language === 'ta'
                      ? 'இது அனைத்து விளையாட்டு தரவு, முன்னேற்றம் மற்றும் அமைப்புகளை நிரந்தரமாக அழிக்கும்'
                      : 'This will permanently delete all game data, progress, and settings'}
                  </p>
                </div>
              </div>
            </div>

            {!showConfirm ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {language === 'ta' ? 'நிர்வாக கடவுச்சொல்' : 'Admin Password'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Enter password'}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-900">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!password}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {language === 'ta' ? 'சரிபார்க்கவும்' : 'Verify Password'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">
                    {language === 'ta' ? 'நிரந்தர நீக்கம்!' : 'Permanent Deletion!'}
                  </h3>
                  <p className="text-sm text-red-800 mb-3">
                    {language === 'ta'
                      ? 'நீங்கள் நிச்சயமாக அனைத்து உள்ளூர் சேமிப்பக தரவையும் அழிக்க விரும்புகிறீர்களா? இந்த செயலை மாற்ற முடியாது.'
                      : 'Are you sure you want to clear all local storage data? This action cannot be undone.'}
                  </p>
                  <ul className="text-xs text-red-700 space-y-1 mb-4">
                    <li>• {language === 'ta' ? 'அனைத்து விளையாட்டு முன்னேற்றம்' : 'All game progress'}</li>
                    <li>• {language === 'ta' ? 'குழு தரவு' : 'Group data'}</li>
                    <li>• {language === 'ta' ? 'தேர்வுகள் மற்றும் முடிவுகள்' : 'Choices and results'}</li>
                    <li>• {language === 'ta' ? 'பயனர் விருப்பத்தேர்வுகள்' : 'User preferences'}</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleClearLocalStorage}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {language === 'ta' ? 'அழி' : 'Clear All'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">
              {language === 'ta' ? 'குறிப்பு' : language === 'si' ? 'සටහන' : 'Note'}
            </h3>
            <p className="text-xs text-blue-800">
              {language === 'ta'
                ? 'உள்ளூர் சேமிப்பகத்தை அழிப்பது சாதனத்தில் சேமிக்கப்பட்ட தரவை மட்டுமே பாதிக்கும். சர்வரில் சமர்ப்பிக்கப்பட்ட தரவு பாதுகாப்பாக உள்ளது.'
                : language === 'si'
                ? 'ගබඩාව හිස් කිරීම මෙම උපකරණයේ ගබඩා කළ දත්ත පමණක් බලපායි. සේවාදායකයට ඉදිරිපත් කළ දත්ත ආරක්ෂිතව ඇත.'
                : 'Clearing local storage only affects data stored on this device. Data submitted to the server remains safe.'}
            </p>
          </CardContent>
        </Card>

        {/* Quiz Admin Card */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-600" />
              {language === 'si'
                ? 'ප්‍රශ්නාවලිය නිර්වාහක'
                : language === 'ta'
                ? 'வினாடி வினா நிர்வாகி'
                : 'Quiz Admin'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              {language === 'si'
                ? 'Kahoot වැනි ප්‍රශ්නාවලිය සැසිවාරයක් සාදා ශිෂ්‍යයන් සමඟ ක්‍රීඩා කරන්න.'
                : language === 'ta'
                ? 'Kahoot போன்ற வினாடி வினா அமர்வை உருவாக்கி மாணவர்களுடன் விளையாடுங்கள்.'
                : 'Create a Kahoot-style quiz session and play with students in real-time.'}
            </p>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Link href="/quiz/admin">
                <Brain className="h-4 w-4 mr-2" />
                {language === 'si'
                  ? 'ප්‍රශ්නාවලිය පාලකය විවෘත කරන්න'
                  : language === 'ta'
                  ? 'வினாடி வினா நிர்வாகியை திற'
                  : 'Open Quiz Admin'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
