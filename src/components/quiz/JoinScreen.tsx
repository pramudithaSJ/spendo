'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, LogIn, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { joinQuizByPin } from '@/lib/quiz/service';

interface JoinScreenProps {
  onJoined: (sessionId: string, participantId: string, name: string) => void;
}

export default function JoinScreen({ onJoined }: JoinScreenProps) {
  const { language } = useLanguage();
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6 || !name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { sessionId, participantId } = await joinQuizByPin(pin.trim(), name.trim());
      // Persist to sessionStorage for refresh resilience
      sessionStorage.setItem('quiz_sessionId', sessionId);
      sessionStorage.setItem('quiz_participantId', participantId);
      sessionStorage.setItem('quiz_name', name.trim());
      onJoined(sessionId, participantId, name.trim());
    } catch (err) {
      const code = (err as Error).message;
      if (code === 'SESSION_NOT_FOUND') {
        setError(
          language === 'si'
            ? 'PIN වලංගු නොවේ හෝ සැසිය ආරම්භ නොවීය'
            : language === 'ta'
            ? 'தவறான PIN அல்லது அமர்வு கண்டுபிடிக்கப்படவில்லை'
            : 'Invalid PIN or session not found'
        );
      } else {
        setError(
          language === 'si'
            ? 'යමක් වැරදී ගිය. නැවත උත්සාහ කරන්න.'
            : language === 'ta'
            ? 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.'
            : 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white">
            <Brain size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'si' ? 'ප්‍රශ්නාවලියට සහභාගි වන්න' : language === 'ta' ? 'வினாடி வினாவில் சேரவும்' : 'Join the Quiz'}
          </h1>
          <p className="text-sm text-gray-500">
            {language === 'si'
              ? 'PIN ඇතුළත් කර ඔබේ නම දෙන්න'
              : language === 'ta'
              ? 'PIN உள்ளிட்டு உங்கள் பெயரை கொடுங்கள்'
              : 'Enter the PIN and your name to join'}
          </p>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              {language === 'si' ? 'සැසි PIN' : language === 'ta' ? 'அமர்வு PIN' : 'Session PIN'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">
                  {language === 'si' ? '6-ඉලක්කම් PIN' : language === 'ta' ? '6 இலக்க PIN' : '6-Digit PIN'}
                </Label>
                <Input
                  id="pin"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl font-mono tracking-widest h-14"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === 'si' ? 'ඔබේ නම' : language === 'ta' ? 'உங்கள் பெயர்' : 'Your Name'}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    language === 'si' ? 'නම ඇතුළත් කරන්න' : language === 'ta' ? 'பெயரை உள்ளிடவும்' : 'Enter your name'
                  }
                  maxLength={30}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={pin.length !== 6 || !name.trim() || loading}
                className="w-full bg-black hover:bg-gray-800 text-white h-12 text-base"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading
                  ? language === 'si' ? 'සම්බන්ධ වෙමින්...' : language === 'ta' ? 'சேர்கிறது...' : 'Joining...'
                  : language === 'si' ? 'සහභාගි වන්න' : language === 'ta' ? 'சேரவும்' : 'Join Quiz'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
