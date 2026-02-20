'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Wifi } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { subscribeToParticipants } from '@/lib/quiz/service';
import { QuizParticipant } from '@/lib/quiz/types';

interface LobbyScreenProps {
  sessionId: string;
  pin: string;
  participantName: string;
}

export default function LobbyScreen({ sessionId, pin, participantName }: LobbyScreenProps) {
  const { language } = useLanguage();
  const [participants, setParticipants] = useState<QuizParticipant[]>([]);

  useEffect(() => {
    const unsub = subscribeToParticipants(sessionId, setParticipants);
    return unsub;
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 px-4 pt-8 pb-20">
      <div className="w-full max-w-md space-y-6">
        {/* PIN Display */}
        <Card className="bg-black text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm text-gray-400 uppercase tracking-widest">
              {language === 'si' ? 'සැසි PIN' : language === 'ta' ? 'அமர்வு PIN' : 'Session PIN'}
            </p>
            <p className="text-5xl font-bold font-mono tracking-[0.3em]">{pin}</p>
            <p className="text-xs text-gray-400">
              {language === 'si'
                ? 'ඔබේ මිතුරන්ට PIN බෙදා ගන්න'
                : language === 'ta'
                ? 'உங்கள் நண்பர்களுடன் PIN பகிர்ந்துகொள்ளுங்கள்'
                : 'Share this PIN with your friends'}
            </p>
          </CardContent>
        </Card>

        {/* Waiting message */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Wifi className="h-5 w-5 animate-pulse text-green-500" />
            <span className="font-medium">
              {language === 'si'
                ? 'සත්කාරක ආරම්භ කිරීමට රැඳී සිටින්න...'
                : language === 'ta'
                ? 'ஹோஸ்ட் தொடங்குவதற்காக காத்திருக்கிறோம்...'
                : 'Waiting for host to start...'}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {language === 'si'
              ? `ඔබ ${participantName} ලෙස සම්බන්ධ වී ඇත`
              : language === 'ta'
              ? `நீங்கள் ${participantName} என்று இணைக்கப்பட்டுள்ளீர்கள்`
              : `You are connected as ${participantName}`}
          </p>
        </div>

        {/* Participant Count + List */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-800">
                {participants.length}{' '}
                {language === 'si'
                  ? 'සහභාගිකරුවන්'
                  : language === 'ta'
                  ? 'பங்கேற்பாளர்கள்'
                  : participants.length === 1 ? 'participant' : 'participants'}
              </span>
            </div>
            {participants.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                {language === 'si'
                  ? 'තවම කිසිවෙකු සහභාගි වී නොමැත'
                  : language === 'ta'
                  ? 'இன்னும் யாரும் சேரவில்லை'
                  : 'No one has joined yet'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-lg px-3 py-2 text-sm font-medium truncate ${
                      p.name === participantName
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {p.name}
                    {p.name === participantName && (
                      <span className="ml-1 text-xs text-gray-300">(you)</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
