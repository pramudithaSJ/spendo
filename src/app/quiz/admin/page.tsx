'use client';

/**
 * Admin quiz page — protected by the same admin password (6164) as settings.
 * Allows creating a new session or resuming an existing one.
 * Admin state is persisted to sessionStorage for refresh resilience.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Lock, Eye, EyeOff, Plus, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { createQuizSession, getSession } from '@/lib/quiz/service';
import { financialLiteracyQuiz } from '@/lib/quiz/questions';
import { QuizSession } from '@/lib/quiz/types';
import AdminDashboard from '@/components/quiz/AdminDashboard';

const ADMIN_PASSWORD = '6164';

export default function QuizAdminPage() {
  const { language } = useLanguage();

  // ─── Auth state ──────────────────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // ─── Session state ───────────────────────────────────────────────────────────
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [resumeInput, setResumeInput] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [loading, setLoading] = useState(false);

  // Restore from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('quiz_admin_sessionId');
    if (saved) {
      setSessionId(saved);
      setLoading(true);
      getSession(saved).then((s) => {
        if (s && s.status !== 'ended') {
          setActiveSession(s);
        } else {
          sessionStorage.removeItem('quiz_admin_sessionId');
          setSessionId(null);
        }
        setLoading(false);
      });
    }
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError(
        language === 'si'
          ? 'වැරදි මුරපදය'
          : language === 'ta'
          ? 'தவறான கடவுச்சொல்'
          : 'Incorrect password'
      );
      setPassword('');
    }
  };

  const handleCreateSession = async () => {
    setLoading(true);
    const { sessionId: newId } = await createQuizSession(
      financialLiteracyQuiz.id,
      financialLiteracyQuiz.questions.length,
      30
    );
    const session = await getSession(newId);
    sessionStorage.setItem('quiz_admin_sessionId', newId);
    setSessionId(newId);
    setActiveSession(session);
    setLoading(false);
  };

  const handleResume = async () => {
    if (!resumeInput.trim()) return;
    setLoading(true);
    setResumeError('');
    const session = await getSession(resumeInput.trim());
    if (!session || session.status === 'ended') {
      setResumeError(
        language === 'si'
          ? 'සැසිය හමු නොවීය හෝ ඉවර වී ඇත'
          : language === 'ta'
          ? 'அமர்வு கண்டுபிடிக்கப்படவில்லை அல்லது முடிந்தது'
          : 'Session not found or already ended'
      );
    } else {
      sessionStorage.setItem('quiz_admin_sessionId', resumeInput.trim());
      setSessionId(resumeInput.trim());
      setActiveSession(session);
    }
    setLoading(false);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  // Password gate
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white">
              <Brain size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'si' ? 'ප්‍රශ්නාවලිය පාලකය' : language === 'ta' ? 'வினாடி வினா நிர்வாகி' : 'Quiz Admin'}
            </h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-pw" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {language === 'si' ? 'නිර්වාහක මුරපදය' : language === 'ta' ? 'நிர்வாக கடவுச்சொல்' : 'Admin Password'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-pw"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {authError && (
                  <p className="text-sm text-red-600">{authError}</p>
                )}
                <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                  <Lock className="h-4 w-4 mr-2" />
                  {language === 'si' ? 'පිවිසෙන්න' : language === 'ta' ? 'உள்ளே நுழைக' : 'Enter'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="text-center">
            <Link href="/settings" className="text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1">
              <ArrowLeft size={14} />
              {language === 'si' ? 'ආපසු' : language === 'ta' ? 'திரும்பு' : 'Back to Settings'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">
          {language === 'si' ? 'ලොඩ් වෙමින්...' : language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading...'}
        </p>
      </div>
    );
  }

  // Active session → show admin dashboard
  if (activeSession && sessionId) {
    return (
      <AdminDashboard
        sessionId={sessionId}
        quiz={financialLiteracyQuiz}
        initialSession={activeSession}
      />
    );
  }

  // No active session → create or resume
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white">
            <Brain size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'si' ? 'ප්‍රශ්නාවලිය පාලකය' : language === 'ta' ? 'வினாடி வினா நிர்வாகி' : 'Quiz Admin'}
          </h1>
        </div>

        {/* Create new */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'si' ? 'නව සැසියක් සාදන්න' : language === 'ta' ? 'புதிய அமர்வு உருவாக்கு' : 'Create New Session'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              {language === 'si'
                ? `ප්‍රශ්නාවලිය: ${financialLiteracyQuiz.title.si} (${financialLiteracyQuiz.questions.length} ප්‍රශ්න)`
                : language === 'ta'
                ? `வினாடி வினா: ${financialLiteracyQuiz.title.ta} (${financialLiteracyQuiz.questions.length} கேள்விகள்)`
                : `Quiz: ${financialLiteracyQuiz.title.en} (${financialLiteracyQuiz.questions.length} questions)`}
            </p>
            <Button
              onClick={handleCreateSession}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'si' ? 'සැසිය සාදන්න' : language === 'ta' ? 'அமர்வு உருவாக்கு' : 'Create Session'}
            </Button>
          </CardContent>
        </Card>

        {/* Resume existing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'si' ? 'සැසිය නැවත ආරම්භ කරන්න' : language === 'ta' ? 'அமர்வை மீண்டும் தொடங்கு' : 'Resume Session'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="resume-id">
                {language === 'si' ? 'සැසි ID' : language === 'ta' ? 'அமர்வு ID' : 'Session ID'}
              </Label>
              <Input
                id="resume-id"
                value={resumeInput}
                onChange={(e) => setResumeInput(e.target.value)}
                placeholder="Firestore session ID"
              />
            </div>
            {resumeError && <p className="text-sm text-red-600">{resumeError}</p>}
            <Button
              onClick={handleResume}
              disabled={loading || !resumeInput.trim()}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'si' ? 'නැවත ආරම්භ කරන්න' : language === 'ta' ? 'மீண்டும் தொடங்கு' : 'Resume'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
