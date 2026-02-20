'use client';

import { Trophy, Medal, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { QuizSession, LeaderboardEntry } from '@/lib/quiz/types';

interface LeaderboardScreenProps {
  session: QuizSession;
  participantId: string;
}

const PODIUM_ICONS = [
  { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: '🥇' },
  { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800', label: '🥈' },
  { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', label: '🥉' },
];

export default function LeaderboardScreen({ session, participantId }: LeaderboardScreenProps) {
  const { language } = useLanguage();
  const { leaderboard, status } = session;
  const isFinal = status === 'ended';

  const myEntry = leaderboard.find((e) => e.participantId === participantId);
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col px-4 py-6 space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        {isFinal && (
          <div className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2">
            {language === 'si' ? 'අවසාන ප්‍රතිඵල' : language === 'ta' ? 'இறுதி முடிவுகள்' : 'Final Results'}
          </div>
        )}
        <h2 className="text-2xl font-bold">
          {language === 'si' ? 'ලොතරැයි ලැයිස්තු' : language === 'ta' ? 'லீடர்போர்டு' : 'Leaderboard'}
        </h2>
      </div>

      {/* My Rank (if not in top 3) */}
      {myEntry && myEntry.rank > 3 && (
        <Card className="bg-gray-700 border-gray-600">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-sm">
              #{myEntry.rank}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{myEntry.name}</p>
              <p className="text-xs text-gray-400">
                {language === 'si' ? 'ඔබේ ස්ථානය' : language === 'ta' ? 'உங்கள் இடம்' : 'Your position'}
              </p>
            </div>
            <p className="font-bold">{myEntry.score}</p>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="space-y-3">
          {top3.map((entry, i) => {
            const podium = PODIUM_ICONS[i];
            const isMe = entry.participantId === participantId;
            return (
              <Card
                key={entry.participantId}
                className={`border-0 ${podium.bg} ${isMe ? 'ring-2 ring-white' : ''}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`text-2xl ${podium.color} flex-shrink-0`}>
                    {podium.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate text-gray-900 dark:text-white`}>
                      {entry.name}
                      {isMe && (
                        <span className="ml-2 text-xs font-normal text-gray-500">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'si'
                        ? `${i + 1} වැනි ස්ථානය`
                        : language === 'ta'
                        ? `${i + 1}வது இடம்`
                        : `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : 'rd'} place`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{entry.score}</p>
                    <p className="text-xs text-gray-500">
                      {language === 'si' ? 'ලකුණු' : language === 'ta' ? 'புள்ளிகள்' : 'pts'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((entry) => {
            const isMe = entry.participantId === participantId;
            return (
              <div
                key={entry.participantId}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  isMe ? 'bg-gray-600 ring-1 ring-white' : 'bg-gray-800'
                }`}
              >
                <span className="text-sm text-gray-400 w-6">#{entry.rank}</span>
                <span className="flex-1 text-sm truncate">
                  {entry.name}
                  {isMe && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                </span>
                <span className="font-semibold text-sm">{entry.score}</span>
              </div>
            );
          })}
        </div>
      )}

      {!isFinal && (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs animate-pulse pt-2">
          <Star size={12} />
          <span>
            {language === 'si'
              ? 'ඊළඟ ප්‍රශ්නයට රැඳී සිටිනු...'
              : language === 'ta'
              ? 'அடுத்த கேள்விக்காக காத்திருக்கவும்...'
              : 'Waiting for next question...'}
          </span>
        </div>
      )}
    </div>
  );
}
