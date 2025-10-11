'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GameState, GameOption, OptionId } from '@/lib/gameTypes';
import { GAME_STEPS, TOTAL_STEPS, GAME_PROFILE } from '@/lib/gameData';
import {
  loadGameState,
  initializeGameState,
  makeChoice,
  isOptionDisabled,
  calculateGameResults,
  saveGameState,
} from '@/lib/gameLogic';
import { detectRefresh, recordRefresh, initializeSession, getRefreshWarning } from '@/lib/refreshDetection';
import OptionCard from '@/components/game/OptionCard';
import ChoiceHistory from '@/components/game/ChoiceHistory';
import ConfirmationDialog from '@/components/game/ConfirmationDialog';
import GameResults from '@/components/game/GameResults';
import LiveTimer from '@/components/game/LiveTimer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function GamePage() {
  const { language, t } = useLanguage();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [groupNumber, setGroupNumber] = useState<string>('');
  const [showGroupSelect, setShowGroupSelect] = useState(true);
  const [selectedOption, setSelectedOption] = useState<GameOption | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for page refresh
    if (gameState && !gameState.completedAt) {
      const isRefresh = detectRefresh(gameState);
      if (isRefresh) {
        const updatedState = recordRefresh(gameState);
        setGameState(updatedState);
        saveGameState(updatedState);
      }
    }
  }, []);

  // Separate effect to handle refresh detection after gameState loads
  useEffect(() => {
    if (mounted && gameState && !gameState.completedAt) {
      const isRefresh = detectRefresh(gameState);
      if (isRefresh && gameState.pageLoadCount === 1) {
        // This is the first refresh detection
        const updatedState = recordRefresh(gameState);
        setGameState(updatedState);
        saveGameState(updatedState);
      }
    }
  }, [mounted, gameState?.groupNumber]);

  const handleGroupSelect = () => {
    const num = parseInt(groupNumber);
    if (num >= 1 && num <= 12) {
      const existing = loadGameState(num);
      if (existing) {
        setGameState(existing);
        // Check for refresh on existing game
        const isRefresh = detectRefresh(existing);
        if (isRefresh) {
          const updatedState = recordRefresh(existing);
          setGameState(updatedState);
          saveGameState(updatedState);
        }
      } else {
        const newState = initializeGameState(num, 'scenario-1');
        setGameState(newState);
        initializeSession(num);
      }
      setShowGroupSelect(false);
    }
  };

  const handleOptionSelect = (option: GameOption) => {
    setSelectedOption(option);
    setShowConfirmation(true);
  };

  const handleConfirmChoice = () => {
    if (!gameState || !selectedOption) return;

    const newState = makeChoice(
      gameState,
      gameState.currentStep,
      selectedOption.id
    );

    setGameState(newState);
    setShowConfirmation(false);
    setSelectedOption(null);
  };

  const handleCancelChoice = () => {
    setSelectedOption(null);
    setShowConfirmation(false);
  };

  const handleChangeGroup = () => {
    setGameState(null);
    setShowGroupSelect(true);
    setGroupNumber('');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t.common.loading}...</p>
      </div>
    );
  }

  // Group Selection Screen
  if (showGroupSelect) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'ta'
                ? 'மாணவர் கடன் மேலாண்மை விளையாட்டு'
                : 'Student Loan Management Game'}
            </h1>
            <p className="text-gray-600 text-sm">
              {language === 'ta'
                ? 'உங்கள் குழு எண்ணை உள்ளிடவும் (1-12)'
                : 'Enter your group number (1-12)'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ta' ? 'குழு எண்' : 'Group Number'}
              </label>
              <Input
                type="number"
                min="1"
                max="12"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder={language === 'ta' ? '1-12' : '1-12'}
                className="text-center text-2xl font-bold"
              />
            </div>

            <Button
              onClick={handleGroupSelect}
              disabled={!groupNumber || parseInt(groupNumber) < 1 || parseInt(groupNumber) > 12}
              className="w-full bg-black hover:bg-gray-800"
            >
              {language === 'ta' ? 'விளையாட்டைத் தொடங்கு' : 'Start Game'}
            </Button>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <ArrowLeft size={16} className="mr-2" />
                {language === 'ta' ? 'டாஷ்போர்டுக்குத் திரும்பு' : 'Back to Dashboard'}
              </Button>
            </Link>
          </div>

          {/* Profile Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <h3 className="font-semibold mb-2">
              {language === 'ta' ? 'சூழ்நிலை விவரங்கள்' : 'Scenario Profile'}
            </h3>
            <ul className="space-y-1 text-gray-700">
              <li>• {language === 'ta' ? GAME_PROFILE.ageTa : GAME_PROFILE.ageEn}</li>
              <li>• {language === 'ta' ? GAME_PROFILE.loanTa : GAME_PROFILE.loanEn}</li>
              <li>• {language === 'ta' ? GAME_PROFILE.salaryTa : GAME_PROFILE.salaryEn}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  // Game Complete - Show Results
  if (gameState.completedAt) {
    const results = calculateGameResults(gameState.choices, gameState.startTime);

    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <Button
              onClick={handleChangeGroup}
              variant="outline"
              size="sm"
            >
              <ArrowLeft size={16} className="mr-2" />
              {language === 'ta' ? 'குழுவை மாற்று' : 'Change Group'}
            </Button>
          </div>

          {/* Dead-end message removed - players discover outcomes through final results only */}

          <GameResults
            result={results}
            language={language}
            groupNumber={gameState.groupNumber}
            scenarioId={gameState.scenarioId}
            startTime={gameState.startTime}
            wasRefreshed={gameState.wasRefreshed}
            refreshCount={gameState.pageLoadCount - 1}
            refreshTimestamps={gameState.refreshTimestamps}
          />

          <div className="mt-6">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <ArrowLeft size={16} className="mr-2" />
                {language === 'ta' ? 'டாஷ்போர்டுக்குத் திரும்பு' : 'Back to Dashboard'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Game - Show Current Step
  const currentStepData = GAME_STEPS.find(s => s.step === gameState.currentStep);

  if (!currentStepData) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Live Timer */}
        <div className="mb-4">
          <LiveTimer
            startTime={gameState.startTime}
            wasRefreshed={gameState.wasRefreshed}
            refreshCount={gameState.pageLoadCount - 1}
            language={language}
          />
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                {gameState.groupNumber}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {language === 'ta' ? `குழு ${gameState.groupNumber}` : `Group ${gameState.groupNumber}`}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {language === 'ta' ? 'படி' : 'Step'} {gameState.currentStep}/{TOTAL_STEPS}
            </div>
          </div>

          <div>
            <Button
              onClick={handleChangeGroup}
              variant="outline"
              size="sm"
            >
              {language === 'ta' ? 'மாற்று' : 'Change'}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${(gameState.currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Choice History */}
        <ChoiceHistory choices={gameState.choices} language={language} />

        {/* Current Step */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-2">
            {language === 'ta' ? currentStepData.titleTa : currentStepData.title}
          </h2>

          {currentStepData.context && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 border border-blue-200">
              {language === 'ta' ? currentStepData.contextTa : currentStepData.context}
            </div>
          )}

          <p className="text-gray-700 mb-4">
            {language === 'ta' ? currentStepData.scenarioTa : currentStepData.scenario}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-gray-600 mb-3">
            {language === 'ta' ? 'உங்கள் தேர்வை தேர்ந்தெடுங்கள்:' : 'Select Your Choice:'}
          </h3>
          {currentStepData.options.map((option) => {
            const disabledCheck = isOptionDisabled(
              gameState.choices,
              gameState.currentStep,
              option.id
            );

            return (
              <OptionCard
                key={option.id}
                option={option}
                onSelect={() => handleOptionSelect(option)}
                disabled={disabledCheck.disabled}
                disabledReason={language === 'ta' ? disabledCheck.reasonTa : disabledCheck.reason}
                language={language}
              />
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && selectedOption && (
        <ConfirmationDialog
          option={selectedOption}
          onConfirm={handleConfirmChoice}
          onCancel={handleCancelChoice}
          language={language}
        />
      )}
    </div>
  );
}
