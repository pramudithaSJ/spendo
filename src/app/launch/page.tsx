'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Brain, Target, Shield, BarChart3, Award, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLaunchStage } from '@/hooks/useLaunchStage';
import DraggableBee from '@/components/launch/DraggableBee';
import LaunchPadCell from '@/components/launch/LaunchPadCell';
import FeatureCard from '@/components/launch/FeatureCard';
import ParticleEffect from '@/components/launch/ParticleEffect';
import LaunchCounter from '@/components/launch/LaunchCounter';
import Logo from '@/components/branding/Logo';

export default function LaunchPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { stage, advanceStage } = useLaunchStage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [isDragOverPad, setIsDragOverPad] = useState(false);

  // Initialize audio with fallback
  useEffect(() => {
    const initAudio = async () => {
      try {
        const audio = new Audio('/sounds/launch-music.mp3');
        audio.loop = true;
        audio.volume = 0.3;

        // Test if audio can be loaded
        audio.addEventListener('canplaythrough', () => {
          setAudioAvailable(true);
        }, { once: true });

        audio.addEventListener('error', () => {
          console.log('Background music not available');
          setAudioAvailable(false);
        }, { once: true });

        // Preload the audio
        audio.load();
        audioRef.current = audio;
      } catch (error) {
        console.log('Audio initialization failed:', error);
        setAudioAvailable(false);
      }
    };

    initAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Toggle audio mute
  const toggleMute = () => {
    if (audioRef.current && audioAvailable) {
      if (isMuted) {
        audioRef.current.play().catch((err) => {
          console.log('Audio play failed:', err);
        });
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  // Start music on first interaction (if available and not muted)
  useEffect(() => {
    if (stage === 1 && audioRef.current && audioAvailable && !isMuted) {
      audioRef.current.play().catch((err) => {
        console.log('Auto-play blocked:', err);
      });
    }
  }, [stage, isMuted, audioAvailable]);

  // Keyboard support: Spacebar or Enter advances stage (not on stage 0 - must drag)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        // Skip stage 0 - user must drag the bee
        if (stage === 1) {
          advanceStage();
        } else if (stage >= 2) {
          router.push('/login');
        }
      } else if (e.key === 'Escape') {
        router.push('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stage, advanceStage, router]);

  // Handle bee drop
  const handleBeeDrop = () => {
    advanceStage();
  };

  // Handle bee hovering over launch pad
  const handleBeeHoverPad = (isOver: boolean) => {
    setIsDragOverPad(isOver);
  };

  // Feature cards data
  const features = [
    { icon: TrendingUp, title: 'Expense Tracking', description: 'Monitor spending in real-time' },
    { icon: Brain, title: 'AI Financial Advisor', description: 'Smart insights powered by AI' },
    { icon: Target, title: 'Goal Planning', description: 'Set and achieve financial goals' },
    { icon: Shield, title: 'Secure & Private', description: 'Bank-level security protection' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Deep financial insights' },
    { icon: Award, title: 'Learning Rewards', description: 'Earn while you learn' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bee-secondary/5 via-background to-bee-primary/5" />

      {/* Particle effects */}
      <ParticleEffect isActive={stage >= 1} count={30} />

      {/* Audio control button - only show if audio is available */}
      {audioAvailable && (
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-surface-elevated border border-surface-border hover:border-bee-primary/50 transition-all duration-300 shadow-lg group"
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          title={isMuted ? 'Click to play music' : 'Click to mute music'}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-text-secondary group-hover:text-bee-primary transition-colors" />
          ) : (
            <Volume2 size={20} className="text-bee-primary animate-pulse" />
          )}
        </button>
      )}

      {/* Main content container */}
      <div className="relative z-10 h-screen overflow-hidden flex flex-col items-center justify-center p-6 md:p-8">

        {/* Stage 0: Initial state with HORIZONTAL drag interaction */}
        {stage === 0 && (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto space-y-8">
            {/* Large logo at top */}
            <div className="animate-fade-slide-up text-center">
              <Logo size="xl" variant="landscape" className="justify-center" />
            </div>

            {/* Horizontal layout: Bee LEFT → Launch Pad RIGHT */}
            <div className="flex items-center justify-between w-full px-4 md:px-12 lg:px-20 flex-1">
              {/* Draggable Bee on LEFT */}
              <div className="animate-fade-slide-up flex flex-col items-center" style={{ animationDelay: '200ms' }}>
                <DraggableBee onDragEnd={handleBeeDrop} onHoverPad={handleBeeHoverPad} />
                <div className="text-center mt-4">
                  <p className="text-sm md:text-base font-semibold bee-gradient-text animate-pulse flex items-center gap-2">
                    Drag Right
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-bee-primary animate-bounce">
                      <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </p>
                </div>
              </div>

              {/* Launch Pad on RIGHT */}
              <div className="animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
                <LaunchPadCell onDrop={handleBeeDrop} isBeingDraggedOver={isDragOverPad} />
              </div>
            </div>
          </div>
        )}

        {/* Stage 1: Features reveal */}
        {stage === 1 && (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Title */}
            <div className="text-center animate-fade-slide-up">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3 tracking-tight">
                Platform Activated
              </h1>
              <p className="text-text-secondary text-base md:text-lg font-medium">
                Discover powerful financial tools at your fingertips
              </p>
            </div>

            {/* Feature cards grid - more compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full flex-1 max-h-[60vh] overflow-auto px-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  isActive={stage >= 1}
                  delay={index * 150}
                  onClick={() => stage === 1 && advanceStage()}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 animate-pulse">
              <p className="text-base md:text-lg font-semibold bee-gradient-text">
                Click any card to continue
              </p>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-bee-primary">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}

        {/* Stage 2: Launch complete */}
        {stage >= 2 && (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-5xl mx-auto space-y-6 md:space-y-8">
            {/* Logo */}
            <div className="animate-fade-slide-up">
              <Logo size="lg" variant="landscape" className="justify-center drop-shadow-2xl" />
            </div>

            {/* Title */}
            <div className="animate-fade-slide-up text-center" style={{ animationDelay: '100ms' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bee-gradient-text drop-shadow-lg">
                BeeWise is Live!
              </h1>
            </div>

            {/* Loading Counter */}
            <div className="animate-fade-slide-up w-full flex justify-center" style={{ animationDelay: '200ms' }}>
              <LaunchCounter targetCount={10000} isVisible={stage >= 2} />
            </div>

            {/* Description */}
            <div className="animate-fade-slide-up text-center" style={{ animationDelay: '300ms' }}>
              <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed">
                Your Financial Literacy Journey Starts Now
              </p>
            </div>

            {/* Enter button */}
            <div className="animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
              <Button
                size="lg"
                className="btn-bee-primary text-lg md:text-xl px-12 py-6 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,205,63,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group"
                onClick={() => router.push('/login')}
              >
                <span className="flex items-center gap-2">
                  Enter BeeWise
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Stage progress indicator - positioned at bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-3">
          {[
            { index: 0, label: 'Drag' },
            { index: 1, label: 'Explore' },
            { index: 2, label: 'Launch' }
          ].map(({ index, label }) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index <= stage
                    ? 'bg-bee-primary w-12 shadow-[0_0_12px_rgba(255,205,63,0.5)]'
                    : 'bg-surface-border w-2'
                }`}
              />
              <span
                className={`text-xs font-medium transition-all duration-300 ${
                  index <= stage ? 'text-bee-primary' : 'text-text-muted'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Skip button - positioned in corner */}
        {stage < 2 && (
          <button
            onClick={() => router.push('/dashboard')}
            className="absolute top-6 right-6 text-xs md:text-sm text-text-secondary hover:text-bee-primary transition-colors underline"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
